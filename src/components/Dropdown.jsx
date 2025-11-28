import { useState, useEffect, useRef } from 'react'

const getOptionLabel = (option) => {
  if (typeof option === 'string') return option
  return option?.label || option?.name || option?.value || ''
}

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

  const handleSelect = (value) => {
    if (onSelect) {
      onSelect(value) // Pass the selected value to the parent
    }
    setIsOpen(false)
  }

  const selectedLabel = options.find((option) => option.value === selectedValue)?.label || label

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 py-2 px-4 bg-white border border-gray-300 rounded cursor-pointer text-sm text-gray-800 transition-all font-medium hover:bg-gray-50 hover:border-primary"
      >
        {selectedLabel}
        <span className="material-symbols-outlined text-xl">arrow_drop_down</span>
      </button>
      {isOpen && (
        <div className="absolute bg-white min-w-[160px] shadow-lg z-10 rounded top-full right-0 mt-1">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`w-full text-left px-4 py-3 text-gray-800 no-underline block transition-colors ${
                selectedValue === option.value ? 'bg-green-50 text-primary font-semibold' : 'hover:bg-gray-100 hover:text-primary'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

