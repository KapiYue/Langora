import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from 'dotenv';

// 加载环境变量（优先 .env.local，再回退 .env）
config({ path: '.env.local' });
config();

// 从环境变量获取数据库URL
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// 创建postgres连接
const client = postgres(connectionString);

// 创建drizzle实例
export const db = drizzle(client);

// 导出类型
export type Database = typeof db;