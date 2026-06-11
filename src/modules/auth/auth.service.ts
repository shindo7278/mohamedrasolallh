import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private supabase;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get('supabase.url') ?? '';
    const supabaseKey = this.configService.get('supabase.serviceRoleKey') ?? '';
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async register(dto: RegisterDto) {
    // 1. Create Supabase auth user
    const { data, error } = await this.supabase.auth.admin.createUser({
      email: dto.email,
      password: dto.password,
      email_confirm: true,
    });

    if (error) {
      if (error.message.includes('already registered')) {
        throw new ConflictException('Email already exists');
      }
      throw new Error(error.message);
    }

    const userId = data.user.id;

    // 2. Create organization
    const slug = dto.organizationName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    const { error: orgError } = await this.supabase
      .from('organizations')
      .insert({
        name: dto.organizationName,
        slug: `${slug}-${Date.now()}`,
      })
      .select()
      .single();

    if (orgError) throw new Error(orgError.message);

    // 3. Get the created org
    const { data: org } = await this.supabase
      .from('organizations')
      .select('id')
      .eq('name', dto.organizationName)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // 4. Create user record
    await this.supabase
      .from('users')
      .insert({
        supabase_auth_id: userId,
        organization_id: org.id,
        email: dto.email,
        full_name: dto.fullName,
        role: 'admin',
      });

    return {
      message: 'Registration successful',
      userId,
      email: data.user.email,
      organizationId: org.id,
    };
  }

  async login(dto: LoginDto) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    });

    if (error) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    };
  }
}