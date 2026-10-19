export interface CalEvent { id: string; title: string; date: string; time?: string; allDay: boolean; memo?: string; color: string }
export const RANGE = { min: 2012, max: 2026 }
const pad = (n: number) => String(n).padStart(2, '0')
export const ymd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const off = (n: number) => { const d = new Date(); d.setDate(d.getDate() + n); return ymd(d) }
export const clock = (d: Date) => `${d.getHours() % 12 || 12}:${pad(d.getMinutes())}`
export const dateStr = (d: Date) => `${d.getMonth() + 1}월 ${d.getDate()}일 (${'일월화수목금토'[d.getDay()]})`
// 데모 시나리오: 항상 "오늘/내일" 기준으로 생성됩니다.
export const demoEvents = (): CalEvent[] => [
  { id: 'e1', title: '중간고사', date: off(0), allDay: true, color: '#b4b4ba' },
  { id: 'e2', title: '4교시 식품학 시험', date: off(0), time: '10:00', allDay: false, memo: '자연과학관 5108 1-5장 OX', color: '#5b5fc7' },
  { id: 'e3', title: '중간고사', date: off(1), allDay: true, color: '#b4b4ba' },
  { id: 'e4', title: '식품구매론 3교시 시험', date: off(1), allDay: true, memo: '12:20까지, 01-07장', color: '#6cbf5a' },
]
