import { Construct } from 'constructs';
import { aws_dynamodb as dynamodb } from 'aws-cdk-lib';
import { EventMachaTable } from '../constructs/event-macha-table';
import { AppConfig } from '../config/app-config';

export interface RateCardsTableProps {
  readonly appConfig: AppConfig;
}

export class RateCardsTable extends Construct {
  public readonly resource: EventMachaTable;

  constructor(scope: Construct, id: string, props: RateCardsTableProps) {
    super(scope, id);

    this.resource = new EventMachaTable(this, 'RateCardsTable', {
      tableName: 'RateCards',
      partitionKey: { name: 'userType', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'planType', type: dynamodb.AttributeType.STRING },
      appConfig: props.appConfig,
    });
  }
}

export interface RateCardItem {
  readonly userType: 'CUSTOMER' | 'AGENT' | 'ADMIN'; // PK
  readonly planType: string; // SK
  readonly displayName?: string;
  readonly description?: string;
  readonly basePrice?: number;
  readonly discount?: number;
  readonly taxPercent?: number;
  readonly finalPrice?: number;
  readonly durationDays?: number;
  readonly active?: boolean;
  readonly createdAt: number;
  readonly updatedAt: number;
}
