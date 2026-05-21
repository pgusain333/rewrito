import { Reveal } from "@/components/ui/Reveal";

export type AudienceCard = {
  title: string;
  body: string;
  image: string;
};

type Props = {
  eyebrow?: string;
  title: string;
  lead: string;
  audiences: AudienceCard[];
  className?: string;
};

export function AudienceShowcase({
  eyebrow = "Who this is for",
  title,
  lead,
  audiences,
  className = "bg-bg",
}: Props) {
  return (
    <section className={className}>
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="mb-10 max-w-2xl">
          <span className="chip mb-5">{eyebrow}</span>
          <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {title}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-ink-muted">{lead}</p>
        </div>
        <div className="no-scrollbar -mx-5 flex snap-x gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 lg:grid-cols-3 xl:grid-cols-5">
          {audiences.map((audience, index) => (
            <Reveal key={audience.title} delay={index * 70}>
              <article className="card h-full min-w-[78vw] snap-start overflow-hidden sm:min-w-0">
                <img
                  src={audience.image}
                  alt=""
                  className="h-36 w-full object-cover"
                  loading="lazy"
                />
                <div className="p-5">
                  <h3 className="text-base font-semibold text-ink">{audience.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{audience.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
