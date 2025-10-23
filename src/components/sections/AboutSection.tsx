export default function AboutSection() {
  const section = "py-12 md:py-16";
  const container = "mx-auto max-w-screen-xl px-4";
  const title = "text-2xl md:text-3xl font-semibold tracking-tight mb-4";
  const subtitle = "text-base md:text-lg text-gray-600";

  return (
    <section id="about" className={`${section} bg-gray-50`}>
      <div className={container}>
        <h2 className={title}>About</h2>
        <p className={subtitle + " max-w-2xl"}>
          UF SASE Hacks is a beginner-friendly hackathon welcoming students of all levels.
          We provide mentors, workshops, prizes, food, and a friendly community.
        </p>
      </div>
    </section>
  );
}
