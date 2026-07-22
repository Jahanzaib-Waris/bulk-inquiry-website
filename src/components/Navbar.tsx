export function Navbar({ siteName, logoUrl }: { siteName: string; logoUrl: string | null }) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-100 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <a href="#" className="flex items-center gap-2 font-semibold text-slate-900">
          {logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="" className="h-7 w-7 rounded object-contain" />
          )}
          {siteName}
        </a>
        <div className="flex items-center gap-6 text-sm font-medium text-slate-600">
          <a href="#about" className="hover:text-slate-900">
            About Us
          </a>
          <a
            href="#inquiry-form"
            className="rounded-md bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-700"
          >
            Submit Inquiry
          </a>
        </div>
      </nav>
    </header>
  );
}
