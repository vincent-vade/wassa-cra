import { type Client, InsertClient, client } from "~/lib/client";

export const getClients = async () => {
	const { data } = await client.GET("/api/rest/clients");
	return data?.clients as Client[];
};

export const getClientById = async (id: string) => {
	const { data } = await client.GET("/api/rest/clients/{id}", {
		params: {
			path: {
				id,
			},
		},
	});

	return data?.clients_by_pk as Client;
};

export const deleteClientById = async (id: string) => {
	const { data } = await client.DELETE("/api/rest/clients/{id}", {
		params: {
			path: {
				id,
			},
		},
	});
	return data?.delete_clients_by_pk as Client;
};

export const createClient = async (body: Client) => {
	const { data } = await client.POST("/api/rest/clients", {
		body: {
			object: {
				...body,
			},
		},
	});
	return data?.insert_clients_one as Client;
};

export const updateClient = async (body: Client) => {
	const { data } = await client.POST("/api/rest/clients/{id}", {
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
	return data?.update_clients_by_pk as Client;
};
