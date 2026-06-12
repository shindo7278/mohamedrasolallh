import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class CampaignsService {
  private supabase;

  constructor(private configService: ConfigService) {
    const url = this.configService.get('supabase.url') ?? '';
    const key = this.configService.get('supabase.serviceRoleKey') ?? '';
    this.supabase = createClient(url, key);
  }

  async findAll(organizationId: string) {
    const { data, error } = await this.supabase
      .from('campaigns')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }

  async findOne(id: string, organizationId: string) {
    const { data, error } = await this.supabase
      .from('campaigns')
      .select('*')
      .eq('id', id)
      .eq('organization_id', organizationId)
      .single();

    if (error || !data) throw new NotFoundException('Campaign not found');
    return data;
  }

  async create(organizationId: string, userId: string, body: any) {
    const { data, error } = await this.supabase
      .from('campaigns')
      .insert({
        ...body,
        organization_id: organizationId,
        created_by: userId,
        status: 'draft',
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async update(id: string, organizationId: string, body: any) {
    const { data, error } = await this.supabase
      .from('campaigns')
      .update({ ...body, updated_at: new Date() })
      .eq('id', id)
      .eq('organization_id', organizationId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async delete(id: string, organizationId: string) {
    const { error } = await this.supabase
      .from('campaigns')
      .update({ status: 'archived' })
      .eq('id', id)
      .eq('organization_id', organizationId);

    if (error) throw new Error(error.message);
    return { message: 'Campaign archived successfully' };
  }
}