import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendToEmail(user: any, url: string) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'florify',
      template: './confirmation',
      context: {
        name: user.email,
        url,
      },
    });
  }
}
