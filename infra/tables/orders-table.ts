import { Construct } from 'constructs';
import { aws_dynamodb as dynamodb } from 'aws-cdk-lib';
import { EventMachaTable } from '../constructs/event-macha-table';
import { AppConfig } from '../config/app-config';

export interface OrdersTableProps {
  readonly appConfig: AppConfig;
}

export class OrdersTable extends Construct {
  public readonly resource: EventMachaTable;

  constructor(scope: Construct, id: string, props: OrdersTableProps) {
    super(scope, id);

    this.resource = new EventMachaTable(this, 'OrdersTable', {
      tableName: 'Orders',
      partitionKey: { name: 'orderId', type: dynamodb.AttributeType.STRING },
      appConfig: props.appConfig,
    });

    // GSI: user-created-index (PK: userId, SK: createdAt, Projection: ALL)
    this.resource.addGlobalSecondaryIndex({
      indexName: 'user-created-index',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.NUMBER },
    });
  }
}

export interface OrderItem {
  readonly orderId: string; // PK
  readonly userId: string; // GSI user-created-index PK
  readonly userType?: string;
  readonly rateCardId?: string;
  readonly planType?: string;
  readonly basePrice?: number;
  readonly discount?: number;
  readonly finalPrice?: number;
  readonly orderStatus?: string;
  readonly themeCode?: string;
  readonly agentId?: number;
  readonly websiteUrl?: string;
  readonly websiteUrlAlias1?: string;
  readonly websiteUrlAlias2?: string;
  readonly publishCount?: string;
  readonly publishExpiresAt?: number;
  readonly orderExpiresAt?: number;
  readonly createdAt: number; // GSI SK
  readonly updatedAt?: number;
}
