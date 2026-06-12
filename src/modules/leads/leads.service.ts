import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class LeadsService {
  private supabase;

  constructor(private configService: ConfigService) {
    const url = this.configService.get('supabase.url') ?? '';
    const key = this.configService.get('supabase.serviceRoleKey') ?? '';
    this.supabase = createClient(url, key);
  }

  async findAll(organizationId: string, campaignId?: string) {
    let query = this.supabase
      .from('leads')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (campaignId) {
      query = query.eq('campaign_id', campaignId);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
  }

  async findOne(id: string, organizationId: string) {
    const { data, error } = await this.supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .eq('organization_id', organizationId)
      .single();

    if (error || !data) throw new NotFoundException('Lead not found');
    return data;
  }

  async create(organizationId: string, body: any) {
    const { data, error } = await this.supabase
      .from('leads')
      .insert({
        ...body,
        organization_id: organizationId,
        status: 'new',
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async update(id: string, organizationId: string, body: any) {
    const { data, error } = await this.supabase
      .from('leads')
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
      .from('leads')
      .delete()
      .eq('id', id)
      .eq('organization_id', organizationId);

    if (error) throw new Error(error.message);
    return { message: 'Lead deleted successfully' };
  }
}