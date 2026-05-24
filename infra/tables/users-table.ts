import { Construct } from 'constructs';
import { aws_dynamodb as dynamodb } from 'aws-cdk-lib';
import { EventMachaTable } from '../constructs/event-macha-table';
import { AppConfig } from '../config/app-config';

export interface UsersTableProps {
  readonly appConfig: AppConfig;
}

export class UsersTable extends Construct {
  public readonly resource: EventMachaTable;

  constructor(scope: Construct, id: string, props: UsersTableProps) {
    super(scope, id);

    this.resource = new EventMachaTable(this, 'UsersTable', {
      tableName: 'Users',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      appConfig: props.appConfig,
    });

    // GSI: email-index (PK: email, Projection: ALL)
    this.resource.addGlobalSecondaryIndex({
      indexName: 'email-index',
      partitionKey: { name: 'email', type: dynamodb.AttributeType.STRING },
    });

    // GSI: userType-index (PK: userType, Projection: ALL)
    this.resource.addGlobalSecondaryIndex({
      indexName: 'userType-index',
      partitionKey: { name: 'userType', type: dynamodb.AttributeType.STRING },
    });

    // GSI: provider-index (PK: authProvider, SK: providerUserId, Projection: ALL)
    this.resource.addGlobalSecondaryIndex({
      indexName: 'provider-index',
      partitionKey: { name: 'authProvider', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'providerUserId', type: dynamodb.AttributeType.STRING },
    });
  }
}

export interface UserItem {
  readonly userId: string; // PK
  readonly userType: 'CUSTOMER' | 'AGENT' | 'ADMIN';
  readonly email: string; // GSI email-index
  readonly phone?: string;
  readonly fullName?: string;
  readonly profileImage?: string;
  readonly authProvider: string; // GOOGLE/COGNITO/etc
  readonly providerUserId: string; // provider-index SK
  readonly cognitoUserId?: string;
  readonly status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
  readonly createdAt: number; // epoch
  readonly updatedAt: number; // epoch
}
