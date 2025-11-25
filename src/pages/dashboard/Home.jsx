import { useState, useEffect, useRef } from 'react'
import DateRangePicker from '../../components/DateRangePicker'
import MetricCard from '../../components/MetricCard'
import ApexChart from '../../components/Chart'
import Dropdown from '../../components/Dropdown'
import { useSidebar } from '../../contexts/SidebarContext'
import { get_pages, fetchPage } from '../../services/pages'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

  
const platformOptions = ['Facebook', 'Instagram']

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
  const [selectedPlatform, setSelectedPlatform] = useState(platformOptions[0])
  const dashboardRef = useRef(null)


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
        console.log(`Loading data for ${selectedFilter} on ${selectedPlatform}`)
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
  }, [selectedFilter, selectedPlatform]);


  const handleDateRangeChange = (range) => {
    console.log('Date range changed:', range)
    // TODO: Fetch data for the selected date range
  }

  const handleFilterSelect = (filter) => { // Handler for dropdown selection
    setSelectedFilter(filter)
    console.log('Filter selected:', filter)
  }

  const handlePlatformSelect = (platform) => {
    setSelectedPlatform(platform)
    console.log('Platform selected:', platform)
  }

  const handleDownloadPDF = async () => {
    if (!dashboardRef.current) return

    try {
      // Hide the header controls before capturing
      const headerElement = document.querySelector('.fixed.top-0')
      if (headerElement) {
        headerElement.style.display = 'none'
      }

      // Wait a bit for charts to render
      await new Promise(resolve => setTimeout(resolve, 1000))

      const canvas = await html2canvas(dashboardRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      })

      // Restore header visibility
      if (headerElement) {
        headerElement.style.display = ''
      }

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 0

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
      
      let heightLeft = imgHeight * ratio
      let position = imgY

      while (heightLeft > 0) {
        position = heightLeft - pdfHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, imgHeight * ratio)
        heightLeft -= pdfHeight
      }

      const fileName = `Dashboard_Home_${selectedFilter}_${selectedPlatform}_${new Date().toISOString().slice(0, 10)}.pdf`
      pdf.save(fileName)
      console.log('Dashboard downloaded as PDF')
    } catch (error) {
      console.error('Error generating PDF:', error)

      const headerElement = document.querySelector('.fixed.top-0')
      if (headerElement) {
        headerElement.style.display = ''
      }
    }
  }



  return (
    <div>
    <div className="fixed top-0 left-[260px] w-[calc(100%-260px)] h-[60px] bg-transparent backdrop-blur-sm flex lg:justify-end items-center px-4 shadow-md z-[2000] transition-all duration-300 md:justify-end max-md:left-0 max-md:w-full">
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
          <Dropdown
            label="Platform"
            options={platformOptions}
            onSelect={handlePlatformSelect}
            selectedValue={selectedPlatform}
          />
          <DateRangePicker onDateRangeChange={handleDateRangeChange} />
          <button
            onClick={handleDownloadPDF}
            className="relative font-bold text-white bg-blue-600 py-2 px-4 border-none rounded-lg cursor-pointer overflow-hidden hover:bg-blue-700 flex justify-center items-center gap-2"
            title="Download Dashboard as PDF"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            <span className="relative z-10">Download</span>
          </button>
      </div>
    </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 p-2.5 mr-5 mt-2.5">
  {/* Chart 1 */}
  <div className="bg-white h-[50vh] p-5 rounded-2xl shadow-sm transition-all hover:shadow-md flex flex-col">
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4 shrink-0">Total Reach Vrs Total Engagement</h2>
      <div className="flex-1 min-h-0">
        <ApexChart 
            options={chartData} 
            series={chartData.series} 
            type="bar" 
            height="100%" 
            colors={chartData.color} 
        />
      </div>
    </div>
  </div>

  {/* Chart 2 */}
  <div className="bg-white h-[50vh] p-5 rounded-2xl shadow-sm transition-all hover:shadow-md flex flex-col">
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4 shrink-0">Total Reach</h2>
      <div className="flex-1 min-h-0">
        <ApexChart 
            options={defaultChartDatas} 
            series={defaultChartDatas.series} 
            type="area" 
            height="100%" 
        />
      </div>
    </div>
  </div>

  {/* Chart 3 */}
  <div className="bg-white h-[50vh] p-5 rounded-2xl shadow-sm transition-all hover:shadow-md flex flex-col">
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4 shrink-0">Total Engagement</h2>
      <div className="flex-1 min-h-0">
        <ApexChart 
            options={defaultChartDatas} 
            series={defaultChartDatas.series} 
            type="area" 
            height="100%" 
        />
      </div>
    </div>
  </div>

  {/* Chart 4 */}
  <div className="bg-white h-[50vh] p-5 rounded-2xl shadow-sm transition-all hover:shadow-md flex flex-col">
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4 shrink-0">Total Spend</h2>
      <div className="flex-1 min-h-0">
        <ApexChart 
            options={defaultChartDatas} 
            series={defaultChartDatas.series} 
            type="line" 
            height="100%" 
        />
      </div>
    </div>
  </div>
</div>
</div>
  )
}