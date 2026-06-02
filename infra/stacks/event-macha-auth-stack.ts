import { Stack, StackProps, RemovalPolicy, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import { AppConfig } from '../config/app-config';

export interface EventMachaAuthStackProps extends StackProps {
  readonly appConfig: AppConfig;
}

export class EventMachaAuthStack extends Stack {
  public readonly userPool: cognito.UserPool;
  public readonly userPoolClient: cognito.UserPoolClient;

  constructor(scope: Construct, id: string, props: EventMachaAuthStackProps) {
    super(scope, id, props);

    const { appConfig } = props;

    // 1. Create Custom Message Lambda Trigger
    const customMessageLambda = new lambda.Function(this, 'CustomMessageFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../src/custom-message')),
      description: 'Generates custom HTML email templates for Event Macha Cognito flows.',
    });

    // 2. Create Cognito User Pool
    this.userPool = new cognito.UserPool(this, 'EventMachaUserPool', {
      userPoolName: `event-macha-users-${appConfig.environment}`,
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
      },
      autoVerify: {
        email: true,
      },
      email: cognito.UserPoolEmail.withSES({
        fromEmail: 'no-reply@eventmacha.com',
        fromName: 'Event Macha',
        sesRegion: this.region,
      }),
      lambdaTriggers: {
        customMessage: customMessageLambda,
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true,
      },
      removalPolicy: appConfig.environment === 'prod' ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
    });

    // 2. Create Cognito User Pool Client
    this.userPoolClient = new cognito.UserPoolClient(this, 'EventMachaUserPoolClient', {
      userPool: this.userPool,
      userPoolClientName: `event-macha-client-${appConfig.environment}`,
      generateSecret: false, // typically false for web/mobile apps
      preventUserExistenceErrors: true,
      authFlows: {
        userPassword: true,
        userSrp: true,
        custom: true,
      },
    });

    // Outputs
    new CfnOutput(this, 'UserPoolId', {
      value: this.userPool.userPoolId,
      description: 'The ID of the Cognito User Pool',
    });

    new CfnOutput(this, 'UserPoolClientId', {
      value: this.userPoolClient.userPoolClientId,
      description: 'The ID of the Cognito User Pool Client',
    });
  }
}
