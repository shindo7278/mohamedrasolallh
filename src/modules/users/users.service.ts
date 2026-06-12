import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class UsersService {
  private supabase;

  constructor(private configService: ConfigService) {
    const url = this.configService.get('supabase.url') ?? '';
    const key = this.configService.get('supabase.serviceRoleKey') ?? '';
    this.supabase = createClient(url, key);
  }

  async findAll(organizationId: string) {
    const { data, error } = await this.supabase
      .from('users')
      .select('id, email, full_name, role, is_active, created_at')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }

  async findOne(id: string, organizationId: string) {
    const { data, error } = await this.supabase
      .from('users')
      .select('id, email, full_name, role, is_active, language, timezone, created_at')
      .eq('id', id)
      .eq('organization_id', organizationId)
      .single();

    if (error || !data) throw new NotFoundException('User not found');
    return data;
  }

  async findBySupabaseId(supabaseAuthId: string) {
    const { data, error } = await this.supabase
      .from('users')
      .select('*, organizations(id, name, slug, billing_plan, credits_balance)')
      .eq('supabase_auth_id', supabaseAuthId)
      .single();

    if (error || !data) throw new NotFoundException('User not found');
    return data;
  }

  async update(id: string, organizationId: string, body: any) {
    const { data, error } = await this.supabase
      .from('users')
      .update({ ...body, updated_at: new Date() })
      .eq('id', id)
      .eq('organization_id', organizationId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async updateRole(id: string, organizationId: string, role: string) {
    const { data, error } = await this.supabase
      .from('users')
      .update({ role, updated_at: new Date() })
      .eq('id', id)
      .eq('organization_id', organizationId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async deactivate(id: string, organizationId: string) {
    const { data, error } = await this.supabase
      .from('users')
      .update({ is_active: false, updated_at: new Date() })
      .eq('id', id)
      .eq('organization_id', organizationId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
}