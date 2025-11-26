// src/features/champions/championsApi.ts
import { api } from '../../app/api'
import type { Champion } from './types'

const SET_NUMBER = 15
const SET_PREFIX = `TFT${SET_NUMBER}_`

const toCDragonPng = (path?: string) =>
  path
    ? 'https://raw.communitydragon.org/latest/' +
      path.replace(/^ASSETS\//i, 'game/assets/')
          .replace(/\.tex$/i, '.png')
          .toLowerCase()
    : ''

export const championsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getChampions: build.query<Champion[], void>({
      query: () => 'https://raw.communitydragon.org/latest/cdragon/tft/ko_kr.json',

      transformResponse: (raw: any): Champion[] => {

   // 1) setData 배열이 있다고 가정 (latest/tft/ko_kr.json 구조)
  const sets = Array.isArray(raw?.setData) ? raw.setData : []

  // 2) 그 중에서 champions 중 apiName이 'TFT15_'로 시작하는 세트 찾기
  const target =
    sets.find((s: any) =>
      Array.isArray(s?.champions) &&
      s.champions.some(
        (c: any) =>
          typeof c?.apiName === 'string' &&
          c.apiName.startsWith(SET_PREFIX)
      )
    ) ?? sets.at(-1)

  const champs: any[] =
    (target?.champions ?? []).filter(
      (c: any) =>
        typeof c?.apiName === 'string' &&
        c.apiName.startsWith(SET_PREFIX)
    )

  // 3) 모루/상자 같은 특수 오브젝트 제외
  const playable = champs.filter((c: any) => {
    const hasName = !!c?.name
    const looksLikeUnit =
      (Array.isArray(c?.traits) && c.traits.length > 0) &&
      (typeof c?.role === 'string' && c.role.length > 0) &&
      (typeof c?.cost === 'number' && c.cost >= 1 && c.cost <= 5)
    return hasName && looksLikeUnit
  })

        // 5) 정규화
        return playable
          .map((c: any) => ({
            id: c.apiName,
            name: c.name,
            cost: c.cost ?? 0,
            role: c.role ?? '',
            traits: c.traits ?? [],
            icon: toCDragonPng(c.icon),
            ability: {
              name: c.ability?.name ?? '',
              desc: c.ability?.desc ?? '',
              icon: toCDragonPng(c.ability?.icon),
              variables:c.ability?.variables ?? ''
            },
            stats: {
              hp: c.stats?.hp ?? 0,
              damage: c.stats?.damage ?? 0,
              armor: c.stats?.armor ?? 0,
              magicResist: c.stats?.magicResist ?? 0,
              attackSpeed: c.stats?.attackSpeed ?? 0,
              range: c.stats?.range ?? 0,
              mana: c.stats?.mana ?? 0,
              initialMana: c.stats?.initialMana ?? 0,
            },
          }))
          .sort((a, b) => (a.cost - b.cost) || a.name.localeCompare(b.name))
      },
    }),
  }),
})


export const { useGetChampionsQuery } = championsApi
