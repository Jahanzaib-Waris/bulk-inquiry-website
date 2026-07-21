export function Hero() {
  return (
    <section className="bg-slate-900 text-white">
      <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
          Bulk Inquiry, Made Simple
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
          Tell us what you need, attach reference images, and our team will
          get back to you with a tailored quote.
        </p>
        <a
          href="#inquiry-form"
          className="mt-8 block rounded-md bg-white px-6 py-3 font-medium text-slate-900 transition hover:bg-slate-200 sm:inline-block"
        >
          Submit an Inquiry
        </a>
      </div>
    </section>
  );
}
