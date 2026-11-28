"use client";

import { useParams } from "next/navigation";
import { PRODUCTS } from "@/lib/data/products";

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const product = PRODUCTS.find((p) => p.id === params.slug);

  return (
    <main style={{ minHeight: "100dvh", paddingTop: "15dvh", textAlign: "center" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "3rem" }}>
        {product?.name ?? "Product"}
      </h1>
      <p style={{ fontFamily: "var(--font-ui)", opacity: 0.6 }}>Full product page coming soon.</p>
    </main>
  );
}