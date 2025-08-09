#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { TechfeedStack } from '../lib/techfeed-stack';

const app = new cdk.App();
new TechfeedStack(app, 'TechfeedStack', {
  env: { 
    account: process.env.CDK_DEFAULT_ACCOUNT, 
    region: process.env.CDK_DEFAULT_REGION 
  },
});