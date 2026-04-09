import { useState } from "react";
import { Wand2, Download } from "lucide-react";
import ImageDropzone from "../shared/ImageDropzone";
import ToggleSwitch from "../shared/ToggleSwitch";
import CopyButton from "../shared/CopyButton";
import LoadingSpinner from "../shared/LoadingSpinner";
import { generateStyledImage } from "../../services/api";
import type { AnalysisResult, GenerationResult } from "../../types";

interface Props {
  analysisResult: AnalysisResult | null;
}

export default function StyleGenerator({ analysisResult }: Props) {
  const [originalImages, setOriginalImages] = useState<File[]>([]);
  const [fixMode, setFixMode] = useState(true);
  const [strength, setStrength] = useState(0.65);
  const [results, setResults] = useState<GenerationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (originalImages.length === 0 || !analysisResult) return;
    setLoading(true);
    setError(null);
    setResults([]);
    setProgress({ current: 0, total: originalImages.length });

    const newResults: GenerationResult[] = [];

    for (let i = 0; i < originalImages.length; i++) {
      setProgress({ current: i + 1, total: originalImages.length });
      try {
        const data = await generateStyledImage(
          originalImages[i],
          analysisResult.stylePrompt,
          fixMode,
          fixMode ? undefined : strength,
          analysisResult.provider
        );
        newResults.push(data);
        setResults([...newResults]);
      } catch (err) {
        setError(
          `Image ${i + 1} failed: ${err instanceof Error ? err.message : "Generation failed"}`
        );
      }
    }

    setLoading(false);
  };

  const handleDownloadAll = () => {
    results.forEach((r, i) => {
      const a = document.createElement("a");
      a.href = r.imageUrl;
      a.download = `styled-${i + 1}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-surface-800">
          Style Unifier
        </h2>
        <p className="mt-1 text-sm text-surface-500">
          Apply a reference style to multiple images at once
        </p>
      </div>

      {analysisResult ? (
        <div className="rounded-2xl border border-primary-200 bg-primary-50 p-4 space-y-2">
          <p className="text-xs font-medium text-primary-600">Style Prompt from Analyzer</p>
          <p className="text-sm text-primary-800 leading-relaxed">{analysisResult.stylePrompt}</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-surface-200 bg-surface-50 p-4 text-center">
          <p className="text-sm text-surface-500">
            Go to Style Analyzer first to extract a style prompt
          </p>
        </div>
      )}

      <div>
        <p className="mb-2 text-xs font-medium text-surface-500">
          Images to transform ({originalImages.length})
        </p>
        <ImageDropzone
          multiple
          label="Upload images to transform"
          onImagesSelect={setOriginalImages}
          currentImages={originalImages}
          onClear={() => setOriginalImages([])}
        />
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
        disabled={originalImages.length === 0 || !analysisResult || loading}
        className="w-full rounded-xl bg-primary-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-600 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span className="inline-flex items-center gap-2">
          <Wand2 size={16} />
          Generate{originalImages.length > 1 ? ` (${originalImages.length} images)` : ""}
        </span>
      </button>

      {loading && (
        <LoadingSpinner
          message={`Processing image ${progress.current} of ${progress.total}... This may take 15-30 seconds per image`}
        />
      )}

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-surface-700">
              Results ({results.length})
            </h3>
            {results.length > 1 && (
              <button
                onClick={handleDownloadAll}
                className="inline-flex items-center gap-1.5 rounded-lg border border-primary-200 bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-600 transition-all hover:bg-primary-100 active:scale-[0.98]"
              >
                <Download size={14} />
                Download all
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {results.map((r, i) => (
              <div
                key={i}
                className="rounded-2xl border border-surface-200 bg-white p-4 space-y-3"
              >
                <img
                  src={r.imageUrl}
                  alt={`Generated ${i + 1}`}
                  className="w-full rounded-xl"
                />
                <a
                  href={r.imageUrl}
                  download={`styled-${i + 1}.png`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-primary-500 hover:text-primary-600"
                >
                  <Download size={14} />
                  Download
                </a>
              </div>
            ))}
          </div>

          {results[0] && (
            <div className="rounded-2xl border border-surface-200 bg-white p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-medium text-surface-400">
                  Style prompt used
                </p>
                <CopyButton text={results[0].stylePromptUsed} />
              </div>
              <p className="rounded-xl bg-surface-50 p-3 text-xs leading-relaxed text-surface-600 text-left">
                {results[0].stylePromptUsed}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
