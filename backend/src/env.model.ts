export interface Env{
    NODE_ENV: 'development' | 'production' | 'test';
    GEMINI_API_KEY: string;
    POSTGRES_HOST: string;
    POSTGRES_PORT: number;
    POSTGRES_DB: string;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    JWT_SECRET: string
}