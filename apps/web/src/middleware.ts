import { getCookie } from "cookies-next";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
	const res = NextResponse.next();

	const token = await getCookie("token", { req, res });
	if (!token) {
		return NextResponse.redirect(new URL("/login", req.url));
	}

	return res;
}

export const config = {
	matcher: ["/dashboard/:path*"],
};
