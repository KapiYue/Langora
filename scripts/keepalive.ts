/**
 * 保活脚本：让 Supabase 项目保持“有活动”状态，避免免费版被暂停。
 *
 * Supabase 免费版在 7 天没有数据库活动后会暂停项目：暂停后整站不可用，
 * Creem 的 webhook 也会被静默丢弃（付款回调收不到，用户付了钱开不了会员）。
 * 所以这个脚本由 GitHub Actions 定时跑（.github/workflows/keepalive.yml）。
 *
 *   npm run keepalive
 *
 * 做两件事：
 *   1. 执行一次最轻量的真实查询 `select now()`，让 Supabase 记录到数据库活动（必须成功）。
 *   2. 顺手 ping 一次 Supabase REST 接口，让 API 侧也有请求记录（失败只告警，不算整体失败）。
 */
import { config } from 'dotenv';

// 本地跑的时候靠它把变量读进 process.env；优先 .env.local，再回退 .env（与 lib/db 保持一致）。
config({ path: '.env.local' });
config();

async function touchDatabase() {
  if (!process.env.DATABASE_URL) {
    // 这里必须大声失败：静默跳过正是导致项目悄悄被暂停的原因。
    throw new Error('DATABASE_URL 未配置，无法执行数据库保活');
  }

  // 动态 import：lib/db 在模块加载时就会建连接，放在环境变量校验之后才能给出清晰报错。
  const { sql } = await import('drizzle-orm');
  const { db } = await import('../lib/db');

  const result = await db.execute(sql`select now() as now`);
  // postgres-js 驱动返回的是数组形式的结果集。
  const now = (result as unknown as Array<{ now: unknown }>)[0]?.now;
  console.log('✅ 数据库保活成功:', now);
}

/**
 * 只读地打一次 Supabase REST 根路径。用 anon key 即可，不写任何数据。
 * 纯粹是为了让 Supabase 的 API 活动统计里也有记录，属于加分项而非必需。
 */
async function pingSupabaseRest() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY;

  if (!url || !key) {
    console.log('ℹ️  跳过 REST ping：未配置 NEXT_PUBLIC_SUPABASE_URL / ANON_KEY');
    return;
  }

  try {
    const response = await fetch(`${url.replace(/\/$/, '')}/rest/v1/`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      // 别让网络问题把整次运行拖死。
      signal: AbortSignal.timeout(15_000),
    });
    console.log(`✅ Supabase REST ping: HTTP ${response.status}`);
  } catch (error) {
    // 非致命：数据库那一步才是决定项目是否被暂停的关键。
    console.warn('⚠️  Supabase REST ping 失败（不影响保活结果）:', error);
  }
}

async function main() {
  await touchDatabase();
  await pingSupabaseRest();
}

main()
  // lib/db 的 postgres 连接不会自己关闭，直接 exit 结束进程。
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ 保活失败:', error);
    process.exit(1);
  });
