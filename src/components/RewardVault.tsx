import { useEffect, useMemo, useState } from "react";
import type { RewardKind } from "@/components/RewardCelebration";

const CONFETTI_COLORS = [
  "var(--brand-gold)",
  "var(--brand-pink)",
  "var(--brand-orange)",
  "var(--brand-cream)",
  "var(--brand-purple)",
];

function Burst({ delay }: { delay: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 60 + Math.random() * 0.4;
        const r = 120 + Math.random() * 220;
        return {
          dx: `${Math.cos(a) * r}px`,
          dy: `${Math.sin(a) * r - 60}px`,
          rot: `${Math.random() * 720 - 360}deg`,
          color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          w: 4 + Math.random() * 6,
          h: 7 + Math.random() * 8,
          round: i % 3 === 0,
          d: delay + Math.random() * 0.3,
        };
      }),
    [delay],
  );
  return (
    <div className="pointer-events-none absolute left-1/2 top-[42%]">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="absolute block opacity-0"
          style={
            {
              width: p.w,
              height: p.round ? p.w : p.h,
              borderRadius: p.round ? 999 : 2,
              background: p.color,
              "--dx": p.dx,
              "--dy": p.dy,
              "--rot": p.rot,
              animation: `rw-confetti 1.9s cubic-bezier(.15,.7,.35,1) ${p.d}s forwards`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

function Counter({
  from = 0,
  to,
  delay = 0,
  duration = 1200,
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

function Vault({ kind, amount }: { kind: RewardKind; amount: number }) {
  // phases: 0 charge, 1 doors open, 2 reward out
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1700);
    const t2 = setTimeout(() => setPhase(2), 2350);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const open = phase >= 1;
  const isCode = kind === "code";

  return (
    <div className="relative flex h-72 w-full items-center justify-center">
      {/* energy rings while charging */}
      <div
        className="absolute h-64 w-64 rounded-full border-2 border-brand-gold/60"
        style={{ animation: "vc-ring 1.1s ease-out infinite" }}
      />
      <div
        className="absolute h-64 w-64 rounded-full border border-brand-pink/50"
        style={{ animation: "vc-ring 1.1s ease-out .35s infinite" }}
      />
      {/* inner light that grows while charging */}
      <div
        className="absolute h-40 w-40 rounded-full"
        style={{
          background:
            "radial-gradient(circle, var(--brand-gold), color-mix(in oklab, var(--brand-orange) 60%, transparent) 45%, transparent 70%)",
          animation: open ? "vc-core-open .8s ease-out both" : "vc-core 1.7s ease-in-out both",
        }}
      />

      {/* vault body */}
      <div
        className="relative z-10"
        style={{
          animation: open ? undefined : "vc-charge-shake .18s linear 1.1s 4",
          perspective: "700px",
        }}
      >
        <div className="relative h-44 w-56 overflow-hidden rounded-3xl border-4 border-brand-gold/80 bg-brand-purple-deep shadow-glow">
          {/* interior glow revealed when doors open */}
          <div
            className="absolute inset-0 transition-opacity duration-500"
            style={{
              opacity: open ? 1 : 0,
              background:
                "radial-gradient(circle at 50% 55%, var(--brand-gold), color-mix(in oklab, var(--brand-orange) 70%, var(--brand-purple-deep)) 55%, var(--brand-purple-deep) 90%)",
            }}
          />
          {/* light beams shooting out */}
          {open && (
            <>
              <span className="absolute left-1/2 top-1/2 h-[300px] w-10 -translate-x-1/2 -translate-y-1/2 rotate-[25deg] bg-brand-cream/50 blur-md" style={{ animation: "rw-fade .4s ease both" }} />
              <span className="absolute left-1/2 top-1/2 h-[300px] w-6 -translate-x-1/2 -translate-y-1/2 -rotate-[30deg] bg-brand-cream/40 blur-md" style={{ animation: "rw-fade .5s ease .1s both" }} />
            </>
          )}

          {/* reward content inside the vault */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-1 transition-all duration-700"
            style={{
              opacity: phase >= 2 ? 1 : 0,
              transform: phase >= 2 ? "translateY(0) scale(1)" : "translateY(24px) scale(.7)",
            }}
          >
            {isCode ? (
              <div className="rounded-xl bg-brand-purple-deep/80 px-4 py-2 text-center backdrop-blur-sm">
                <div className="text-[9px] font-bold tracking-[0.3em] text-brand-gold">DİJİTAL KOD</div>
                <div className="mt-1 font-mono text-sm font-bold tracking-[0.2em] text-brand-cream">ICLB-7K2Q-200</div>
              </div>
            ) : (
              <div className="rounded-xl bg-brand-purple-deep/80 px-4 py-2 text-center backdrop-blur-sm">
                <div className="text-[9px] font-bold tracking-[0.3em] text-brand-gold">iWALLET</div>
                <div className="mt-1 text-xs font-bold text-brand-cream">Bakiyene eklendi</div>
              </div>
            )}
          </div>

          {/* vault doors */}
          <div
            className="absolute inset-y-0 left-0 w-1/2 border-r-2 border-brand-gold/60 bg-gradient-to-br from-brand-purple to-brand-purple-deep transition-transform duration-700 ease-in"
            style={{
              transformOrigin: "left center",
              transform: open ? "rotateY(-105deg)" : "none",
            }}
          />
          <div
            className="absolute inset-y-0 right-0 w-1/2 border-l-2 border-brand-gold/60 bg-gradient-to-bl from-brand-purple to-brand-purple-deep transition-transform duration-700 ease-in"
            style={{
              transformOrigin: "right center",
              transform: open ? "rotateY(105deg)" : "none",
            }}
          />
          {/* dial */}
          <div
            className="absolute left-1/2 top-1/2 z-10 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-brand-gold bg-brand-purple-deep shadow-card transition-opacity duration-300"
            style={{ opacity: open ? 0 : 1 }}
          >
            <div
              className="h-10 w-10 rounded-full border-2 border-brand-gold/70"
              style={{
                background:
                  "conic-gradient(var(--brand-gold) 0deg 40deg, transparent 40deg 360deg)",
                animation: "vc-dial 1.6s cubic-bezier(.6,.05,.3,1) both",
              }}
            />
            <span className="absolute h-2 w-2 rounded-full bg-brand-gold" />
          </div>
        </div>
        {/* vault base */}
        <div className="mx-auto mt-1 h-3 w-64 rounded-full bg-brand-purple-deep/80" />
      </div>

      {open && <Burst delay={0.15} />}
      <span className="sr-only">{amount} TL ödül kasası açıldı</span>
    </div>
  );
}

export function RewardVault({
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
      <div
        className="absolute inset-0 bg-brand-purple-deep/85 backdrop-blur-md"
        style={{ animation: "rw-fade .4s ease both" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 42%, color-mix(in oklab, var(--brand-orange) 35%, transparent), transparent 65%)",
          animation: "rw-fade 1s ease .8s both",
        }}
      />

      <div className="relative w-full">
        <div style={{ animation: "rw-rise .5s ease .2s both" }}>
          <div className="mb-2 text-xs font-extrabold tracking-[0.35em] text-brand-gold">
            ÖDÜL KASASI
          </div>
        </div>

        <Vault kind={kind} amount={amount} />

        <div style={{ animation: "rw-pop .6s cubic-bezier(.3,1.5,.5,1) 2.5s both" }}>
          <Counter
            to={amount}
            delay={2600}
            duration={900}
            suffix=" TL"
            className="text-6xl font-extrabold tabular-nums text-gold-gradient drop-shadow-lg"
          />
        </div>
        <div style={{ animation: "rw-rise .5s ease 2.8s both" }}>
          <div className="mt-1 text-lg font-bold text-brand-cream">
            {isCode ? "Dijital Kod Ödülü" : "Ödül Bakiyesi"}
          </div>
          <div className="mx-auto mt-3 inline-flex items-center gap-2 rounded-full bg-brand-cream/15 px-4 py-1.5 text-xs font-semibold text-brand-cream">
            <span className="grid h-4 w-4 place-items-center rounded-full bg-brand-gold text-[10px] text-brand-purple-deep">✓</span>
            {isCode ? "Kodun kasadan çıktı, hesabına tanımlandı" : "Bakiyen kasadan hesabına aktarıldı"}
          </div>
        </div>
        <div className="mt-7 space-y-2" style={{ animation: "rw-rise .5s ease 3.1s both" }}>
          <button
            onClick={onClose}
            className="relative w-full overflow-hidden rounded-2xl bg-brand-cream py-3.5 text-sm font-extrabold text-brand-purple shadow-glow transition active:scale-95"
          >
            {isCode ? "Kodumu Görüntüle" : "Harika!"}
          </button>
          {isCode && (
            <button onClick={onClose} className="w-full py-2 text-xs font-semibold text-brand-cream/80">
              Daha sonra
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
