import { Lock, Unlock } from "lucide-react";
import clsx from "clsx";

interface Props {
  enabled: boolean;
  onToggle: (value: boolean) => void;
}

export default function ToggleSwitch({ enabled, onToggle }: Props) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onToggle(!enabled)}
        className={clsx(
          "relative inline-flex h-7 w-12 items-center rounded-full transition-colors",
          enabled ? "bg-primary-500" : "bg-surface-300"
        )}
      >
        <span
          className={clsx(
            "inline-flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm transition-transform",
            enabled ? "translate-x-6" : "translate-x-1"
          )}
        >
          {enabled ? (
            <Lock size={10} className="text-primary-600" />
          ) : (
            <Unlock size={10} className="text-surface-400" />
          )}
        </span>
      </button>
      <div>
        <span
          className={clsx(
            "text-sm font-semibold",
            enabled ? "text-primary-600" : "text-surface-500"
          )}
        >
          FIX {enabled ? "ON" : "OFF"}
        </span>
        <p className="text-xs text-surface-400">
          {enabled
            ? "Lock composition, change style only"
            : "Free creative generation"}
        </p>
      </div>
    </div>
  );
}
