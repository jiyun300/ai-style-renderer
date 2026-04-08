import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image as ImageIcon, Plus } from "lucide-react";
import clsx from "clsx";

interface SingleProps {
  multiple?: false;
  onImageSelect: (file: File) => void;
  label: string;
  currentImage?: File | null;
  onClear?: () => void;
}

interface MultiProps {
  multiple: true;
  onImagesSelect: (files: File[]) => void;
  label: string;
  currentImages?: File[];
  onClear?: () => void;
}

type Props = SingleProps | MultiProps;

export default function ImageDropzone(props: Props) {
  const { label, onClear } = props;
  const isMulti = props.multiple === true;
  const [previews, setPreviews] = useState<{ url: string; name: string }[]>([]);

  // Sync previews when external state is cleared
  useEffect(() => {
    if (isMulti) {
      const images = (props as MultiProps).currentImages ?? [];
      if (images.length === 0 && previews.length > 0) {
        previews.forEach((p) => URL.revokeObjectURL(p.url));
        setPreviews([]);
      }
    } else {
      const image = (props as SingleProps).currentImage;
      if (!image && previews.length > 0) {
        previews.forEach((p) => URL.revokeObjectURL(p.url));
        setPreviews([]);
      }
    }
  }, [isMulti, props, previews]);

  const onDrop = useCallback(
    (accepted: File[]) => {
      if (!accepted.length) return;
      if (isMulti) {
        const mp = props as MultiProps;
        const current = mp.currentImages ?? [];
        const merged = [...current, ...accepted];
        mp.onImagesSelect(merged);
        setPreviews((prev) => [
          ...prev,
          ...accepted.map((f) => ({ url: URL.createObjectURL(f), name: f.name })),
        ]);
      } else {
        const sp = props as SingleProps;
        const file = accepted[0];
        sp.onImageSelect(file);
        setPreviews((prev) => {
          prev.forEach((p) => URL.revokeObjectURL(p.url));
          return [{ url: URL.createObjectURL(file), name: file.name }];
        });
      }
    },
    [isMulti, props]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    multiple: isMulti,
    maxSize: 10 * 1024 * 1024,
  });

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    previews.forEach((p) => URL.revokeObjectURL(p.url));
    setPreviews([]);
    onClear?.();
  };

  const handleRemoveOne = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    URL.revokeObjectURL(previews[index].url);
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    if (isMulti) {
      const mp = props as MultiProps;
      const current = mp.currentImages ?? [];
      mp.onImagesSelect(current.filter((_, i) => i !== index));
    } else {
      onClear?.();
    }
  };

  const hasPreviews = previews.length > 0;

  return (
    <div
      {...getRootProps()}
      className={clsx(
        "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 transition-all cursor-pointer",
        hasPreviews ? "min-h-[100px]" : "min-h-[200px]",
        isDragActive
          ? "border-primary-500 bg-primary-50"
          : hasPreviews
            ? "border-surface-200 bg-white"
            : "border-surface-300 bg-white hover:border-primary-400 hover:bg-primary-50/30"
      )}
    >
      <input {...getInputProps()} />

      {hasPreviews ? (
        <>
          <div
            className={clsx(
              "w-full gap-3",
              previews.length === 1 ? "flex justify-center" : "grid grid-cols-3"
            )}
          >
            {previews.map((p, i) => (
              <div key={i} className="relative group">
                <img
                  src={p.url}
                  alt={p.name}
                  className="w-full h-[120px] rounded-xl object-cover"
                />
                <button
                  onClick={(e) => handleRemoveOne(e, i)}
                  className="absolute top-1.5 right-1.5 rounded-full bg-surface-800/70 p-1 text-white opacity-0 group-hover:opacity-100 hover:bg-surface-800 transition-all"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            {isMulti && (
              <div className="flex items-center justify-center h-[120px] rounded-xl border-2 border-dashed border-surface-200 hover:border-primary-400 transition-colors">
                <Plus size={24} className="text-surface-300" />
              </div>
            )}
          </div>
          {!isMulti && (
            <p className="mt-3 text-xs text-surface-400">Click or drag to replace</p>
          )}
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
            {isDragActive ? (
              <ImageIcon size={28} className="text-primary-500" />
            ) : (
              <Upload size={28} className="text-surface-400" />
            )}
          </div>
          <p className="text-sm font-medium text-surface-700">{label}</p>
          <p className="mt-1 text-xs text-surface-400">
            {isDragActive
              ? "Drop here"
              : isMulti
                ? "Drag & drop or click (multiple OK)"
                : "Drag & drop or click to browse"}
          </p>
        </>
      )}
    </div>
  );
}
