import {
	type PropsWithChildren,
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
	id: number;
	message: string;
	type: ToastType;
}

type ToasterContext = {
	toasts: Toast[];
	addToast: (message: string, type: ToastType) => void;
	removeToast: (index: number) => void;
};

const ToasterContext = createContext<ToasterContext | null>(null);

let toastId = 0;

const ToasterProvider = ({ children }: PropsWithChildren) => {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const addToast = useCallback((message: string, type: ToastType) => {
		const id = toastId++;
		setToasts((prevToasts) => [...prevToasts, { id, message, type }]);
		setTimeout(() => removeToast(id), id + 3000); // Remove toast after 3 seconds
	}, []);

	const removeToast = useCallback((toastId: number) => {
		setToasts((prevToasts) =>
			prevToasts.filter((toast) => toast.id !== toastId),
		);
	}, []);

	const value = useMemo(
		() => ({
			toasts,
			addToast,
			removeToast,
		}),
		[addToast, removeToast, toasts],
	);

	return <ToasterContext value={value}>{children}</ToasterContext>;
};

export const useToaster = () => {
	if (!ToasterContext) {
		throw new Error("useToaster must be used within a ToasterProvider");
	}
	return useContext(ToasterContext) as ToasterContext;
};

export { ToasterProvider, type ToasterContext };
