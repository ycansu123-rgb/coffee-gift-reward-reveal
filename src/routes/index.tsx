import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { RewardCelebration, type RewardKind } from "@/components/RewardCelebration";
import { RewardVault } from "@/components/RewardVault";
import { RewardReveal } from "@/components/RewardReveal";
import { RewardStage } from "@/components/RewardStage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "iClub – Ödül Kazanma Deneyimleri" },
      { name: "description", content: "iClub sadakat uygulaması için üç yaratıcı ödül kazanma konsepti: Ödül Kasası, Sürpriz Ödül ve Ödülün Sahnesi." },
      { property: "og:title", content: "iClub – Ödül Kazanma Deneyimleri" },
      { property: "og:description", content: "Dijital Kod ve Ödül Bakiyesi için üç farklı kutlama konsepti." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Reward = { id: string; brand: string; kind: RewardKind; title: string; desc: string; amount: number };
const REWARDS: Reward[] = [
  { id: "a", brand: "ESPRESSOLAB", kind: "balance", title: "Ödül Bakiyesi", desc: "EspressoLab'den 150 TL hediye", amount: 150 },
  { id: "b", brand: "amazon", kind: "code", title: "Dijital Kod", desc: "Amazon'da geçerli 200 TL hediye", amount: 200 },
];

type ConceptId = "vault" | "reveal" | "stage" | "classic";
const CONCEPTS: { id: ConceptId; label: string; hint: string }[] = [
  { id: "vault", label: "1 · Ödül Kasası", hint: "Enerji biriken kasa açılır, altın ışıklar saçılır" },
  { id: "reveal", label: "2 · Sürpriz Ödül", hint: "Hareketli hediye kutusu açılır, kart yükselir" },
  { id: "stage", label: "3 · Ödülün Sahnesi", hint: "Tam ekran premium sahne, 3D ödül kartı" },
  { id: "classic", label: "Mevcut Tasarım", hint: "Karşılaştırma için eski kutlama ekranı" },
];

function Index() {
  const [concept, setConcept] = useState<ConceptId>("vault");
  const [loading, setLoading] = useState<string | null>(null);
  const [active, setActive] = useState<Reward | null>(null);
  const [claimed, setClaimed] = useState<string[]>([]);

  const claim = (r: Reward) => {
    setLoading(r.id);
    setTimeout(() => {
      setLoading(null);
      setActive(r);
      setClaimed((c) => [...c, r.id]);
    }, 900);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-muted px-4 py-10 font-sans">
      <div className="text-center">
        <h1 className="text-2xl font-extrabold text-brand-purple-deep">Ödül Kazanma Deneyimi</h1>
        <p className="text-sm text-muted-foreground">Bir konsept seçin, sonra karttaki "Ödülünü Al" butonuna dokunun.</p>
        {claimed.length > 0 && (
          <button onClick={() => setClaimed([])} className="mt-2 text-xs font-bold text-brand-pink underline">
            Sıfırla
          </button>
        )}
      </div>

      <div className="grid w-full max-w-[380px] grid-cols-2 gap-2">
        {CONCEPTS.map((c) => (
          <button
            key={c.id}
            onClick={() => setConcept(c.id)}
            title={c.hint}
            className={`rounded-2xl px-3 py-2.5 text-left text-xs font-extrabold shadow-card transition active:scale-95 ${
              concept === c.id
                ? "bg-brand-gradient text-brand-cream"
                : "bg-background text-brand-purple-deep"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="relative h-[780px] w-[380px] overflow-hidden rounded-[48px] border-[10px] border-brand-purple-deep bg-brand-cream shadow-card">
        <div className="h-full overflow-y-auto">
          <div className="flex items-center justify-between px-6 pt-4 text-sm font-bold">
            <span>9:41</span>
            <span>●●● ▮</span>
          </div>
          <div className="relative flex items-center justify-center py-4">
            <span className="absolute left-5 grid h-10 w-10 place-items-center rounded-xl bg-background text-brand-purple shadow-card">←</span>
            <span className="text-lg font-extrabold">iClub</span>
          </div>

          <section className="mx-3 rounded-3xl bg-header-gradient p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-extrabold text-brand-purple-deep">Onur Yıldız</div>
                <div className="text-[11px] font-bold text-brand-orange">iClub Üyesi</div>
              </div>
              <div className="flex gap-1">
                <span className="rounded-full bg-brand-pink px-2 py-1 text-[10px] font-bold text-brand-cream">Ödüllerim</span>
                <span className="rounded-full bg-brand-orange px-2 py-1 text-[10px] font-bold text-brand-cream">iClub Nedir?</span>
              </div>
            </div>
            <div className="my-4 h-1.5 rounded-full bg-background/70">
              <div className="h-full w-1/2 rounded-full bg-brand-gradient" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {REWARDS.map((r) => {
                const done = claimed.includes(r.id);
                return (
                  <div
                    key={r.id}
                    className={`rounded-2xl p-3 text-center ${r.kind === "balance" ? "bg-brand-purple text-brand-cream" : "bg-background"}`}
                  >
                    <div className="text-xs font-extrabold tracking-wider">{r.brand}</div>
                    <div className="mt-1 text-sm font-extrabold">{r.title}</div>
                    <div className="mb-3 text-[10px] opacity-80">{r.desc}</div>
                    <button
                      disabled={!!loading || done}
                      onClick={() => claim(r)}
                      className="flex h-8 w-full items-center justify-center rounded-full bg-brand-cream text-xs font-bold text-brand-purple shadow-card transition active:scale-95 disabled:opacity-70"
                    >
                      {loading === r.id ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-purple border-t-transparent" />
                      ) : done ? (
                        "Alındı ✓"
                      ) : (
                        "Ödülünü Al"
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          <h2 className="px-5 pb-3 pt-6 text-lg font-extrabold">Görevlerini Tamamla</h2>
          {[
            ["iWallet uygulamasına 10 farklı gün giriş yap!", "+25 XP"],
            ["Puan Harca'da 100 ₺ değerinde harcama yap!", "+100 XP"],
            ["A101 veya CarrefourSA'da 1.000 ₺ alışveriş yap!", "+100 XP"],
          ].map(([t, x]) => (
            <div key={t} className="mx-4 mb-3 rounded-2xl bg-background p-4 shadow-card">
              <div className="text-sm font-bold">{t}</div>
              <div className="text-xs font-bold text-brand-pink">{x}</div>
            </div>
          ))}
        </div>

        {active && concept === "vault" && (
          <RewardVault key={active.id} kind={active.kind} amount={active.amount} onClose={() => setActive(null)} />
        )}
        {active && concept === "reveal" && (
          <RewardReveal key={active.id} kind={active.kind} amount={active.amount} onClose={() => setActive(null)} />
        )}
        {active && concept === "stage" && (
          <RewardStage key={active.id} kind={active.kind} amount={active.amount} onClose={() => setActive(null)} />
        )}
        {active && concept === "classic" && (
          <RewardCelebration key={active.id} kind={active.kind} amount={active.amount} onClose={() => setActive(null)} />
        )}
      </div>
    </main>
  );
}
