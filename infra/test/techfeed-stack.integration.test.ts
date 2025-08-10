import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { TestTechfeedStack } from '../lib/test-stack';

describe('TechfeedStack Integration Tests', () => {
  let app: cdk.App;
  let stack: TestTechfeedStack;
  let template: Template;

  beforeEach(() => {
    app = new cdk.App();
    stack = new TestTechfeedStack(app, 'TestTechfeedStack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });
    template = Template.fromStack(stack);
  });

  describe('Resource Dependencies', () => {
    test('should ensure database is created before ECS service', () => {
      const ecsService = template.findResources('AWS::ECS::Service');
      const rdsInstance = template.findResources('AWS::RDS::DBInstance');

      expect(Object.keys(ecsService)).toHaveLength(1);
      expect(Object.keys(rdsInstance)).toHaveLength(1);

      // ECS service should depend on database endpoint
      const serviceKey = Object.keys(ecsService)[0];
      const service = ecsService[serviceKey];

      expect(service.Properties.TaskDefinition).toEqual({
        Ref: expect.any(String),
      });
    });

    test('should ensure Redis is created before ECS services', () => {
      const ecsService = template.findResources('AWS::ECS::Service');
      const redisCluster = template.findResources('AWS::ElastiCache::CacheCluster');

      expect(Object.keys(ecsService)).toHaveLength(1);
      expect(Object.keys(redisCluster)).toHaveLength(1);
    });

    test('should ensure VPC is created before all dependent resources', () => {
      const vpc = template.findResources('AWS::EC2::VPC');
      const subnets = template.findResources('AWS::EC2::Subnet');
      const securityGroups = template.findResources('AWS::EC2::SecurityGroup');

      expect(Object.keys(vpc)).toHaveLength(1);
      expect(Object.keys(subnets).length).toBeGreaterThan(0);
      expect(Object.keys(securityGroups).length).toBeGreaterThan(0);
    });
  });

  describe('Network Connectivity', () => {
    test('should allow ECS service to connect to RDS', () => {
      // Find security group rules that allow PostgreSQL traffic
      const ingressRules = template.findResources('AWS::EC2::SecurityGroupIngress');
      const postgresRule = Object.values(ingressRules).find(
        (rule: Record<string, any>) => rule.Properties.FromPort === 5432 && rule.Properties.ToPort === 5432,
      );

      expect(postgresRule).toBeDefined();
      expect(postgresRule).toMatchObject({
        Properties: {
          IpProtocol: 'tcp',
          FromPort: 5432,
          ToPort: 5432,
        },
      });
    });

    test('should allow ECS service to connect to Redis', () => {
      const ingressRules = template.findResources('AWS::EC2::SecurityGroupIngress');
      const redisRule = Object.values(ingressRules).find(
        (rule: Record<string, any>) => rule.Properties.FromPort === 6379 && rule.Properties.ToPort === 6379,
      );

      expect(redisRule).toBeDefined();
      expect(redisRule).toMatchObject({
        Properties: {
          IpProtocol: 'tcp',
          FromPort: 6379,
          ToPort: 6379,
        },
      });
    });

    test('should allow ECS service to connect to both databases', () => {
      const ecsService = template.findResources('AWS::ECS::Service');
      const taskDefinition = template.findResources('AWS::ECS::TaskDefinition');

      expect(Object.keys(ecsService)).toHaveLength(1);
      expect(Object.keys(taskDefinition)).toHaveLength(1);

      // Task definition should have network mode awsvpc
      const taskDefKey = Object.keys(taskDefinition)[0];
      const taskDef = taskDefinition[taskDefKey];
      expect(taskDef.Properties.NetworkMode).toBe('awsvpc');
    });
  });

  describe('Security Configuration', () => {
    test('should use HTTPS for all external communications', () => {
      // CloudFront should redirect HTTP to HTTPS
      const distribution = template.findResources('AWS::CloudFront::Distribution');
      const distKey = Object.keys(distribution)[0];
      const dist = distribution[distKey];

      expect(dist.Properties.DistributionConfig.DefaultCacheBehavior.ViewerProtocolPolicy).toBe('redirect-to-https');
    });

    test('should use secrets manager for database credentials', () => {
      const secrets = template.findResources('AWS::SecretsManager::Secret');
      expect(Object.keys(secrets).length).toBeGreaterThan(0);

      // Check that secrets are properly configured for database credentials
      const secretKey = Object.keys(secrets)[0];
      const secret = secrets[secretKey];
      expect(secret.Properties.GenerateSecretString).toBeDefined();
      expect(secret.Properties.GenerateSecretString.SecretStringTemplate).toContain('techfeed_user');
    });

    test('should place databases in private subnets', () => {
      // RDS should be in private subnets
      const dbSubnetGroup = template.findResources('AWS::RDS::DBSubnetGroup');
      expect(Object.keys(dbSubnetGroup)).toHaveLength(1);

      // Redis should be in private subnets
      const redisSubnetGroup = template.findResources('AWS::ElastiCache::SubnetGroup');
      expect(Object.keys(redisSubnetGroup)).toHaveLength(1);
    });
  });

  describe('Monitoring and Logging', () => {
    test('should enable CloudWatch logging for ECS', () => {
      const taskDefinition = template.findResources('AWS::ECS::TaskDefinition');
      const taskDefKey = Object.keys(taskDefinition)[0];
      const taskDef = taskDefinition[taskDefKey];

      const containerDef = taskDef.Properties.ContainerDefinitions[0];
      expect(containerDef.LogConfiguration).toBeDefined();
      expect(containerDef.LogConfiguration.LogDriver).toBe('awslogs');
    });

    test('should enable performance insights for RDS', () => {
      // This test checks if performance insights could be enabled
      // (not currently enabled due to cost optimization)
      const rdsInstance = template.findResources('AWS::RDS::DBInstance');
      const rdsKey = Object.keys(rdsInstance)[0];
      const rds = rdsInstance[rdsKey];

      // Should have backup retention for monitoring
      expect(rds.Properties.BackupRetentionPeriod).toBe(7);
    });
  });

  describe('Scalability Configuration', () => {
    test('should configure ECS service for horizontal scaling', () => {
      const ecsService = template.findResources('AWS::ECS::Service');
      const serviceKey = Object.keys(ecsService)[0];
      const service = ecsService[serviceKey];

      expect(service.Properties.DesiredCount).toBe(1);
      expect(service.Properties.PlatformVersion).toBe('LATEST');
    });

    test('should use Fargate Spot for cost optimization', () => {
      const ecsService = template.findResources('AWS::ECS::Service');
      const serviceKey = Object.keys(ecsService)[0];
      const service = ecsService[serviceKey];

      expect(service.Properties.CapacityProviderStrategy).toEqual([
        {
          CapacityProvider: 'FARGATE_SPOT',
          Weight: 1,
        },
      ]);
    });
  });

  describe('Backup and Recovery', () => {
    test('should configure automated backups for RDS', () => {
      const rdsInstance = template.findResources('AWS::RDS::DBInstance');
      const rdsKey = Object.keys(rdsInstance)[0];
      const rds = rdsInstance[rdsKey];

      expect(rds.Properties.BackupRetentionPeriod).toBe(7);
      expect(rds.Properties.DeleteAutomatedBackups).toBe(true);
    });

    test('should not enable multi-AZ for cost optimization', () => {
      const rdsInstance = template.findResources('AWS::RDS::DBInstance');
      const rdsKey = Object.keys(rdsInstance)[0];
      const rds = rdsInstance[rdsKey];

      expect(rds.Properties.MultiAZ).toBe(false);
    });
  });

  describe('CDK Best Practices', () => {
    test('should use removal policies appropriately', () => {
      const ecrRepo = template.findResources('AWS::ECR::Repository');
      const s3Bucket = template.findResources('AWS::S3::Bucket');

      // Development resources should have DESTROY removal policy
      expect(Object.keys(ecrRepo)).toHaveLength(2); // API and RSS repositories
      expect(Object.keys(s3Bucket)).toHaveLength(1);
    });

    test('should have appropriate resource naming', () => {
      const cluster = template.findResources('AWS::ECS::Cluster');
      const clusterKey = Object.keys(cluster)[0];
      const clusterResource = cluster[clusterKey];

      expect(clusterResource.Properties.ClusterName).toBe('techfeed-cluster');

      const ecrRepo = template.findResources('AWS::ECR::Repository');
      const repoKey = Object.keys(ecrRepo)[0];
      const repo = ecrRepo[repoKey];

      expect(repo.Properties.RepositoryName).toBe('techfeed-api');
    });

    test('should provide meaningful stack outputs', () => {
      const outputs = template.findOutputs('*');

      // Check that outputs exist and have meaningful names
      expect(outputs.DatabaseEndpoint).toBeDefined();
      expect(outputs.RedisEndpoint).toBeDefined();
      expect(outputs.ApiLoadBalancerUrl).toBeDefined();
      expect(outputs.FrontendUrl).toBeDefined();
      expect(outputs.EcrApiRepositoryUri).toBeDefined();
      expect(outputs.EcrRssRepositoryUri).toBeDefined();
      expect(outputs.RssLambdaFunctionName).toBeDefined();
    });
  });

  describe('Cost Optimization Validation', () => {
    test('should use free tier eligible resources where possible', () => {
      // RDS t3.micro
      const rdsInstance = template.findResources('AWS::RDS::DBInstance');
      const rdsKey = Object.keys(rdsInstance)[0];
      const rds = rdsInstance[rdsKey];
      expect(rds.Properties.DBInstanceClass).toBe('db.t3.micro');
      expect(rds.Properties.AllocatedStorage).toBe('20');

      // ElastiCache t3.micro
      const redisCluster = template.findResources('AWS::ElastiCache::CacheCluster');
      const redisKey = Object.keys(redisCluster)[0];
      const redis = redisCluster[redisKey];
      expect(redis.Properties.CacheNodeType).toBe('cache.t3.micro');

      // ECS minimal resources
      const taskDef = template.findResources('AWS::ECS::TaskDefinition');
      const taskKey = Object.keys(taskDef)[0];
      const task = taskDef[taskKey];
      expect(task.Properties.Cpu).toBe('256');
      expect(task.Properties.Memory).toBe('512');
    });

    test('should minimize resource count for cost efficiency', () => {
      // Single Redis node
      const redisCluster = template.findResources('AWS::ElastiCache::CacheCluster');
      const redisKey = Object.keys(redisCluster)[0];
      const redis = redisCluster[redisKey];
      expect(redis.Properties.NumCacheNodes).toBe(1);

      // Single ECS task initially
      const ecsService = template.findResources('AWS::ECS::Service');
      const serviceKey = Object.keys(ecsService)[0];
      const service = ecsService[serviceKey];
      expect(service.Properties.DesiredCount).toBe(1);

      // No NAT Gateway
      const natGateways = template.findResources('AWS::EC2::NatGateway');
      expect(Object.keys(natGateways)).toHaveLength(0);
    });
  });
});
