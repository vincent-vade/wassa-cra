import {client, type Client, type Freelance} from "~/lib/client";

export const getFreelances = async () => {
  const {data} = await client.GET("/api/rest/freelances");
  return data?.freelances as Freelance[];
};

export const getFreelanceById = async (id: string) => {
  const {data} = await client.GET("/api/rest/freelances/{id}", {
    params: {
      path: {
        id,
      },
    },
  });

  return data?.freelances_by_pk as Freelance;
};

export const deleteFreelanceById = async (id: string) => {
  const {data} = await client.DELETE("/api/rest/freelances/{id}", {
    params: {
      path: {
        id,
      },
    },
  });
  return data?.delete_freelances_by_pk as Freelance;
};

export const createFreelance = async (body: Freelance) => {
  return client.POST("/api/rest/freelances", {
    body: {
      object: {
        ...body,
        password: ""
      },
    },
  });
};

export const updateFreelance = async (body: Client) => {
  const {data} = await client.POST("/api/rest/freelances/{id}", {
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
  return data?.update_freelances_by_pk as Freelance;
};

