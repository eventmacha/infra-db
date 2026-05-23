import { Construct } from 'constructs';
import { aws_dynamodb as dynamodb } from 'aws-cdk-lib';
import { EventMachaTable } from '../constructs/event-macha-table';
import { AppConfig } from '../config/app-config';

export interface RateCardPlansTableProps {
  readonly appConfig: AppConfig;
}

export class RateCardPlansTable extends Construct {
  public readonly resource: EventMachaTable;

  constructor(scope: Construct, id: string, props: RateCardPlansTableProps) {
    super(scope, id);

    this.resource = new EventMachaTable(this, 'RateCardPlansTable', {
      tableName: 'RateCardPlans',
      partitionKey: { name: 'rateCardId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'planType', type: dynamodb.AttributeType.STRING },
      appConfig: props.appConfig,
    });
  }
}
