import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private configService;
    private supabase;
    constructor(configService: ConfigService);
    register(dto: RegisterDto): Promise<{
        message: string;
        userId: any;
        email: any;
    }>;
    login(dto: LoginDto): Promise<{
        access_token: any;
        refresh_token: any;
        user: {
            id: any;
            email: any;
        };
    }>;
}
