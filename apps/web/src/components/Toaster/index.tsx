import { useToaster } from "~/context/ToastContext";
import "./toaster.css";

const Toaster = () => {
	const { toasts, removeToast } = useToaster();

	if (!toasts) return null;

	return (
		<div className="flex flex-col fixed w-full bottom-0 items-center z-30">
			{toasts.map((toast) => (
				<div key={toast.id} className={`toast ${toast.type}`}>
					<span>{toast.message}</span>
					<button type="button" onClick={() => removeToast(toast.id)}>
						&nbsp;×&nbsp;
					</button>
				</div>
			))}
		</div>
	);
};

export default Toaster;
