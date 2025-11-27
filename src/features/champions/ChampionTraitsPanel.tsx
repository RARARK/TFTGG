// src/features/champions/ChampionTraitsPanel.tsx
import type { Champion } from './types'

interface ChampionTraitsPanelProps {
  champ: Champion
}

export function ChampionTraitsPanel({ champ }: ChampionTraitsPanelProps) {
  const { name, traits, cost, role, icon } = champ

  return (
    <section className="mb-4 rounded-lg border border-slate-700 bg-slate-900/60 p-3 flex items-center gap-4">
      {/* 아이콘 */}
      {icon && (
        <img
          src={icon}
          alt={name}
          className="h-120 w-60 rounded-md object-contain"
        />
      )}

      <div className="flex-1">
        {/* 이름 + 코스트 + 역할 */}
        <div className="flex items-baseline gap-2">
          <h1 className="text-xl font-bold text-slate-50">{name}</h1>
          {role && (
            <span className="text-xs text-slate-400">
              ({role})
            </span>
          )}
        </div>

        <div className="text-sm text-slate-300 mt-2 mb-3">cost {cost}</div>

        {/* traits 배지 */}
        <div className="mt-2 flex flex-wrap gap-2">
          {traits.map((t) => (
            <span
              key={t}
              className="rounded-full bg-slate-800/80 px-2 py-0.5 text-xs text-slate-200"
            >
            {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
