import { deleteCookie, hasCookie, useGetCookies } from "cookies-next/client";
import { useRouter } from "next/router";
import {
	type PropsWithChildren,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import type { Freelance } from "~/lib/client";
import { auth } from "~/services/auth";
import { getFreelanceById } from "~/services/freelances";

type AuthContext = {
	user: Freelance | null;
	login: (email: string, password: string) => void;
	logout: () => void;
};

const AuthContext = createContext<AuthContext>({
	user: null,
	login: () => {},
	logout: () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
	const [user, setUser] = useState<Freelance | null>(null);

	const router = useRouter();
	const getCookies = useGetCookies();

	useEffect(() => {
		const cookies = getCookies();

		if (cookies?.token) {
			getFreelanceById(cookies?.token).then((freelance) => {
				if (freelance?.id) {
					setUser(freelance);
				}
			});
		}
	}, [getCookies]);

	const logout = useCallback(() => {
		if (hasCookie("token")) {
			deleteCookie("token");
		}
		setUser(null);
		router.push("/login");
	}, [router]);

	const login = useCallback(
		async (email: string, password: string) => {
			const response = await auth.login(email, password);
			if (response.ok) {
				setTimeout(() => {
					router.push("/dashboard");
				}, 3000);
				// 	toaster("Logged. You will be redirected soon...", "success");
			}
			// 	toaster("Invalid credentials", "error");
		},
		[router],
	);

	return <AuthContext value={{ user, logout, login }}>{children}</AuthContext>;
};

export const useAuth = () => {
	if (!AuthContext) {
		throw new Error("useAuth must be used within a AuthProvider");
	}

	return useContext(AuthContext);
};
