/** Types generated for queries found in "src/infra/data/postgres/queries/projects.sql" */
// @ts-ignore
import { PreparedQuery } from '@pgtyped/runtime';

/** 'FindAllProjects' parameters type */
export type IFindAllProjectsParams = void;

/** 'FindAllProjects' return type */
export interface IFindAllProjectsResult {
  created_at: Date;
  description: string | null;
  /** id of a project */
  id: string;
  is_active: boolean;
  name: string;
  organization_id: string;
  type: string;
  updated_at: Date | null;
}

/** 'FindAllProjects' query type */
export interface IFindAllProjectsQuery {
  params: IFindAllProjectsParams;
  result: IFindAllProjectsResult;
}

const findAllProjectsIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT * FROM \"projects\""};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM "projects"
 * ```
 */
export const findAllProjects = new PreparedQuery<IFindAllProjectsParams,IFindAllProjectsResult>(findAllProjectsIR);


/** 'FindProjectById' parameters type */
export interface IFindProjectByIdParams {
  projectId?: string | null | void;
}

/** 'FindProjectById' return type */
export interface IFindProjectByIdResult {
  created_at: Date;
  description: string | null;
  /** id of a project */
  id: string;
  is_active: boolean;
  name: string;
  organization_id: string;
  type: string;
  updated_at: Date | null;
}

/** 'FindProjectById' query type */
export interface IFindProjectByIdQuery {
  params: IFindProjectByIdParams;
  result: IFindProjectByIdResult;
}

const findProjectByIdIR: any = {"usedParamSet":{"projectId":true},"params":[{"name":"projectId","required":false,"transform":{"type":"scalar"},"locs":[{"a":38,"b":47}]}],"statement":"SELECT * FROM \"projects\" WHERE \"id\" = :projectId"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM "projects" WHERE "id" = :projectId
 * ```
 */
export const findProjectById = new PreparedQuery<IFindProjectByIdParams,IFindProjectByIdResult>(findProjectByIdIR);


/** 'FindProjectByName' parameters type */
export interface IFindProjectByNameParams {
  projectName?: string | null | void;
}

/** 'FindProjectByName' return type */
export interface IFindProjectByNameResult {
  created_at: Date;
  description: string | null;
  /** id of a project */
  id: string;
  is_active: boolean;
  name: string;
  organization_id: string;
  type: string;
  updated_at: Date | null;
}

/** 'FindProjectByName' query type */
export interface IFindProjectByNameQuery {
  params: IFindProjectByNameParams;
  result: IFindProjectByNameResult;
}

const findProjectByNameIR: any = {"usedParamSet":{"projectName":true},"params":[{"name":"projectName","required":false,"transform":{"type":"scalar"},"locs":[{"a":40,"b":51}]}],"statement":"SELECT * FROM \"projects\" WHERE \"name\" = :projectName"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM "projects" WHERE "name" = :projectName
 * ```
 */
export const findProjectByName = new PreparedQuery<IFindProjectByNameParams,IFindProjectByNameResult>(findProjectByNameIR);


/** 'CreateProject' parameters type */
export interface ICreateProjectParams {
  project: {
    name: string | null | void,
    description: string | null | void,
    is_active: boolean | null | void,
    type: string | null | void,
    organization_id: string | null | void
  };
}

/** 'CreateProject' return type */
export interface ICreateProjectResult {
  /** id of a project */
  id: string;
}

/** 'CreateProject' query type */
export interface ICreateProjectQuery {
  params: ICreateProjectParams;
  result: ICreateProjectResult;
}

const createProjectIR: any = {"usedParamSet":{"project":true},"params":[{"name":"project","required":false,"transform":{"type":"pick_tuple","keys":[{"name":"name","required":false},{"name":"description","required":false},{"name":"is_active","required":false},{"name":"type","required":false},{"name":"organization_id","required":false}]},"locs":[{"a":94,"b":101}]}],"statement":"INSERT INTO \"projects\" (\"name\", \"description\", \"is_active\", \"type\", \"organization_id\") VALUES :project RETURNING id"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO "projects" ("name", "description", "is_active", "type", "organization_id") VALUES :project RETURNING id
 * ```
 */
export const createProject = new PreparedQuery<ICreateProjectParams,ICreateProjectResult>(createProjectIR);


/** 'DeleteProject' parameters type */
export interface IDeleteProjectParams {
  projectId?: string | null | void;
}

/** 'DeleteProject' return type */
export interface IDeleteProjectResult {
  created_at: Date;
  description: string | null;
  /** id of a project */
  id: string;
  is_active: boolean;
  name: string;
  organization_id: string;
  type: string;
  updated_at: Date | null;
}

/** 'DeleteProject' query type */
export interface IDeleteProjectQuery {
  params: IDeleteProjectParams;
  result: IDeleteProjectResult;
}

const deleteProjectIR: any = {"usedParamSet":{"projectId":true},"params":[{"name":"projectId","required":false,"transform":{"type":"scalar"},"locs":[{"a":36,"b":45}]}],"statement":"DELETE FROM \"projects\" WHERE \"id\" = :projectId RETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM "projects" WHERE "id" = :projectId RETURNING *
 * ```
 */
export const deleteProject = new PreparedQuery<IDeleteProjectParams,IDeleteProjectResult>(deleteProjectIR);


