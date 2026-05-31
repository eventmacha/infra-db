import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ses from 'aws-cdk-lib/aws-ses';
import * as sns from 'aws-cdk-lib/aws-sns';
import { AppConfig } from '../config/app-config';

export interface EventMachaEmailStackProps extends StackProps {
  readonly appConfig: AppConfig;
}

export class EventMachaEmailStack extends Stack {
  public readonly emailIdentity: ses.EmailIdentity;
  public readonly notificationTopic: sns.Topic;

  constructor(scope: Construct, id: string, props: EventMachaEmailStackProps) {
    super(scope, id, props);

    const { appConfig } = props;

    // 1. Create SNS Topic for Email Notifications (Bounces, Complaints, Deliveries)
    this.notificationTopic = new sns.Topic(this, 'EventMachaEmailNotifications', {
      topicName: `event-macha-email-notifications-${appConfig.environment}`,
      displayName: `Event Macha Email Notifications (${appConfig.environment})`,
    });

    // 2. Create Configuration Set and Event Destination
    const configSet = new ses.ConfigurationSet(this, 'EventMachaConfigSet', {
      configurationSetName: `event-macha-config-${appConfig.environment}`,
    });

    configSet.addEventDestination('SnsDestination', {
      destination: ses.EventDestination.snsTopic(this.notificationTopic),
      events: [
        ses.EmailSendingEvent.BOUNCE,
        ses.EmailSendingEvent.COMPLAINT,
        ses.EmailSendingEvent.DELIVERY,
      ],
    });

    // 3. Create the SES Email Identity for the specified email address
    const emailAddress = 'no-reply@eventmacha.com';

    this.emailIdentity = new ses.EmailIdentity(this, 'EventMachaEmailIdentity', {
      identity: ses.Identity.email(emailAddress),
      configurationSet: configSet,
    });

    // Outputs
    new CfnOutput(this, 'EmailIdentityName', {
      value: this.emailIdentity.emailIdentityName,
      description: 'The name of the SES Email Identity',
    });

    new CfnOutput(this, 'NotificationTopicArn', {
      value: this.notificationTopic.topicArn,
      description: 'The ARN of the SNS Topic for email notifications',
    });
  }
}
