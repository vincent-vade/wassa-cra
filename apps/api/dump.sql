CREATE TABLE "projects" (
  "id" uuid PRIMARY KEY NOT NULL DEFAULT (uuid_generate_v4()),
  "name" varchar(255) UNIQUE NOT NULL,
  "description" text,
  "is_active" bool NOT NULL DEFAULT false,
  "type" varchar(255) NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp,
  "organization_id" varchar NOT NULL
);

COMMENT ON COLUMN "projects"."id" IS 'id of a project';
