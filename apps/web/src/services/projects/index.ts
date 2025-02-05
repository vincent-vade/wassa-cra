import { client, Project } from "~/lib/client";

export const getProjects = async () => {
    const { data } = await client.GET("/api/rest/projects");
    return data?.projects as Project[];
};

export const getProjectById = async (id: string) => {
    const { data } = await client.GET(`/api/rest/projects/${id}`);
    return data?.project as Project;
};