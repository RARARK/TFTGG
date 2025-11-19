// src/components/ChampionAbilityPanel.tsx
import React from 'react'

// --- 타입 정의 ---
// 필요하면 프로젝트 전체 공유 타입 파일로 빼도 됨

export type AbilityVariable = {
  name: string
  value: number[]
}

export type ChampionAbility = {
  name: string
  desc: string
  icon?: string
  variables?: AbilityVariable[]
}

type VarRow = {
  name: string
  star1?: number
  star2?: number
  star3?: number
}

// --- 헬퍼 함수: value 배열에서 1/2/3성 값만 뽑기 ---
function getStars(value?: number[]): { star1?: number; star2?: number; star3?: number } {
  if (!Array.isArray(value)) return {}

  const star1 = value[1]
  const star2 = value[2]
  const star3 = value[3]

  return { star1, star2, star3 }
}

type Props = {
  ability: ChampionAbility
}

// --- 메인 컴포넌트 ---
export function ChampionAbilityPanel({ ability }: Props) {
  const variables = ability.variables ?? []

  // variables -> 테이블에 넣을 rows로 변환
  const rows: VarRow[] = variables.flatMap((v) => {
    if (!v || !v.name || !Array.isArray(v.value)) {
      return []
    }

    const { star1, star2, star3 } = getStars(v.value)

    // 셋 다 비어 있으면 굳이 보여줄 필요 없음
    if (star1 == null && star2 == null && star3 == null) {
      return []
    }

    return [
      {
        name: v.name,
        star1,
        star2,
        star3,
      },
    ]
  })

  return (
    <section className="mt-3 rounded-lg border border-slate-700 bg-slate-900/60 p-3 text-sm">
      <div className="mb-2 flex items-center gap-2">
        {ability.icon && (
          <img
            src={ability.icon}
            alt={ability.name}
            className="h-8 w-8 rounded"
          />
        )}
        <h3 className="text-slate-50 font-semibold">{ability.name}</h3>
      </div>

      {/* desc: CDragon에서 온 HTML 그대로 렌더 */}
      <div
        className="leading-relaxed text-xs text-slate-200 [&_br]:block"
        dangerouslySetInnerHTML={{ __html: ability.desc }}
      />

      {rows.length > 0 && (
        <div className="mt-3">
          <div className="mb-1 text-xs font-semibold text-slate-300">
            1 / 2 / 3성 수치
          </div>
          <table className="w-full border-separate border-spacing-y-1 text-[11px] text-slate-200">
            <tbody>
              {rows.map((row) => (
                <tr key={row.name}>
                  <td className="align-top pr-2 text-slate-400">{row.name}</td>
                  <td className="align-top">
                    {row.star1 ?? '-'} / {row.star2 ?? '-'} / {row.star3 ?? '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}


