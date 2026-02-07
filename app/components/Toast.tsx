type ToastType = "success" | "error";

type ToastProps = {
  type: ToastType;
  message: string;
  onClose: () => void;
};

export function Toast({ type, message, onClose }: ToastProps) {
  const tone =
    type === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
      : "border-red-200 bg-red-50 text-red-900";

  return (
    <div
      className={`pointer-events-auto flex items-start justify-between gap-4 rounded-md border px-4 py-3 text-sm shadow-lg ${tone}`}
      role="status"
    >
      <span>{message}</span>
      <button
        type="button"
        onClick={onClose}
        className="rounded-md p-1 text-current/70 hover:bg-white/70"
        aria-label="Close toast"
      >
        <svg
          viewBox="0 0 24 24"
          width="12"
          height="12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 6l12 12M18 6l-12 12" />
        </svg>
      </button>
    </div>
  );
}
