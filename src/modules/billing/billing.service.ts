import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class BillingService {
  private supabase;

  constructor(private configService: ConfigService) {
    const url = this.configService.get('supabase.url') ?? '';
    const key = this.configService.get('supabase.serviceRoleKey') ?? '';
    this.supabase = createClient(url, key);
  }

  async getBalance(organizationId: string) {
    const { data, error } = await this.supabase
      .from('organizations')
      .select('credits_balance, meetings_purchased, meetings_consumed, billing_plan')
      .eq('id', organizationId)
      .single();

    if (error) throw new NotFoundException('Organization not found');
    return data;
  }

  async getCreditHistory(organizationId: string) {
    const { data, error } = await this.supabase
      .from('credit_ledger')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }

  async addCredits(organizationId: string, amount: number, description: string) {
    // Get current balance
    const { data: org } = await this.supabase
      .from('organizations')
      .select('credits_balance')
      .eq('id', organizationId)
      .single();

    const newBalance = (org?.credits_balance ?? 0) + amount;

    // Update balance
    await this.supabase
      .from('organizations')
      .update({ credits_balance: newBalance })
      .eq('id', organizationId);

    // Log transaction
    const { data, error } = await this.supabase
      .from('credit_ledger')
      .insert({
        organization_id: organizationId,
        transaction_type: 'purchase',
        amount,
        balance_after: newBalance,
        description,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return { newBalance, transaction: data };
  }

  async consumeCredit(organizationId: string, meetingId: string) {
    const { data: org } = await this.supabase
      .from('organizations')
      .select('credits_balance')
      .eq('id', organizationId)
      .single();

    if (!org || org.credits_balance < 1) {
      throw new Error('Insufficient credits');
    }

    const newBalance = org.credits_balance - 1;

    await this.supabase
      .from('organizations')
      .update({
        credits_balance: newBalance,
        meetings_consumed: org.credits_balance,
      })
      .eq('id', organizationId);

    await this.supabase
      .from('credit_ledger')
      .insert({
        organization_id: organizationId,
        transaction_type: 'consumed',
        amount: -1,
        balance_after: newBalance,
        reference_type: 'meeting',
        reference_id: meetingId,
        description: 'Qualified meeting credit consumed',
      });

    return { newBalance };
  }

  async getInvoices(organizationId: string) {
    const { data, error } = await this.supabase
      .from('invoices')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }
}