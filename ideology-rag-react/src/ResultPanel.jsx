function Badge({ label, value, color }) {
  if (!value) return null;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 3,
      fontSize: 11, padding: "2px 8px", borderRadius: 20,
      border: `1px solid ${color}33`,
      background: `${color}11`, color,
    }}>
      <span style={{ opacity: 0.6 }}>{label}</span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </span>
  );
}

function SourceCard({ source, accentColor }) {
  return (
    <div style={{
      padding: "10px 14px", borderRadius: 8,
      border: "0.5px solid #d0ccc5",
      background: "#f7f5f0",
      display: "flex", flexDirection: "column", gap: 5,
    }}>
      <div style={{
        fontFamily: "Georgia, serif", fontSize: 13,
        fontWeight: 500, lineHeight: 1.4,
      }}>
        {source.title || "Unknown title"}
      </div>
      <div style={{ fontSize: 12, color: "#6b7280" }}>
        {source.author || "Unknown author"}
        {source.year_published ? ` · ${source.year_published}` : ""}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 2 }}>
        <Badge label="role"  value={source.role}           color={accentColor} />
        <Badge label="topic" value={source.topic}          color={accentColor} />
        <Badge label="group" value={source.document_group} color={accentColor} />
      </div>
    </div>
  );
}

export default function ResultPanel({ result, accentColor, accentBg, accentBorder }) {
  return (
    <div style={{
      flex: 1, minWidth: 280,
      borderRadius: 10,
      border: `0.5px solid ${accentBorder}`,
      background: "#fff",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        padding: "12px 18px",
        background: accentBg,
        borderBottom: `0.5px solid ${accentBorder}`,
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <span style={{
          fontFamily: "Georgia, serif", fontSize: 15,
          fontWeight: 600, color: accentColor,
        }}>
          {result.label}
        </span>
        <span style={{ marginLeft: "auto", fontSize: 11, color: accentColor, opacity: 0.7 }}>
          {result.n_chunks} passages
        </span>
      </div>

      {/* Summary */}
      <div style={{ padding: "18px 18px 14px" }}>
        <p style={{
          fontFamily: "Georgia, serif", fontSize: 15,
          lineHeight: 1.8, margin: 0, color: "#1a1a2e",
        }}>
          {result.summary}
        </p>
      </div>

      {/* Sources */}
      <div style={{ padding: "0 18px 18px" }}>
        <div style={{
          fontSize: 11, fontWeight: 600, textTransform: "uppercase",
          letterSpacing: "0.05em", color: accentColor,
          marginBottom: 10,
        }}>
          Sources ({result.sources.length})
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {result.sources.map((src, i) => (
            <SourceCard key={i} source={src} accentColor={accentColor} />
          ))}
        </div>
      </div>
    </div>
  );
}