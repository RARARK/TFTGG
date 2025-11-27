import type {ChampionAbility} from './types';
import type {AbilityVariable} from './types';

interface ChampionAbilitypanelprops {
  ability: ChampionAbility
}


// --- 헬퍼 함수: value 배열에서 1/2/3성 값만 뽑기 ---
function getStars(value?: number[]): { star1?: string; star2?: string; star3?: string } {
  if (!Array.isArray(value)) return {}

  const star1 = value[1].toFixed(2)
  const star2 = value[2].toFixed(2)
  const star3 = value[3].toFixed(2)

  return { star1, star2, star3 }
}


// --- 메인 컴포넌트 ---
export function ChampionAbilityPanel({ability}: ChampionAbilitypanelprops) {

  const {name, icon, desc, variables} = ability
  

 // 테이블에 넣기 편하도록 가공
  const rows = variables.map((v: AbilityVariable) => {
    const { star1, star2, star3 } = getStars(v.value)
    return {
      name: v.name,
      star1,
      star2,
      star3,
    }
  })


  return (
    <section className="mt-3 rounded-lg border border-slate-700 bg-slate-900/60 p-3 text-sm">
      <div className="mb-2 flex items-center gap-2">
        {icon && (
          <img
            src={icon}
            alt={name}
            className="h-8 w-8 rounded"
          />
        )}
        <h3 className="text-slate-50 font-semibold">{name}</h3>
      </div>

      {/* desc: CDragon에서 온 HTML 그대로 렌더 */}
      <div
        className="leading-relaxed text-xs text-slate-200 [&_br]:block"
        dangerouslySetInnerHTML={{ __html: desc }}
      />


      {/* 아래: variables 테이블 */}
      {rows.length > 0 && (
        <div className="mt-3">
          <h4 className="mb-1 text-xs font-semibold text-slate-300">
            스킬 수치 (1 / 2 / 3성)
          </h4>
          <table className="w-full border-collapse text-[11px]">
            <thead>
              <tr className="border-b border-slate-700 text-slate-300">
                <th className="py-1 text-left">변수</th>
                <th className="py-1 text-right">1성</th>
                <th className="py-1 text-right">2성</th>
                <th className="py-1 text-right">3성</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.name} className="border-b border-slate-800/60">
                  <td className="py-0.5 pr-2 font-mono text-[10px] text-slate-400">
                    {row.name}
                  </td>
                  <td className="py-0.5 text-right">
                    {row.star1 ?? '-'}
                  </td>
                  <td className="py-0.5 text-right">
                    {row.star2 ?? '-'}
                  </td>
                  <td className="py-0.5 text-right">
                    {row.star3 ?? '-'}
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


