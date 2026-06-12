import { Controller, Get, Patch, Body, Param } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.organizationsService.findById(id);
  }

  @Get(':id/stats')
  async getStats(@Param('id') id: string) {
    return this.organizationsService.getStats(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.organizationsService.update(id, body);
  }
}