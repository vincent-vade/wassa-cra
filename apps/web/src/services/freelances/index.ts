import { type Freelance, client } from "~/lib/client";

export const getFreelances = async () => {
	const { data } = await client.GET("/api/rest/freelances");
	return data?.freelances as Freelance[];
};

export const getFreelanceById = async (id: string) => {
	const { data } = await client.GET("/api/rest/freelances/{id}", {
		params: {
			path: {
				id,
			},
		},
	});

	return data?.freelances_by_pk as Freelance;
};

export const deleteFreelanceById = async (id: string) => {
	const { data } = await client.DELETE("/api/rest/freelances/{id}", {
		params: {
			path: {
				id,
			},
		},
	});
	return data?.delete_freelances_by_pk as Freelance;
};
