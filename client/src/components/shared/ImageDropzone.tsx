import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import clsx from "clsx";

interface Props {
  onImageSelect: (file: File) => void;
  label: string;
  currentImage?: File | null;
  onClear?: () => void;
}

export default function ImageDropzone({ onImageSelect, label, currentImage, onClear }: Props) {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(
    (accepted: File[]) => {
      const file = accepted[0];
      if (!file) return;
      onImageSelect(file);
      const url = URL.createObjectURL(file);
      setPreview(url);
    },
    [onImageSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onClear?.();
  };

  return (
    <div
      {...getRootProps()}
      className={clsx(
        "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 transition-all cursor-pointer min-h-[200px]",
        isDragActive
          ? "border-primary-500 bg-primary-50"
          : preview
            ? "border-surface-200 bg-white"
            : "border-surface-300 bg-white hover:border-primary-400 hover:bg-primary-50/30"
      )}
    >
      <input {...getInputProps()} />

      {preview ? (
        <>
          <img
            src={preview}
            alt="Preview"
            className="max-h-[180px] rounded-xl object-contain"
          />
          <p className="mt-2 text-sm text-surface-500 truncate max-w-full">
            {currentImage?.name}
          </p>
          <button
            onClick={handleClear}
            className="absolute top-3 right-3 rounded-full bg-surface-800/70 p-1.5 text-white hover:bg-surface-800 transition-colors"
          >
            <X size={14} />
          </button>
        </>
      ) : (
        <>
          <div className="mb-3 rounded-xl bg-surface-100 p-3">
            {isDragActive ? <ImageIcon size={28} className="text-primary-500" /> : <Upload size={28} className="text-surface-400" />}
          </div>
          <p className="text-sm font-medium text-surface-700">{label}</p>
          <p className="mt-1 text-xs text-surface-400">
            {isDragActive ? "Drop here" : "Drag & drop or click to browse"}
          </p>
        </>
      )}
    </div>
  );
}
