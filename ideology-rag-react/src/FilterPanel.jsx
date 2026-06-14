import { useState } from "react";

const FIELD_LABELS = {
  document_group: "Ideology group",
  title:          "Book title",
  topic:          "Topic",
  author:         "Author",
  role:           "Author role",
  year_published: "Year published",
};

function Tag({ value, onRemove, accentColor }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 3,
      background: `${accentColor}15`, border: `0.5px solid ${accentColor}55`,
      color: accentColor, borderRadius: 4, padding: "1px 5px 1px 7px",
      fontSize: 11, fontWeight: 500, maxWidth: 130,
    }}>
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {value}
      </span>
      <button
        onMouseDown={e => { e.preventDefault(); e.stopPropagation(); onRemove(value); }}
        style={{
          background: "none", border: "none", cursor: "pointer",
          color: accentColor, padding: "0 2px", lineHeight: 1,
          fontSize: 14, fontWeight: 700, opacity: 0.65, flexShrink: 0,
        }}
      >×</button>
    </span>
  );
}

function FilterSection({ label, opts, selected, onChange, accentColor, isOpen, onToggle }) {
  const [search, setSearch] = useState("");

  const filtered = opts.filter(o =>
    String(o.value).toLowerCase().includes(search.toLowerCase())
  );

  const toggle = value => {
    const has = selected.includes(value);
    onChange(has ? selected.filter(v => v !== value) : [...selected, value]);
  };

  const chips    = selected.slice(0, 3);
  const overflow = selected.length - 3;

  return (
    <div style={{ borderBottom: "0.5px solid #ece8e2" }}>

      {/* Header row */}
      <button onClick={onToggle} style={{
        width: "100%", background: isOpen ? `${accentColor}06` : "none",
        border: "none", cursor: "pointer", padding: "9px 14px",
        display: "flex", alignItems: "center", gap: 8, textAlign: "left",
      }}>
        <span style={{
          fontSize: 11, fontWeight: 700,
          color: selected.length > 0 ? accentColor : "#6b7280",
          textTransform: "uppercase", letterSpacing: "0.06em",
          flexShrink: 0, minWidth: 100,
        }}>{label}</span>

        <div style={{ flex: 1, display: "flex", gap: 4, flexWrap: "nowrap", alignItems: "center", overflow: "hidden" }}>
          {chips.map(v => (
            <Tag key={v} value={v}
              onRemove={value => onChange(selected.filter(s => s !== value))}
              accentColor={accentColor} />
          ))}
          {overflow > 0 && (
            <span style={{ fontSize: 11, color: accentColor, fontWeight: 600, flexShrink: 0 }}>
              +{overflow}
            </span>
          )}
        </div>

        <span style={{
          fontSize: 9, color: "#9ca3af", flexShrink: 0,
          display: "inline-block",
          transform: isOpen ? "rotate(180deg)" : "none",
          transition: "transform 0.15s",
        }}>▼</span>
      </button>

      {/* Expanded panel */}
      {isOpen && (
        <div style={{ background: "#faf8f5", borderTop: "0.5px solid #ece8e2" }}>

          {/* Search */}
          <div style={{ padding: "8px 14px 4px" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "#fff", border: "0.5px solid #d0ccc5",
              borderRadius: 5, padding: "5px 10px",
            }}>
              <input
                type="text" value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={`Search ${label.toLowerCase()}…`}
                autoFocus
                style={{
                  flex: 1, border: "none", background: "transparent",
                  fontSize: 12, outline: "none", color: "#1a1a2e",
                }}
              />
              {search && (
                <button onClick={() => setSearch("")} style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "#9ca3af", fontSize: 14, padding: 0,
                }}>×</button>
              )}
            </div>
          </div>

          {/* Options */}
          <div style={{ maxHeight: 190, overflowY: "auto" }}>
            {filtered.length === 0 ? (
              <div style={{ padding: "10px 16px", fontSize: 12, color: "#9ca3af", fontStyle: "italic" }}>
                No matches for "{search}"
              </div>
            ) : (
              filtered.map(o => {
                const isChecked = selected.includes(o.value);
                return (
                  <label key={o.value} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "6px 16px", cursor: "pointer", fontSize: 13,
                    background: isChecked ? `${accentColor}0d` : "transparent",
                    borderBottom: "0.5px solid #f0ede8",
                  }}>
                    <input type="checkbox" checked={isChecked}
                      onChange={() => toggle(o.value)}
                      style={{ width: 13, height: 13, accentColor, flexShrink: 0 }} />
                    <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {o.value}
                    </span>
                    <span style={{ fontSize: 11, color: "#9ca3af", flexShrink: 0 }}>{o.count}</span>
                  </label>
                );
              })
            )}
          </div>

          {/* Clear this field */}
          {selected.length > 0 && (
            <div style={{ padding: "5px 14px 8px" }}>
              <button
                onClick={e => { e.stopPropagation(); onChange([]); setSearch(""); }}
                style={{
                  background: "none", border: "none", color: accentColor,
                  fontSize: 11, cursor: "pointer", padding: 0, textDecoration: "underline",
                }}
              >
                Clear {label.toLowerCase()}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function FilterPanel({ label, filters, setFilters, options, accentColor, accentBg }) {
  const activeCount = Object.values(filters).filter(v => v?.length > 0).length;
  const [openField, setOpenField] = useState(null);

  const handleChange = (field, values) => {
    setFilters(prev => ({ ...prev, [field]: values }));
  };

  const years = [...(options.year_published || [])].sort((a, b) => a.value - b.value);

  return (
    <div style={{
      flex: 1, minWidth: 240,
      border: "0.5px solid #d0ccc5",
      borderRadius: 10, background: "#fff", overflow: "hidden",
    }}>
      <div style={{
        padding: "10px 16px", background: accentBg,
        borderBottom: "0.5px solid #d0ccc5",
        display: "flex", alignItems: "center",
      }}>
        <span style={{
          fontFamily: "Georgia, serif", fontSize: 14,
          fontWeight: 600, color: accentColor,
        }}>
          {label}
        </span>
        {activeCount > 0 && (
          <span style={{
            marginLeft: "auto", fontSize: 11,
            background: accentColor, color: "#fff",
            padding: "2px 8px", borderRadius: 20,
          }}>
            {activeCount} active
          </span>
        )}
      </div>

      {Object.entries(FIELD_LABELS).map(([field, fieldLabel]) => {
        const opts = field === "year_published" ? years : (options[field] || []);
        return (
          <FilterSection
            key={field}
            label={fieldLabel}
            opts={opts}
            selected={filters[field] || []}
            onChange={vals => handleChange(field, vals)}
            accentColor={accentColor}
            isOpen={openField === field}
            onToggle={() => setOpenField(prev => prev === field ? null : field)}
          />
        );
      })}
      
      {activeCount > 0 && (
        <div style={{ padding: "10px 16px" }}>
          <button
            onClick={() => {
              setFilters({ document_group: [], title: [], topic: [], author: [], role: [], year_published: [] });
              setOpenField(null);
            }}
            style={{
              background: "none", color: accentColor,
              border: `0.5px solid ${accentColor}`,
              borderRadius: 6, padding: "5px 12px",
              fontSize: 12, fontWeight: 500, cursor: "pointer",
            }}
          >
            Clear all filters
          </button>
        </div>
      )}

    </div>
  );
}