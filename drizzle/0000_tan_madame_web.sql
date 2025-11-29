CREATE TYPE "public"."crop_type" AS ENUM('carrot', 'potato', 'watermelon');--> statement-breakpoint
CREATE TYPE "public"."growth_stage" AS ENUM('empty', 'planted', 'growing', 'ready');--> statement-breakpoint
CREATE TABLE "crop_catalog" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" "crop_type" NOT NULL,
	"name" text NOT NULL,
	"grow_time_ms" integer NOT NULL,
	"value" integer NOT NULL,
	"image" text NOT NULL,
	"class_name" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "crop_catalog_type_unique" UNIQUE("type")
);
--> statement-breakpoint
CREATE TABLE "farms" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"coins" integer DEFAULT 100 NOT NULL,
	"real_crops" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plots" (
	"id" serial PRIMARY KEY NOT NULL,
	"farm_id" integer NOT NULL,
	"position" integer NOT NULL,
	"crop" "crop_type",
	"stage" "growth_stage" DEFAULT 'empty' NOT NULL,
	"planted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "plots" ADD CONSTRAINT "plots_farm_id_farms_id_fk" FOREIGN KEY ("farm_id") REFERENCES "public"."farms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "plots_farm_position_idx" ON "plots" USING btree ("farm_id","position");