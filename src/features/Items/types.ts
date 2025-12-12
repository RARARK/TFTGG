// src/features/items/types.ts
export type ItemKind = 'component' | 'completed' | 'ornn' | 'emblem' | 'augment' | 'other'

export type AugmentTier = 'silver' | 'gold' | 'prismatic'

export interface Item {
  apiName: string
  name: string
  desc: string
  icon: string
  composition: string[]
  tier: AugmentTier
  // 뒤에 kind, associatedTraits 같은 거 추가하고 싶으면 여기로
}
