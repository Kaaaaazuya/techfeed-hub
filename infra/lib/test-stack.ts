import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as elasticache from 'aws-cdk-lib/aws-elasticache';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as ecr from 'aws-cdk-lib/aws-ecr';

export class TestTechfeedStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC - 無料枠活用（最小構成）
    const vpc = new ec2.Vpc(this, 'TechfeedVPC', {
      maxAzs: 2, // 最小限のAZ数でコスト削減
      natGateways: 0, // NAT Gateway無効でコスト削減
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED, // NAT不要な分離サブネット
        },
      ],
    });

    // セキュリティグループ
    const dbSecurityGroup = new ec2.SecurityGroup(this, 'DatabaseSG', {
      vpc,
      description: 'Security group for RDS and ElastiCache',
      allowAllOutbound: false,
    });

    const appSecurityGroup = new ec2.SecurityGroup(this, 'AppSG', {
      vpc,
      description: 'Security group for ECS services',
    });

    // アプリからDBへのアクセス許可
    dbSecurityGroup.addIngressRule(appSecurityGroup, ec2.Port.tcp(5432), 'Allow PostgreSQL access from app');
    dbSecurityGroup.addIngressRule(appSecurityGroup, ec2.Port.tcp(6379), 'Allow Redis access from app');

    // RDS PostgreSQL - 無料枠活用
    const database = new rds.DatabaseInstance(this, 'TechfeedDB', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_15_7,
      }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO), // 無料枠
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
      securityGroups: [dbSecurityGroup],
      databaseName: 'techfeed_hub',
      credentials: rds.Credentials.fromGeneratedSecret('techfeed_user'),
      allocatedStorage: 20, // 無料枠最大
      storageType: rds.StorageType.GP2,
      multiAz: false, // コスト削減
      deletionProtection: false, // 開発環境用
      backupRetention: cdk.Duration.days(7),
      deleteAutomatedBackups: true,
    });

    // ElastiCache Redis Subnet Group
    const redisSubnetGroup = new elasticache.CfnSubnetGroup(this, 'RedisSubnetGroup', {
      description: 'Subnet group for Redis cluster',
      subnetIds: vpc.selectSubnets({
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      }).subnetIds,
    });

    // ElastiCache Redis - 無料枠活用
    const redisCluster = new elasticache.CfnCacheCluster(this, 'TechfeedRedis', {
      cacheNodeType: 'cache.t3.micro', // 無料枠
      engine: 'redis',
      numCacheNodes: 1,
      vpcSecurityGroupIds: [dbSecurityGroup.securityGroupId],
      cacheSubnetGroupName: redisSubnetGroup.ref,
    });

    // ECR Repositories
    const apiRepository = new ecr.Repository(this, 'TechfeedApiRepo', {
      repositoryName: 'techfeed-api',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const rssRepository = new ecr.Repository(this, 'TechfeedRssRepo', {
      repositoryName: 'techfeed-rss-fetcher',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // ECS Cluster
    const cluster = new ecs.Cluster(this, 'TechfeedCluster', {
      vpc,
      clusterName: 'techfeed-cluster',
    });

    // ECS Service for API - Fargate Spot活用
    const apiService = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'TechfeedApiService', {
      cluster,
      memoryLimitMiB: 512, // 最小メモリでコスト削減
      cpu: 256, // 最小CPU
      desiredCount: 1, // 最小レプリカ数
      taskImageOptions: {
        image: ecs.ContainerImage.fromEcrRepository(apiRepository, 'latest'),
        containerPort: 8080,
        environment: {
          DB_HOST: database.instanceEndpoint.hostname,
          DB_PORT: '5432',
          DB_NAME: 'techfeed_hub',
          REDIS_HOST: redisCluster.attrRedisEndpointAddress,
          REDIS_PORT: '6379',
        },
        secrets: {
          DB_USERNAME: ecs.Secret.fromSecretsManager(database.secret!, 'username'),
          DB_PASSWORD: ecs.Secret.fromSecretsManager(database.secret!, 'password'),
        },
      },
      publicLoadBalancer: true,
      platformVersion: ecs.FargatePlatformVersion.LATEST,
      capacityProviderStrategies: [
        {
          capacityProvider: 'FARGATE_SPOT', // Spotインスタンス使用でコスト削減
          weight: 1,
        },
      ],
    });

    // API Service の Security Group 設定
    apiService.service.connections.securityGroups.forEach((sg) => {
      appSecurityGroup.connections.allowFrom(sg, ec2.Port.allTraffic());
    });

    // S3 Bucket for Frontend
    const frontendBucket = new s3.Bucket(this, 'TechfeedFrontendBucket', {
      bucketName: `techfeed-frontend-${cdk.Aws.ACCOUNT_ID}-${cdk.Aws.REGION}`,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: '404.html',
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
    });

    // CloudFront Distribution
    const distribution = new cloudfront.Distribution(this, 'TechfeedDistribution', {
      defaultBehavior: {
        origin: new origins.S3StaticWebsiteOrigin(frontendBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html', // SPA routing support
        },
      ],
    });

    // Lambda for RSS Fetching - Container Image
    const rssLambda = new lambda.DockerImageFunction(this, 'RssFetcherLambda', {
      code: lambda.DockerImageCode.fromEcr(rssRepository, {
        tagOrDigest: 'latest',
        cmd: ['rssfetcher.lambda.RssLambdaHandler::handleRequest'],
      }),
      timeout: cdk.Duration.minutes(15), // Lambda最大実行時間
      memorySize: 1024, // RSS処理に必要なメモリ
      environment: {
        DB_HOST: database.instanceEndpoint.hostname,
        DB_PORT: '5432',
        DB_NAME: 'techfeed_hub',
        REDIS_HOST: redisCluster.attrRedisEndpointAddress,
        REDIS_PORT: '6379',
        DB_SECRET_ARN: database.secret?.secretArn || '',
      },
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
      securityGroups: [appSecurityGroup],
    });

    // Lambda にシークレット参照権限付与
    database.secret?.grantRead(rssLambda);

    // EventBridge Rule for RSS fetching schedule
    const rssScheduleRule = new events.Rule(this, 'RssScheduleRule', {
      schedule: events.Schedule.cron({
        minute: '0',
        hour: '*/3', // 3時間ごと実行
      }),
    });

    rssScheduleRule.addTarget(new targets.LambdaFunction(rssLambda));

    // Outputs
    new cdk.CfnOutput(this, 'DatabaseEndpoint', {
      value: database.instanceEndpoint.hostname,
    });

    new cdk.CfnOutput(this, 'RedisEndpoint', {
      value: redisCluster.attrRedisEndpointAddress,
    });

    new cdk.CfnOutput(this, 'ApiLoadBalancerUrl', {
      value: apiService.loadBalancer.loadBalancerDnsName,
    });

    new cdk.CfnOutput(this, 'FrontendUrl', {
      value: distribution.distributionDomainName,
    });

    new cdk.CfnOutput(this, 'EcrApiRepositoryUri', {
      value: apiRepository.repositoryUri,
    });

    new cdk.CfnOutput(this, 'EcrRssRepositoryUri', {
      value: rssRepository.repositoryUri,
    });

    new cdk.CfnOutput(this, 'RssLambdaFunctionName', {
      value: rssLambda.functionName,
    });
  }
}
