import {client, type Project} from "~/lib/client";

export const getProjects = async () => {
  const {data} = await client.GET("/api/rest/projects");
  return data?.projects as Project[];
};

export const getProjectById = async (id: string) => {
  const {data} = await client.GET("/api/rest/projects/{id}", {
    params: {
      path: {
        id,
      },
    },
  });

  return data?.projects_by_pk as Project;
};

export const deleteProjectById = async (id: string) => {
  const {data} = await client.DELETE("/api/rest/projects/{id}", {
    params: {
      path: {
        id,
      },
    },
  });

  return data?.delete_projects_by_pk as Project;
};

export const createProject = async (body: Project) => {
  const {data} = await client.POST("/api/rest/projects", {
    body: {
      object: {
        ...body,
      },
    },
  });
  return data?.insert_projects_one as Project;
};

export const updateProject = async (body: Project) => {
  const {data} = await client.POST("/api/rest/projects/{id}", {
    body: {
      object: {
        ...body,
      },
    },
    params: {
      path: {
        id: body?.id as string,
      },
    },
  });
  return data?.update_projects_by_pk as Project;
};