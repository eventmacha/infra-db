import { Construct } from 'constructs';
import { aws_dynamodb as dynamodb } from 'aws-cdk-lib';
import { EventMachaTable } from '../constructs/event-macha-table';
import { AppConfig } from '../config/app-config';

export interface PublishTableProps {
  readonly appConfig: AppConfig;
}

export class PublishTable extends Construct {
  public readonly resource: EventMachaTable;

  constructor(scope: Construct, id: string, props: PublishTableProps) {
    super(scope, id);

    this.resource = new EventMachaTable(this, 'PublishTable', {
      tableName: 'Publish',
      partitionKey: { name: 'orderId', type: dynamodb.AttributeType.STRING },
      appConfig: props.appConfig,
    });
  }
}

export interface PublishItem {
  readonly orderId: string; // PK
  readonly publishVersionId?: string; // latest published version
  readonly publishCount?: number; // total publishes
  readonly status?: 'DRAFT' | 'PREVIEW' | 'PUBLISHED' | 'EXPIRED' | 'ARCHIVED';
  readonly expiresAt?: number; // expiry epoch
  readonly previewToken?: string; // preview access
  readonly previewGeneratedAt?: number; // preview timestamp
  readonly draftSiteConfig?: string; // draft config
  readonly draftContentEn?: string; // draft english content
  readonly draftContentLocalized?: string; // localized draft
  readonly draftImages?: string; // draft assets
  readonly publishedSiteConfig?: string; // live config
  readonly publishedContentEn?: string; // published english
  readonly publishedContentLocalized?: string; // published localized
  readonly publishedImages?: string; // published assets
  readonly publishedAt?: number; // publish timestamp
  readonly createdAt: number; // created
  readonly updatedAt: number; // updated
}
