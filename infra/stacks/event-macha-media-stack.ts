import { Stack, StackProps, RemovalPolicy, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { AppConfig } from '../config/app-config';

export interface EventMachaMediaStackProps extends StackProps {
  readonly appConfig: AppConfig;
}

export class EventMachaMediaStack extends Stack {
  public readonly mediaBucket: s3.Bucket;

  constructor(scope: Construct, id: string, props: EventMachaMediaStackProps) {
    super(scope, id, props);

    const { appConfig } = props;

    // Create the Media S3 Bucket with public access enabled
    this.mediaBucket = new s3.Bucket(this, 'MediaBucket', {
      bucketName: `eventmacha-${appConfig.environment}-media`,
      publicReadAccess: true,
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      }),
      removalPolicy: appConfig.environment === 'prod' ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
      autoDeleteObjects: false,
    });

    // Outputs
    new CfnOutput(this, 'MediaBucketName', {
      value: this.mediaBucket.bucketName,
      description: 'The name of the Event Macha Media S3 bucket',
      exportName: `EventMacha-${appConfig.environment}-MediaBucketName`,
    });

    new CfnOutput(this, 'MediaBucketDomainName', {
      value: this.mediaBucket.bucketRegionalDomainName,
      description: 'The domain name of the Event Macha Media S3 bucket',
      exportName: `EventMacha-${appConfig.environment}-MediaBucketDomainName`,
    });
  }
}
