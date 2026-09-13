import { Construct } from 'constructs';
import { aws_dynamodb as dynamodb } from 'aws-cdk-lib';
import { EventMachaTable } from '../constructs/event-macha-table';
import { AppConfig } from '../config/app-config';

export interface PosemachaCategoriesTableProps {
  readonly appConfig: AppConfig;
}

export class PosemachaCategoriesTable extends Construct {
  public readonly resource: EventMachaTable;

  constructor(scope: Construct, id: string, props: PosemachaCategoriesTableProps) {
    super(scope, id);

    this.resource = new EventMachaTable(this, 'PosemachaCategoriesTable', {
      tableName: 'PosemachaCategories',
      partitionKey: { name: 'categoryId', type: dynamodb.AttributeType.STRING },
      appConfig: props.appConfig,
    });
  }
}

export interface PosemachaCategoryItem {
  readonly categoryId: string;
  readonly categoryName: string;
  readonly categoryImage?: string;
  readonly popularityCount?: number;
  readonly active: boolean;
  readonly createdAt: number;
  readonly updatedAt: number;
}
