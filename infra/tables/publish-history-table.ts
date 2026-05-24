import { Construct } from 'constructs';
import { aws_dynamodb as dynamodb } from 'aws-cdk-lib';
import { EventMachaTable } from '../constructs/event-macha-table';
import { AppConfig } from '../config/app-config';

export interface PublishHistoryTableProps {
  readonly appConfig: AppConfig;
}

export class PublishHistoryTable extends Construct {
  public readonly resource: EventMachaTable;

  constructor(scope: Construct, id: string, props: PublishHistoryTableProps) {
    super(scope, id);

    this.resource = new EventMachaTable(this, 'PublishHistoryTable', {
      tableName: 'PublishHistory',
      partitionKey: { name: 'orderId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'publishVersionId', type: dynamodb.AttributeType.STRING },
      appConfig: props.appConfig,
    });
  }
}

export interface PublishHistoryItem {
  readonly orderId: string; // PK
  readonly publishVersionId: string; // SK version id
  readonly expiresAt?: number; // expiry
  readonly siteConfig?: string; // snapshot
  readonly contentEn?: string; // english
  readonly contentLocalized?: string; // localized
  readonly images?: string; // assets
  readonly publishedBy?: string; // user
  readonly status?: string; // publish status
  readonly changeReason?: string; // reason
  readonly publishedAt?: number; // publish timestamp
  readonly createdAt: number; // snapshot created
}
