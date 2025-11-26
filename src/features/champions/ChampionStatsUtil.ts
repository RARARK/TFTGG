
export function getStarHp(baseHp: number, star: 1 | 2 | 3) {
  const HP_MULT = { 1: 1.0, 2: 1.8, 3: 3.24 }
  return Math.round(baseHp * HP_MULT[star])
}

export function getStarAD(baseAD: number, star: 1 | 2 | 3) {
  const AD_MULT = { 1: 1.0, 2: 1.5, 3: 2.25 }
  return Math.round(baseAD * AD_MULT[star])
}
