import Image from "next/image";
import { getPublicImageUrl } from "@/lib/supabase/storage";

const PARTNERS = [
  {
    name: "Open Source Club",
    logo: getPublicImageUrl("partners/open-source-club.png"),
    link: "https://ufosc.org/",
  },
  {
    name: "WiCSE",
    logo: getPublicImageUrl("partners/wicse.png"),
    link: "https://ufwicse.com/",
  },
  {
    name: "SHPE",
    logo: getPublicImageUrl("partners/shpe.png"),
    link: "https://www.shpeuf.com/",
  },
  {
    name: "GatorAI",
    logo: getPublicImageUrl("partners/gatorai.png"),
    link: "https://www.ufgatorai.info/",
  },
  {
    name: "PCBuilding",
    logo: getPublicImageUrl("partners/pcbuilding.png"),
    link: "https://www.spcbatuf.org/",
  },
];

export default function PartnersSections() {
  return (
    <section id="partners" className="w-full min-h-screen flex flex-col items-center py-16 md:py-20">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8 w-full">
        <div className="mb-12 md:mb-16">
          <h2 className="font-[family-name:var(--font-heading)] text-white text-4xl md:text-6xl lg:text-7xl mb-4 text-center drop-shadow-lg uppercase">
            Student Organizations
          </h2>
          <p className="font-[family-name:var(--font-body)] text-white text-lg md:text-xl mb-12 text-center drop-shadow-md max-w-2xl mx-auto">
            Shoutout to our amazing student organization partners.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 items-center max-w-5xl mx-auto md:flex md:flex-wrap md:justify-center md:gap-10">
            {PARTNERS.map((partner) => (
              <a
                key={partner.name}
                href={partner.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-xl p-2 md:p-4 transition-all duration-300 hover:scale-105 shadow-lg flex items-center justify-center aspect-[4/3] md:w-64 md:h-48"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    unoptimized
                    className="object-contain"
                  />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}