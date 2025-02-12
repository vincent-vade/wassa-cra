import argon2 from "argon2";
import { setCookie } from "cookies-next/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { client } from "~/lib/client";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const { data } = await client.GET("/api/rest/freelance-by-email", {
		params: {
			query: {
				email: req.body.email,
			},
		},
	});

	const user = data?.freelances?.[0];
	if (user?.password) {
		const verifyPassword = await argon2.verify(
			user?.password,
			req.body.password,
		);

		if (verifyPassword) {
			await setCookie("token", user?.id, { res, req });
			res.status(200).json({ ok: true });
		}
	}

	res.status(401).json({ ok: false });
}
