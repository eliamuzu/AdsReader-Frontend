import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

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
  const [popupPos, setPopupPos] = useState(null)
  const popupRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      // If click is inside the input wrapper, ignore
      if (pickerRef.current && pickerRef.current.contains(event.target)) return
      // If click is inside the popup (portal), ignore
      if (popupRef.current && popupRef.current.contains(event.target)) return
      // Otherwise close
      setIsOpen(false)
    }

    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      setPopupPos(null)
      return
    }

    const el = pickerRef.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const estimatedHeight = 360 
    const margin = 8
    let top = rect.bottom + margin

    if (window.innerHeight - rect.bottom < estimatedHeight + margin) {
      top = rect.top - estimatedHeight - margin
    }

    
    const preferredWidth = Math.max(rect.width, 460)
    let left = rect.left - 20
    
    if (left + preferredWidth > window.innerWidth - margin) {
      left = window.innerWidth - preferredWidth - margin
    }
    if (left < margin) left = margin

    setPopupPos({ left, top, width: preferredWidth })
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
    } else if (startDate && date.getTime() === startDate.getTime()) {
      setStartDate(null)
      setEndDate(null)
    }
  }

const handleApply = () => {
  if (startDate && endDate && onDateRangeChange) {
    const start = startDate <= endDate ? startDate : endDate;
    const end = startDate <= endDate ? endDate : startDate;

    // Format the dates as "YYYY-MM-DD"
    const formattedStart = formatDate(start);
    const formattedEnd = formatDate(end);

    onDateRangeChange({ since: formattedStart, until: formattedEnd });
  }
  setIsOpen(false);
};

const handleCancel = () => {
    setStartDate(null)
    setEndDate(null)
}
  
  
  const navigateMonth = (direction) => {
    const newLeftDate = new Date(leftDate.getFullYear(), leftDate.getMonth() + direction)
    setLeftDate(newLeftDate)
    setRightDate(new Date(newLeftDate.getFullYear(), newLeftDate.getMonth() + 1))
  }

  
  const renderCalendar = (year, month, calendarIndex) => {
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
    
    const isLeftCalendar = calendarIndex === 0
    const isRightCalendar = calendarIndex === 1

    return (
      <div className="p-4 w-1/2">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center mb-2">
          
          {isLeftCalendar && (
            <button
              onClick={() => navigateMonth(-1)}
              className="w-8 h-8 bg-transparent border-none cursor-pointer text-slate-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="currentColor"
              >
                <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
              </svg>
            </button>
          )}
          <strong className={`font-semibold uppercase text-center ${!isLeftCalendar ? 'col-start-1 col-span-2' : 'col-start-2'}`}>{monthLabel}</strong>

          {isRightCalendar && (
            <button
              onClick={() => navigateMonth(1)}
              className="w-8 h-8 bg-transparent border-none cursor-pointer text-slate-500 justify-self-end"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="currentColor"
              >
                <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
              </svg>
            </button>
          )}
        </div>

        <div className="grid grid-cols-7 gap-0 mt-2 w-full mb-2 font-semibold text-xs">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <span key={day} className="text-center text-xs">
              {day}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0 w-full">
          {dates.map((date, idx) => {
            const isDisabled = date.getMonth() !== month
            const dateStr = formatDate(date)
            const isToday = dateStr === todayStr
            const isStart = startDate && formatDate(startDate) === dateStr
            const isEnd = endDate && formatDate(endDate) === dateStr
            
            
            const startMidnight = startDate ? new Date(startDate.setHours(0,0,0,0)).getTime() : null
            const endMidnight = endDate ? new Date(endDate.setHours(0,0,0,0)).getTime() : null
            const dateMidnight = date.getTime()
            
           
            const isInRange =
              startDate &&
              endDate &&
              ((dateMidnight > startMidnight && dateMidnight < endMidnight) || 
               (dateMidnight < startMidnight && dateMidnight > endMidnight))

            let className =
              'aspect-square flex items-center justify-center cursor-pointer rounded transition-colors text-slate-700 hover:bg-primary/70 hover:text-white text-sm'
            
            if (isDisabled) {
              className += ' text-slate-300 pointer-events-none'
            } else if (isStart || isEnd) {
              // Apply base selection color
              className = 'aspect-square flex items-center justify-center cursor-pointer rounded transition-colors text-white bg-primary text-sm'
            } else if (isInRange) {
              // Apply range color
              className += ' bg-primary/20 text-primary rounded-none'
            } else if (isToday) {
              // Apply today color only if not selected
              className += ' font-bold'
            }


            return (
              <span
                key={idx}
                className={className}
                onClick={() => !isDisabled && handleDateClick(date)}
                title={formatForDisplay(date)}
                style={isStart ? { borderTopLeftRadius: '9999px', borderBottomLeftRadius: '9999px' } : isEnd ? { borderTopRightRadius: '9999px', borderBottomRightRadius: '9999px' } : {}}
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
    : 'Select Date Range' 
  return (
    <div
      className={`relative rounded z-[1] border-2 border-white shadow-md ${
        isOpen ? 'max-w-none' : 'max-w-[240px]'
      }`}
      ref={pickerRef}
    >
      <input
        type="text"
        placeholder="Select Date"
        readOnly
        value={displayValue}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full rounded border-none outline-none py-2 pr-8 pl-4 text-sm cursor-pointer"
      />
      {isOpen && popupPos
        ? createPortal(
            <div ref={popupRef}
                  style={{ position: 'fixed', left: popupPos.left, top: popupPos.top, width: popupPos.width, zIndex: 9999 }}
                >
             
              <div className="flex overflow-hidden p-2 rounded-t shadow-xl bg-white user-select-none text-center text-sm">
                {renderCalendar(leftDate.getFullYear(), leftDate.getMonth(), 0)}
                {renderCalendar(rightDate.getFullYear(), rightDate.getMonth(), 1)}
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-b-lg shadow-xl">
                  <span className="text-sm font-medium">
                    {startDate && endDate
                      ? `${formatForDisplay(startDate)} - ${formatForDisplay(endDate)}`
                      : 'No date selected'}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={handleCancel} className="bg-gray-200 text-gray-700 py-1 px-3 rounded text-sm hover:bg-gray-300 transition-colors">
                      Clear
                    </button>
                    <button 
                      onClick={handleApply} 
                      className={`py-1 px-3 rounded text-sm transition-colors ${startDate && endDate ? 'bg-primary text-white hover:bg-primary/90' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                      disabled={!startDate || !endDate}
                      >
                      Apply
                    </button>
                  </div>
                </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}