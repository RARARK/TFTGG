// src/features/champions/types.ts
export interface ChampionStats {
  hp: number
  damage: number
  armor: number
  magicResist: number
  attackSpeed: number
  range: number
  mana: number
  initialMana: number
}

export interface ChampionAbility {
  name: string
  desc: string
  icon: string
  value: number[]
}

export interface Champion {
  id: string
  name: string
  cost: number
  role: string
  traits: string[]
  icon: string
  ability: ChampionAbility
  stats: ChampionStats
}
