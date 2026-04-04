import { useState } from "react";
import { Sparkles } from "lucide-react";
import ImageDropzone from "../shared/ImageDropzone";
import CopyButton from "../shared/CopyButton";
import LoadingSpinner from "../shared/LoadingSpinner";
import { analyzeStyle } from "../../services/api";
import type { AnalysisResult } from "../../types";

export default function StyleAnalyzer() {
  const [image, setImage] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeStyle(image);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-surface-800">Style Analyzer</h2>
        <p className="mt-1 text-sm text-surface-500">
          Upload an image to extract its rendering style as a prompt
        </p>
      </div>

      <ImageDropzone
        label="Upload image to analyze"
        onImageSelect={setImage}
        currentImage={image}
        onClear={() => {
          setImage(null);
          setResult(null);
        }}
      />

      <button
        onClick={handleAnalyze}
        disabled={!image || loading}
        className="w-full rounded-xl bg-primary-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-600 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span className="inline-flex items-center gap-2">
          <Sparkles size={16} />
          Analyze Style
        </span>
      </button>

      {loading && <LoadingSpinner message="Analyzing rendering style..." />}

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {result && !loading && (
        <div className="space-y-4 rounded-2xl border border-surface-200 bg-white p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-sm font-semibold text-surface-700">
              Extracted Style Prompt
            </h3>
            <CopyButton text={result.stylePrompt} />
          </div>
          <p className="rounded-xl bg-surface-50 p-4 text-sm leading-relaxed text-surface-700 text-left">
            {result.stylePrompt}
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {Object.entries(result.breakdown).map(([key, value]) => (
              <div key={key} className="rounded-xl bg-surface-50 p-3">
                <p className="text-xs font-medium text-surface-400 capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </p>
                <p className="mt-0.5 text-sm text-surface-700">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
