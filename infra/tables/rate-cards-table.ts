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
      partitionKey: { name: 'rateCardId', type: dynamodb.AttributeType.STRING },
      appConfig: props.appConfig,
    });

    // GSI: userType-index (PK: userType, Projection: ALL)
    this.resource.addGlobalSecondaryIndex({
      indexName: 'userType-index',
      partitionKey: { name: 'userType', type: dynamodb.AttributeType.STRING },
    });
  }
}
