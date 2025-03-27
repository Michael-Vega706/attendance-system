import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendResetPassword(email: string, password: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset Password - NestAPI',
      html: `
                <h1>Here is your new Password!</h1>
                <p>${password}</p>
            `,
    });
  }
}
