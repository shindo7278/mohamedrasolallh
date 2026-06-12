import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { LeadsService } from './leads.service';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get('org/:organizationId')
  async findAll(
    @Param('organizationId') organizationId: string,
    @Query('campaignId') campaignId?: string,
  ) {
    return this.leadsService.findAll(organizationId, campaignId);
  }

  @Get(':id/org/:organizationId')
  async findOne(
    @Param('id') id: string,
    @Param('organizationId') organizationId: string,
  ) {
    return this.leadsService.findOne(id, organizationId);
  }

  @Post('org/:organizationId')
  async create(
    @Param('organizationId') organizationId: string,
    @Body() body: any,
  ) {
    return this.leadsService.create(organizationId, body);
  }

  @Patch(':id/org/:organizationId')
  async update(
    @Param('id') id: string,
    @Param('organizationId') organizationId: string,
    @Body() body: any,
  ) {
    return this.leadsService.update(id, organizationId, body);
  }

  @Delete(':id/org/:organizationId')
  async delete(
    @Param('id') id: string,
    @Param('organizationId') organizationId: string,
  ) {
    return this.leadsService.delete(id, organizationId);
  }
}