import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import FilterPanel from "./FilterPanel";
import ResultPanel from "./ResultPanel";

const API = "https://ideology-rag-api-2637577564.us-central1.run.app";

const COLORS = {
  leftBlue:   "#1d4e89",
  leftBg:     "#e8f0f8",
  leftBorder: "#b8d0ee",
  rightRed:   "#8b1a1a",
  rightBg:    "#f8e8e8",
  rightBorder:"#e8b8b8",
  gold:       "#b8860b",
  muted:      "#6b7280",
  border:     "#d0ccc5",
};

const EMPTY_FILTERS = {
  document_group: [],
  title: [],
  topic: [],
  author: [],
  role: [],
  year_published: [],
};

function LoadingSpinner() {
  return (
    <div style={{ textAlign: "center", padding: "3rem 0" }}>
      <div style={{
        width: 32, height: 32, margin: "0 auto 12px",
        border: "3px solid #e2ddd8",
        borderTop: "3px solid #1a1a2e",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
      <p style={{ fontSize: 13, color: COLORS.muted }}>
        Retrieving passages and generating answer…
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function EmptyState({ mode }) {
  const examples = [
    "What is the proper role of government in the economy?",
    "How should immigration policy work?",
    "What does freedom mean in American politics?",
  ];
  return (
    <div style={{
      textAlign: "center", padding: "3rem 2rem",
      border: "0.5px dashed #d0ccc5",
      borderRadius: 10, background: "#fff",
    }}>
      <p style={{
        fontFamily: "Georgia, serif", fontSize: 16,
        color: "#1a1a2e", marginBottom: 8,
      }}>
        {mode === "rag"
          ? "Select filters, ask a question, get a grounded answer."
          : "Define two groups and compare their perspectives side by side."}
      </p>
      <p style={{ fontSize: 12, color: COLORS.muted, marginBottom: "1rem" }}>
        Try one of these questions:
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
        {examples.map(q => (
          <span key={q} style={{
            fontSize: 12, color: COLORS.leftBlue,
            fontStyle: "italic", cursor: "default",
          }}>
            "{q}"
          </span>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [mode, setMode]                   = useState("rag");
  const [filterOptions, setFilterOptions] = useState({});
  const [modelOptions, setModelOptions]   = useState({});
  const [selectedModel, setSelectedModel] = useState("qwen2.5-14b");
  const [question, setQuestion]           = useState("");
  const [filtersA, setFiltersA]           = useState({ ...EMPTY_FILTERS });
  const [filtersB, setFiltersB]           = useState({ ...EMPTY_FILTERS });
  const [groupALabel, setGroupALabel]     = useState("Group A");
  const [groupBLabel, setGroupBLabel]     = useState("Group B");
  const [results, setResults]             = useState(null);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState(null);
  const [remaining, setRemaining]         = useState(null);

  useEffect(() => {
    fetch(`${API}/filters`).then(r => r.json()).then(setFilterOptions).catch(console.error);
    fetch(`${API}/models`).then(r => r.json()).then(setModelOptions).catch(console.error);
  }, []);

  const toApiFilters = (f) =>
    Object.fromEntries(
      Object.entries(f).filter(([, v]) => Array.isArray(v) ? v.length > 0 : v !== "" && v !== null)
    );

  const handleSubmit = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setError(null);
    setResults(null);

    const fA = toApiFilters(filtersA);
    const fB = mode === "compare" ? toApiFilters(filtersB) : fA;

    try {
      const res = await fetch(`${API}/compare`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.trim(),
          model: selectedModel,
          group_a_label: mode === "compare" ? (groupALabel || "Group A") : "Result",
          group_b_label: mode === "compare" ? (groupBLabel || "Group B") : "Result",
          group_a_filters: fA,
          group_b_filters: fB,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Error ${res.status}`);
      }

      const data = await res.json();
      setResults(data);
      setRemaining(data.requests_remaining_today);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f7f5f0" }}>
      <Navbar />

      <div style={{ padding: "2rem", maxWidth: 1100, margin: "0 auto" }}>

        {/* Mode switcher */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{
            display: "inline-flex",
            border: `0.5px solid ${COLORS.border}`,
            borderRadius: 8, overflow: "hidden",
            marginBottom: 8,
          }}>
            {[
              { key: "rag",     label: "RAG" },
              { key: "compare", label: "Comparative RAG" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => { setMode(key); setResults(null); setError(null); }}
                style={{
                  padding: "7px 18px", fontSize: 13,
                  borderRadius: 0, border: "none",
                  background: mode === key ? "#1a1a2e" : "#fff",
                  color: mode === key ? "#fff" : COLORS.muted,
                  fontWeight: mode === key ? 600 : 400,
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <p style={{ fontSize: 12, color: COLORS.muted, margin: 0 }}>
            {mode === "rag"
              ? "Ask a question and retrieve grounded answers from one defined group of books."
              : "Define two groups and compare their perspectives on the same question, side by side."}
          </p>
        </div>

        {/* Question + Model row */}
        <div style={{ display: "flex", gap: 10, marginBottom: "1rem", alignItems: "flex-start" }}>
          <textarea
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Ask a question about political ideology, policy, or values…"
            rows={2}
            style={{
              flex: 1, resize: "vertical",
              fontFamily: "Georgia, serif", fontSize: 14,
              lineHeight: 1.6, padding: "10px 14px",
            }}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 210 }}>
            <select
              value={selectedModel}
              onChange={e => setSelectedModel(e.target.value)}
              style={{ width: "100%" }}
            >
              {Object.entries(modelOptions).map(([key, m]) => (
                <option key={key} value={key}>{m.label}</option>
              ))}
            </select>
            {modelOptions[selectedModel] && (
              <div style={{ fontSize: 11, color: COLORS.muted }}>
                {modelOptions[selectedModel].benchmarked
                  ? `✓ Benchmarked · ${(modelOptions[selectedModel].benchmark_avg_score * 100).toFixed(1)}% avg score`
                  : "○ Not yet benchmarked"}
              </div>
            )}
          </div>
        </div>

        {/* Group labels — compare mode only */}
        {mode === "compare" && (
          <div style={{ display: "flex", gap: 12, marginBottom: "1rem", flexWrap: "wrap" }}>
            <div style={{ flex: 1 }}>
              <label style={{
                display: "block", fontSize: 11, fontWeight: 600,
                textTransform: "uppercase", letterSpacing: "0.05em",
                color: COLORS.leftBlue, marginBottom: 4,
              }}>
                Group A label
              </label>
              <input
                value={groupALabel}
                onChange={e => setGroupALabel(e.target.value)}
                placeholder="e.g. Left, Progressive"
                style={{ width: "100%" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{
                display: "block", fontSize: 11, fontWeight: 600,
                textTransform: "uppercase", letterSpacing: "0.05em",
                color: COLORS.rightRed, marginBottom: 4,
              }}>
                Group B label
              </label>
              <input
                value={groupBLabel}
                onChange={e => setGroupBLabel(e.target.value)}
                placeholder="e.g. Right, Conservative"
                style={{ width: "100%" }}
              />
            </div>
          </div>
        )}

        {/* Filter panels */}
        <div style={{ display: "flex", gap: 12, marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <FilterPanel
            label={mode === "compare" ? `${groupALabel || "Group A"} filters` : "Filters"}
            filters={filtersA}
            setFilters={setFiltersA}
            options={filterOptions}
            accentColor={COLORS.leftBlue}
            accentBg={COLORS.leftBg}
          />
          {mode === "compare" && (
            <FilterPanel
              label={`${groupBLabel || "Group B"} filters`}
              filters={filtersB}
              setFilters={setFiltersB}
              options={filterOptions}
              accentColor={COLORS.rightRed}
              accentBg={COLORS.rightBg}
            />
          )}
        </div>

        {/* Submit */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: "1.5rem" }}>
          <button
            onClick={handleSubmit}
            disabled={loading || !question.trim()}
            style={{ padding: "9px 24px", fontSize: 14, borderRadius: 8 }}
          >
            {loading
              ? "Retrieving & generating…"
              : mode === "compare" ? "Compare →" : "Ask →"}
          </button>
          {remaining !== null && (
            <span style={{ fontSize: 12, color: COLORS.muted }}>
              {remaining} request{remaining !== 1 ? "s" : ""} remaining today
            </span>
          )}
        </div>

        {/* Error */}
        {error && (
          <div style={{
            padding: "10px 14px", borderRadius: 8, marginBottom: "1rem",
            background: "#fef2f2", border: "0.5px solid #fca5a5",
            fontSize: 13, color: "#991b1b",
          }}>
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && <LoadingSpinner />}

        {/* Results */}
        {!loading && results && (
          <div>
            <div style={{ fontSize: 11, color: COLORS.muted, marginBottom: "1rem" }}>
              Generated by {modelOptions[results.model]?.label || results.model}
            </div>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <ResultPanel
                result={results.group_a}
                accentColor={COLORS.leftBlue}
                accentBg={COLORS.leftBg}
                accentBorder={COLORS.leftBorder}
              />
              {mode === "compare" && (
                <ResultPanel
                  result={results.group_b}
                  accentColor={COLORS.rightRed}
                  accentBg={COLORS.rightBg}
                  accentBorder={COLORS.rightBorder}
                />
              )}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !results && !error && (
          <EmptyState mode={mode} />
        )}

      </div>
    </div>
  );
}