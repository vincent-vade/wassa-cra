CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "projects" (
                            "id" uuid PRIMARY KEY NOT NULL DEFAULT (uuid_generate_v4()),
                            "created_at" timestamp NOT NULL DEFAULT (now()),
                            "updated_at" timestamp,
                            "name" varchar(255) UNIQUE NOT NULL,
                            "description" text,
                            "is_active" bool NOT NULL DEFAULT false,
                            "start_date" timestamp,
                            "end_date" timestamp
);

CREATE TABLE "clients" (
                           "id" uuid PRIMARY KEY NOT NULL DEFAULT (uuid_generate_v4()),
                           "created_at" timestamp NOT NULL DEFAULT (now()),
                           "updated_at" timestamp,
                           "name" varchar(255) UNIQUE NOT NULL,
                           "email" varchar(255) NOT NULL,
                           "phone" varchar(20) NOT NULL
);

CREATE TABLE "freelances" (
                              "id" uuid PRIMARY KEY NOT NULL DEFAULT (uuid_generate_v4()),
                              "created_at" timestamp NOT NULL DEFAULT (now()),
                              "updated_at" timestamp,
                              "daily_rate" decimal(10,2) NOT NULL,
                              "email" varchar
);

CREATE TABLE "timesheets" (
                              "id" uuid PRIMARY KEY NOT NULL DEFAULT (uuid_generate_v4()),
                              "created_at" timestamp NOT NULL DEFAULT (now()),
                              "updated_at" timestamp,
                              "client_id" uuid NOT NULL,
                              "project_task_id" uuid NOT NULL,
                              "freelance_id" uuid NOT NULL
);

CREATE TABLE "projects_tasks" (
                                  "id" uuid PRIMARY KEY NOT NULL DEFAULT (uuid_generate_v4()),
                                  "created_at" timestamp NOT NULL DEFAULT (now()),
                                  "updated_at" timestamp,
                                  "task_description" text,
                                  "date" timestamp,
                                  "hours_worked" decimal(10,2) NOT NULL,
                                  "project_id" uuid NOT NULL
);

COMMENT ON COLUMN "projects"."id" IS 'id of a project';

COMMENT ON COLUMN "clients"."id" IS 'id of a project';

COMMENT ON COLUMN "freelances"."id" IS 'id of a project';

COMMENT ON COLUMN "timesheets"."id" IS 'id of a project';

COMMENT ON COLUMN "projects_tasks"."id" IS 'id of a project';

ALTER TABLE "projects_tasks" ADD FOREIGN KEY ("project_id") REFERENCES "projects" ("id");

ALTER TABLE "timesheets" ADD FOREIGN KEY ("client_id") REFERENCES "clients" ("id");

ALTER TABLE "timesheets" ADD FOREIGN KEY ("project_task_id") REFERENCES "projects_tasks" ("id");

ALTER TABLE "timesheets" ADD FOREIGN KEY ("freelance_id") REFERENCES "freelances" ("id");
