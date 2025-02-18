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
import { useToaster } from "~/context/ToastContext";
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
	const toaster = useToaster();

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

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const login = useCallback(async (email: string, password: string) => {
		const response = await auth.login(email, password);
		if (response.ok) {
			setTimeout(() => {
				router.push("/admin");
			}, 3000);
			toaster?.addToast("Logged. You will be redirected soon...", "success");
		}
		toaster?.addToast("Invalid credentials", "error");
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
