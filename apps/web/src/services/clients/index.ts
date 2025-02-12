import { type Client, client } from "~/lib/client";

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
