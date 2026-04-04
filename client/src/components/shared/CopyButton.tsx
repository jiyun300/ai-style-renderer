import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface Props {
  text: string;
}

export default function CopyButton({ text }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 rounded-lg bg-surface-100 px-3 py-1.5 text-xs font-medium text-surface-600 transition-all hover:bg-surface-200 active:scale-95"
    >
      {copied ? (
        <>
          <Check size={14} className="text-green-500" />
          Copied
        </>
      ) : (
        <>
          <Copy size={14} />
          Copy
        </>
      )}
    </button>
  );
}
