import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { BillingService } from './billing.service';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('org/:organizationId/balance')
  async getBalance(@Param('organizationId') organizationId: string) {
    return this.billingService.getBalance(organizationId);
  }

  @Get('org/:organizationId/credits')
  async getCreditHistory(@Param('organizationId') organizationId: string) {
    return this.billingService.getCreditHistory(organizationId);
  }

  @Post('org/:organizationId/credits/add')
  async addCredits(
    @Param('organizationId') organizationId: string,
    @Body() body: { amount: number; description: string },
  ) {
    return this.billingService.addCredits(
      organizationId,
      body.amount,
      body.description,
    );
  }

  @Post('org/:organizationId/credits/consume')
  async consumeCredit(
    @Param('organizationId') organizationId: string,
    @Body() body: { meetingId: string },
  ) {
    return this.billingService.consumeCredit(organizationId, body.meetingId);
  }

  @Get('org/:organizationId/invoices')
  async getInvoices(@Param('organizationId') organizationId: string) {
    return this.billingService.getInvoices(organizationId);
  }
}