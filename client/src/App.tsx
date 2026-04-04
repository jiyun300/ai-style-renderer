import { useState } from "react";
import { Palette, Layers } from "lucide-react";
import StyleAnalyzer from "./components/analyzer/StyleAnalyzer";
import StyleGenerator from "./components/generator/StyleGenerator";
import clsx from "clsx";

type Tab = "analyzer" | "generator";

function App() {
  const [tab, setTab] = useState<Tab>("analyzer");

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <header className="border-b border-surface-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-2xl px-4 py-4">
          <h1 className="text-lg font-bold text-surface-900 tracking-tight">
            Style Renderer
          </h1>
          <p className="text-xs text-surface-400 mt-0.5">
            Extract & unify rendering styles with AI
          </p>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="mx-auto max-w-2xl px-4 pt-6">
        <div className="inline-flex w-full rounded-xl bg-surface-100 p-1">
          <button
            onClick={() => setTab("analyzer")}
            className={clsx(
              "flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
              tab === "analyzer"
                ? "bg-white text-surface-800 shadow-sm"
                : "text-surface-500 hover:text-surface-700"
            )}
          >
            <Palette size={16} />
            Style Analyzer
          </button>
          <button
            onClick={() => setTab("generator")}
            className={clsx(
              "flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
              tab === "generator"
                ? "bg-white text-surface-800 shadow-sm"
                : "text-surface-500 hover:text-surface-700"
            )}
          >
            <Layers size={16} />
            Style Unifier
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-2xl px-4 py-6 pb-20">
        {tab === "analyzer" ? <StyleAnalyzer /> : <StyleGenerator />}
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-200 bg-white">
        <div className="mx-auto max-w-2xl px-4 py-4 text-center">
          <p className="text-xs text-surface-400">
            Powered by Claude Vision & Stable Diffusion
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
