import React, { useMemo, useState } from "react";

/**
 * TFT-style Card components for a React project.
 * - <TftCardTailwind />: TailwindCSS version (with hover/shine, star accent, stat icons)
 * - <TftCardCSS />: Pure CSS version (same effects, no Tailwind)
 * - <TftCardDemo />: Toggle to compare
 */

// ------- Shared Types -------
export type TftCardProps = {
  name: string;
  stars?: 1 | 2 | 3;
  cost?: 1 | 2 | 3 | 4 | 5 | 6;
  traits?: string[];
  imgUrl: string;
  desc?: string;
  stats?: {
    hp?: number;
    atk?: number;
    armor?: number;
    ap?: number;
    speed?: number;
  };
};

// Small helper to map cost to a rare-ish accent for borders/glow
const costAccent = (cost: number | undefined) => {
  switch (cost) {
    case 1:
      return { ring: "ring-gray-300", glow: "shadow-gray-500/30" };
    case 2:
      return { ring: "ring-green-300", glow: "shadow-green-500/30" };
    case 3:
      return { ring: "ring-blue-300", glow: "shadow-blue-500/30" };
    case 4:
      return { ring: "ring-purple-300", glow: "shadow-purple-500/30" };
    case 5:
      return { ring: "ring-yellow-300", glow: "shadow-yellow-500/30" };
    case 6:
      return { ring: "ring-rose-300", glow: "shadow-rose-500/30" };
    default:
      return { ring: "ring-slate-300", glow: "shadow-slate-500/20" };
  }
};

const starClasses = (stars: number) => {
  // 별 개수에 따른 강조 색
  if (stars >= 3) return "text-amber-300 drop-shadow";
  if (stars === 2) return "text-sky-300";
  return "text-slate-300";
};

// ------- Inline SVG Icons (no external deps) -------
const HeartIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden fill="currentColor" {...props}>
    <path d="M12 21s-6.716-4.27-9.193-7.29C.33 11.1 1.1 7.9 3.807 6.6A4.8 4.8 0 0 1 12 8.2a4.8 4.8 0 0 1 8.193-1.6c2.707 1.3 3.478 4.5.999 7.11C18.716 16.73 12 21 12 21z"/>
  </svg>
);
const SwordIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden fill="currentColor" {...props}>
    <path d="M13.5 2l8.5 8.5-3 3L14 8.5 6.5 16l-2 4-2.5-2.5 4-2L13.5 2z"/>
  </svg>
);
const ShieldIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden fill="currentColor" {...props}>
    <path d="M12 2l8 3v6c0 5.25-3.438 9.938-8 11-4.562-1.062-8-5.75-8-11V5l8-3z"/>
  </svg>
);

// ------- Tailwind Version -------
export function TftCardTailwind({ name, stars = 1, cost = 1, traits = [], imgUrl, desc, stats = {} }: TftCardProps) {
  const accent = costAccent(cost);
  const starStr = "⭐".repeat(stars);

  return (
    <div
      className={`group relative max-w-xs rounded-2xl bg-slate-900 text-slate-100 p-3 ring-2 ${accent.ring} shadow-xl ${accent.glow} overflow-hidden transition-transform duration-300 will-change-transform hover:scale-[1.03]`}
    >
      {/* Moving shine bar */}
      <div className="pointer-events-none absolute -inset-16 -translate-x-full group-hover:translate-x-0 transition-transform duration-[1200ms]">
        <div className="absolute inset-y-0 -left-10 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Top badge row */}
      <div className="flex items-center justify-between text-xs mb-2">
        <span className="px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700">Cost {cost}</span>
        <span aria-label={`${stars} stars`} className={`font-semibold tracking-tight ${starClasses(stars)}`}>
          {starStr}
        </span>
      </div>

      {/* Artwork */}
      <div className="relative overflow-hidden rounded-xl">
        <img src={imgUrl} alt={name} className="block w-full h-44 object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
        <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between">
          <h2 className="text-lg font-bold drop-shadow-sm">{name}</h2>
          {traits?.length ? (
            <div className="flex gap-1 text-[10px]">
              {traits.map((t) => (
                <span
                  key={t}
                  className="px-1.5 py-0.5 rounded bg-slate-900/80 border border-slate-700 whitespace-nowrap"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* Description */}
      {desc ? (
        <p className="mt-3 text-sm text-slate-300 leading-snug">{desc}</p>
      ) : null}

      {/* Stats */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
        {typeof stats.hp !== "undefined" && (
          <div className="rounded-lg bg-slate-800/70 border border-slate-700 p-2">
            <div className="flex items-center justify-center gap-1 text-slate-400"><HeartIcon /> HP</div>
            <div className="text-base font-semibold">{stats.hp}</div>
          </div>
        )}
        {typeof stats.atk !== "undefined" && (
          <div className="rounded-lg bg-slate-800/70 border border-slate-700 p-2">
            <div className="flex items-center justify-center gap-1 text-slate-400"><SwordIcon /> ATK</div>
            <div className="text-base font-semibold">{stats.atk}</div>
          </div>
        )}
        {typeof stats.armor !== "undefined" && (
          <div className="rounded-lg bg-slate-800/70 border border-slate-700 p-2">
            <div className="flex items-center justify-center gap-1 text-slate-400"><ShieldIcon /> ARMOR</div>
            <div className="text-base font-semibold">{stats.armor}</div>
          </div>
        )}
        {typeof stats.ap !== "undefined" && (
          <div className="rounded-lg bg-slate-800/70 border border-slate-700 p-2">
            <div className="text-slate-400">AP</div>
            <div className="text-base font-semibold">{stats.ap}</div>
          </div>
        )}
        {typeof stats.speed !== "undefined" && (
          <div className="rounded-lg bg-slate-800/70 border border-slate-700 p-2">
            <div className="text-slate-400">SPD</div>
            <div className="text-base font-semibold">{stats.speed}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ------- Pure CSS Version -------
export function TftCardCSS({ name, stars = 1, cost = 1, traits = [], imgUrl, desc, stats = {} }: TftCardProps) {
  const starStr = "⭐".repeat(stars);
  const ringColor = useMemo(() => {
    switch (cost) {
      case 1:
        return "#CBD5E1"; // slate-300
      case 2:
        return "#86EFAC"; // green-300
      case 3:
        return "#93C5FD"; // blue-300
      case 4:
        return "#D8B4FE"; // purple-300
      case 5:
        return "#FDE68A"; // yellow-300
      case 6:
        return "#FDA4AF"; // rose-300
      default:
        return "#CBD5E1";
    }
  }, [cost]);

  const starColor = useMemo(() => (stars >= 3 ? "#FCD34D" : stars === 2 ? "#7DD3FC" : "#CBD5E1"), [stars]);

  return (
    <div className="tftcss-card" data-cost={cost}>
      <style>{`
        .tftcss-card {
          position: relative;
          max-width: 20rem; /* ~320px */
          border-radius: 1rem;
          background: #0f172a; /* slate-900 */
          color: #e2e8f0; /* slate-200 */
          padding: 0.75rem;
          box-shadow: 0 20px 45px rgba(2, 6, 23, 0.5);
          outline: 2px solid ${ringColor};
          overflow: hidden;
          transform: translateZ(0);
          transition: transform .3s ease;
        }
        .tftcss-card:hover { transform: scale(1.03); }

        /* Shine effect */
        .tftcss-card::before {
          content: "";
          position: absolute; inset: -30% -50%;
          background: linear-gradient(105deg, transparent 0%, rgba(255,255,255,.18) 45%, rgba(255,255,255,.18) 55%, transparent 100%);
          transform: translateX(-100%) skewX(-12deg);
          transition: transform 1.2s ease;
          pointer-events: none;
        }
        .tftcss-card:hover::before { transform: translateX(100%) skewX(-12deg); }

        .tftcss-row { display: flex; align-items: center; justify-content: space-between; font-size: 0.75rem; margin-bottom: 0.5rem; }
        .tftcss-badge { padding: 0.125rem 0.5rem; border-radius: 9999px; background: rgba(15, 23, 42, 0.8); border: 1px solid #334155; }
        .tftcss-stars { font-weight: 700; color: ${starColor}; }

        .tftcss-art { position: relative; overflow: hidden; border-radius: 0.75rem; height: 11rem; }
        .tftcss-art img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .3s ease; }
        .tftcss-card:hover .tftcss-art img { transform: scale(1.05); }
        .tftcss-art::after { content: ""; position: absolute; inset: 0; background: linear-gradient(to top, rgba(15,23,42,.8), transparent); pointer-events: none; }
        .tftcss-artbar { position: absolute; left: .5rem; right: .5rem; bottom: .5rem; display: flex; align-items: flex-end; justify-content: space-between; }
        .tftcss-name { font-weight: 800; font-size: 1.125rem; text-shadow: 0 1px 1px rgba(0,0,0,.3); }
        .tftcss-traits { display: flex; gap: .25rem; }
        .tftcss-chip { font-size: 0.625rem; background: rgba(2,6,23,.8); border: 1px solid #334155; padding: .125rem .375rem; border-radius: .375rem; white-space: nowrap; }
        .tftcss-desc { margin-top: .75rem; font-size: .875rem; color: #cbd5e1; line-height: 1.35; }
        .tftcss-stats { margin-top: .75rem; display: grid; grid-template-columns: repeat(3, 1fr); gap: .5rem; }
        .tftcss-stat { text-align: center; background: rgba(30, 41, 59, 0.7); border: 1px solid #334155; border-radius: .5rem; padding: .5rem; }
        .tftcss-k { color: #94a3b8; font-size: .75rem; display: inline-flex; align-items: center; gap: .25rem; }
        .tftcss-v { font-weight: 700; font-size: 1rem; }
        .tftcss-ico { width: 16px; height: 16px; display: inline-block; }
      `}</style>

      <div className="tftcss-row">
        <span className="tftcss-badge">Cost {cost}</span>
        <span className="tftcss-stars" aria-label={`${stars} stars`}>{starStr}</span>
      </div>

      <div className="tftcss-art">
        <img src={imgUrl} alt={name} />
        <div className="tftcss-artbar">
          <div className="tftcss-name">{name}</div>
          {!!traits?.length && (
            <div className="tftcss-traits">
              {traits.map((t) => (
                <span className="tftcss-chip" key={t}>{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {desc && <p className="tftcss-desc">{desc}</p>}

      <div className="tftcss-stats">
        {typeof stats.hp !== "undefined" && (
          <div className="tftcss-stat">
            <div className="tftcss-k">
              {/* Heart */}
              <svg className="tftcss-ico" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-6.716-4.27-9.193-7.29C.33 11.1 1.1 7.9 3.807 6.6A4.8 4.8 0 0 1 12 8.2a4.8 4.8 0 0 1 8.193-1.6c2.707 1.3 3.478 4.5.999 7.11C18.716 16.73 12 21 12 21z"/></svg>
              HP
            </div>
            <div className="tftcss-v">{stats.hp}</div>
          </div>
        )}
        {typeof stats.atk !== "undefined" && (
          <div className="tftcss-stat">
            <div className="tftcss-k">
              {/* Sword */}
              <svg className="tftcss-ico" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 2l8.5 8.5-3 3L14 8.5 6.5 16l-2 4-2.5-2.5 4-2L13.5 2z"/></svg>
              ATK
            </div>
            <div className="tftcss-v">{stats.atk}</div>
          </div>
        )}
        {typeof stats.armor !== "undefined" && (
          <div className="tftcss-stat">
            <div className="tftcss-k">
              {/* Shield */}
              <svg className="tftcss-ico" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l8 3v6c0 5.25-3.438 9.938-8 11-4.562-1.062-8-5.75-8-11V5l8-3z"/></svg>
              ARMOR
            </div>
            <div className="tftcss-v">{stats.armor}</div>
          </div>
        )}
        {typeof stats.ap !== "undefined" && (
          <div className="tftcss-stat"><div className="tftcss-k">AP</div><div className="tftcss-v">{stats.ap}</div></div>
        )}
        {typeof stats.speed !== "undefined" && (
          <div className="tftcss-stat"><div className="tftcss-k">SPD</div><div className="tftcss-v">{stats.speed}</div></div>
        )}
      </div>
    </div>
  );
}

// ------- Small Demo with toggle -------
export default function TftCardDemo() {
  const [useTailwind, setUseTailwind] = useState(true);

  const sample: TftCardProps = {
    name: "가렌",
    stars: 3,
    cost: 2,
    traits: ["Warlord", "Vanguard"],
    imgUrl: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=1200&auto=format&fit=crop",
    desc: "앞라인에서 버티는 탱커. 궁극기는 회오리베기!",
    stats: { hp: 800, atk: 55, armor: 40 }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-3 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={useTailwind} onChange={(e) => setUseTailwind(e.target.checked)} />
          Tailwind 버전 보기 (hover로 반짝임/확대 확인)
        </label>
      </div>

      {useTailwind ? <TftCardTailwind {...sample} /> : <TftCardCSS {...sample} />}
    </div>
  );
}
