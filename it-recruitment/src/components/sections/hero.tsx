import { Briefcase, Layers, Users } from 'lucide-react'
import { CodeWaveBackground } from '@/components/ui/code-wave-background'
import { cn } from '@/lib/utils'

function CrestiaMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 44"
      className={cn('h-10 w-9 shrink-0', className)}
      aria-hidden
    >
      <path
        d="M20 2.5 35.5 11.2v17.6L20 41.5 4.5 28.8V11.2L20 2.5Z"
        fill="none"
        stroke="#1148D7"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path
        d="M20 8.2 29.8 13.8v12.4L20 32.8l-9.8-6.6V13.8L20 8.2Z"
        fill="#0A1640"
      />
      <path
        d="M14.2 21.1 18.1 25l7.7-8.4"
        fill="none"
        stroke="#F5EDE3"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const NAV = [
  { label: 'IT Services', href: '#expertise' },
  { label: 'Career Consultancy', href: '/career-consultancy/' },
  { label: 'About', href: '#why' },
  { label: 'Contact', href: '#contact' },
] as const

const CHIPS = [
  { label: 'Contract Talent', icon: Users },
  { label: 'Direct Hire', icon: Briefcase },
  { label: 'Contract-to-Hire', icon: Layers },
] as const

const TAGS = [
  { label: 'Engineering', className: 'left-4 top-4 md:left-5 md:top-5' },
  { label: 'Cloud & DevOps', className: 'right-4 top-4 md:right-5 md:top-5' },
  { label: 'Data & AI', className: 'bottom-4 right-4 md:bottom-5 md:right-5' },
] as const

export default function Hero() {
  return (
    <section
      className="relative isolate min-h-svh overflow-hidden bg-cream text-navy"
      aria-labelledby="hero-title"
    >
      <CodeWaveBackground />

      <div className="relative z-10 mx-auto w-full max-w-[1240px] px-[5vw]">
        <header className="flex items-center justify-between gap-6 pt-7 pb-4 md:pt-8">
          <a href="#top" className="flex items-center gap-3" aria-label="Crestia Ventures">
            <CrestiaMark />
            <span className="leading-none">
              <span className="block text-[15px] font-extrabold tracking-[0.04em]">
                CRESTIA
              </span>
              <span className="mt-1 block text-[9px] font-semibold tracking-[0.5em] text-navy/70">
                VENTURES
              </span>
            </span>
          </a>

          <div className="flex items-center gap-4 xl:gap-5">
            <nav className="hidden items-center gap-4 xl:gap-5 lg:flex" aria-label="Primary">
              {NAV.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-widest text-navy/75 transition-colors hover:text-accent"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <span
              className="hidden h-5 w-px shrink-0 bg-navy/20 lg:block"
              aria-hidden
            />

            <a
              href="#contact"
              className="inline-flex shrink-0 items-center justify-center rounded-none bg-accent px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#0d3bb3]"
            >
              Start a Project →
            </a>
          </div>
        </header>

        <div className="grid min-h-[calc(100svh-96px)] grid-cols-1 items-center gap-10 py-10 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:py-14">
          <div className="max-w-[640px]">
            <div className="mb-6">
              <span className="mb-3 block h-[3px] w-[52px] bg-accent" aria-hidden />
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em]">
                <span className="text-accent">Division 02 /</span>
                <span className="text-navy"> IT Recruitment &amp; Staffing</span>
              </p>
            </div>

            <h1
              id="hero-title"
              className="mb-6 text-[clamp(2.6rem,6.2vw,5.2rem)] font-extrabold uppercase leading-[0.98] tracking-[-0.045em] text-navy"
            >
              Build the team behind what&apos;s next
              <span className="text-accent">.</span>
            </h1>

            <p className="mb-8 max-w-[44ch] text-[15px] leading-relaxed text-navy/70 md:text-base">
              We connect businesses with exceptional technology talent — from
              niche specialists to scalable, long-term teams — so you can build,
              scale and innovate faster.
            </p>

            <div className="mb-8 flex flex-wrap gap-3">
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-none bg-accent px-5 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#0d3bb3]"
              >
                Hire Tech Talent →
              </a>
              <a
                href="#models"
                className="inline-flex items-center justify-center rounded-none border border-navy/80 bg-transparent px-5 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-navy transition-colors hover:border-accent hover:text-accent"
              >
                Explore Our Approach →
              </a>
            </div>

            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {CHIPS.map(({ label, icon: Icon }) => (
                <li
                  key={label}
                  className="flex items-center gap-3 rounded-xl border border-navy/10 bg-white/80 px-3.5 py-3 shadow-[0_10px_30px_-22px_rgba(10,22,64,0.45)] backdrop-blur-[2px]"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent/10 text-accent">
                    <Icon className="h-4 w-4" aria-hidden strokeWidth={2.1} />
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-navy">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-[560px] lg:max-w-none">
            <div className="relative aspect-[1.5/1] overflow-hidden rounded-[22px] bg-[#e8dfd3] shadow-[0_28px_60px_-28px_rgba(10,22,64,0.45)]">
              <img
                src="/images/team.jpg"
                alt="Four diverse technology professionals collaborating around a laptop in a modern office."
                className="h-full w-full object-cover object-[center_28%]"
                width={1200}
                height={800}
                decoding="async"
                fetchPriority="high"
              />
            </div>

            {TAGS.map((tag) => (
              <span
                key={tag.label}
                className={cn(
                  'pointer-events-none absolute z-10 inline-flex items-center gap-2 rounded-full bg-accent px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-[0_10px_24px_-14px_rgba(17,72,215,0.8)]',
                  tag.className,
                )}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-white" aria-hidden />
                {tag.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
