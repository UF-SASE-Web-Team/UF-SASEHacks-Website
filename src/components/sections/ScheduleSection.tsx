export default function ScheduleSection() {
  const section = "py-12 md:py-16";
  const container = "mx-auto max-w-screen-xl px-4";
  const title = "text-2xl md:text-3xl font-semibold tracking-tight mb-4";

  return (
    <section id="schedule" className={`${section} bg-gray-50`}>
      <div className={container}>
        <h2 className={title}>Schedule (summary)</h2>
        <ul className="mt-2 space-y-2 text-sm text-gray-700">
          <li>Day 1 - Stuff being done</li>
          <li>Day 2 - Stuff still being done</li>
          <li>Final - This is the end</li>
        </ul>
      </div>
    </section>
  );
}
