import { useState } from 'react'
import DateRangePicker from '../../components/DateRangePicker'
import Dropdown from '../../components/Dropdown'
import { useSidebar } from '../../contexts/SidebarContext'

export default function Overview() {
  const { toggleSidebar } = useSidebar()
  const [selectedFilter, setSelectedFilter] = useState('All')
  const filterOptions = [
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

  const [tableData, setTableData] = useState([
    // Sample data - replace with API call
    { month: 'January', reach: 1000, engagement: 500, spend: 2000, views: 5000 },
    { month: 'February', reach: 1200, engagement: 600, spend: 2500, views: 6000 },
  ])

  const handleDateRangeChange = (range) => {
    console.log('Date range changed:', range)
    // TODO: Fetch table data for the selected date range
  }

  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter)
    console.log('Filter selected:', filter)
    // TODO: Fetch table data filtered by the selected filter
  }

  const handleDownload = () => {
    // TODO: Implement download functionality
    console.log('Download clicked')
  }

  return (
    <div>
      {/* Updated Header Bar */}
      <div className="fixed top-0 left-[260px] w-[calc(100%-260px)] h-[60px] bg-transparent backdrop-blur-sm flex justify-between items-center gap-2 px-4 shadow-md z-[2000] transition-all duration-300 max-md:left-0 max-md:w-full">
        <button
        onClick={toggleSidebar}
        className="bg-transparent border-none p-2 rounded text-gray-800 hover:bg-gray-100 cursor-pointer md:hidden"
        aria-label="Toggle sidebar"
      >
        <span className="material-symbols-outlined text-2xl">menu</span>
      </button>
        
        {/* ADDED DROPDOWN COMPONENT HERE */}
        <Dropdown
          label="Pages"
          options={filterOptions}
          onSelect={handleFilterSelect}
          selectedValue={selectedFilter}
        />
        <DateRangePicker onDateRangeChange={handleDateRangeChange} />
      </div>

      <div className="p-5">
        <div className="mt-4">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-3 border border-gray-300 text-left bg-[#273c75] text-white">
                    Month
                  </th>
                  <th className="p-3 border border-gray-300 text-left bg-[#273c75] text-white">
                    Reach
                  </th>
                  <th className="p-3 border border-gray-300 text-left bg-[#273c75] text-white">
                    Engagement
                  </th>
                  <th className="p-3 border border-gray-300 text-left bg-[#273c75] text-white">
                    Spend
                  </th>
                  <th className="p-3 border border-gray-300 text-left bg-[#273c75] text-white">
                    Views
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* NOTE: You might want to filter tableData here based on selectedFilter 
                  if the filtering logic is handled purely client-side without an API call.
                */}
                {tableData.map((row, idx) => (
                  <tr key={idx}>
                    <td className="p-3 border border-gray-300">{row.month}</td>
                    <td className="p-3 border border-gray-300">{row.reach}</td>
                    <td className="p-3 border border-gray-300">{row.engagement}</td>
                    <td className="p-3 border border-gray-300">${row.spend}</td>
                    <td className="p-3 border border-gray-300">{row.views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <button
              onClick={handleDownload}
              className="relative font-bold text-white bg-gray-900 py-2 px-8 border-none rounded-lg cursor-pointer overflow-hidden hover:bg-gray-800"
            >
              <span className="relative z-10">Download</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}