import { useEffect, useRef, useState } from 'react'
import { usePersisted, resetAll } from './storage'
import { CalEvent, clock, dateStr, demoEvents } from './data'
import Widget from './Widget'

interface AppDef { id: string; name: string; icon: string; live?: boolean; bg?: string }
const GREEN = 'linear-gradient(#7ee07a,#3fbf4f)'
const GRID: AppDef[] = [
  { id: 'calendar', name: '캘린더', icon: '📅', live: true },
  { id: 'talk', name: '톡', icon: '💬', live: true },
  { id: 'settings', name: '설정', icon: '⚙️', live: true },
  { id: 'clock', name: '시계', icon: '🕑' },
  { id: 'photos', name: '사진', icon: '🌅' },
  { id: 'camera', name: '카메라', icon: '📷' },
  { id: 'store', name: 'App Store', icon: '🅰️' },
]
const DOCK: AppDef[] = [
  { id: 'phone', name: '전화', icon: '📞', live: true, bg: GREEN },
  { id: 'browser', name: '브라우저', icon: '🧭', bg: '#f4f7fc' },
  { id: 'messages', name: '문자', icon: '✉️', live: true, bg: GREEN },
]
// x%, y%, 크기, 회전, 색
const STARS: [number, number, number, number, string][] = [
  [76, 22, 110, 12, '#f0f2f8'], [72, 64, 70, -10, '#f4f5fa'], [3, 78, 110, 8, '#f6f7fb'],
  [21, 47, 42, 6, '#eef0f7'], [18, 35, 72, -15, '#33498f'], [88, 9, 40, 0, '#4a63b0'],
  [9, 25, 30, 0, '#e8ecf6'], [10, 42, 28, 0, '#2f4488'], [50, 94, 34, 0, '#7b8fc9'],
]

const Wall = () => (
  <div className="wall">{STARS.map(([x, y, s, r, c], i) =>
    <i key={i} className="star" style={{ left: `${x}%`, top: `${y}%`, width: s, height: s, transform: `rotate(${r}deg)`, background: c }} />)}</div>
)
const Status = ({ left, dark }: { left: string; dark?: boolean }) => (
  <div className={'status' + (dark ? ' dark' : '')}><span>{left}</span>
    <span className="sys"><i className="sig"><b /><b /><b /><b /></i>
      <svg width="18" height="13" viewBox="0 0 18 13"><path d="M1 4.5a11 11 0 0 1 16 0M4 7.5a7 7 0 0 1 10 0M7 10.3a3 3 0 0 1 4 0" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" /></svg>
      <i className="bat" /></span></div>
)
function AppView({ app, out, onClose }: { app: AppDef; out: boolean; onClose: () => void }) {
  return (
    <div className={'appview' + (out ? ' out' : '')}>
      <header><button onClick={onClose}>‹ 홈</button><h1>{app.name}</h1></header>
      <main>
        {app.id === 'settings' ? (<>
          <p>모든 데이터는 이 브라우저에만 저장됩니다.</p>
          <button className="danger" onClick={() => confirm('모든 데이터를 데모 상태로 되돌릴까요?') && resetAll()}>데모 데이터로 초기화</button>
        </>) : <p>이 앱은 다음 단계에서 구현됩니다.</p>}
      </main>
    </div>
  )
}
function useNow() {
  const [n, setN] = useState(new Date())
  useEffect(() => { const t = setInterval(() => setN(new Date()), 10000); return () => clearInterval(t) }, [])
  return n
}
function useFit() {
  const [s, setS] = useState(1)
  useEffect(() => {
    const f = () => setS(window.innerWidth <= 500 ? 1 : Math.min(1, (window.innerHeight - 48) / 844))
    f(); window.addEventListener('resize', f); return () => window.removeEventListener('resize', f)
  }, [])
  return s
}

export default function App() {
  const now = useNow(), scale = useFit(), y0 = useRef(0)
  const [locked, setLocked] = useState(true)
  const [open, setOpen] = useState<AppDef | null>(null)
  const [out, setOut] = useState(false)
  const [events] = usePersisted<CalEvent[]>('events', demoEvents())
  const close = () => { if (!open || out) return; setOut(true); setTimeout(() => { setOpen(null); setOut(false) }, 220) }
  const lock = () => { setOpen(null); setOut(false); setLocked(true) }
  const tile = (a: AppDef) => (
    <button key={a.id} className="app-btn" onClick={() => a.live && setOpen(a)}>
      <span className="ic" style={a.bg ? { background: a.bg } : undefined}>{a.icon}</span><span className="lbl">{a.name}</span>
    </button>
  )
  return (
    <div className="stage">
      <div className="frame" style={{ transform: `scale(${scale})` }}>
        <div className="device">
          {locked ? (
            <div className="screen" onPointerDown={e => (y0.current = e.clientY)} onPointerUp={e => y0.current - e.clientY > 60 && setLocked(false)}>
              <Wall /><Status left="SKT" />
              <div className="ldate">{dateStr(now)}</div><div className="ltime">{clock(now)}</div>
              <span className="fab l">🔦</span><span className="fab r">📷</span>
              <button className="home-bar" onClick={() => setLocked(false)} aria-label="잠금 해제" />
            </div>
          ) : (
            <div className="screen">
              <Wall /><Status left={clock(now)} dark={!!open && !out} />
              <div className="grid">
                <div className="widget-wrap"><Widget events={events} now={now} /><span className="wcap">캘린더</span></div>
                {GRID.map(tile)}
              </div>
              <div className="dock">{DOCK.map(tile)}</div>
              {open && <AppView app={open} out={out} onClose={close} />}
              <button className={'home-bar' + (open && !out ? ' dark' : '')} onClick={close} aria-label="홈" />
            </div>
          )}
          <div className="island" />
        </div>
        <button className="side" onClick={lock} aria-label="화면 잠금" />
      </div>
    </div>
  )
}
