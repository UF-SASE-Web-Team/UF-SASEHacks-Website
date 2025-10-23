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

export default function HeroSection() {
  const section = "py-12 md:py-16";
  const container = "mx-auto max-w-screen-xl px-4";

  return (
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
  );
}
