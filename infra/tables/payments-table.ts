import { Construct } from 'constructs';
import { aws_dynamodb as dynamodb } from 'aws-cdk-lib';
import { EventMachaTable } from '../constructs/event-macha-table';
import { AppConfig } from '../config/app-config';

export interface PaymentsTableProps {
  readonly appConfig: AppConfig;
}

export class PaymentsTable extends Construct {
  public readonly resource: EventMachaTable;

  constructor(scope: Construct, id: string, props: PaymentsTableProps) {
    super(scope, id);

    this.resource = new EventMachaTable(this, 'PaymentsTable', {
      tableName: 'Payments',
      partitionKey: { name: 'paymentId', type: dynamodb.AttributeType.STRING },
      appConfig: props.appConfig,
    });

    // GSI: order-index (PK: orderId, Projection: ALL)
    this.resource.addGlobalSecondaryIndex({
      indexName: 'order-index',
      partitionKey: { name: 'orderId', type: dynamodb.AttributeType.STRING },
    });

    // GSI: user-payment-index (PK: userId, SK: createdAt, Projection: ALL)
    this.resource.addGlobalSecondaryIndex({
      indexName: 'user-payment-index',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.NUMBER },
    });
  }
}
