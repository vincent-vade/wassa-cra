import { getCookie } from "cookies-next";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;
	const res = NextResponse.next();

	const token = await getCookie("token", { req, res });
	if (!token) {
		return NextResponse.redirect(new URL("/login", req.url));
	}

	if (pathname === "/") {
		return NextResponse.redirect(new URL("/admin", req.url));
	}

	return res;
}

export const config = {
	matcher: ["/", "/admin/:path*"],
};
