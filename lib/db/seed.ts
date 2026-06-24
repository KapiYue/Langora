import { db } from './index';
import { lessons, lessonItems } from './schema';
import lessonsData from '../../docs/lessons.json';

export async function seedDatabase() {
  try {
    console.log('开始导入课程数据...');

    // 清空现有数据（谨慎使用）
    await db.delete(lessonItems);
    await db.delete(lessons);

    // 导入课程数据
    for (const lessonData of lessonsData) {
      // 插入课程
      const [insertedLesson] = await db.insert(lessons).values({
        lessonId: lessonData.lesson_id,
        titleEn: lessonData.title_en,
        titleZh: lessonData.title_zh,
        descriptionEn: lessonData.description_en,
        cover: lessonData.cover,
        tag: lessonData.tag,
        order: lessonData.order,
      }).returning();

      console.log(`已插入课程: ${lessonData.title_en}`);

      // 插入课程项目
      for (let i = 0; i < lessonData.items.length; i++) {
        const item = lessonData.items[i];
        await db.insert(lessonItems).values({
          itemId: item.item_id,
          lessonId: insertedLesson.id,
          type: item.type,
          en: item.en,
          zh: item.zh,
          py: item.py,
          accepted: item.accepted,
          audio: item.audio,
          order: i + 1,
        });
      }

      console.log(`已插入 ${lessonData.items.length} 个练习项目`);
    }

    console.log('✅ 数据导入完成！');
    console.log(`共导入 ${lessonsData.length} 个课程，${lessonsData.reduce((sum, lesson) => sum + lesson.items.length, 0)} 个练习项目`);

  } catch (error) {
    console.error('❌ 数据导入失败:', error);
    throw error;
  }
}

// 如果直接运行此文件，则执行数据种子
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('数据种子执行完成');
      process.exit(0);
    })
    .catch((error) => {
      console.error('数据种子执行失败:', error);
      process.exit(1);
    });
} 