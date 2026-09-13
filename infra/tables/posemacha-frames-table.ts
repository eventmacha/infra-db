import { Construct } from 'constructs';
import { aws_dynamodb as dynamodb } from 'aws-cdk-lib';
import { EventMachaTable } from '../constructs/event-macha-table';
import { AppConfig } from '../config/app-config';

export interface PosemachaFramesTableProps {
  readonly appConfig: AppConfig;
}

export class PosemachaFramesTable extends Construct {
  public readonly resource: EventMachaTable;

  constructor(scope: Construct, id: string, props: PosemachaFramesTableProps) {
    super(scope, id);

    this.resource = new EventMachaTable(this, 'PosemachaFramesTable', {
      tableName: 'PosemachaFrames',
      partitionKey: { name: 'frameId', type: dynamodb.AttributeType.STRING },
      appConfig: props.appConfig,
    });

    this.resource.addGlobalSecondaryIndex({
      indexName: 'user-index',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
    });
  }
}

export interface PosemachaFrameItem {
  readonly frameId: string;
  readonly frameUrl: string;
  readonly frameName: string;
  readonly userId: string;
  readonly createdAt: number;
  readonly modifiedAt: number;
}
