// Drizzle ORM Schema 定义文件
// 在这里定义你的数据表结构

import { pgTable, serial, text, timestamp, integer, boolean, varchar, jsonb, uniqueIndex, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// 课程表
export const lessons = pgTable('lessons', {
  id: serial('id').primaryKey(),
  lessonId: varchar('lesson_id', { length: 100 }).notNull().unique(),
  titleEn: text('title_en').notNull(),
  titleZh: text('title_zh'),
  descriptionEn: text('description_en').notNull(),
  cover: text('cover'),
  tag: varchar('tag', { length: 50 }).notNull(),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  lessonIdIdx: uniqueIndex('lesson_id_idx').on(table.lessonId),
  tagIdx: index('tag_idx').on(table.tag),
  orderIdx: index('order_idx').on(table.order),
}));

// 课程项目表（每个课程的具体练习题）
export const lessonItems = pgTable('lesson_items', {
  id: serial('id').primaryKey(),
  itemId: varchar('item_id', { length: 100 }).notNull().unique(),
  lessonId: integer('lesson_id').notNull().references(() => lessons.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 20 }).notNull().default('word'),
  en: text('en').notNull(), // 英文提示
  zh: text('zh').notNull(), // 中文答案
  py: text('py').notNull(), // 拼音
  accepted: jsonb('accepted').notNull(), // 可接受的答案数组
  audio: text('audio'), // 音频URL
  order: integer('order').notNull(), // 在课程中的顺序
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  itemIdIdx: uniqueIndex('item_id_idx').on(table.itemId),
  lessonIdIdx: index('lesson_items_lesson_id_idx').on(table.lessonId),
  orderIdx: index('lesson_items_order_idx').on(table.order),
}));

// 用户表（扩展Supabase的用户信息）
export const userProfiles = pgTable('user_profiles', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 100 }).notNull().unique(), // Supabase用户ID
  email: text('email').notNull(),
  fullName: text('full_name'),
  totalLessonsCompleted: integer('total_lessons_completed').notNull().default(0),
  totalWordsLearned: integer('total_words_learned').notNull().default(0),
  currentStreak: integer('current_streak').notNull().default(0),
  lastActiveDate: timestamp('last_active_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userIdIdx: uniqueIndex('user_id_idx').on(table.userId),
  emailIdx: index('email_idx').on(table.email),
}));

// 用户课程进度表
export const userLessonProgress = pgTable('user_lesson_progress', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 100 }).notNull(),
  lessonId: integer('lesson_id').notNull().references(() => lessons.id, { onDelete: 'cascade' }),
  completedItems: integer('completed_items').notNull().default(0), // 已完成的题目数
  totalItems: integer('total_items').notNull(), // 总题目数
  isCompleted: boolean('is_completed').notNull().default(false),
  lastAccessedAt: timestamp('last_accessed_at').defaultNow(),
  completedAt: timestamp('completed_at'),
  accuracy: integer('accuracy').default(0), // 准确率百分比
  totalTimeSpent: integer('total_time_spent').default(0), // 总学习时间(秒)
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userLessonIdx: uniqueIndex('user_lesson_idx').on(table.userId, table.lessonId),
  userIdIdx: index('user_lesson_progress_user_id_idx').on(table.userId),
  lessonIdIdx: index('user_lesson_progress_lesson_id_idx').on(table.lessonId),
  lastAccessedIdx: index('last_accessed_idx').on(table.lastAccessedAt),
}));

// 用户课程项目进度表（具体到每个题目的完成情况）
export const userItemProgress = pgTable('user_item_progress', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 100 }).notNull(),
  itemId: integer('item_id').notNull().references(() => lessonItems.id, { onDelete: 'cascade' }),
  isCompleted: boolean('is_completed').notNull().default(false),
  attempts: integer('attempts').notNull().default(0), // 尝试次数
  correctAttempts: integer('correct_attempts').notNull().default(0), // 正确次数
  lastAttemptAt: timestamp('last_attempt_at').defaultNow(),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  userItemIdx: uniqueIndex('user_item_idx').on(table.userId, table.itemId),
  userIdIdx: index('user_item_progress_user_id_idx').on(table.userId),
  itemIdIdx: index('user_item_progress_item_id_idx').on(table.itemId),
}));

// 用户每日学习统计表
export const userDailyStats = pgTable('user_daily_stats', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 100 }).notNull(),
  date: varchar('date', { length: 10 }).notNull(), // YYYY-MM-DD格式
  lessonsCompleted: integer('lessons_completed').notNull().default(0),
  wordsLearned: integer('words_learned').notNull().default(0),
  timeSpent: integer('time_spent').notNull().default(0), // 学习时间(秒)
  accuracy: integer('accuracy').default(0), // 当日平均准确率
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  userDateIdx: uniqueIndex('user_date_idx').on(table.userId, table.date),
  userIdIdx: index('user_daily_stats_user_id_idx').on(table.userId),
  dateIdx: index('date_idx').on(table.date),
}));

// 定义关系
export const lessonsRelations = relations(lessons, ({ many }) => ({
  items: many(lessonItems),
  userProgress: many(userLessonProgress),
}));

export const lessonItemsRelations = relations(lessonItems, ({ one, many }) => ({
  lesson: one(lessons, {
    fields: [lessonItems.lessonId],
    references: [lessons.id],
  }),
  userProgress: many(userItemProgress),
}));

export const userProfilesRelations = relations(userProfiles, ({ many }) => ({
  lessonProgress: many(userLessonProgress),
  itemProgress: many(userItemProgress),
  dailyStats: many(userDailyStats),
}));

export const userLessonProgressRelations = relations(userLessonProgress, ({ one }) => ({
  lesson: one(lessons, {
    fields: [userLessonProgress.lessonId],
    references: [lessons.id],
  }),
}));

export const userItemProgressRelations = relations(userItemProgress, ({ one }) => ({
  item: one(lessonItems, {
    fields: [userItemProgress.itemId],
    references: [lessonItems.id],
  }),
}));

// 导出类型
export type Lesson = typeof lessons.$inferSelect;
export type NewLesson = typeof lessons.$inferInsert;

export type LessonItem = typeof lessonItems.$inferSelect;
export type NewLessonItem = typeof lessonItems.$inferInsert;

export type UserProfile = typeof userProfiles.$inferSelect;
export type NewUserProfile = typeof userProfiles.$inferInsert;

export type UserLessonProgress = typeof userLessonProgress.$inferSelect;
export type NewUserLessonProgress = typeof userLessonProgress.$inferInsert;

export type UserItemProgress = typeof userItemProgress.$inferSelect;
export type NewUserItemProgress = typeof userItemProgress.$inferInsert;

export type UserDailyStats = typeof userDailyStats.$inferSelect;
export type NewUserDailyStats = typeof userDailyStats.$inferInsert;

// 用户订阅表（Pro和终身会员）
export const userSubscriptions = pgTable('user_subscriptions', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 100 }).notNull(),
  subscriptionType: varchar('subscription_type', { length: 20 }).notNull(), // 'pro' or 'lifetime'
  creemSubscriptionId: text('creem_subscription_id'), // null for lifetime
  creemCustomerId: text('creem_customer_id').notNull(),
  status: varchar('status', { length: 20 }).notNull(), // 'active', 'canceled', 'expired'
  currentPeriodStart: timestamp('current_period_start'),
  currentPeriodEnd: timestamp('current_period_end'),
  canceledAt: timestamp('canceled_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userIdIdx: index('user_subscriptions_user_id_idx').on(table.userId),
  subscriptionIdIdx: index('user_subscriptions_subscription_id_idx').on(table.creemSubscriptionId),
  typeIdx: index('user_subscriptions_type_idx').on(table.subscriptionType),
  // 每个用户每种订阅类型至多一条记录，避免重复订阅产生脏数据
  userTypeIdx: uniqueIndex('user_subscriptions_user_type_idx').on(table.userId, table.subscriptionType),
}));

// 用户单课程购买表
export const userCoursePurchases = pgTable('user_course_purchases', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 100 }).notNull(),
  lessonId: integer('lesson_id').notNull().references(() => lessons.id),
  creemOrderId: text('creem_order_id').notNull(),
  creemCustomerId: text('creem_customer_id').notNull(),
  status: varchar('status', { length: 20 }).notNull(), // 'paid', 'refunded'
  amount: integer('amount').notNull(), // in cents
  currency: varchar('currency', { length: 3 }).notNull(),
  purchasedAt: timestamp('purchased_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  userLessonIdx: uniqueIndex('user_lesson_purchase_idx').on(table.userId, table.lessonId),
  userIdIdx: index('user_course_purchases_user_id_idx').on(table.userId),
  orderIdIdx: index('user_course_purchases_order_id_idx').on(table.creemOrderId),
}));

// 支付交易历史表
export const paymentTransactions = pgTable('payment_transactions', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 100 }).notNull(),
  creemTransactionId: text('creem_transaction_id').notNull().unique(),
  creemOrderId: text('creem_order_id'),
  creemSubscriptionId: text('creem_subscription_id'),
  creemCustomerId: text('creem_customer_id').notNull(),
  type: varchar('type', { length: 20 }).notNull(), // 'single_course', 'subscription', 'lifetime'
  status: varchar('status', { length: 20 }).notNull(), // 'pending', 'paid', 'failed', 'refunded'
  amount: integer('amount').notNull(), // in cents
  currency: varchar('currency', { length: 3 }).notNull(),
  lessonId: integer('lesson_id'), // only for single course purchases
  metadata: jsonb('metadata'), // additional data from Creem
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userIdIdx: index('payment_transactions_user_id_idx').on(table.userId),
  transactionIdIdx: uniqueIndex('payment_transactions_transaction_id_idx').on(table.creemTransactionId),
  typeIdx: index('payment_transactions_type_idx').on(table.type),
  statusIdx: index('payment_transactions_status_idx').on(table.status),
}));

// 添加支付相关的关系
export const userSubscriptionsRelations = relations(userSubscriptions, ({ one }) => ({
  user: one(userProfiles, {
    fields: [userSubscriptions.userId],
    references: [userProfiles.userId],
  }),
}));

export const userCoursePurchasesRelations = relations(userCoursePurchases, ({ one }) => ({
  user: one(userProfiles, {
    fields: [userCoursePurchases.userId],
    references: [userProfiles.userId],
  }),
  lesson: one(lessons, {
    fields: [userCoursePurchases.lessonId],
    references: [lessons.id],
  }),
}));

export const paymentTransactionsRelations = relations(paymentTransactions, ({ one }) => ({
  user: one(userProfiles, {
    fields: [paymentTransactions.userId],
    references: [userProfiles.userId],
  }),
  lesson: one(lessons, {
    fields: [paymentTransactions.lessonId],
    references: [lessons.id],
  }),
}));

// 导出支付相关类型
export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type NewUserSubscription = typeof userSubscriptions.$inferInsert;

export type UserCoursePurchase = typeof userCoursePurchases.$inferSelect;
export type NewUserCoursePurchase = typeof userCoursePurchases.$inferInsert;

export type PaymentTransaction = typeof paymentTransactions.$inferSelect;
export type NewPaymentTransaction = typeof paymentTransactions.$inferInsert;