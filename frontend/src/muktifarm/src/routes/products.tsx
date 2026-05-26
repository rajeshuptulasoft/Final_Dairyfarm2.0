import { createFileRoute } from "@tanstack/react-router";
import Products from "../pages/Products";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — Mukti Dairy Farm" },
      { name: "description", content: "Browse our range of fresh organic dairy: milk, curd, paneer, cheese, butter and ghee — all from Mukti Dairy Farm." },
      { property: "og:title", content: "Products — Mukti Dairy Farm" },
      { property: "og:description", content: "Glass-bottled organic dairy crafted fresh daily." },
    ],
  }),
  component: Products,
});