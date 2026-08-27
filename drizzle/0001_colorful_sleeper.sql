CREATE TABLE "engine_auth_state" (
	"id" text PRIMARY KEY DEFAULT 'global' NOT NULL,
	"last_totp_time_step" integer DEFAULT -1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "login_challenges" DROP COLUMN "twilio_sid";