declare const _default: () => {
    port: number;
    nodeEnv: string;
    jwtSecret: string | undefined;
    supabase: {
        url: string | undefined;
        anonKey: string | undefined;
        serviceRoleKey: string | undefined;
    };
    anthropic: {
        apiKey: string | undefined;
    };
    resend: {
        apiKey: string | undefined;
    };
    redis: {
        url: string | undefined;
    };
};
export default _default;
