// Estavo Prototype — CalendarPage
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Plus, Check, Circle } from 'lucide-react'
import { calendarEvents } from '../data/mockData'
import { analytics } from '../analytics/track.js'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const TODAY_YEAR  = 2026
const TODAY_MONTH = 3 // April (0-indexed)
const TODAY_DAY   = 24

function eventCls(type) {
  if (type === 'deadline')   return 'bg-[#FDF0EE] text-rust'
  if (type === 'showing')    return 'bg-[#EEF2FC] text-[#2B4FA0]'
  if (type === 'inspection') return 'bg-[#FEF8EC] text-[#9A6A10]'
  if (type === 'closing')    return 'bg-[#EEF6F2] text-teal'
  return 'bg-[#F5F5F5] text-[#8A8A8A]'
}

const INIT_TASKS = [
  { id: 1, text: 'Follow up Marcus Diaz on 147 Oak St offer',       done: false, due: '2026-04-24' },
  { id: 2, text: 'Review Park disclosures before inspection',         done: false, due: '2026-04-27' },
  { id: 3, text: 'Send property matches to Thomas Reed',              done: false, due: '2026-04-25' },
  { id: 4, text: 'Confirm Sunday showings with Priya',               done: true,  due: '2026-04-23' },
  { id: 5, text: 'Order home warranty quote for 14 Oak St',          done: false, due: '2026-04-30' },
]

export default function CalendarPage() {
  const navigate = useNavigate()
  const [year, setYear]   = useState(TODAY_YEAR)
  const [month, setMonth] = useState(TODAY_MONTH)
  const [tasks, setTasks] = useState(INIT_TASKS)
  const [newTask, setNewTask] = useState('')

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  function handleEvent(ev) {
    if (ev.txId) navigate(`/transactions/${ev.txId}`)
    else navigate('/showings')
  }

  function toggleTask(id) {
    setTasks(ts => {
      const task = ts.find(t => t.id === id)
      if (task && !task.done) analytics.taskCompleted({ taskId: id })
      return ts.map(t => t.id === id ? { ...t, done: !t.done } : t)
    })
  }

  function addTask() {
    const text = newTask.trim()
    if (!text) return
    setTasks(ts => [...ts, { id: Date.now(), text, done: false, due: null }])
    analytics.taskAdded({ text })
    setNewTask('')
  }

  // Build calendar grid
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startDow    = new Date(year, month, 1).getDay()
  const cells = [
    ...Array(startDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const isCurrentMonth = year === TODAY_YEAR && month === TODAY_MONTH

  // Gather upcoming events from calendarEvents (for visible month + 30 days)
  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`
  const monthEvents = Object.entries(calendarEvents)
    .filter(([date]) => date.startsWith(monthStr))
    .sort(([a], [b]) => a.localeCompare(b))

  const pendingTasks  = tasks.filter(t => !t.done)
  const completedTasks = tasks.filter(t => t.done)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 items-start">

      {/* ── Calendar ── */}
      <div className="space-y-3">
        <div className="bg-white rounded-xl border border-rule overflow-hidden">
          {/* Month nav */}
          <div className="px-4 py-3 border-b border-rule flex items-center justify-between">
            <button onClick={prevMonth} className="p-1 rounded hover:bg-ui-bg transition-colors">
              <ChevronLeft size={16} className="text-slate" />
            </button>
            <p className="text-[13px] font-semibold text-navy">
              {MONTH_NAMES[month]} {year}
            </p>
            <button onClick={nextMonth} className="p-1 rounded hover:bg-ui-bg transition-colors">
              <ChevronRight size={16} className="text-slate" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-rule">
            {DAYS.map(d => (
              <div key={d} className="py-2 text-center text-[10px] font-semibold uppercase tracking-wider text-ink3">
                {d}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7">
            {cells.map((day, i) => {
              const isToday = isCurrentMonth && day === TODAY_DAY
              const dateKey = day ? `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : null
              const events = dateKey ? (calendarEvents[dateKey] ?? []) : []
              const isLast = i >= cells.length - 7

              return (
                <div
                  key={i}
                  className={`min-h-[80px] p-1 border-b border-r border-[#F5F5F5] ${
                    i % 7 === 6 ? 'border-r-0' : ''
                  } ${isLast ? 'border-b-0' : ''} ${!day ? 'bg-[#FAFAFA]' : ''}`}
                >
                  {day && (
                    <>
                      <div className={`w-6 h-6 flex items-center justify-center rounded-full text-[11px] font-medium mb-0.5 ${
                        isToday ? 'bg-rust text-white' : 'text-navy'
                      }`}>
                        {day}
                      </div>
                      <div className="space-y-0.5">
                        {events.map((ev, j) => (
                          <button
                            key={j}
                            onClick={() => handleEvent(ev)}
                            className={`w-full text-left text-[9px] leading-tight px-1 py-0.5 rounded truncate ${eventCls(ev.type)}`}
                          >
                            {ev.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* This month's events */}
        {monthEvents.length > 0 && (
          <div className="bg-white rounded-xl border border-rule p-4">
            <p className="text-[12px] font-semibold text-navy mb-3">{MONTH_NAMES[month]} events</p>
            <div className="space-y-2">
              {monthEvents.map(([date, evs]) =>
                evs.map((item, j) => {
                  const d = new Date(date + 'T12:00:00')
                  const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  return (
                    <div
                      key={date + j}
                      onClick={() => handleEvent(item)}
                      className="flex items-center gap-3 py-1.5 border-b border-[#F5F5F5] last:border-0 cursor-pointer hover:bg-ui-bg -mx-1 px-1 rounded transition-colors"
                    >
                      <span className="text-[10px] text-ink3 w-12 shrink-0">{label}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full flex-1 truncate ${eventCls(item.type)}`}>
                        {item.label}
                      </span>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Task list ── */}
      <div className="bg-white rounded-xl border border-rule overflow-hidden">
        <div className="px-4 py-3 border-b border-rule">
          <p className="text-[12px] font-semibold text-navy">Tasks</p>
          <p className="text-[10px] text-ink3 mt-0.5">{pendingTasks.length} pending</p>
        </div>

        {/* Add task */}
        <div className="px-3 py-2.5 border-b border-rule flex gap-2">
          <input
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTask()}
            placeholder="Add a task…"
            className="flex-1 text-[11px] text-navy placeholder:text-ink3 focus:outline-none"
          />
          <button
            onClick={addTask}
            className="w-6 h-6 rounded-full bg-rust flex items-center justify-center shrink-0"
          >
            <Plus size={12} className="text-white" />
          </button>
        </div>

        {/* Pending */}
        <div className="divide-y divide-[#F5F5F5]">
          {pendingTasks.map(task => (
            <div key={task.id} className="flex items-start gap-2.5 px-3 py-2.5 hover:bg-[#FAFAFA] transition-colors">
              <button onClick={() => toggleTask(task.id)} className="mt-0.5 shrink-0">
                <Circle size={14} className="text-ink3" />
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-navy leading-snug">{task.text}</p>
                {task.due && (
                  <p className="text-[10px] text-ink3 mt-0.5">
                    Due {new Date(task.due + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                )}
              </div>
            </div>
          ))}
          {pendingTasks.length === 0 && (
            <p className="px-3 py-4 text-[11px] text-ink3 text-center">All tasks complete!</p>
          )}
        </div>

        {/* Completed */}
        {completedTasks.length > 0 && (
          <>
            <div className="px-3 py-1.5 bg-ui-bg border-t border-rule">
              <p className="text-[10px] font-semibold text-ink3 uppercase tracking-wider">Completed</p>
            </div>
            <div className="divide-y divide-[#F5F5F5]">
              {completedTasks.map(task => (
                <div key={task.id} className="flex items-start gap-2.5 px-3 py-2.5 opacity-50">
                  <button onClick={() => toggleTask(task.id)} className="mt-0.5 shrink-0">
                    <Check size={14} className="text-teal" />
                  </button>
                  <p className="text-[11px] text-navy line-through leading-snug">{task.text}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
