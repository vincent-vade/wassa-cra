/* @name FindAllProjects */
SELECT * FROM "projects";

/* @name FindProjectById */
SELECT * FROM "projects" WHERE "id" = :projectId;

/* @name FindProjectByName */
SELECT * FROM "projects" WHERE "name" = :projectName;

/*
  @name CreateProject
  @param project -> (name, description, is_active, type, organization_id)
*/
INSERT INTO "projects" ("name", "description", "is_active", "type", "organization_id") VALUES :project RETURNING id;


/*
    @name UpdateProject
*/
UPDATE "projects" SET "name" = :name, "description" = :description, "is_active" = :is_active, "type" = :type, "organization_id" = :organization_id WHERE "id" = :projectId RETURNING *;
/* @name DeleteProject */
DELETE FROM "projects" WHERE "id" = :projectId RETURNING *;