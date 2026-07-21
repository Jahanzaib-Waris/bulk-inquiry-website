import { Hero } from "@/components/Hero";
import { FeaturesStrip } from "@/components/FeaturesStrip";
import { AboutSection } from "@/components/AboutSection";
import { InquiryForm } from "@/components/InquiryForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <FeaturesStrip />
      <AboutSection />
      <section id="inquiry-form" className="border-t border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6 sm:py-20">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Bulk Inquiry
          </h2>
          <p className="mt-2 text-slate-600">
            Fill out the form below and we&apos;ll get back to you shortly.
          </p>
          <div className="mt-8">
            <InquiryForm />
          </div>
        </div>
      </section>
      <footer className="border-t border-slate-100 px-4 py-8 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} Bulk Inquiry. All rights reserved.
      </footer>
    </div>
  );
}
