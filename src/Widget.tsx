import { CalEvent, dateStr, ymd } from './data'
const DOW = ['월', '화', '수', '목', '금', '토', '일']
const Row = ({ e }: { e: CalEvent }) => (
  <div className="ev"><span className="et">{e.allDay ? '종일' : e.time}</span><i style={{ background: e.color }} />
    <div><b>{e.title}</b>{e.memo && <small>{e.memo}</small>}</div></div>
)
export default function Widget({ events, now }: { events: CalEvent[]; now: Date }) {
  const tom = new Date(now); tom.setDate(now.getDate() + 1)
  const rows = (date: string) => events.filter(e => e.date === date)
    .sort((a, b) => Number(b.allDay) - Number(a.allDay) || (a.time ?? '').localeCompare(b.time ?? ''))
  const t = rows(ymd(now)).slice(0, 3), n = rows(ymd(tom)).slice(0, 2)
  const first = (new Date(now.getFullYear(), now.getMonth(), 1).getDay() + 6) % 7
  const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const cells = [...Array<number>(first).fill(0), ...Array.from({ length: days }, (_, i) => i + 1)]
  return (
    <div className="widget">
      <div className="wl-left"><h2>{dateStr(now)}</h2>
        {t.map(e => <Row key={e.id} e={e} />)}
        {n.length > 0 && <div className="nx">내일</div>}
        {n.map(e => <Row key={e.id} e={e} />)}</div>
      <div className="wl-right"><h2>{now.getMonth() + 1}월</h2>
        <div className="mg">
          {DOW.map(d => <span key={d} className="dw">{d}</span>)}
          {cells.map((c, i) => <span key={i} className={`dc c${i % 7}${c === now.getDate() ? ' today' : ''}`}>{c || ''}</span>)}
        </div></div>
    </div>
  )
}
