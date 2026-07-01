// Physical print maths, shared by the generator UI and the print layout.
// Auto-imported by Nuxt (app/utils).

export const CARD_RATIO = 3.375 / 2.125

export type Paper = 'A4' | 'Letter'
export type CoverType = 'cards' | 'coins'

// Usable print area in mm after the safe margin (A4 210×297, Letter 216×279 with
// ~10mm margins). Widths match the original generator's safe widths.
const USABLE: Record<Paper, { w: number; h: number }> = {
  A4: { w: 190, h: 277 },
  Letter: { w: 195, h: 259 },
}

export interface SheetInput {
  paper: Paper
  type: CoverType
  widthMm: number
  /** Number of tiles that will actually print. */
  count: number
}

export interface SheetResult {
  coverW: number
  coverH: number
  perRow: number
  rowsPerSheet: number
  perSheet: number
  sheets: number
}

export function sheetMath({ paper, type, widthMm, count }: SheetInput): SheetResult {
  const usable = USABLE[paper]
  const coverW = widthMm
  const coverH = type === 'coins' ? widthMm : widthMm * CARD_RATIO
  const perRow = Math.max(1, Math.floor(usable.w / coverW))
  const rowsPerSheet = Math.max(1, Math.floor(usable.h / coverH))
  const perSheet = perRow * rowsPerSheet
  const sheets = count > 0 ? Math.ceil(count / perSheet) : 0
  return { coverW, coverH, perRow, rowsPerSheet, perSheet, sheets }
}

/** Parse a width entered as "54", "54 mm" or "5.4 cm" into millimetres. */
export function parseWidthMm(input: string): number {
  const str = input.trim().toLowerCase()
  if (str.endsWith('cm')) return parseFloat(str) * 10 || NaN
  return parseFloat(str) || NaN
}
