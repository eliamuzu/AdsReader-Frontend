import { useState } from 'react'
import DateRangePicker from '../../components/DateRangePicker'
import Dropdown from '../../components/Dropdown'

export default function Profile() {
  const [selectedPage, setSelectedPage] = useState('All')

  const pageOptions = [
    'All',
    'Bel-Ice',
    'BelCola',
    'Bel-Aqua',
    'Bel-Beverages',
    'BelPak',
    'Bel7Star',
    'Blowpak',
    'Cricket',
    'Prime Insurance',
    'Moov',
    'Novo',
    'Holy Insecticide',
  ]

  const handleDateRangeChange = (range) => {
    console.log('Date range changed:', range)
  }

  const handlePageSelect = (page) => {
    setSelectedPage(page)
    console.log('Page selected:', page)
  }

  return (
    <div>
      <div className="fixed top-0 left-[260px] w-[calc(100%-260px)] h-[60px] bg-transparent backdrop-blur-sm flex justify-end items-center gap-2 px-4 shadow-md z-[2000] transition-all duration-300 max-md:left-0 max-md:w-full">
        <Dropdown
          label="Pages"
          options={pageOptions}
          onSelect={handlePageSelect}
          selectedValue={selectedPage}
        />
        <DateRangePicker onDateRangeChange={handleDateRangeChange} />
      </div>

      <div className="p-5">
        <div className="mt-4">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Profile</h2>
            <p className="text-gray-600">Profile content will be displayed here.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

