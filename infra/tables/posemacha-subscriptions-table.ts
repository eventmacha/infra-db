import { Construct } from 'constructs';
import { aws_dynamodb as dynamodb } from 'aws-cdk-lib';
import { EventMachaTable } from '../constructs/event-macha-table';
import { AppConfig } from '../config/app-config';

export interface PosemachaSubscriptionsTableProps {
  readonly appConfig: AppConfig;
}

export class PosemachaSubscriptionsTable extends Construct {
  public readonly resource: EventMachaTable;

  constructor(scope: Construct, id: string, props: PosemachaSubscriptionsTableProps) {
    super(scope, id);

    this.resource = new EventMachaTable(this, 'PosemachaSubscriptionsTable', {
      tableName: 'PosemachaSubscriptions',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      appConfig: props.appConfig,
    });

    this.resource.table.addGlobalSecondaryIndex({
      indexName: 'cognitoUserId-index',
      partitionKey: { name: 'cognitoUserId', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });
  }
}

export interface PosemachaSubscriptionItem {
  readonly userId: string;
  readonly cognitoUserId: string;
  readonly generatedCount: number;
  readonly limitCount: number;
  readonly active: boolean;
}
