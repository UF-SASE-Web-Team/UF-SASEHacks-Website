export default function SponsorsSection() {
  const section = "py-12 md:py-16";
  const container = "mx-auto max-w-screen-xl px-4";
  const title = "text-2xl md:text-3xl font-semibold tracking-tight mb-4";
  const subtitle = "text-base md:text-lg text-gray-600";

  return (
    <section id="sponsors" className={section}>
      <div className={container}>
        <h2 className={title}>Sponsors</h2>
        <p className={subtitle}>Sponsor logos coming soon. Interested in sponsoring? Contact us.</p>
      </div>
    </section>
  );
}
