import { useEffect, useRef } from 'react'

const SNIPPETS = [
  'const hire = async () => {',
  '  await matchTalent(role)',
  '  return shortlist.map(c => c.id)',
  '}',
  'export function Team() {',
  '  const [stack, setStack] = useState([])',
  '  useEffect(() => { loadRoles() }, [])',
  '  return <section className="crew">{children}</section>',
  '}',
  'import { filter, map } from "talent"',
  'display: flex; align-items: center;',
  'position: relative; transform: translateY(-2px);',
  'transition: all 280ms ease; animation: wave 4s infinite;',
  'justify-content: space-between;',
  '<header /><main /><article /><button />',
  'className="rounded-2xl shadow-sm"',
  '=> { return engineers.filter(isSenior) }',
  'async function screen(candidate) {',
  '  if (skills && cultureFit) return true',
  '}',
  '{} [] () === && || </> ;',
]

const COLORS = ['#1148D7', '#6D86C4', '#7B8399'] as const

/** Relative Y positions for the eight wave bands */
const BAND_Y = [0.09, 0.16, 0.3, 0.44, 0.58, 0.72, 0.86, 0.94]

function bandOpacity(index: number) {
  // Strong at top/bottom, faint through the middle content zone
  const strong = [0.52, 0.45, 0.22, 0.18, 0.2, 0.22, 0.48, 0.62]
  return strong[index] ?? 0.25
}

function edgeFade(x: number, width: number) {
  const margin = Math.max(48, width * 0.08)
  if (x < margin) return Math.max(0, x / margin)
  if (x > width - margin) return Math.max(0, (width - x) / margin)
  return 1
}

function buildStream() {
  const raw = SNIPPETS.join('   ·   ')
  return `${raw}   ·   ${raw}   ·   ${raw}`
}

export function CodeWaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const stream = buildStream()
    let width = 0
    let height = 0
    let dpr = 1
    let raf = 0
    let running = false
    let last = performance.now()
    let phase = 0
    let offsets = BAND_Y.map((_, i) => (i % 2 === 0 ? 0 : 180))

    const speeds = BAND_Y.map((_, i) => {
      const base = 60 + ((i * 17) % 41) // 60–100 px/s
      return i % 2 === 0 ? base : -base
    })

    function resize() {
      const parent = canvas!.parentElement ?? document.body
      const rect = parent.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = Math.max(1, Math.floor(window.innerWidth || rect.width))
      height = Math.max(1, Math.floor(window.innerHeight || rect.height))
      canvas!.width = Math.floor(width * dpr)
      canvas!.height = Math.floor(height * dpr)
      canvas!.style.width = `${width}px`
      canvas!.style.height = `${height}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function waveY(baseY: number, x: number, p: number, amp: number, freq: number, tilt: number) {
      const n = (x / Math.max(width, 1)) * Math.PI * 2 * freq
      const primary = Math.sin(n + p) * amp
      const harmonic = Math.sin(n * 0.5 + p * 0.85) * (amp * 0.38)
      return baseY + primary + harmonic + x * tilt
    }

    function draw(p: number, offs: number[]) {
      ctx!.clearRect(0, 0, width, height)
      ctx!.textBaseline = 'middle'
      ctx!.font = '500 13px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'

      for (let i = 0; i < BAND_Y.length; i++) {
        const baseY = BAND_Y[i] * height
        const amp = 16 + (i % 3) * 7
        const freq = 1.05 + (i % 4) * 0.22
        const tilt = (i % 2 === 0 ? 1 : -1) * 0.018
        const color = COLORS[i % COLORS.length]
        const opacity = bandOpacity(i)
        const step = 9.2
        const loopWidth = Math.max(900, ctx!.measureText(stream).width + 80)
        const scroll = ((offs[i] % loopWidth) + loopWidth) % loopWidth

        // Walk characters across an extended range so the loop is seamless
        let x = -loopWidth + scroll
        let charIndex = 0

        while (x < width + loopWidth) {
          const ch = stream[charIndex % stream.length]
          charIndex += 1

          const y0 = waveY(baseY, x - 0.6, p + i * 0.35, amp, freq, tilt)
          const y1 = waveY(baseY, x + 0.6, p + i * 0.35, amp, freq, tilt)
          const angle = Math.atan2(y1 - y0, 1.2)
          const y = waveY(baseY, x, p + i * 0.35, amp, freq, tilt)
          const fade = edgeFade(x, width)
          const a = opacity * fade

          if (a > 0.02 && x > -40 && x < width + 40) {
            ctx!.save()
            ctx!.translate(x, y)
            ctx!.rotate(angle)
            ctx!.fillStyle = color
            ctx!.globalAlpha = a
            ctx!.fillText(ch, 0, 0)
            ctx!.restore()
          }

          x += step
        }
      }
    }

    function frame(now: number) {
      if (!running) return
      raf = requestAnimationFrame(frame)
      if (document.hidden) {
        last = now
        return
      }

      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      phase += 1.5 * dt

      for (let i = 0; i < offsets.length; i++) {
        offsets[i] += speeds[i] * dt
      }

      draw(phase, offsets)
    }

    function start() {
      if (running) return
      running = true
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }

    function stop() {
      running = false
      if (raf) cancelAnimationFrame(raf)
      raf = 0
    }

    function onVisibility() {
      if (document.hidden) return
      last = performance.now()
      if (!reduceMotion.matches && !running) start()
    }

    function onReduceChange() {
      if (reduceMotion.matches) {
        stop()
        draw(phase, offsets)
      } else {
        start()
      }
    }

    resize()
    draw(phase, offsets)

    if (!reduceMotion.matches) start()

    const ro = new ResizeObserver(() => {
      resize()
      draw(phase, offsets)
    })
    ro.observe(document.documentElement)

    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVisibility)
    reduceMotion.addEventListener?.('change', onReduceChange)

    return () => {
      stop()
      ro.disconnect()
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
      reduceMotion.removeEventListener?.('change', onReduceChange)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
    />
  )
}

export default CodeWaveBackground
