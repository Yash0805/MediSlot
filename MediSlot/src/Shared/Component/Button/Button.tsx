interface ButtonProps {
  caption: string;
  type?: "button" | "reset" | "submit";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

export default function Button({
  caption,
  type = "submit",
  disabled,
  loading,
  onClick,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className="bg-sky-500 hover:bg-sky-600 text-white font-medium py-2 px-4 rounded-lg 
      transition disabled:opacity-50"
    >
      {loading ? "Processing..." : caption}
    </button>
  );
}