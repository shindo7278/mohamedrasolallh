"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    port: parseInt(process.env.PORT ?? '3000', 10) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    jwtSecret: process.env.JWT_SECRET,
    supabase: {
        url: process.env.SUPABASE_URL,
        anonKey: process.env.SUPABASE_ANON_KEY,
        serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
    anthropic: {
        apiKey: process.env.ANTHROPIC_API_KEY,
    },
    resend: {
        apiKey: process.env.RESEND_API_KEY,
    },
    redis: {
        url: process.env.REDIS_URL,
    },
});
//# sourceMappingURL=app.config.js.map