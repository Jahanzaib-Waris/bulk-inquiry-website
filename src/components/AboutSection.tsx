export function AboutSection() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="grid gap-6 sm:grid-cols-3 sm:gap-10">
        <div className="sm:col-span-1">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            About Us
          </h2>
        </div>
        <div className="sm:col-span-2 space-y-4 text-slate-600">
          <p>
            We help businesses source and fulfill bulk orders quickly and
            reliably. Whether you&apos;re restocking inventory or sourcing a
            one-off large order, our team works directly with you to
            understand your requirements and deliver a competitive quote.
          </p>
          <p>
            Simply describe what you need below and attach any reference
            images — product photos, specs, or examples — and we&apos;ll
            follow up by email with next steps.
          </p>
        </div>
      </div>
    </section>
  );
}
