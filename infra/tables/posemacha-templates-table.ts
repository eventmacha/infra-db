import { Construct } from 'constructs';
import { aws_dynamodb as dynamodb } from 'aws-cdk-lib';
import { EventMachaTable } from '../constructs/event-macha-table';
import { AppConfig } from '../config/app-config';

export interface PosemachaTemplatesTableProps {
  readonly appConfig: AppConfig;
}

export class PosemachaTemplatesTable extends Construct {
  public readonly resource: EventMachaTable;

  constructor(scope: Construct, id: string, props: PosemachaTemplatesTableProps) {
    super(scope, id);

    this.resource = new EventMachaTable(this, 'PosemachaTemplatesTable', {
      tableName: 'PosemachaTemplates',
      partitionKey: { name: 'templateId', type: dynamodb.AttributeType.STRING },
      appConfig: props.appConfig,
    });

    // Add GSI for categoryId
    this.resource.addGlobalSecondaryIndex({
      indexName: 'category-index',
      partitionKey: { name: 'categoryId', type: dynamodb.AttributeType.STRING },
    });
  }
}

export interface PosemachaTemplateItem {
  readonly templateId: string;
  readonly categoryId: string;
  readonly templateName: string;
  readonly templateUrl?: string;
  readonly prompt?: string;
  readonly popularityCount?: number;
  readonly active: boolean;
  readonly createdAt: number;
  readonly updatedAt: number;
}
