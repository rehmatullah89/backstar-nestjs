import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import axios from 'axios';
import { response } from 'express';

@Controller()
export class AppController {
  private zendeskApiUrl = 'https://smilebrilliant.zendesk.com';
  private zendeskEmail = 'support@smilebrilliant.com';
  private zendeskPassword = 'xlma2190';

  constructor(private readonly appService: AppService) {}

  @Get('/index')
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/create-dummy-ticket')
  async createDummyTicket(
    @Res() response,
    @Body()
    credentials: { subject: string; description: string; userEmail: string },
  ): Promise<any> {
    try {
      const response_data = await axios.post(
        `${this.zendeskApiUrl}/api/v2/tickets.json`,
        {
          ticket: {
            subject: credentials.subject,
            description: credentials.description,
            requester: {
              email: credentials.userEmail,
            },
          },
        },
        {
          auth: {
            username: this.zendeskEmail,
            password: this.zendeskPassword,
          },
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      return response.status(HttpStatus.CREATED).json({
        message: 'Ticket Created Successfully.',
        response_data,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Creating Ticket!',
        error: error,
      });
    }
  }
}
