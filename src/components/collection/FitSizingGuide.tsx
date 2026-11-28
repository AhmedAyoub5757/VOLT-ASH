const ROWS = [
  { size: "XS", chest: "32–33", waist: "25–26", hip: "34–35" },
  { size: "S", chest: "34–35", waist: "27–28", hip: "36–37" },
  { size: "M", chest: "36–38", waist: "29–31", hip: "38–40" },
  { size: "L", chest: "39–41", waist: "32–34", hip: "41–43" },
  { size: "XL", chest: "42–44", waist: "35–37", hip: "44–46" },
];

const FIT_NOTES = [
  { fit: "Relaxed", note: "Room through the body, true to size." },
  { fit: "Tailored", note: "Closer through the shoulder and waist — size up if between sizes." },
  { fit: "Oversized", note: "Intentionally loose — size down for a closer silhouette." },
  { fit: "Fitted", note: "Compression-close — true to size, stretch fabric." },
];

export default function FitSizingGuide() {
  return (
    <section className="w-full" style={{ background: "var(--color-cream)", padding: "10dvh 6dvh" }}>
      <div className="mx-auto flex max-w-[1000px] flex-col gap-10">
        <div className="flex flex-col gap-3 text-center">
          <span className="text-[11px] font-medium uppercase tracking-[0.4em]" style={{ fontFamily: "var(--font-ui)", color: "var(--color-green)" }}>
            Fit &amp; Sizing
          </span>
          <h2 className="text-[clamp(1.8rem,3.5vw,2.6rem)]" style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}>
            Know Before You Order
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-center" style={{ fontFamily: "var(--font-ui)" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(26,26,26,0.15)" }}>
                <th className="py-3 text-[11px] uppercase tracking-[0.15em]" style={{ color: "rgba(26,26,26,0.5)" }}>Size</th>
                <th className="py-3 text-[11px] uppercase tracking-[0.15em]" style={{ color: "rgba(26,26,26,0.5)" }}>Chest (in)</th>
                <th className="py-3 text-[11px] uppercase tracking-[0.15em]" style={{ color: "rgba(26,26,26,0.5)" }}>Waist (in)</th>
                <th className="py-3 text-[11px] uppercase tracking-[0.15em]" style={{ color: "rgba(26,26,26,0.5)" }}>Hip (in)</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.size} style={{ borderBottom: "1px solid rgba(26,26,26,0.08)" }}>
                  <td className="py-3 text-[14px]" style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}>{r.size}</td>
                  <td className="py-3 text-[13px]" style={{ color: "rgba(26,26,26,0.7)" }}>{r.chest}</td>
                  <td className="py-3 text-[13px]" style={{ color: "rgba(26,26,26,0.7)" }}>{r.waist}</td>
                  <td className="py-3 text-[13px]" style={{ color: "rgba(26,26,26,0.7)" }}>{r.hip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {FIT_NOTES.map((f) => (
            <div key={f.fit} className="flex flex-col gap-1.5">
              <span className="text-[13px] font-medium" style={{ fontFamily: "var(--font-ui)", color: "var(--color-ink)" }}>{f.fit}</span>
              <span className="text-[12px]" style={{ fontFamily: "var(--font-ui)", color: "rgba(26,26,26,0.55)" }}>{f.note}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}