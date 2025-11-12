import { useState, useEffect, useRef } from 'react'

export default function DateRangePicker({ onDateRangeChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [leftDate, setLeftDate] = useState(new Date())
  const [rightDate, setRightDate] = useState(() => {
    const date = new Date()
    date.setMonth(date.getMonth() + 1)
    return date
  })
  const pickerRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen])

  const formatDate = (date) => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  const formatForDisplay = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const handleDateClick = (date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date)
      setEndDate(null)
    } else if (date < startDate) {
      setStartDate(date)
    } else if (date > startDate) {
      setEndDate(date)
    } else if (date.getTime() === startDate.getTime()) {
      setStartDate(null)
      setEndDate(null)
    }
  }

  const handleApply = () => {
    if (startDate && endDate && onDateRangeChange) {
      onDateRangeChange({ start: startDate, end: endDate })
    }
    setIsOpen(false)
  }

  const handleCancel = () => {
    setStartDate(null)
    setEndDate(null)
    setIsOpen(false)
  }

  const renderCalendar = (year, month, isLeft = true) => {
    const start = new Date(year, month, 1)
    start.setDate(start.getDate() - start.getDay())

    const dates = []
    for (let i = 0; i < 42; i++) {
      const date = new Date(start)
      date.setDate(start.getDate() + i)
      dates.push(date)
    }

    const monthLabel = new Date(year, month).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    })

    const today = new Date()
    const todayStr = formatDate(today)

    return (
      <div className="p-4">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center mb-2">
          {isLeft && (
            <button
              onClick={() => {
                const newDate = new Date(year, month - 1)
                setLeftDate(newDate)
                setRightDate(new Date(newDate.getFullYear(), newDate.getMonth() + 1))
              }}
              className="w-8 h-8 bg-transparent border-none cursor-pointer text-slate-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e3e3e3"
              >
                <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
              </svg>
            </button>
          )}
          <strong className="font-semibold uppercase text-center">{monthLabel}</strong>
          {!isLeft && (
            <button
              onClick={() => {
                const newDate = new Date(year, month + 1)
                setRightDate(newDate)
                setLeftDate(new Date(newDate.getFullYear(), newDate.getMonth() - 1))
              }}
              className="w-8 h-8 bg-transparent border-none cursor-pointer text-slate-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e3e3e3"
              >
                <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
              </svg>
            </button>
          )}
        </div>

        <div className="grid grid-cols-7 gap-0 mt-2 w-[220px] mb-2 font-semibold">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <span key={day} className="text-center">
              {day}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0 w-[220px]">
          {dates.map((date, idx) => {
            const isDisabled = date.getMonth() !== month
            const dateStr = formatDate(date)
            const isToday = dateStr === todayStr
            const isStart = startDate && formatDate(startDate) === dateStr
            const isEnd = endDate && formatDate(endDate) === dateStr
            const isInRange =
              startDate &&
              endDate &&
              date > startDate &&
              date < endDate &&
              !isDisabled

            let className =
              'aspect-square flex items-center justify-center cursor-pointer rounded transition-colors text-slate-500 hover:bg-primary hover:text-white'
            if (isDisabled) {
              className += ' text-slate-300 pointer-events-none'
            } else if (isToday && !isStart && !isEnd) {
              className += ' bg-primary text-white'
            } else if (isStart || isEnd) {
              className += ' bg-primary text-white'
            } else if (isInRange) {
              className += ' bg-green-100 text-primary rounded-none'
            }

            return (
              <span
                key={idx}
                className={className}
                onClick={() => !isDisabled && handleDateClick(date)}
              >
                {date.getDate()}
              </span>
            )
          })}
        </div>
      </div>
    )
  }

  const displayValue = startDate
    ? endDate
      ? `${formatForDisplay(startDate)} - ${formatForDisplay(endDate)}`
      : formatForDisplay(startDate)
    : ''

  return (
    <div className="relative rounded z-[1] max-w-[240px] border-2 border-white shadow-md" ref={pickerRef}>
      <input
        type="text"
        placeholder="Select Date"
        readOnly
        value={displayValue}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full rounded border-none outline-none py-2 pr-8 pl-4 text-sm cursor-pointer"
      />
      {isOpen && (
        <div className="absolute top-[110%] right-0.5 mt-2 z-[9999] overflow-hidden p-4 rounded shadow-md bg-white user-select-none text-center text-sm grid grid-cols-2 gap-0.5">
          {renderCalendar(leftDate.getFullYear(), leftDate.getMonth(), true)}
          {renderCalendar(rightDate.getFullYear(), rightDate.getMonth(), false)}
          <div className="col-span-2 flex items-center gap-2 mt-2">
            <span className="text-sm">
              {startDate && endDate
                ? `${formatForDisplay(startDate)} - ${formatForDisplay(endDate)}`
                : 'No date selected'}
            </span>
            <button
              onClick={handleCancel}
              className="ml-auto bg-primary/20 py-1 px-2 rounded text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="bg-primary text-white py-1 px-2 rounded text-sm"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

