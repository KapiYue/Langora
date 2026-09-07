/** Read a production table without returning user or lesson content. */
import { config } from 'dotenv';
import postgres from 'postgres';

config({ path: '.env.local' });
config();

const projectRef = 'wzqnbezmhkngwijqside';

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not configured');
  }

  const url = new URL(connectionString);
  const direct = url.hostname === `db.${projectRef}.supabase.co`;
  const pooler =
    url.hostname.endsWith('.pooler.supabase.com') &&
    decodeURIComponent(url.username) === `postgres.${projectRef}`;
  if (
    !['postgres:', 'postgresql:'].includes(url.protocol) ||
    (!direct && !pooler)
  ) {
    throw new Error(
      'DATABASE_URL does not target the expected Supabase project'
    );
  }

  const client = postgres(connectionString, {
    prepare: false,
    max: 1,
    connect_timeout: 15,
    connection: { statement_timeout: 15000 },
  });

  try {
    await client.begin('read only', async (transaction) => {
      const [result] = await transaction.unsafe<
        { checked_at: Date; has_lessons: boolean }[]
      >(`
        select now() as checked_at,
          exists(select 1 from public.lessons limit 1) as has_lessons
      `);
      if (!result || typeof result.has_lessons !== 'boolean') {
        throw new Error('Unexpected database query result');
      }
      console.log('Database keepalive ok:', {
        project: projectRef,
        table: 'public.lessons',
        checkedAt: result.checked_at,
      });
    });
  } finally {
    await client.end({ timeout: 5 });
  }
}

main().catch(() => {
  // Connection errors can contain credentials or query context. Keep logs private.
  console.error(
    'Database keepalive failed: check target, connection and table access'
  );
  process.exitCode = 1;
});
