import { useParams } from 'react-router-dom'
import { useGetChampionsQuery } from './championsApi'
import { ChampionAbilityPanel } from  './ChampionAbilityPanel'
import { ChampionStatsPanel } from './ChampionStatsPanel'
import {ChampionTraitsPanel} from './ChampionTraitsPanel'

export function ChampionDetailPage() {
    const { apiName } = useParams<{ apiName: string }>()
    const { data: champs, isLoading, isError } = useGetChampionsQuery()

    if (!apiName) return <div>잘못된 URL</div>
  if (isLoading) return <div>로딩 중...</div>
  if (isError || !champs) return <div>에러 발생</div>

  const champ = champs.find((c) => c.id === apiName)
  if (!champ) return <div>챔피언을 찾을 수 없음</div>

  return (
    <div>
      {/* 여기서 능력치/특성 등 보여주고 */}
      <ChampionTraitsPanel champ={champ}/>
      <ChampionStatsPanel stats={champ.stats}/>
      <ChampionAbilityPanel ability={champ.ability}/>
    </div>
  )

}