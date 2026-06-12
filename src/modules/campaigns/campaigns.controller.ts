import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Get('org/:organizationId')
  async findAll(@Param('organizationId') organizationId: string) {
    return this.campaignsService.findAll(organizationId);
  }

  @Get(':id/org/:organizationId')
  async findOne(
    @Param('id') id: string,
    @Param('organizationId') organizationId: string,
  ) {
    return this.campaignsService.findOne(id, organizationId);
  }

  @Post('org/:organizationId/user/:userId')
  async create(
    @Param('organizationId') organizationId: string,
    @Param('userId') userId: string,
    @Body() body: any,
  ) {
    return this.campaignsService.create(organizationId, userId, body);
  }

  @Patch(':id/org/:organizationId')
  async update(
    @Param('id') id: string,
    @Param('organizationId') organizationId: string,
    @Body() body: any,
  ) {
    return this.campaignsService.update(id, organizationId, body);
  }

  @Delete(':id/org/:organizationId')
  async delete(
    @Param('id') id: string,
    @Param('organizationId') organizationId: string,
  ) {
    return this.campaignsService.delete(id, organizationId);
  }
}