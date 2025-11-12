import { useState, useEffect, useRef } from 'react'

export default function Dropdown({ label, options = [], onSelect, selectedValue }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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

  const handleSelect = (option) => {
    if (onSelect) {
      onSelect(option)
    }
    setIsOpen(false)
  }

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 py-2 px-4 bg-white border border-gray-300 rounded cursor-pointer text-sm text-gray-800 transition-all font-medium hover:bg-gray-50 hover:border-primary"
      >
        {label}
        <span className="material-symbols-outlined text-xl">arrow_drop_down</span>
      </button>
      {isOpen && (
        <div className="absolute bg-white min-w-[160px] shadow-lg z-10 rounded top-full right-0 mt-1">
          {options.map((option, idx) => {
            const isSelected = selectedValue === option.value || selectedValue === option
            return (
              <button
                key={idx}
                onClick={() => handleSelect(option.value || option)}
                className={`w-full text-left px-4 py-3 text-gray-800 no-underline block transition-colors ${
                  idx === 0 ? 'rounded-t' : ''
                } ${
                  idx === options.length - 1 ? 'rounded-b' : ''
                } ${
                  isSelected
                    ? 'bg-green-50 text-primary font-semibold relative pl-8 before:content-["✓"] before:absolute before:left-2 before:top-1/2 before:-translate-y-1/2 before:text-primary before:text-sm'
                    : 'hover:bg-gray-100 hover:text-primary'
                }`}
              >
                {option.label || option}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

