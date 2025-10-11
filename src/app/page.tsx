import { HACK_NAME, DATES, CITY, DISCORD_INVITE, DEVPOST_URL } from "@/lib/constants";

function CtaRow() {
  const btn =
    "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium border w-full sm:w-auto";
  return (
    <div className="mt-6 flex flex-col sm:flex-row gap-3">
      <a href="/portal" className={`${btn} bg-black text-white border-black hover:opacity-90`}>Register / Portal</a>
      <a href={DISCORD_INVITE} target="_blank" rel="noreferrer" className={`${btn} bg-white text-black border-gray-300 hover:bg-gray-50`}>Join Discord</a>
      <a href={DEVPOST_URL} target="_blank" rel="noreferrer" className={`${btn} bg-white text-black border-gray-300 hover:bg-gray-50`}>View on Devpost</a>
    </div>
  );
}

export default function Page() {
  const section = "py-12 md:py-16";
  const container = "mx-auto max-w-screen-xl px-4";
  const title = "text-2xl md:text-3xl font-semibold tracking-tight mb-4";
  const subtitle = "text-base md:text-lg text-gray-600";

  return (
    <>
      {/* Hero */}
      <section className={section}>
        <div className={container}>
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium text-gray-700 border-gray-200">
            {CITY}
          </div>
          <h1 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">
            {HACK_NAME}
          </h1>
          <p className="mt-2 text-lg text-gray-700">{DATES} • {CITY}</p>
          <p className="mt-4 text-base text-gray-600 max-w-2xl">
            Build something amazing in 24-36 hours. Meet new teammates, learn from mentors, and
            ship projects you will be proud of :D
          </p>
          <CtaRow />
        </div>
      </section>

      {/* About */}
      <section id="about" className={`${section} bg-gray-50`}>
        <div className={container}>
          <h2 className={title}>About</h2>
          <p className={subtitle + " max-w-2xl"}>
            UF SASE Hacks is a beginner-friendly hackathon welcoming students of all levels.
            We provide mentors, workshops, prizes, food, and a friendly community.
          </p>
        </div>
      </section>

      {/* Tracks / Prizes */}
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

      {/* Schedule summary */}
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

      {/* Sponsors */}
      <section id="sponsors" className={section}>
        <div className={container}>
          <h2 className={title}>Sponsors</h2>
          <p className={subtitle}>Sponsor logos coming soon. Interested in sponsoring? Contact us.</p>
        </div>
      </section>

      {/* FAQ placeholder*/}
      <section id="faq" className={`${section} bg-gray-50`}>
        <div className={container}>
          <h2 className={title}>FAQ</h2>
          <p className={subtitle}>Will use Notion CRM for this.</p>
          <CtaRow />
        </div>
      </section>
    </>
  );
}
