import eases from 'eases'
let list = {}
let count = 0
let isStop = true
let name = 0
let prevTime
let onAni
let isPause = false
const state = {
  fps: 60
}
const setOnAni = (fun) => {
  onAni = fun
}
const ratioFilter = (unit) => {
  return unit + (1 - state.fps / 60) * unit
}
const calculateFps = (interval) => {
  if (interval <= 0) return 60
  const f = 1000 / interval
  return f > 60 ? 60 : f
}
export const start = (fresh, end, ease = 'linear', time = 1000, delay = 0, loop = false, alternate = false) => {
  count++
  name++
  list[name] = {
    fresh,
    end,
    startAt: new Date().getTime(),
    ease,
    time,
    delay,
    loop,
    alternate,
    alternateNote: true,
    progress: 0
  }
  if (isStop) {
    prevTime = new Date().getTime()
    animate()
  }
  return name
}

const animate = () => {
  if (isPause) return
  const now = new Date().getTime()
  const interval = now - prevTime
  prevTime = now
  state.fps = calculateFps(interval)
  for (let k in list) {
    const el = list[k]
    if (el.ease === 'no') {
      el.fresh(now)
    } else {
      if (el.ease === 'timer') {
        if (now - el.startAt >= el.delay) {
          el.end()
          stop(k)
        }
        continue
      }
      if (now - el.startAt < el.delay) continue
      if (el.loop) {
        let ivpg = interval / el.time
        if (el.alternate) {
          if (el.alternateNote) el.progress += ivpg
          else el.progress -= ivpg
          if (el.progress > 1) {
            el.progress = 1
            el.alternateNote = !el.alternateNote
          } else if (el.progress < 0) {
            el.progress = 0
            el.alternateNote = !el.alternateNote
          }
        } else {
          el.progress += ivpg
          if (el.progress > 1) el.progress = el.progress % 1
        }
        const p = eases[el.ease](el.progress)
        el.fresh(p, now)
      } else {
        el.progress += interval / el.time
        let p
        if (eases[el.ease]) p = eases[el.ease](el.progress)
        else console.log(el.ease)
        if (el.progress >= 1) {
          try {
            el.fresh(1, now)
          } catch (error) {
            console.log(JSON.stringify(el), error)
          }
          if (el.end) el.end()
          stop(k)
        } else {
          if (typeof el.fresh === 'function')el.fresh(p, now)
          else console.log(el.fresh)
        }
      }
    }
  }
  if (typeof onAni === 'function') onAni()
  isStop = false
  if (count > 0)requestAnimationFrame(animate)
  else isStop = true
}

export const stop = (k) => {
  if ((typeof k === 'number' || typeof k === 'string') && list[k]) {
    delete list[k]
    count--
  }
}
export const clean = () => {
  list = {}
  count = 0
}
export const haveAni = () => count > 0
const setOptions = (id, val) => {
  const el = list[id]
  if (el) {
    for (let k in val) {
      el[k] = val[k]
    }
  }
}
const pause = () => {
  isPause = true
}

const play = () => {
  isPause = false
  animate()
}

export default {
  start, stop, setOptions, clean, haveAni () { return count > 0 }, state, ratioFilter, setOnAni, pause, play
}
