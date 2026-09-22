import { cookies } from "next/headers";
import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { dictionary, type Locale } from "@/lib/dictionary";

const timelineAr = [
  { year: "منذ الطفولة", text: "بدأت الرحلة مع الكهرمان من سوق الأنتيكات القديم، شغفًا بلونه ودفئه." },
  { year: "أكثر من 20 عامًا", text: "خبرة متراكمة في تمييز الكهرمان الطبيعي عن الفاتوران وعن التقليد." },
  { year: "اليوم", text: "أمبر آند إنرجي — بيت رقمي يجمع أفضل القطع الموثقة لهواة الاقتناء أينما كانوا." },
];

const timelineEn = [
  { year: "Since childhood", text: "The journey began at the old antiques market, drawn to amber's warmth and color." },
  { year: "20+ years", text: "Deep expertise distinguishing natural amber from faturan and imitation." },
  { year: "Today", text: "Amber & Energy — an online home bringing documented, authentic pieces to collectors everywhere." },
];

export default async function AboutPage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("ae_locale")?.value === "en" ? "en" : "ar") as Locale;
  const dict = dictionary[locale];
  const timeline = locale === "ar" ? timelineAr : timelineEn;

  return (
    <div>
      <section className="relative overflow-hidden py-20">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,rgba(217,169,74,0.1),transparent_60%)]" />
        <div className="mx-auto max-w-4xl px-6 text-center md:px-8">
          <Reveal>
            <p className="mb-3 text-xs font-medium tracking-[0.3em] text-amber-400 uppercase">
              {dict.nav.about}
            </p>
            <h1 className="font-display text-4xl text-foreground md:text-5xl">
              {locale === "ar" ? "قصة أبو حيدر مع الكهرمان" : "Abu Haidar's Journey With Amber"}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted">
              {locale === "ar"
                ? "أمبر آند إنرجي ليست مجرد متجر، بل امتداد لشغف عائلي بالكهرمان الطبيعي والفاتوران، توارثته الأيدي قبل أن يصل إليك موثّقًا وأصيلًا."
                : "Amber & Energy is more than a store — it's an extension of a family passion for natural amber and faturan, passed down by hand before it reaches you documented and authentic."}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-20 md:px-8">
        <div className="relative flex flex-col gap-10 border-s-2 border-amber-500/25 ps-8">
          {timeline.map((item, i) => (
            <Reveal key={item.year} delay={i * 0.1}>
              <div className="relative">
                <span className="absolute -start-[2.55rem] top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 ring-4 ring-background" />
                <p className="font-display text-lg text-amber-300">{item.year}</p>
                <p className="mt-1 text-sm leading-7 text-muted">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24 md:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            "/images/collections/rare-pieces.svg",
            "/images/collections/faturan-amber.svg",
            "/images/collections/natural-amber-tasbih.svg",
          ].map((img, i) => (
            <Reveal key={img} delay={i * 0.1}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl card-border">
                <Image src={img} alt="" fill className="object-cover" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
