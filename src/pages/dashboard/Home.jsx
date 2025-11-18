import { useState, useEffect } from 'react'
import DateRangePicker from '../../components/DateRangePicker'
import MetricCard from '../../components/MetricCard'
import ApexChart from '../../components/Chart'
import Dropdown from '../../components/Dropdown'
import { useSidebar } from '../../contexts/SidebarContext'
import { get_pages, fetchPage } from '../../services/pages'

  
const defaultChartData = {
  series: [
    {
      name: 'series1',
      data: [31, 40, 28, 51, 42, 109, 100],
      // color: 'cyan',
    },
    {
      name: 'series2',
      data: [11, 32, 45, 32, 34, 52, 41],
      // color: 'indigo',
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

};
const defaultChartDatas = {
  series: [
    // {
    //   name: 'series1',
    //   data: [31, 40, 28, 51, 42, 109, 100],
    // },
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
};

export default function Home() {
  const { toggleSidebar } = useSidebar()
  const [filterOptions, setFilterOptions] = useState([])
  const [selectedFilter, setSelectedFilter] = useState('All') 
  const [chartData, setChartData] = useState(defaultChartData);


  useEffect(() => {
    // Load ionicons
    const script = document.createElement('script')
    script.type = 'module'
    script.src = 'https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js'
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, []);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await get_pages();
        if (response) {
          setFilterOptions(response);
        }
      } catch (error) {
        console.error("Failed to fetch pages:", error);
      }
    };

    fetchPages();
  }, []);

  useEffect(() => {
    const loadPageData = async () => {
      if (selectedFilter === 'All') {
        
        setChartData(defaultChartData);
        return;
      }
      
      try {
        
        const response = await fetchPage(selectedFilter); 
        
        if (response && response.series && response.xaxis) {
          
          setChartData(response);
        } else {
          
          console.warn(`No valid data received for filter: ${selectedFilter}. Using default data.`);
          setChartData(defaultChartData);
        }
      } catch (error) {
        console.error(`Failed to fetch data for ${selectedFilter}:`, error);
       
        setChartData(defaultChartData);
      }
    };

    loadPageData();
  }, [selectedFilter]);


  const handleDateRangeChange = (range) => {
    console.log('Date range changed:', range)
    // TODO: Fetch data for the selected date range
  }

  const handleFilterSelect = (filter) => { // Handler for dropdown selection
    setSelectedFilter(filter)
    console.log('Filter selected:', filter)
  }



  return (
    <div>
    <div className="fixed top-0 left-[260px] w-[calc(100%-260px)] h-[60px] bg-transparent backdrop-blur-sm flex lg:justify-end items-center px-4 shadow-md z-[2000] transition-all duration-300 md:justify-between max-md:left-0 max-md:w-full">
      <button
        onClick={toggleSidebar}
        className="bg-transparent border-none p-2 rounded text-gray-800 hover:bg-gray-100 cursor-pointer md:hidden"
        aria-label="Toggle sidebar"
      >
        <span className="material-symbols-outlined text-2xl">menu</span>
      </button>
      
      
      <div className='flex items-center gap-2'> 
          <Dropdown
            label="Page Selector"
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 p-2.5 mr-5 mt-2.5">
          <div className="bg-white h-[50vh] p-5 rounded-2xl shadow-sm transition-all hover:shadow-md">
            <div>
              <h2 className="text-xl font-semibold mb-4">Total Reach Vrs Total Engagement</h2>
              <div className="mt-4">
                {/* Use dynamic chartData */}
                <ApexChart options={chartData} series={chartData.series} type="bar" height={420} colors={chartData.color}   />
              </div>
            </div>
          </div>
          <div className="bg-white h-[50vh] p-5 rounded-2xl shadow-sm transition-all hover:shadow-md">
            <div>
              <h2 className="text-xl font-semibold mb-4">Total Reach</h2>
              <div className="mt-4">
                {/* Use dynamic chartData */}
                <ApexChart options={defaultChartDatas} series={defaultChartDatas.series} type="area" height={420} />
              </div>
            </div>
          </div>
          <div className="bg-white h-[50vh] p-5 rounded-2xl shadow-sm transition-all hover:shadow-md">
            <div>
              <h2 className="text-xl font-semibold mb-4">Total Engagement </h2>
              <div className="mt-4">
                {/* Use dynamic chartData */}
                <ApexChart options={defaultChartDatas} series={defaultChartDatas.series} type="area" height={420} />
              </div>
            </div>
          </div>
          <div className="bg-white h-[50vh] p-5 rounded-2xl shadow-sm transition-all hover:shadow-md">
            <div>
              <h2 className="text-xl font-semibold mb-4">Total Spend</h2>
              <div className="mt-4">
                {/* Use dynamic chartData, overriding type to line */}
                <ApexChart options={defaultChartDatas} series={defaultChartDatas.series} type="line" height={420} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}