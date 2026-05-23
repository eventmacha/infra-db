import { Construct } from 'constructs';
import { aws_dynamodb as dynamodb, Tags } from 'aws-cdk-lib';
import { AppConfig } from '../config/app-config';

export interface EventMachaTableProps {
  readonly tableName: string;
  readonly partitionKey: dynamodb.Attribute;
  readonly sortKey?: dynamodb.Attribute;
  readonly timeToLiveAttribute?: string;
  readonly appConfig: AppConfig;
}

export class EventMachaTable extends Construct {
  public readonly table: dynamodb.Table;

  constructor(scope: Construct, id: string, props: EventMachaTableProps) {
    super(scope, id);

    const { tableName, partitionKey, sortKey, timeToLiveAttribute, appConfig } = props;

    this.table = new dynamodb.Table(this, 'Table', {
      tableName,
      partitionKey,
      sortKey,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      pointInTimeRecovery: appConfig.pointInTimeRecovery,
      deletionProtection: appConfig.deletionProtection,
      timeToLiveAttribute: timeToLiveAttribute,
    });

    // Apply tag properties specifically to the table
    Object.entries(appConfig.tags).forEach(([key, value]) => {
      Tags.of(this.table).add(key, value);
    });
  }

  /**
   * Helper to quickly add a Global Secondary Index (GSI) with standard ALL projection
   */
  public addGlobalSecondaryIndex(props: {
    readonly indexName: string;
    readonly partitionKey: dynamodb.Attribute;
    readonly sortKey?: dynamodb.Attribute;
    readonly projectionType?: dynamodb.ProjectionType;
  }): void {
    this.table.addGlobalSecondaryIndex({
      indexName: props.indexName,
      partitionKey: props.partitionKey,
      sortKey: props.sortKey,
      projectionType: props.projectionType ?? dynamodb.ProjectionType.ALL,
    });
  }
}
