import { useEffect, useMemo, useState } from "react";
import type { RewardKind } from "@/components/RewardCelebration";

function Particles() {
  const dots = useMemo(
    () =>
      Array.from({ length: 26 }, () => ({
        x: Math.random() * 100,
        size: 2 + Math.random() * 4,
        d: Math.random() * 6,
        dur: 5 + Math.random() * 7,
        o: 0.25 + Math.random() * 0.5,
      })),
    [],
  );
  return (
    <>
      {dots.map((p, i) => (
        <span
          key={i}
          className="pointer-events-none absolute bottom-0 rounded-full bg-brand-cream"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            opacity: 0,
            animation: `st-particle ${p.dur}s linear ${p.d}s infinite`,
            ["--o" as string]: p.o,
          }}
        />
      ))}
    </>
  );
}

function Counter({
  from = 0,
  to,
  delay = 0,
  duration = 1300,
  className,
  suffix = "",
}: {
  from?: number;
  to: number;
  delay?: number;
  duration?: number;
  className?: string;
  suffix?: string;
}) {
  const [v, setV] = useState(from);
  useEffect(() => {
    let raf = 0;
    const start = performance.now() + delay;
    const tick = (t: number) => {
      const p = Math.min(1, Math.max(0, (t - start) / duration));
      setV(Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [from, to, delay, duration]);
  return (
    <div className={className}>
      {v}
      {suffix}
    </div>
  );
}

function PremiumCard({ kind, amount }: { kind: RewardKind; amount: number }) {
  const isCode = kind === "code";
  return (
    <div style={{ perspective: "900px" }}>
      <div
        className="relative mx-auto h-52 w-full max-w-[300px] overflow-hidden rounded-[28px] p-5 text-left text-brand-cream"
        style={{
          background:
            "linear-gradient(140deg, color-mix(in oklab, var(--brand-purple-deep) 88%, black), var(--brand-purple) 55%, var(--brand-pink))",
          boxShadow:
            "0 30px 60px -20px color-mix(in oklab, var(--brand-purple-deep) 80%, transparent), 0 0 80px -10px color-mix(in oklab, var(--brand-pink) 55%, transparent)",
          animation: "st-card-in 1s cubic-bezier(.2,1.2,.35,1) .35s both, st-card-tilt 7s ease-in-out 1.5s infinite",
          transformStyle: "preserve-3d",
        }}
      >
        {/* metallic shine sweep */}
        <span
          className="absolute inset-y-0 left-0 w-1/3 bg-brand-cream/25"
          style={{ animation: "rw-shine 1.6s ease-in-out 1.6s 2" }}
        />
        {/* decorative orbs */}
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-brand-pink/40 blur-2xl" />
        <div className="absolute -bottom-14 -left-10 h-36 w-36 rounded-full bg-brand-orange/30 blur-2xl" />

        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-extrabold tracking-[0.25em]">iCLUB</span>
            <span className="rounded-full border border-brand-cream/40 px-2.5 py-1 text-[9px] font-bold tracking-widest">
              {isCode ? "DİJİTAL KOD" : "ÖDÜL BAKİYESİ"}
            </span>
          </div>

          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.3em] opacity-75">
              {isCode ? "Hediye kodun" : "Kazandığın tutar"}
            </div>
            <Counter
              to={amount}
              delay={1100}
              duration={1100}
              suffix=" TL"
              className="mt-0.5 text-5xl font-extrabold tabular-nums text-gold-gradient drop-shadow"
            />
          </div>

          <div className="flex items-end justify-between">
            {isCode ? (
              <div className="font-mono text-sm font-bold tracking-[0.22em]">ICLB-7K2Q-200</div>
            ) : (
              <div className="text-xs font-bold">iWallet'a anında aktarıldı</div>
            )}
            {/* chip */}
            <div className="grid h-8 w-11 grid-cols-2 gap-px overflow-hidden rounded-md border border-brand-gold/70 bg-brand-gold/25 p-1">
              <span className="rounded-sm bg-brand-gold/60" />
              <span className="rounded-sm bg-brand-gold/60" />
              <span className="rounded-sm bg-brand-gold/60" />
              <span className="rounded-sm bg-brand-gold/60" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RewardStage({
  kind,
  amount,
  onClose,
}: {
  kind: RewardKind;
  amount: number;
  onClose: () => void;
}) {
  const isCode = kind === "code";
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* animated brand gradient backdrop */}
      <div
        className="absolute inset-[-40%]"
        style={{
          background:
            "conic-gradient(from 0deg at 50% 50%, var(--brand-purple-deep), var(--brand-purple), var(--brand-pink), var(--brand-orange), var(--brand-pink), var(--brand-purple), var(--brand-purple-deep))",
          animation: "st-gradient 14s linear infinite",
          filter: "saturate(1.1)",
        }}
      />
      <div className="absolute inset-0 bg-brand-purple-deep/35" />
      {/* soft vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, transparent 30%, color-mix(in oklab, var(--brand-purple-deep) 75%, transparent) 100%)",
        }}
      />
      <Particles />

      <div className="relative flex w-full flex-col items-center">
        <div style={{ animation: "rw-rise .5s ease .2s both" }}>
          <div className="text-[11px] font-extrabold tracking-[0.4em] text-brand-cream/90">
            TEBRİKLER
          </div>
          <div className="mt-1 text-2xl font-extrabold text-brand-cream drop-shadow">
            Ödülün Hazır
          </div>
        </div>

        <div className="my-8 w-full">
          <PremiumCard kind={kind} amount={amount} />
        </div>

        <div style={{ animation: "rw-rise .5s ease 1.4s both" }}>
          <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-brand-cream/15 px-4 py-1.5 text-xs font-semibold text-brand-cream backdrop-blur-sm">
            <span className="grid h-4 w-4 place-items-center rounded-full bg-brand-gold text-[10px] text-brand-purple-deep">✓</span>
            {isCode ? "Dijital kodun hesabına tanımlandı" : "Ödül bakiyen başarıyla eklendi"}
          </div>
        </div>

        <div className="mt-8 w-full space-y-2" style={{ animation: "rw-rise .5s ease 1.7s both" }}>
          <button
            onClick={onClose}
            className="w-full rounded-2xl bg-brand-cream py-3.5 text-sm font-extrabold text-brand-purple transition active:scale-95"
            style={{
              boxShadow:
                "0 15px 40px -10px color-mix(in oklab, var(--brand-purple-deep) 70%, transparent)",
            }}
          >
            {isCode ? "Kodumu Görüntüle" : "Ödüllerime Dön"}
          </button>
          {isCode && (
            <button onClick={onClose} className="w-full py-2 text-xs font-semibold text-brand-cream/85">
              Daha sonra
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
