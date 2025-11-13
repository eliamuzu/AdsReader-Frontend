import { useState, useEffect } from 'react' // Import useState
import DateRangePicker from '../../components/DateRangePicker'
import MetricCard from '../../components/MetricCard'
import ApexChart from '../../components/Chart'
import Dropdown from '../../components/Dropdown' // Import Dropdown
import { useSidebar } from '../../contexts/SidebarContext'

export default function Home() {
  const { toggleSidebar } = useSidebar()
  const [selectedFilter, setSelectedFilter] = useState('All') // State for the filter

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

  useEffect(() => {
    // Load ionicons
    const script = document.createElement('script')
    script.type = 'module'
    script.src = 'https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js'
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  const handleDateRangeChange = (range) => {
    console.log('Date range changed:', range)
    // TODO: Fetch data for the selected date range
  }

  const handleFilterSelect = (filter) => { // Handler for dropdown selection
    setSelectedFilter(filter)
    console.log('Filter selected:', filter)
    // TODO: Fetch data based on the selected filter
  }

  const chartOptions = {
    series: [
      {
        name: 'series1',
        data: [31, 40, 28, 51, 42, 109, 100],
      },
      {
        name: 'series2',
        data: [11, 32, 45, 32, 34, 52, 41],
      },
    ],
    xaxis: {
      type: 'datetime',
      categories: [
        '2018-09-19T00:00:00.000Z',
        '2018-09-19T01:30:00.000Z',
        '2018-09-19T02:30:00.000Z',
        '2018-09-19T03:30:00.000Z',
        '2018-09-19T04:30:00.000Z',
        '2018-09-19T05:30:00.000Z',
        '2018-09-19T06:30:00.000Z',
      ],
    },
  }

  return (
    <div>
    {/* Header bar */}
    <div className="fixed top-0 left-[260px] w-[calc(100%-260px)] h-[60px] bg-transparent backdrop-blur-sm flex lg:justify-end items-center px-4 shadow-md z-[2000] transition-all duration-300 md:justify-between max-md:left-0 max-md:w-full">
      <button
        onClick={toggleSidebar}
        className="bg-transparent border-none p-2 rounded text-gray-800 hover:bg-gray-100 cursor-pointer md:hidden"
        aria-label="Toggle sidebar"
      >
        <span className="material-symbols-outlined text-2xl">menu</span>
      </button>
      
      {/* Filters Group - Ensures spacing */}
      <div className='flex items-center gap-2'> 
          <Dropdown
            label="Pages"
            options={filterOptions}
            onSelect={handleFilterSelect}
            selectedValue={selectedFilter}
          />
          <DateRangePicker onDateRangeChange={handleDateRangeChange} />
      </div>
    </div>

      <div className="p-2.5 mr-5">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2.5 p-2.5 mr-5">
          <MetricCard title="Total Views" value="1,504" icon="eye-outline" />
          <MetricCard title="Total Reach" value="284" icon="globe-outline" />
          <MetricCard title="Total Impressions" value="284" icon="megaphone-outline" />
          <MetricCard title="Total Spend" value="$7,842" icon="cash-outline" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 p-2.5 mr-5 mt-2.5">
          <div className="bg-white h-[50vh] p-5 rounded-2xl shadow-sm transition-all hover:shadow-md">
            <div>
              <h2 className="text-xl font-semibold mb-4">Top Performing Content</h2>
              <div className="mt-4">
                <ApexChart options={chartOptions} type="area" height={300} />
              </div>
            </div>
          </div>
          <div className="bg-white h-[50vh] p-5 rounded-2xl shadow-sm transition-all hover:shadow-md">
            <div>
              <h2 className="text-xl font-semibold mb-4">Summary</h2>
              <div className="mt-4">
                <ApexChart options={chartOptions} type="area" height={300} />
              </div>
            </div>
          </div>
          <div className="bg-white h-[50vh] p-5 rounded-2xl shadow-sm transition-all hover:shadow-md">
            <div>
              <h2 className="text-xl font-semibold mb-4">Chart</h2>
              <div className="mt-4">
                <ApexChart options={chartOptions} type="area" height={300} />
              </div>
            </div>
          </div>
          <div className="bg-white h-[50vh] p-5 rounded-2xl shadow-sm transition-all hover:shadow-md">
            <div>
              <h2 className="text-xl font-semibold mb-4">Chart</h2>
              <div className="mt-4">
                <ApexChart options={chartOptions} type="area" height={300} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}