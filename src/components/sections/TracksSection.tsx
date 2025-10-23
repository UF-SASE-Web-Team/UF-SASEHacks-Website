export default function TracksSection() {
  const section = "py-12 md:py-16";
  const container = "mx-auto max-w-screen-xl px-4";
  const title = "text-2xl md:text-3xl font-semibold tracking-tight mb-4";

  return (
    <section id="tracks" className={section}>
      <div className={container}>
        <h2 className={title}>Tracks & Prizes</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="rounded-xl border p-4">
            <h3 className="font-semibold mb-1">Track 1</h3>
            <p className="text-sm text-gray-600">Woah pretty cool track guys</p>
          </div>
          <div className="rounded-xl border p-4">
            <h3 className="font-semibold mb-1">Track 3</h3>
            <p className="text-sm text-gray-600">Wowza this is awesome</p>
          </div>
          <div className="rounded-xl border p-4">
            <h3 className="font-semibold mb-1">Track 2</h3>
            <p className="text-sm text-gray-600">Bing Bong Bang lets goo</p>
          </div>
        </div>
      </div>
    </section>
  );
}
