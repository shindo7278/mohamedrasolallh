import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class OrganizationsService {
  private supabase;

  constructor(private configService: ConfigService) {
    const url = this.configService.get('supabase.url') ?? '';
    const key = this.configService.get('supabase.serviceRoleKey') ?? '';
    this.supabase = createClient(url, key);
  }

  async findById(id: string) {
    const { data, error } = await this.supabase
      .from('organizations')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundException('Organization not found');
    return data;
  }

  async update(id: string, updates: any) {
    const { data, error } = await this.supabase
      .from('organizations')
      .update({ ...updates, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async getStats(id: string) {
    const { data: org } = await this.supabase
      .from('organizations')
      .select('credits_balance, meetings_purchased, meetings_consumed, billing_plan')
      .eq('id', id)
      .single();

    const { count: totalLeads } = await this.supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', id);

    const { count: totalCampaigns } = await this.supabase
      .from('campaigns')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', id);

    return {
      ...org,
      total_leads: totalLeads ?? 0,
      total_campaigns: totalCampaigns ?? 0,
    };
  }
}