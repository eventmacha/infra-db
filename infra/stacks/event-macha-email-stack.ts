import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ses from 'aws-cdk-lib/aws-ses';
import { AppConfig } from '../config/app-config';

export interface EventMachaEmailStackProps extends StackProps {
  readonly appConfig: AppConfig;
}

export class EventMachaEmailStack extends Stack {
  public readonly emailIdentity: ses.EmailIdentity;

  constructor(scope: Construct, id: string, props: EventMachaEmailStackProps) {
    super(scope, id, props);

    // Create the SES Email Identity for the specified email address
    const emailAddress = 'no-reply@eventmacha.com';

    this.emailIdentity = new ses.EmailIdentity(this, 'EventMachaEmailIdentity', {
      identity: ses.Identity.email(emailAddress),
    });

    // Outputs
    new CfnOutput(this, 'EmailIdentityName', {
      value: this.emailIdentity.emailIdentityName,
      description: 'The name of the SES Email Identity',
    });
  }
}
