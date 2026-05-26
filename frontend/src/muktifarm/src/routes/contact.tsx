import { createFileRoute } from "@tanstack/react-router";
import Contact from "../pages/Contact";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Mukti Dairy Farm" },
      { name: "description", content: "Visit our farm, subscribe for daily delivery, or send us a message — Mukti Dairy Farm is open every day." },
      { property: "og:title", content: "Contact Mukti Dairy Farm" },
      { property: "og:description", content: "Get in touch for daily fresh dairy delivery or a farm visit." },
    ],
  }),
  component: Contact,
});