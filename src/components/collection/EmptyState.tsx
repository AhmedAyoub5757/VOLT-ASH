export default function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-[12dvh] text-center">
      <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "1.6rem", color: "var(--color-ink)" }}>
        Nothing matches that combination.
      </span>
      <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "rgba(26,26,26,0.55)" }}>
        Try loosening a filter, or start over.
      </p>
      <button
        onClick={onReset}
        className="mt-2 rounded-full px-6 py-2.5 text-[12px] font-medium uppercase tracking-[0.2em]"
        style={{ fontFamily: "var(--font-ui)", background: "var(--color-red)", color: "var(--color-cream)" }}
      >
        Reset Filters
      </button>
    </div>
  );
}