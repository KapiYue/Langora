import { seedDatabase } from '../lib/db/seed';

async function main() {
  try {
    console.log('开始设置数据库...');
    await seedDatabase();
    console.log('✅ 数据库设置完成！');
    process.exit(0);
  } catch (error) {
    console.error('❌ 数据库设置失败:', error);
    process.exit(1);
  }
}

main(); 