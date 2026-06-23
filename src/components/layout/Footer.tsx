import { site } from "@/data/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="flex flex-col gap-3 border-t border-fg/10 bg-bg-deep px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-12">
      <span className="label text-fg/35">
        © {year} — {site.monogram}
      </span>
      <span className="label text-fg/35">
        {/* TODO: full name placeholder — see src/data/site.ts */}
        {site.fullName}
      </span>
    </footer>
  );
}
