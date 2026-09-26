import { Construct } from 'constructs';
import { aws_dynamodb as dynamodb } from 'aws-cdk-lib';
import { EventMachaTable } from '../constructs/event-macha-table';
import { AppConfig } from '../config/app-config';

export interface PosemachaPcsJobsTableProps {
  readonly appConfig: AppConfig;
}

export class PosemachaPcsJobsTable extends Construct {
  public readonly resource: EventMachaTable;

  constructor(scope: Construct, id: string, props: PosemachaPcsJobsTableProps) {
    super(scope, id);

    this.resource = new EventMachaTable(this, 'PosemachaPcsJobsTable', {
      tableName: 'PosemachaPcsJobs',
      partitionKey: { name: 'jobId', type: dynamodb.AttributeType.STRING },
      appConfig: props.appConfig,
    });

    this.resource.addGlobalSecondaryIndex({
      indexName: 'userId-createdAt-index',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.NUMBER },
    });
  }
}

export interface PosemachaPcsJobItem {
  readonly jobId: string;
  readonly userId: string;
  readonly generatedUrl?: string;
  readonly status: string;
  readonly frameId?: string;
  readonly retryCount: number;
  readonly createdAt: number;
  readonly completedAt?: number;
}

