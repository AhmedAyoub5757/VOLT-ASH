export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <main style={{ minHeight: "100dvh", paddingTop: "15dvh", textAlign: "center" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "3rem", textTransform: "capitalize" }}>
        {slug.replace("-", " ")}
      </h1>
      <p style={{ fontFamily: "var(--font-ui)", opacity: 0.6 }}>Collection coming soon.</p>
    </main>
  );
}