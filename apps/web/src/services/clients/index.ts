import { Client, client } from "~/lib/client";

export const getClients = async () => {
    const { data } = await client.GET("/api/rest/clients");
    return data?.clients as Client[];
};

export const getFreelanceById = async (id: string) => {
    const { data } = await client.GET(`/api/rest/clients/${id}`);
    return data?.client as Client;
};