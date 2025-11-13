import { useState, useEffect } from 'react'
import DateRangePicker from '../../components/DateRangePicker'
import Dropdown from '../../components/Dropdown'
import MetricCard from '../../components/MetricCard'
import ApexChart from '../../components/Chart'
import { useSidebar } from '../../contexts/SidebarContext'

export default function Analytics() {
   const { toggleSidebar } = useSidebar()
  const [selectedFilter, setSelectedFilter] = useState('All')

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

  const handleDateRangeChange = (range) => {
    console.log('Date range changed:', range)
  }

  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter)
    console.log('Filter selected:', filter)
  }

  const chartOptions = {
    series: [
      {
        name: 'series1',
        data: [31, 40, 28, 51, 42, 109, 100, 200],
      },
      {
        name: 'series2',
        data: [11, 32, 45, 32, 34, 52, 41, 150],
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
        '2018-09-19T07:30:00.000Z',
      ],
    },
  }

  return (
    <div>
      <div className="fixed top-0 left-[260px] w-[calc(100%-260px)] h-[60px] bg-transparent backdrop-blur-sm flex justify-between items-center gap-2 px-4 shadow-md z-[2000] transition-all duration-300 max-md:left-0 max-md:w-full">
       <button
        onClick={toggleSidebar}
        className="bg-transparent border-none p-2 rounded text-gray-800 hover:bg-gray-100 cursor-pointer md:hidden"
        aria-label="Toggle sidebar"
      >
        <span className="material-symbols-outlined text-2xl">menu</span>
      </button>
        <Dropdown
          label="Pages"
          options={filterOptions}
          onSelect={handleFilterSelect}
          selectedValue={selectedFilter}
        />
        <DateRangePicker onDateRangeChange={handleDateRangeChange} />
      </div>

      <div className="p-2.5 mr-5">
        {/* MODIFICATION 1: Metric Cards - Changed md:grid-cols-1 to grid-cols-2 lg:grid-cols-4 and removed the extra md:grid-cols-1 you had */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2.5 p-2.5 mr-5">
          <MetricCard title="Total Views" value="1,504" icon="eye-outline" />
          <MetricCard title="Total Reach" value="284" icon="globe-outline" />
          <MetricCard title="Total Impressions" value="284" icon="megaphone-outline" />
          <MetricCard title="Total Spend" value="$7,842" icon="cash-outline" />
        </div>

        {/* MODIFICATION 2: Chart Container - Changed grid-cols-2 to grid-cols-1 md:grid-cols-2 */}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-2.5 p-2.5 mr-5 mt-2.5">
          <div className="bg-white h-[50vh] p-5 rounded-2xl shadow-sm transition-all hover:shadow-md">
            <div>
              <h2 className="text-xl font-semibold mb-4">Top Performing Content</h2>
              <div id="bar">
                <ApexChart
                  options={{ ...chartOptions, chart: { type: 'bar' } }}
                  type="bar"
                  height={300}
                />
              </div>
            </div>
          </div>
          <div className="bg-white h-[50vh] p-5 rounded-2xl shadow-sm transition-all hover:shadow-md">
            <div>
              <h2 className="text-xl font-semibold mb-4">Summary</h2>
              <div id="Reach-line">
                <ApexChart
                  options={{ ...chartOptions, chart: { type: 'line' } }}
                  type="line"
                  height={300}
                />
              </div>
            </div>
          </div>
          <div className="bg-white h-[50vh] p-5 rounded-2xl shadow-sm transition-all hover:shadow-md">
            <div>
              <h2 className="text-xl font-semibold mb-4">Chart</h2>
              <div className="mt-4">
                <div id="area">
                  <ApexChart options={chartOptions} type="area" height={300} />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white h-[50vh] p-5 rounded-2xl shadow-sm transition-all hover:shadow-md">
            <div>
              <h2 className="text-xl font-semibold mb-4">Chart</h2>
              <div id="line">
                <ApexChart
                  options={{ ...chartOptions, chart: { type: 'line' } }}
                  type="line"
                  height={300}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}