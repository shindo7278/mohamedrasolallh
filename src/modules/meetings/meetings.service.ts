import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class MeetingsService {
  private supabase;

  constructor(private configService: ConfigService) {
    const url = this.configService.get('supabase.url') ?? '';
    const key = this.configService.get('supabase.serviceRoleKey') ?? '';
    this.supabase = createClient(url, key);
  }

  async findAll(organizationId: string) {
    const { data, error } = await this.supabase
      .from('meetings')
      .select('*, leads(first_name, last_name, email, company_name)')
      .eq('organization_id', organizationId)
      .order('scheduled_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }

  async findOne(id: string, organizationId: string) {
    const { data, error } = await this.supabase
      .from('meetings')
      .select('*, leads(first_name, last_name, email, company_name, job_title)')
      .eq('id', id)
      .eq('organization_id', organizationId)
      .single();

    if (error || !data) throw new NotFoundException('Meeting not found');
    return data;
  }

  async create(organizationId: string, body: any) {
    const { data, error } = await this.supabase
      .from('meetings')
      .insert({
        ...body,
        organization_id: organizationId,
        status: 'booked',
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async update(id: string, organizationId: string, body: any) {
    const { data, error } = await this.supabase
      .from('meetings')
      .update({ ...body, updated_at: new Date() })
      .eq('id', id)
      .eq('organization_id', organizationId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async markAttended(id: string, organizationId: string) {
    const { data, error } = await this.supabase
      .from('meetings')
      .update({ attended: true, status: 'attended', updated_at: new Date() })
      .eq('id', id)
      .eq('organization_id', organizationId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async markNoShow(id: string, organizationId: string) {
    const { data, error } = await this.supabase
      .from('meetings')
      .update({ attended: false, status: 'no_show', updated_at: new Date() })
      .eq('id', id)
      .eq('organization_id', organizationId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async getUpcoming(organizationId: string) {
    const { data, error } = await this.supabase
      .from('meetings')
      .select('*, leads(first_name, last_name, email, company_name)')
      .eq('organization_id', organizationId)
      .eq('status', 'booked')
      .gte('scheduled_at', new Date().toISOString())
      .order('scheduled_at', { ascending: true });

    if (error) throw new Error(error.message);
    return data;
  }
}