// src/features/items/itemsApi.ts
import { api } from '../../app/api'
import type { Item, AugmentTier } from './types'

const SET_NUMBER = 16
const AUGMENT_PREFIX = `TFT${SET_NUMBER}_Augment`
const SET_ICON_REGEX = /\.TFT_Set(\d+)\.tex$/i

const toCDragonPng = (path?: string) =>
  path
    ? 'https://raw.communitydragon.org/latest/' +
      path
        .replace(/^ASSETS\//i, 'game/assets/')
        .replace(/\.tex$/i, '.png')
        .toLowerCase()
    : ''

function isCurrentOrGenericIcon(iconPath?: string): boolean {
  if (!iconPath) return false

  const match = iconPath.match(SET_ICON_REGEX)

  // 매치가 없으면: Set 번호 없는 공용 증강체 → 포함
  if (!match) return true

  const setNum = Number(match[1])
  return setNum === SET_NUMBER
}

function getAugmentTier(iconPath?: string): AugmentTier {
  const lower = (iconPath ?? '').toLowerCase()
  const file = lower.split('/').pop() ?? lower  // 맨 끝 파일 이름만 보기

  // 프리즘: _III 또는 -III 포함
  if (file.includes('_iii') || file.includes('-iii') || file.includes('3')) {
    return 'prismatic'
  }

  // 골드: _II 또는 -II 포함
  if (file.includes('_ii') || file.includes('-ii') || file.includes('2')) {
    return 'gold'
  }

  // 나머지는 실버 처리
  return 'silver'
}

const TIER_RANK: Record<AugmentTier, number> = {
  silver: 1,
  gold: 2,
  prismatic: 3,
}

function getTierRank(tier: AugmentTier): number {
  return TIER_RANK[tier] ?? 999  // 혹시 모를 이상값 대비
}

function compareAugments(a: Item, b: Item) {
  const rankA = getTierRank(a.tier)
  const rankB = getTierRank(b.tier)
  const tierDiff = rankA - rankB

  if (!Number.isNaN(tierDiff) && tierDiff !== 0) {
    return tierDiff
  }

  // 같은 티어면 이름 순
  return a.name.localeCompare(b.name, 'ko')
}

export const itemsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAugments: build.query<Item[], void>({
      query: () =>
        'https://raw.communitydragon.org/latest/cdragon/tft/ko_kr.json',

      transformResponse: (raw: any): Item[] => {
        const allItems: any[] = Array.isArray(raw?.items) ? raw.items : []

        const augments = allItems.filter((c) => {
          const apiName: string | undefined = c?.apiName
          const icon: string | undefined = c?.icon

          if (typeof apiName !== 'string' || typeof icon !== 'string') {
            return false
          }

          const isAugment =
            apiName.startsWith(AUGMENT_PREFIX) ||
            apiName.startsWith('TFT_Augment_')

          const isNotMissing = !icon.includes('Missing')
          const isFromCurrentSetOrGeneric = isCurrentOrGenericIcon(icon)

          return isAugment && isNotMissing && isFromCurrentSetOrGeneric
        })


        return augments
          .map((c) => ({
            apiName: c.apiName,
            name: c.name ?? '',
            icon: toCDragonPng(c.icon),
            desc: c.desc ?? '',
            tier: getAugmentTier(c.icon),
            composition: Array.isArray(c.composition) ? c.composition : [],
          }))
          .sort(compareAugments)
      },
    }),
  }),
})

export const { useGetAugmentsQuery } = itemsApi
