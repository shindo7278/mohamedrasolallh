import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { MeetingsService } from './meetings.service';

@Controller('meetings')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Get('org/:organizationId')
  async findAll(@Param('organizationId') organizationId: string) {
    return this.meetingsService.findAll(organizationId);
  }

  @Get('org/:organizationId/upcoming')
  async getUpcoming(@Param('organizationId') organizationId: string) {
    return this.meetingsService.getUpcoming(organizationId);
  }

  @Get(':id/org/:organizationId')
  async findOne(
    @Param('id') id: string,
    @Param('organizationId') organizationId: string,
  ) {
    return this.meetingsService.findOne(id, organizationId);
  }

  @Post('org/:organizationId')
  async create(
    @Param('organizationId') organizationId: string,
    @Body() body: any,
  ) {
    return this.meetingsService.create(organizationId, body);
  }

  @Patch(':id/org/:organizationId')
  async update(
    @Param('id') id: string,
    @Param('organizationId') organizationId: string,
    @Body() body: any,
  ) {
    return this.meetingsService.update(id, organizationId, body);
  }

  @Patch(':id/org/:organizationId/attended')
  async markAttended(
    @Param('id') id: string,
    @Param('organizationId') organizationId: string,
  ) {
    return this.meetingsService.markAttended(id, organizationId);
  }

  @Patch(':id/org/:organizationId/no-show')
  async markNoShow(
    @Param('id') id: string,
    @Param('organizationId') organizationId: string,
  ) {
    return this.meetingsService.markNoShow(id, organizationId);
  }
}