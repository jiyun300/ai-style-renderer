import { Loader2 } from "lucide-react";

interface Props {
  message?: string;
}

export default function LoadingSpinner({ message = "Processing..." }: Props) {
  return (
    <div className="flex flex-col items-center gap-3 py-8">
      <Loader2 size={32} className="animate-spin text-primary-500" />
      <p className="text-sm text-surface-500">{message}</p>
    </div>
  );
}
