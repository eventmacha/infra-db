#!/usr/bin/env node
import 'source-map-support/register';
import { App, Tags } from 'aws-cdk-lib';
import { EventMachaDbStack } from '../stacks/event-macha-db-stack';
import { getAppConfig } from '../config/app-config';

const app = new App();

// 1. Retrieve the Production config
const config = getAppConfig();

const stackName = 'EventMachaDbStack-prod';

// 2. Instantiate the Database Infrastructure Stack (Prod-only)
const dbStack = new EventMachaDbStack(app, stackName, {
  env: {
    region: config.region,
    account: process.env.CDK_DEFAULT_ACCOUNT, // Automatically resolves current authenticated AWS account
  },
  appConfig: config,
  description: 'Event Macha Database infrastructure stack for the Production environment.',
});

// 3. Apply global tags at the stack level (automatically propagates to all nested resources)
Object.entries(config.tags).forEach(([key, value]) => {
  Tags.of(dbStack).add(key, value);
});

app.synth();
