import { Controller, Get, Patch, Delete, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('org/:organizationId')
  async findAll(@Param('organizationId') organizationId: string) {
    return this.usersService.findAll(organizationId);
  }

  @Get(':id/org/:organizationId')
  async findOne(
    @Param('id') id: string,
    @Param('organizationId') organizationId: string,
  ) {
    return this.usersService.findOne(id, organizationId);
  }

  @Get('supabase/:supabaseAuthId')
  async findBySupabaseId(@Param('supabaseAuthId') supabaseAuthId: string) {
    return this.usersService.findBySupabaseId(supabaseAuthId);
  }

  @Patch(':id/org/:organizationId')
  async update(
    @Param('id') id: string,
    @Param('organizationId') organizationId: string,
    @Body() body: any,
  ) {
    return this.usersService.update(id, organizationId, body);
  }

  @Patch(':id/org/:organizationId/role')
  async updateRole(
    @Param('id') id: string,
    @Param('organizationId') organizationId: string,
    @Body() body: { role: string },
  ) {
    return this.usersService.updateRole(id, organizationId, body.role);
  }

  @Delete(':id/org/:organizationId')
  async deactivate(
    @Param('id') id: string,
    @Param('organizationId') organizationId: string,
  ) {
    return this.usersService.deactivate(id, organizationId);
  }
}