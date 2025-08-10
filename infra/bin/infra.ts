#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { TechfeedStack } from '../lib/techfeed-stack';
import { TestTechfeedStack } from '../lib/test-stack';

const app = new cdk.App();
new TechfeedStack(app, 'TechfeedStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

// Test stack for unit testing
if (process.env.NODE_ENV === 'test') {
  new TestTechfeedStack(app, 'TestTechfeedStack');
}
