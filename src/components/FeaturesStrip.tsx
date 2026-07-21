const FEATURES = [
  {
    title: "Fast turnaround",
    description: "Quotes typically within one business day of your inquiry.",
  },
  {
    title: "Any quantity",
    description: "From a few hundred units to full-container orders.",
  },
  {
    title: "Direct communication",
    description: "Work with the same point of contact from quote to delivery.",
  },
];

export function FeaturesStrip() {
  return (
    <section className="border-b border-slate-100 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3 sm:px-6 sm:py-14">
        {FEATURES.map((feature) => (
          <div key={feature.title}>
            <h3 className="font-semibold text-slate-900">{feature.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
