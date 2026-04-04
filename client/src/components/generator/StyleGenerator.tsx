import { useState } from "react";
import { Wand2 } from "lucide-react";
import ImageDropzone from "../shared/ImageDropzone";
import ToggleSwitch from "../shared/ToggleSwitch";
import CopyButton from "../shared/CopyButton";
import LoadingSpinner from "../shared/LoadingSpinner";
import { generateStyledImage } from "../../services/api";
import type { GenerationResult } from "../../types";

export default function StyleGenerator() {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [styleImage, setStyleImage] = useState<File | null>(null);
  const [fixMode, setFixMode] = useState(true);
  const [strength, setStrength] = useState(0.65);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!originalImage || !styleImage) return;
    setLoading(true);
    setError(null);
    try {
      const data = await generateStyledImage(
        originalImage,
        styleImage,
        fixMode,
        fixMode ? undefined : strength
      );
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-surface-800">
          Style Unifier
        </h2>
        <p className="mt-1 text-sm text-surface-500">
          Apply a reference style to your original image
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-medium text-surface-500">Original Image</p>
          <ImageDropzone
            label="Upload original"
            onImageSelect={setOriginalImage}
            currentImage={originalImage}
            onClear={() => setOriginalImage(null)}
          />
        </div>
        <div>
          <p className="mb-2 text-xs font-medium text-surface-500">Style Reference</p>
          <ImageDropzone
            label="Upload style reference"
            onImageSelect={setStyleImage}
            currentImage={styleImage}
            onClear={() => setStyleImage(null)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-surface-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <ToggleSwitch enabled={fixMode} onToggle={setFixMode} />

        {!fixMode && (
          <div className="flex items-center gap-3">
            <label className="text-xs font-medium text-surface-500">
              Strength
            </label>
            <input
              type="range"
              min={0.3}
              max={0.9}
              step={0.05}
              value={strength}
              onChange={(e) => setStrength(Number(e.target.value))}
              className="h-1.5 w-32 appearance-none rounded-full bg-surface-200 accent-primary-500"
            />
            <span className="text-xs font-mono text-surface-600 w-8">
              {strength.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      <button
        onClick={handleGenerate}
        disabled={!originalImage || !styleImage || loading}
        className="w-full rounded-xl bg-primary-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-600 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span className="inline-flex items-center gap-2">
          <Wand2 size={16} />
          Generate
        </span>
      </button>

      {loading && (
        <LoadingSpinner message="Analyzing style & generating image... This may take 15-30 seconds" />
      )}

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {result && !loading && (
        <div className="space-y-4 rounded-2xl border border-surface-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-surface-700">Result</h3>
          <img
            src={result.imageUrl}
            alt="Generated"
            className="w-full rounded-xl"
          />

          <div className="flex items-start justify-between gap-3">
            <p className="text-xs font-medium text-surface-400">
              Style prompt used
            </p>
            <CopyButton text={result.stylePromptUsed} />
          </div>
          <p className="rounded-xl bg-surface-50 p-3 text-xs leading-relaxed text-surface-600 text-left">
            {result.stylePromptUsed}
          </p>
        </div>
      )}
    </div>
  );
}
