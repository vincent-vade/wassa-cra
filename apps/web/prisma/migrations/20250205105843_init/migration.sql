CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "clients" (
                           "id" UUID NOT NULL DEFAULT (uuid_generate_v4()),
                           "created_at" TIMESTAMP(6) NOT NULL DEFAULT (CURRENT_TIMESTAMP),
                           "updated_at" TIMESTAMP(6),
                           "name" VARCHAR(255) NOT NULL,
                           "email" VARCHAR(255) NOT NULL,
                           "phone" VARCHAR(20) NOT NULL,
                           PRIMARY KEY ("id")
);

CREATE TABLE "freelances" (
                              "id" UUID NOT NULL DEFAULT (uuid_generate_v4()),
                              "created_at" TIMESTAMP(6) NOT NULL DEFAULT (CURRENT_TIMESTAMP),
                              "updated_at" TIMESTAMP(6),
                              "daily_rate" DECIMAL(10,2) NOT NULL,
                              "email" VARCHAR,
                              PRIMARY KEY ("id")
);

CREATE TABLE "projects" (
                            "id" UUID NOT NULL DEFAULT (uuid_generate_v4()),
                            "created_at" TIMESTAMP(6) NOT NULL DEFAULT (CURRENT_TIMESTAMP),
                            "updated_at" TIMESTAMP(6),
                            "name" VARCHAR(255) NOT NULL,
                            "description" TEXT,
                            "is_active" BOOLEAN NOT NULL DEFAULT false,
                            "start_date" TIMESTAMP(6),
                            "end_date" TIMESTAMP(6),
                            PRIMARY KEY ("id")
);

CREATE TABLE "projects_tasks" (
                                  "id" UUID NOT NULL DEFAULT (uuid_generate_v4()),
                                  "created_at" TIMESTAMP(6) NOT NULL DEFAULT (CURRENT_TIMESTAMP),
                                  "updated_at" TIMESTAMP(6),
                                  "task_description" TEXT,
                                  "date" TIMESTAMP(6),
                                  "project_id" UUID NOT NULL,
                                  PRIMARY KEY ("id")
);

CREATE TABLE "timesheets" (
                              "id" UUID NOT NULL DEFAULT (uuid_generate_v4()),
                              "created_at" TIMESTAMP(6) NOT NULL DEFAULT (CURRENT_TIMESTAMP),
                              "updated_at" TIMESTAMP(6),
                              "client_id" UUID NOT NULL,
                              "project_task_id" UUID NOT NULL,
                              "freelance_id" UUID NOT NULL,
                              "working_date" TEXT NOT NULL,
                              "working_durations" JSONB DEFAULT (jsonb_build_array()),
                              PRIMARY KEY ("id")
);

ALTER TABLE "projects_tasks" ADD CONSTRAINT "projects_tasks_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "timesheets" ADD CONSTRAINT "timesheets_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "timesheets" ADD CONSTRAINT "timesheets_freelance_id_fkey" FOREIGN KEY ("freelance_id") REFERENCES "freelances" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "timesheets" ADD CONSTRAINT "timesheets_project_task_id_fkey" FOREIGN KEY ("project_task_id") REFERENCES "projects_tasks" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
