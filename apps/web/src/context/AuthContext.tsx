import { notifications } from "@mantine/notifications";
import { deleteCookie, hasCookie, useGetCookies } from "cookies-next/client";
import { useRouter } from "next/router";
import {
	type PropsWithChildren,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
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

const AuthContext = createContext<AuthContext | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
	const [user, setUser] = useState<Freelance | null>(null);

	const router = useRouter();
	const getCookies = useGetCookies();
	const cookies = getCookies();

	useEffect(() => {
		if (cookies?.token) {
			getFreelanceById(cookies?.token).then((freelance) => {
				if (freelance?.id) {
					setUser(freelance);
				}
			});
		}
	}, [cookies?.token]);

	const logout = useCallback(() => {
		if (hasCookie("token")) {
			deleteCookie("token");
		}
		setUser(null);
		router.push("/login");
	}, [router]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const login = useCallback(async (email: string, password: string) => {
		const response = await auth.login(email, password);
		if (response.ok) {
			notifications.show({
				title: "Success",
				message: "Logged. You will be redirected soon...",
				color: "green",
				position: "top-right",
				autoClose: 5000,
			});

			setTimeout(() => {
				router.push("/admin");
			}, 3000);
		} else {
			notifications.show({
				title: "Error",
				message: "Invalid credentials",
				color: "red",
				position: "top-right",
				autoClose: 5000,
			});
		}
	}, []);

	const value = useMemo(() => ({ user, logout, login }), [login, logout, user]);

	return <AuthContext value={value}>{children}</AuthContext>;
};

export const useAuth = () => {
	if (!AuthContext) {
		throw new Error("useAuth must be used within a AuthProvider");
	}

	return useContext(AuthContext);
};
