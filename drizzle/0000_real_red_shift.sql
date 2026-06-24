CREATE TABLE "lesson_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_id" varchar(100) NOT NULL,
	"lesson_id" integer NOT NULL,
	"type" varchar(20) DEFAULT 'word' NOT NULL,
	"en" text NOT NULL,
	"zh" text NOT NULL,
	"py" text NOT NULL,
	"accepted" jsonb NOT NULL,
	"audio" text,
	"order" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "lesson_items_item_id_unique" UNIQUE("item_id")
);
--> statement-breakpoint
CREATE TABLE "lessons" (
	"id" serial PRIMARY KEY NOT NULL,
	"lesson_id" varchar(100) NOT NULL,
	"title_en" text NOT NULL,
	"title_zh" text,
	"description_en" text NOT NULL,
	"cover" text,
	"tag" varchar(50) NOT NULL,
	"order" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "lessons_lesson_id_unique" UNIQUE("lesson_id")
);
--> statement-breakpoint
CREATE TABLE "user_daily_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(100) NOT NULL,
	"date" varchar(10) NOT NULL,
	"lessons_completed" integer DEFAULT 0 NOT NULL,
	"words_learned" integer DEFAULT 0 NOT NULL,
	"time_spent" integer DEFAULT 0 NOT NULL,
	"accuracy" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_item_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(100) NOT NULL,
	"item_id" integer NOT NULL,
	"is_completed" boolean DEFAULT false NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"correct_attempts" integer DEFAULT 0 NOT NULL,
	"last_attempt_at" timestamp DEFAULT now(),
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_lesson_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(100) NOT NULL,
	"lesson_id" integer NOT NULL,
	"completed_items" integer DEFAULT 0 NOT NULL,
	"total_items" integer NOT NULL,
	"is_completed" boolean DEFAULT false NOT NULL,
	"last_accessed_at" timestamp DEFAULT now(),
	"completed_at" timestamp,
	"accuracy" integer DEFAULT 0,
	"total_time_spent" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(100) NOT NULL,
	"email" text NOT NULL,
	"full_name" text,
	"total_lessons_completed" integer DEFAULT 0 NOT NULL,
	"total_words_learned" integer DEFAULT 0 NOT NULL,
	"current_streak" integer DEFAULT 0 NOT NULL,
	"last_active_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "lesson_items" ADD CONSTRAINT "lesson_items_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_item_progress" ADD CONSTRAINT "user_item_progress_item_id_lesson_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."lesson_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_lesson_progress" ADD CONSTRAINT "user_lesson_progress_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "item_id_idx" ON "lesson_items" USING btree ("item_id");--> statement-breakpoint
CREATE INDEX "lesson_items_lesson_id_idx" ON "lesson_items" USING btree ("lesson_id");--> statement-breakpoint
CREATE INDEX "lesson_items_order_idx" ON "lesson_items" USING btree ("order");--> statement-breakpoint
CREATE UNIQUE INDEX "lesson_id_idx" ON "lessons" USING btree ("lesson_id");--> statement-breakpoint
CREATE INDEX "tag_idx" ON "lessons" USING btree ("tag");--> statement-breakpoint
CREATE INDEX "order_idx" ON "lessons" USING btree ("order");--> statement-breakpoint
CREATE UNIQUE INDEX "user_date_idx" ON "user_daily_stats" USING btree ("user_id","date");--> statement-breakpoint
CREATE INDEX "user_daily_stats_user_id_idx" ON "user_daily_stats" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "date_idx" ON "user_daily_stats" USING btree ("date");--> statement-breakpoint
CREATE UNIQUE INDEX "user_item_idx" ON "user_item_progress" USING btree ("user_id","item_id");--> statement-breakpoint
CREATE INDEX "user_item_progress_user_id_idx" ON "user_item_progress" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_item_progress_item_id_idx" ON "user_item_progress" USING btree ("item_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_lesson_idx" ON "user_lesson_progress" USING btree ("user_id","lesson_id");--> statement-breakpoint
CREATE INDEX "user_lesson_progress_user_id_idx" ON "user_lesson_progress" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_lesson_progress_lesson_id_idx" ON "user_lesson_progress" USING btree ("lesson_id");--> statement-breakpoint
CREATE INDEX "last_accessed_idx" ON "user_lesson_progress" USING btree ("last_accessed_at");--> statement-breakpoint
CREATE UNIQUE INDEX "user_id_idx" ON "user_profiles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "email_idx" ON "user_profiles" USING btree ("email");