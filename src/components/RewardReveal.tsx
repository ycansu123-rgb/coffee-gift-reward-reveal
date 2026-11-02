import { useEffect, useMemo, useState } from "react";
import type { RewardKind } from "@/components/RewardCelebration";

const CONFETTI_COLORS = [
  "var(--brand-purple)",
  "var(--brand-pink)",
  "var(--brand-orange)",
  "var(--brand-gold)",
  "var(--brand-cream)",
];

function Confetti({ delay }: { delay: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 80 + Math.random() * 0.3;
        const r = 130 + Math.random() * 220;
        return {
          dx: `${Math.cos(a) * r}px`,
          dy: `${Math.sin(a) * r + 140}px`,
          rot: `${Math.random() * 720 - 360}deg`,
          color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          w: 5 + Math.random() * 6,
          h: 8 + Math.random() * 8,
          round: i % 3 === 0,
          d: delay + Math.random() * 0.25,
        };
      }),
    [delay],
  );
  return (
    <div className="pointer-events-none absolute left-1/2 top-[36%]">
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
              animation: `rw-confetti 1.8s cubic-bezier(.15,.7,.35,1) ${p.d}s forwards`,
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
  duration = 1100,
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

function BigGiftBox({ kind }: { kind: RewardKind }) {
  // phases: 0 floating, 1 anticipation shake, 2 open
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1100);
    const t2 = setTimeout(() => setPhase(2), 1900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);
  const open = phase >= 2;
  const isCode = kind === "code";

  return (
    <div className="relative flex h-72 w-full items-center justify-center" style={{ perspective: "800px" }}>
      {/* floor shadow */}
      <div
        className="absolute bottom-8 h-5 w-44 rounded-full bg-brand-purple-deep/40 blur-md"
        style={{ animation: "rv-shadow 2.2s ease-in-out infinite" }}
      />
      {/* glow that intensifies before opening */}
      <div
        className="absolute h-52 w-52 rounded-full bg-brand-pink/40 blur-3xl"
        style={{
          animation: open ? "rw-burst 1s ease-out both" : "rv-glow 1.9s ease-in-out both",
        }}
      />

      <div
        className="relative"
        style={{
          animation: open
            ? "rw-pop .5s cubic-bezier(.3,1.6,.5,1) both"
            : phase === 1
              ? "rv-anticipate .8s ease-in-out both"
              : "rv-float 2.2s ease-in-out infinite",
          transformStyle: "preserve-3d",
        }}
      >
        {/* reward card rising from the box */}
        <div
          className="absolute left-1/2 top-0 z-0 flex h-32 w-52 -translate-x-1/2 flex-col justify-between overflow-hidden rounded-2xl bg-brand-gradient p-3.5 text-brand-cream shadow-glow transition-all duration-700 ease-out"
          style={{
            transform: open
              ? "translate(-50%, -96px) rotate(-5deg) rotateY(8deg)"
              : "translate(-50%, 40px) scale(.55)",
            opacity: open ? 1 : 0,
          }}
        >
          <div className="flex items-center justify-between text-[10px] font-bold tracking-widest">
            <span>iCLUB</span>
            <span>{isCode ? "DİJİTAL KOD" : "ÖDÜL BAKİYESİ"}</span>
          </div>
          {isCode ? (
            <div className="font-mono text-sm font-bold tracking-[0.22em]">ICLB-7K2Q-200</div>
          ) : (
            <div className="text-xs font-bold">iWallet bakiyene eklendi</div>
          )}
          <div className="flex items-center justify-between text-[10px] font-semibold opacity-85">
            <span>{isCode ? "Amazon'da geçerli" : "Anında kullanılabilir"}</span>
            <span>★</span>
          </div>
          <span
            className="absolute inset-y-0 left-0 w-1/3 bg-brand-cream/40"
            style={{ animation: "rw-shine 1.4s ease-in-out 2.4s 2" }}
          />
        </div>

        {/* box body */}
        <div className="relative z-10 mt-14">
          {/* lid */}
          <div
            className="relative mx-auto h-10 w-48 rounded-xl bg-brand-pink shadow-card"
            style={{
              animation: open
                ? "rv-lid-fly .8s cubic-bezier(.3,.8,.4,1) forwards"
                : phase === 1
                  ? "rv-lid-rattle .8s ease-in-out both"
                  : undefined,
            }}
          >
            <div className="absolute inset-y-0 left-1/2 w-7 -translate-x-1/2 bg-brand-gold" />
            {/* bow */}
            <div className="absolute -top-7 left-1/2 flex -translate-x-1/2 gap-1">
              <span className="h-8 w-10 rotate-[-25deg] rounded-full border-[7px] border-brand-gold" />
              <span className="h-8 w-10 rotate-[25deg] rounded-full border-[7px] border-brand-gold" />
            </div>
          </div>
          {/* base */}
          <div className="relative mx-auto h-32 w-44 overflow-hidden rounded-b-3xl bg-brand-purple shadow-card">
            <div className="absolute inset-y-0 left-1/2 w-7 -translate-x-1/2 bg-brand-gold" />
            <div className="absolute inset-x-0 top-0 h-3.5 bg-brand-purple-deep/40" />
            {/* inner light spilling out when open */}
            <div
              className="absolute inset-x-0 top-0 h-10 transition-opacity duration-500"
              style={{
                opacity: open ? 1 : 0,
                background:
                  "linear-gradient(to bottom, var(--brand-gold), transparent)",
              }}
            />
          </div>
        </div>
      </div>

      {open && <Confetti delay={0.1} />}
    </div>
  );
}

export function RewardReveal({
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
        className="absolute inset-0 bg-brand-purple-deep/75 backdrop-blur-md"
        style={{ animation: "rw-fade .4s ease both" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 36%, color-mix(in oklab, var(--brand-pink) 50%, transparent), transparent 62%)",
          animation: "rw-fade .8s ease .3s both",
        }}
      />

      <div className="relative w-full">
        <div style={{ animation: "rw-rise .5s ease .15s both" }}>
          <div className="text-xs font-extrabold tracking-[0.35em] text-brand-gold">
            🎁 SÜRPRİZ ÖDÜL
          </div>
        </div>

        <BigGiftBox kind={kind} />

        <div style={{ animation: "rw-pop .6s cubic-bezier(.3,1.5,.5,1) 2.1s both" }}>
          <Counter
            to={amount}
            delay={2200}
            duration={900}
            suffix=" TL"
            className="text-6xl font-extrabold tabular-nums text-gold-gradient drop-shadow-lg"
          />
        </div>
        <div style={{ animation: "rw-rise .5s ease 2.4s both" }}>
          <div className="mt-1 text-lg font-bold text-brand-cream">
            {isCode ? "Dijital Kod Ödülü" : "Ödül Bakiyesi"}
          </div>
          <div className="mx-auto mt-3 inline-flex items-center gap-2 rounded-full bg-brand-cream/15 px-4 py-1.5 text-xs font-semibold text-brand-cream">
            <span className="grid h-4 w-4 place-items-center rounded-full bg-brand-gold text-[10px] text-brand-purple-deep">✓</span>
            {isCode ? "Kodun kutudan çıktı, hesabında!" : "Bakiyen kutudan hesabına düştü!"}
          </div>
        </div>
        <div className="mt-7 space-y-2" style={{ animation: "rw-rise .5s ease 2.7s both" }}>
          <button
            onClick={onClose}
            className="relative w-full overflow-hidden rounded-2xl bg-brand-cream py-3.5 text-sm font-extrabold text-brand-purple shadow-glow transition active:scale-95"
          >
            {isCode ? "Ödülümü Görüntüle" : "Süper!"}
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
