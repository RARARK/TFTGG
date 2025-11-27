import type { ChampionStats } from "./types"
import { getStarHp, getStarAD } from './ChampionStatsUtil'
import {AD,Armor,AS,Health,MagicResist,Mana,Range} from '../../assets/images/icons/stats'

interface championStatsPanelprops {
    stats: ChampionStats
}


export function ChampionStatsPanel({stats}:championStatsPanelprops) {

    const {hp,damage,armor,magicResist,attackSpeed,range,mana,initialMana} = stats

const hp1 = getStarHp(hp, 1)
const hp2 = getStarHp(hp, 2)
const hp3 = getStarHp(hp, 3)

const ad1 = getStarAD(damage, 1)
const ad2 = getStarAD(damage, 2)
const ad3 = getStarAD(damage, 3)

    return (
    <section className="rounded-lg border border-slate-700 bg-slate-900/60 p-3">
  <h2 className="mb-3 text-slate-50">스탯 (1 / 2 / 3성)</h2>

  <table className="w-full text-sm text-slate-200 border-collapse">
    <thead>
      <tr className="border-b border-slate-700">
        <th className="py-2 text-center">
          <div className="flex items-center justify-center gap-1">
            <img src={Health} className="w-4 h-4" />
            체력
          </div>
        </th>
        <th className="py-2 text-center">
          <div className="flex items-center justify-center gap-1">
            <img src={AD} className="w-4 h-4" />
            데미지
          </div>
        </th>
        <th className="py-2 text-center">
          <div className="flex items-center justify-center gap-1">
            <img src={Armor} className="w-4 h-4" />
            방어력
          </div>
        </th>
        <th className="py-2 text-center">
          <div className="flex items-center justify-center gap-1">
            <img src={MagicResist} className="w-4 h-4" />
            마법저항력
          </div>
        </th>
        <th className="py-2 text-center">
          <div className="flex items-center justify-center gap-1">
            <img src={AS} className="w-4 h-4" />
            공격 속도
          </div>
        </th>
        <th className="py-2 text-center">
          <div className="flex items-center justify-center gap-1">
            <img src={Range} className="w-4 h-4" />
            거리
          </div>
        </th>
        <th className="py-2 text-center">
          <div className="flex items-center justify-center gap-1">
            <img src={Mana} className="w-4 h-4" />
            마나
          </div>
        </th>
      </tr>
    </thead>

    <tbody>
      <tr className="text-center text-slate-50">
        <td>{hp1}/{hp2}/{hp3}</td>
        <td>{ad1}/{ad2}/{ad3}</td>
        <td>{armor}</td>
        <td>{magicResist}</td>
        <td>{attackSpeed.toFixed(2)}</td>
        <td>{range}</td>
        <td>{initialMana}/{mana}</td>
      </tr>
    </tbody>
  </table>
</section>

  )
}