const NAV_LINKS = [
  { label: "Ideate Lab",  href: "https://websites.umass.edu/ideate/" },
  { label: "Corpus info", href: "https://websites.umass.edu/ideate/ibc-corpus/" },
  { label: "Blog",        href: "https://websites.umass.edu/ideate/category/ideology-rag/" },
  { label: "GitHub",      href: "https://github.com/venkatx02/ideology-rag" },
];

export default function Navbar() {
  return (
    <nav style={{
      width: "100%",
      borderBottom: "0.5px solid #d0ccc5",
      background: "#1a1a2e",
      padding: "2rem 8rem",
      display: "flex",
      alignItems: "center",
      height: 52,
      gap: 16,
    }}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <span style={{
          fontFamily: "Georgia, serif", fontSize: 20,
          fontWeight: 600, color: "#fff", lineHeight: 1.2,
        }}>
          IdeologyRAG v1 Beta
        </span>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", letterSpacing: "0.04em" }}>
          Retrieval-augmented generation over the Ideological Books Corpus
        </span>
      </div>

      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
        {NAV_LINKS.map(({ label, href }) => (
        <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 12, color: "rgba(255,255,255,0.6)",
              textDecoration: "none", padding: "6px 12px",
              borderRadius: 6,
              transition: "color 0.15s",
            }}
            onMouseEnter={e => e.target.style.color = "#fff"}
            onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.6)"}
        >
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}