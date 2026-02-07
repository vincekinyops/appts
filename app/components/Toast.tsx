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
        className="rounded-md border border-transparent px-2 py-1 text-xs font-semibold hover:border-current"
      >
        Close
      </button>
    </div>
  );
}
