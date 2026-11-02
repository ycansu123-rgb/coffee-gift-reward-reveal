import { useEffect, useMemo, useState } from "react";

export type RewardKind = "code" | "balance";

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
      Array.from({ length: 70 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 70 + Math.random() * 0.3;
        const r = 140 + Math.random() * 200;
        return {
          dx: `${Math.cos(a) * r}px`,
          dy: `${Math.sin(a) * r + 160}px`,
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
    <div className="pointer-events-none absolute left-1/2 top-[38%]">
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

function Sparkles() {
  const s = useMemo(
    () =>
      Array.from({ length: 14 }, () => ({
        x: 10 + Math.random() * 80,
        y: 8 + Math.random() * 60,
        d: Math.random() * 2,
        size: 6 + Math.random() * 10,
      })),
    [],
  );
  return (
    <>
      {s.map((p, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="pointer-events-none absolute fill-brand-gold"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            animation: `rw-twinkle 1.8s ease-in-out ${p.d}s infinite`,
            transform: "scale(0)",
          }}
        >
          <path d="M12 0l2.5 9.5L24 12l-9.5 2.5L12 24l-2.5-9.5L0 12l9.5-2.5z" />
        </svg>
      ))}
    </>
  );
}

function Stage({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-64 w-full items-center justify-center">
      <div
        className="absolute h-[420px] w-[420px] opacity-60"
        style={{
          background:
            "repeating-conic-gradient(from 0deg, color-mix(in oklab, var(--brand-gold) 55%, transparent) 0deg 8deg, transparent 8deg 24deg)",
          maskImage: "radial-gradient(circle, black 15%, transparent 65%)",
          animation: "rw-rays 18s linear infinite, rw-fade .8s ease .5s both",
        }}
      />
      <div
        className="absolute h-40 w-40 rounded-full"
        style={{
          background: "radial-gradient(circle, var(--brand-cream), transparent 70%)",
          animation: "rw-burst 1s ease-out .55s both",
        }}
      />
      <div className="absolute h-44 w-44 rounded-full bg-brand-pink/40 blur-3xl" />
      {children}
    </div>
  );
}

function GiftBox() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 900);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="relative" style={{ animation: "rw-pop .6s cubic-bezier(.3,1.5,.5,1) both" }}>
      {/* Card revealed from box */}
      <div
        className="absolute left-1/2 top-0 z-0 flex h-28 w-44 -translate-x-1/2 flex-col justify-between overflow-hidden rounded-2xl bg-brand-gradient p-3 text-brand-cream shadow-glow transition-all duration-700 ease-out"
        style={{
          transform: open ? "translate(-50%, -70px) rotate(-4deg)" : "translate(-50%, 30px) scale(.6)",
          opacity: open ? 1 : 0,
        }}
      >
        <div className="flex items-center justify-between text-[10px] font-bold tracking-widest">
          <span>iCLUB</span>
          <span>DİJİTAL KOD</span>
        </div>
        <div className="font-mono text-xs tracking-[0.25em] opacity-90">•••• •••• 7K2Q</div>
        <span
          className="absolute inset-y-0 left-0 w-1/3 bg-brand-cream/40"
          style={{ animation: "rw-shine 1.4s ease-in-out 1.6s 2" }}
        />
      </div>
      {/* Box */}
      <div className="relative z-10 mt-10" style={{ animation: open ? undefined : "rw-shake .3s ease 3" }}>
        <div
          className="relative mx-auto h-8 w-40 rounded-lg bg-brand-pink shadow-card"
          style={{ animation: open ? "rw-lid .7s ease-out forwards" : undefined }}
        >
          <div className="absolute inset-y-0 left-1/2 w-6 -translate-x-1/2 bg-brand-gold" />
          <div className="absolute -top-6 left-1/2 flex -translate-x-1/2 gap-1">
            <span className="h-7 w-9 rotate-[-25deg] rounded-full border-[6px] border-brand-gold" />
            <span className="h-7 w-9 rotate-[25deg] rounded-full border-[6px] border-brand-gold" />
          </div>
        </div>
        <div className="relative mx-auto h-24 w-36 rounded-b-2xl bg-brand-purple shadow-card">
          <div className="absolute inset-y-0 left-1/2 w-6 -translate-x-1/2 bg-brand-gold" />
          <div className="absolute inset-x-0 top-0 h-3 bg-brand-purple-deep/40" />
        </div>
      </div>
    </div>
  );
}

function BalanceCard({ amount }: { amount: number }) {
  const coins = useMemo(
    () => Array.from({ length: 9 }, (_, i) => ({ x: -70 + i * 17, d: 0.7 + i * 0.12 })),
    [],
  );
  return (
    <div className="relative" style={{ animation: "rw-pop .6s cubic-bezier(.3,1.5,.5,1) both" }}>
      {coins.map((c, i) => (
        <span
          key={i}
          className="absolute left-1/2 top-6 z-20 grid h-8 w-8 place-items-center rounded-full bg-gold-gradient text-xs font-extrabold text-brand-purple-deep opacity-0 shadow-card"
          style={{ marginLeft: c.x, animation: `rw-coin 1s ease-in ${c.d}s forwards` }}
        >
          ₺
        </span>
      ))}
      <div className="relative z-10 h-36 w-60 overflow-hidden rounded-3xl bg-brand-gradient p-4 text-brand-cream shadow-glow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold tracking-widest">iWallet</span>
          <span className="rounded-full bg-brand-cream/25 px-2 py-0.5 text-[10px] font-bold">Ödül Bakiyesi</span>
        </div>
        <div className="mt-5 text-[10px] font-semibold opacity-80">Güncel bakiye</div>
        <Counter to={amount + 85} from={85} delay={900} className="text-3xl font-extrabold tabular-nums" suffix=" TL" />
        <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-brand-cream/15" />
        <span
          className="absolute inset-y-0 left-0 w-1/3 bg-brand-cream/35"
          style={{ animation: "rw-shine 1.4s ease-in-out 2s 2" }}
        />
      </div>
    </div>
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

export function RewardCelebration({
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
        className="absolute inset-0 bg-brand-purple-deep/70 backdrop-blur-md"
        style={{ animation: "rw-fade .4s ease both" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 50% 38%, color-mix(in oklab, var(--brand-pink) 45%, transparent), transparent 60%)",
          animation: "rw-fade .8s ease .3s both",
        }}
      />
      <Sparkles />
      <Confetti delay={isCode ? 1 : 0.6} />

      <div className="relative w-full">
        <Stage>{isCode ? <GiftBox /> : <BalanceCard amount={amount} />}</Stage>

        <div style={{ animation: "rw-rise .5s ease 1.1s both" }}>
          <div className="text-xs font-extrabold tracking-[0.3em] text-brand-gold">
            🎉 {isCode ? "ÖDÜLÜNÜ KAZANDIN!" : "BAKİYEN ARTTI!"}
          </div>
        </div>
        <div style={{ animation: "rw-pop .6s cubic-bezier(.3,1.5,.5,1) 1.25s both" }}>
          <Counter
            to={amount}
            delay={1300}
            duration={900}
            suffix=" TL"
            className="mt-1 text-6xl font-extrabold tabular-nums text-gold-gradient drop-shadow-lg"
          />
        </div>
        <div style={{ animation: "rw-rise .5s ease 1.5s both" }}>
          <div className="text-lg font-bold text-brand-cream">
            {isCode ? "Dijital Kod Ödülü" : "Ödül Bakiyesi"}
          </div>
          <div className="mx-auto mt-3 inline-flex items-center gap-2 rounded-full bg-brand-cream/15 px-4 py-1.5 text-xs font-semibold text-brand-cream">
            <span className="grid h-4 w-4 place-items-center rounded-full bg-brand-gold text-[10px] text-brand-purple-deep">✓</span>
            {isCode ? "Dijital kodun hesabına tanımlandı" : "Bakiyene başarıyla eklendi!"}
          </div>
        </div>
        <div className="mt-7 space-y-2" style={{ animation: "rw-rise .5s ease 1.8s both" }}>
          <button
            onClick={onClose}
            className="relative w-full overflow-hidden rounded-2xl bg-brand-cream py-3.5 text-sm font-extrabold text-brand-purple shadow-glow transition active:scale-95"
          >
            {isCode ? "Ödülümü Görüntüle" : "Harika!"}
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
