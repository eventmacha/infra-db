import { Construct } from 'constructs';
import { aws_dynamodb as dynamodb } from 'aws-cdk-lib';
import { EventMachaTable } from '../constructs/event-macha-table';
import { AppConfig } from '../config/app-config';

export interface SiteTemplatesTableProps {
  readonly appConfig: AppConfig;
}

export class SiteTemplatesTable extends Construct {
  public readonly resource: EventMachaTable;

  constructor(scope: Construct, id: string, props: SiteTemplatesTableProps) {
    super(scope, id);

    this.resource = new EventMachaTable(this, 'SiteTemplatesTable', {
      tableName: 'SiteTemplates',
      partitionKey: { name: 'themeCode', type: dynamodb.AttributeType.STRING },
      appConfig: props.appConfig,
    });

    // GSI: category-orderedCount-index (PK: category, SK: orderedCount)
    this.resource.addGlobalSecondaryIndex({
      indexName: 'category-orderedCount-index',
      partitionKey: { name: 'category', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'orderedCount', type: dynamodb.AttributeType.NUMBER },
    });
  }
}

export interface SiteTemplateItem {
  readonly themeCode: string; // PK
  readonly name: string;
  readonly category: string;
  readonly sitePreviewImage: string;
  readonly siteUrl: string;
  readonly cloudfrontId?: string;
  readonly orderedCount: number; // default 0
  readonly diyIndicator: boolean;
  readonly createdAt: number;
  readonly updatedAt: number;
}
