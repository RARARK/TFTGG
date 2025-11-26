import type { ChampionStats } from "./types"
import { getStarHp, getStarAD } from './ChampionStatsUtil'
import {AD,AP,Armor,AS,Health,MagicResist,Mana,Range} from '../../assets/images/icons/stats'

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
    <section className="...">
      <h2 className="...">스탯 (1 / 2 / 3성)</h2>
      <table>
        <thead>
            <tr>
                <th>
                    <img src={Health} alt="체력" className="inline-block w-4 h-4 mr-1" />
                    체력
                </th>
                <th>
                    <img src={AD} alt="데미지" className="inline-block w-4 h-4 mr-1" />
                    데미지
                </th>
                <th>
                    <img src={Armor} alt="방어력" className="inline-block w-4 h-4 mr-1" />
                    방어력
                </th>
                <th>
                    <img src={MagicResist} alt="마법저항력" className="inline-block w-4 h-4 mr-1" />
                    마법 저항력
                </th>
                <th>
                    <img src={AS} alt="공격 속도" className="inline-block w-4 h-4 mr-1" />
                    공격 속도
                </th>
                <th>
                    <img src={Range} alt="범위" className="inline-block w-4 h-4 mr-1" />
                    범위
                </th>
                <th>
                    <img src={Mana} alt="마나" className="inline-block w-4 h-4 mr-1" />
                    마나
                </th>
            </tr>
        </thead>
        <tbody>
            <tr>
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