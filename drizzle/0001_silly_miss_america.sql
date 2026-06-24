CREATE TABLE "payment_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(100) NOT NULL,
	"creem_transaction_id" text NOT NULL,
	"creem_order_id" text,
	"creem_subscription_id" text,
	"creem_customer_id" text NOT NULL,
	"type" varchar(20) NOT NULL,
	"status" varchar(20) NOT NULL,
	"amount" integer NOT NULL,
	"currency" varchar(3) NOT NULL,
	"lesson_id" integer,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "payment_transactions_creem_transaction_id_unique" UNIQUE("creem_transaction_id")
);
--> statement-breakpoint
CREATE TABLE "user_course_purchases" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(100) NOT NULL,
	"lesson_id" integer NOT NULL,
	"creem_order_id" text NOT NULL,
	"creem_customer_id" text NOT NULL,
	"status" varchar(20) NOT NULL,
	"amount" integer NOT NULL,
	"currency" varchar(3) NOT NULL,
	"purchased_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(100) NOT NULL,
	"subscription_type" varchar(20) NOT NULL,
	"creem_subscription_id" text,
	"creem_customer_id" text NOT NULL,
	"status" varchar(20) NOT NULL,
	"current_period_start" timestamp,
	"current_period_end" timestamp,
	"canceled_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "user_course_purchases" ADD CONSTRAINT "user_course_purchases_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "payment_transactions_user_id_idx" ON "payment_transactions" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "payment_transactions_transaction_id_idx" ON "payment_transactions" USING btree ("creem_transaction_id");--> statement-breakpoint
CREATE INDEX "payment_transactions_type_idx" ON "payment_transactions" USING btree ("type");--> statement-breakpoint
CREATE INDEX "payment_transactions_status_idx" ON "payment_transactions" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "user_lesson_purchase_idx" ON "user_course_purchases" USING btree ("user_id","lesson_id");--> statement-breakpoint
CREATE INDEX "user_course_purchases_user_id_idx" ON "user_course_purchases" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_course_purchases_order_id_idx" ON "user_course_purchases" USING btree ("creem_order_id");--> statement-breakpoint
CREATE INDEX "user_subscriptions_user_id_idx" ON "user_subscriptions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_subscriptions_subscription_id_idx" ON "user_subscriptions" USING btree ("creem_subscription_id");--> statement-breakpoint
CREATE INDEX "user_subscriptions_type_idx" ON "user_subscriptions" USING btree ("subscription_type");