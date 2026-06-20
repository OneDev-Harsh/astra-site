import DocsContent from "./DocsContent";

export const metadata = {
  title: "Docs — Astra",
  description:
    "Comprehensive reference for every Astra feature, command, mode, and configuration option.",
};

export default function DocsPage() {
  return (
    <main className="relative min-h-screen">
      <div className="relative z-10 pt-20">
        <DocsContent />
      </div>
    </main>
  );
}
