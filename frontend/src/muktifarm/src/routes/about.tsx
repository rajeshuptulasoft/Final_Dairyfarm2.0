import { createFileRoute } from "@tanstack/react-router";
import About from "../pages/About";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Mukti Dairy Farm" },
      { name: "description", content: "Three generations of honest dairy farming. Meet the people, the cows, and the process behind Mukti Dairy Farm." },
      { property: "og:title", content: "About Mukti Dairy Farm" },
      { property: "og:description", content: "A village dairy with a modern heart — pure, organic, and traceable." },
    ],
  }),
  component: About,
});