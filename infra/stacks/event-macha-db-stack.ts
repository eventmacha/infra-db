import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_iam as iam } from 'aws-cdk-lib';
import { AppConfig } from '../config/app-config';
import { UsersTable } from '../tables/users-table';
import { RateCardsTable } from '../tables/rate-cards-table';
import { RateCardPlansTable } from '../tables/rate-card-plans-table';
import { OrdersTable } from '../tables/orders-table';
import { PaymentsTable } from '../tables/payments-table';
import { PaymentHistoryTable } from '../tables/payment-history-table';

export interface EventMachaDbStackProps extends StackProps {
  readonly appConfig: AppConfig;
}

export class EventMachaDbStack extends Stack {
  public readonly usersTable: UsersTable;
  public readonly rateCardsTable: RateCardsTable;
  public readonly rateCardPlansTable: RateCardPlansTable;
  public readonly ordersTable: OrdersTable;
  public readonly paymentsTable: PaymentsTable;
  public readonly paymentHistoryTable: PaymentHistoryTable;

  constructor(scope: Construct, id: string, props: EventMachaDbStackProps) {
    super(scope, id, props);

    const { appConfig } = props;

    // 1. Instantiate the partitioned DynamoDB tables
    this.usersTable = new UsersTable(this, 'UsersTableContainer', { appConfig });
    this.rateCardsTable = new RateCardsTable(this, 'RateCardsTableContainer', { appConfig });
    this.rateCardPlansTable = new RateCardPlansTable(this, 'RateCardPlansTableContainer', { appConfig });
    this.ordersTable = new OrdersTable(this, 'OrdersTableContainer', { appConfig });
    this.paymentsTable = new PaymentsTable(this, 'PaymentsTableContainer', { appConfig });
    this.paymentHistoryTable = new PaymentHistoryTable(this, 'PaymentHistoryTableContainer', { appConfig });

    // 2. Define standard CloudFormation Exports for every Table (Name & ARN)
    const tables = [
      { key: 'Users', table: this.usersTable.resource.table },
      { key: 'RateCards', table: this.rateCardsTable.resource.table },
      { key: 'RateCardPlans', table: this.rateCardPlansTable.resource.table },
      { key: 'Orders', table: this.ordersTable.resource.table },
      { key: 'Payments', table: this.paymentsTable.resource.table },
      { key: 'PaymentHistory', table: this.paymentHistoryTable.resource.table },
    ];

    tables.forEach(({ key, table }) => {
      // Export Table Name
      new CfnOutput(this, `${key}TableNameOutput`, {
        value: table.tableName,
        description: `The name of the Event Macha ${key} DynamoDB table`,
        exportName: `EventMacha-${appConfig.environment}-${key}-TableName`,
      });

      // Export Table ARN
      new CfnOutput(this, `${key}TableArnOutput`, {
        value: table.tableArn,
        description: `The ARN of the Event Macha ${key} DynamoDB table`,
        exportName: `EventMacha-${appConfig.environment}-${key}-TableArn`,
      });
    });
  }

  /**
   * Helper utility to grant comprehensive DynamoDB read/write access to a Quarkus Lambda's execution role.
   * This handles granting access both to the tables themselves and to their global secondary indexes (*).
   */
  public grantReadWriteAccessToQuarkusRole(role: iam.IRole): void {
    const ddbTables = [
      this.usersTable.resource.table,
      this.rateCardsTable.resource.table,
      this.rateCardPlansTable.resource.table,
      this.ordersTable.resource.table,
      this.paymentsTable.resource.table,
      this.paymentHistoryTable.resource.table,
    ];

    ddbTables.forEach((table) => {
      // Grant standard read-write permissions to the table
      table.grantReadWriteData(role);
      
      // Explicitly grant index query permissions (e.g. /index/*) as CDK grantReadWriteData does not automatically cover GSIs
      role.addToPrincipalPolicy(
        new iam.PolicyStatement({
          actions: [
            'dynamodb:BatchGetItem',
            'dynamodb:BatchWriteItem',
            'dynamodb:GetItem',
            'dynamodb:PutItem',
            'dynamodb:UpdateItem',
            'dynamodb:DeleteItem',
            'dynamodb:Query',
            'dynamodb:Scan',
          ],
          resources: [`${table.tableArn}/index/*`],
        })
      );
    });
  }
}
