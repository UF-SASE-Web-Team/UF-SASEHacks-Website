import { DISCORD_INVITE, DEVPOST_URL } from "@/lib/constants";
import FaqList from "@/components/FaqList";
import type { FaqItem } from "@/lib/notion";

type Props = {
  faqItems: FaqItem[];
};

export default function FaqSection({ faqItems }: Props) {
  const section = "py-12 md:py-16";
  const container = "mx-auto max-w-screen-xl px-4";
  const title = "text-2xl md:text-3xl font-semibold tracking-tight mb-4";

  return (
    <section id="faq" className={`${section} bg-gray-50`}>
      <div className={container}>
        <h2 className={title}>FAQ</h2>
        <FaqList items={faqItems} />
        <div className="mt-6 flex gap-3">
          <a href={DISCORD_INVITE} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium border hover:bg-gray-50">
            Join Discord
          </a>
          <a href={DEVPOST_URL} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium border hover:bg-gray-50">
            Devpost
          </a>
        </div>
      </div>
    </section>
  );
}
