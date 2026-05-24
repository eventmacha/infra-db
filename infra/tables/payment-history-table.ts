import { Construct } from 'constructs';
import { aws_dynamodb as dynamodb } from 'aws-cdk-lib';
import { EventMachaTable } from '../constructs/event-macha-table';
import { AppConfig } from '../config/app-config';

export interface PaymentHistoryTableProps {
  readonly appConfig: AppConfig;
}

export class PaymentHistoryTable extends Construct {
  public readonly resource: EventMachaTable;

  constructor(scope: Construct, id: string, props: PaymentHistoryTableProps) {
    super(scope, id);

    this.resource = new EventMachaTable(this, 'PaymentHistoryTable', {
      tableName: 'PaymentHistory',
      partitionKey: { name: 'paymentId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'eventTime', type: dynamodb.AttributeType.NUMBER },
      timeToLiveAttribute: 'ttl', // TTL enabled to allow automated cleaning or archival of logs
      appConfig: props.appConfig,
    });
  }
}

export interface PaymentHistoryItem {
  readonly paymentId: string; // PK
  readonly eventTime: number; // SK
  readonly oldStatus?: string;
  readonly newStatus?: string;
  readonly source?: 'WEBHOOK' | 'SYSTEM' | 'MANUAL';
  readonly payload?: Record<string, any>;
  readonly createdAt: number;
}
