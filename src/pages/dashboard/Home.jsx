import { useState, useEffect, useRef } from 'react'
import DateRangePicker from '../../components/DateRangePicker'
import MetricCard from '../../components/MetricCard'
import ApexChart from '../../components/Chart'
import Dropdown from '../../components/Dropdown'
import LoadingIndicator from '../../components/LoadingIndicator'
import { useSidebar } from '../../contexts/SidebarContext'
import { useFilter } from '../../contexts/FilterContext'
import { get_pages, get_page_insights } from '../../services/pages'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

  
const platformOptions = ['Facebook', 'Instagram']

const defaultMetrics = {
  totalViews: 0,
  totalReach: 0,
  totalEngagement: 0,
  totalSpend: 0,
};


export default function Home() {
  const { toggleSidebar } = useSidebar()
  const { 
    selectedFilter, 
    setSelectedFilter, 
    insightsData, 
    setInsightsData, 
    dateRange, 
    setDateRange, 
    tableData,
    setTableData } = useFilter()

  const [filterOptions, setFilterOptions] = useState([])
  const [selectedPlatform, setSelectedPlatform] = useState(platformOptions[0])
  const [metrics, setMetrics] = useState(defaultMetrics);
  const [isLoading, setIsLoading] = useState(false)
  const [chartData, setChartData] = useState({
  series: [],
  categories: [],
});
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
    if (!selectedFilter) return;

    if(Array.isArray(insightsData) && insightsData[0]) {
      console.log('Using existing global insights data:', insightsData);

      const updatedMetrics = {
          totalViews: insightsData[0].find((i) => i.name === 'page_media_view')?.value || 0,
          totalReach: insightsData[0].find((i) => i.name === 'page_impressions_unique')?.value || 0,
          totalEngagement: insightsData[0].find((i) => i.name === 'page_post_engagements')?.value || 0,
          totalSpend: insightsData[0].find((i) => i.name === 'total_spend')?.value || 0,
        };

        setMetrics(updatedMetrics); 
        const processedTableData = insightsData[1].reduce((acc, metric) => {
        metric.values.forEach((value) => {
          const normalizedDate = new Date(value.end_time).toLocaleDateString();
          const existingRow = acc.find((row) => row.date === normalizedDate);

          if (existingRow) {
            if (metric.name === 'page_impressions_unique') {
              existingRow.reach += value.value;
            } else if (metric.name === 'page_media_view') {
              existingRow.views += value.value;
            } else if (metric.name === 'page_post_engagements') {
              existingRow.engagement += value.value;
            }
          } else {
            acc.push({
              date: normalizedDate,
              reach: metric.name === 'page_impressions_unique' ? value.value : 0,
              views: metric.name === 'page_media_view' ? value.value : 0,
              engagement: metric.name === 'page_post_engagements' ? value.value : 0,
              spend: 0, // Add spend if available
              });
            }
          });
          return acc;
        }, []);

        setTableData(processedTableData);
        return;
    }
    try {
      setIsLoading(true);
      const responseData = await get_page_insights(selectedFilter.id, dateRange.since, dateRange.until); // Call without date range
      const [insights, rawData] = responseData;

      // Map insights to metrics
      const updatedMetrics = {
        totalViews: insights.find((i) => i.name === 'page_media_view')?.value || 0,
        totalReach: insights.find((i) => i.name === 'page_impressions_unique')?.value || 0,
        totalEngagement: insights.find((i) => i.name === 'page_post_engagements')?.value || 0,
        totalSpend: insights.find((i) => i.name === 'total_spend')?.value || 0,
      };

      setMetrics(updatedMetrics); // Update metrics state
      setInsightsData(responseData); // Update global insights data
    } catch (error) {
      console.error('Failed to fetch insights:', error);
      setMetrics(defaultMetrics); // Reset to default metrics on error
    } finally {
      setIsLoading(false);
    }
  }
    loadPageData();
  }, [selectedFilter, insightsData, dateRange]);

//useEffect to process chart data whenever tableData changes 
  useEffect(() => {
  const processChartData = () => {
    if (!tableData || tableData.length === 0) return;

    const categories = tableData.map((row) => row.date); // Dates for the x-axis
    const reachData = tableData.map((row) => row.reach); // Reach values
    const engagementData = tableData.map((row) => row.engagement); // Engagement values
    const viewsData = tableData.map((row) => row.views); // Views values
    const spendData = tableData.map((row) => row.spend); // Spend values

    setChartData({
      series: [
        { name: 'Reach', data: reachData },
        { name: 'Engagement', data: engagementData },
        { name: 'Views', data: viewsData },
        { name: 'Spend', data: spendData },
      ],
      categories,
    });
  };

  processChartData();
}, [tableData]);
 

  const handleDateRangeChange = async (range) => {
    console.log('Date range changed:', range);
    setDateRange(range);
    setInsightsData([]); // Clear existing insights data on date range change
  };

  const handleFilterSelect = async (filterId) => {
    const selected = filterOptions.find(option => option.id === filterId);
    setSelectedFilter(selected);
    setInsightsData(null); // Clear existing insights data on filter change
};

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
            options={filterOptions.map((option) => ({
              value: option.id,
              label: option.name
            }))}
            onSelect={(filterId) => handleFilterSelect(filterId)}
            selectedValue={selectedFilter?.id}
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

      <div className="p-2.5 mr-5" ref={dashboardRef}>
         {isLoading ? (
          <LoadingIndicator message="Fetching insights..." />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-2.5 p-2.5 mr-5">
            <MetricCard title="Total Views" value={metrics.totalViews} icon="eye-outline" />
            <MetricCard title="Total Reach" value={metrics.totalReach} icon="globe-outline" />
            <MetricCard title="Total Engagement" value={metrics.totalEngagement} icon="megaphone-outline" />
            <MetricCard title="Total Spend" value={`$${metrics.totalSpend}`} icon="cash-outline" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 p-2.5 mr-5 mt-2.5">
          <div className="bg-white h-[50vh] p-5 rounded-2xl shadow-sm transition-all hover:shadow-md">
            <div>
              <h2 className="text-xl font-semibold mb-4">Total Reach Vrs Total Engagement</h2>
              <div className="mt-4">
                {/* Use dynamic chartData */}
                <ApexChart options={{
                    chart: { id: 'reach-vs-engagement' },
                    xaxis: { categories: chartData.categories },
                  }}
                  series={[
                    { name: 'Reach', data: chartData.series[0]?.data || [] },
                    { name: 'Engagement', data: chartData.series[1]?.data || [] },
                  ]}
                  type="bar" height={385} 
                  colors={chartData.color}   />
              </div>
            </div>
          </div>
          <div className="bg-white h-[50vh] p-5 rounded-2xl shadow-sm transition-all hover:shadow-md">
            <div>
              <h2 className="text-xl font-semibold mb-4">Total Reach</h2>
              <div className="mt-4">
                {/* Use dynamic chartData */}
                <ApexChart
                    options={{
                      chart: { id: 'reach-vs-engagement' },
                      xaxis: { categories: chartData.categories },
                    }}
                    series={[
                      { name: 'Reach', data: chartData.series[0]?.data || [] }
                    ]} type="line" height={385} width={100} />
              </div>
            </div>
          </div>
          <div className="bg-white h-[50vh] p-5 rounded-2xl shadow-sm transition-all hover:shadow-md">
            <div>
              <h2 className="text-xl font-semibold mb-4">Total Engagement </h2>
              <div className="mt-4">
                {/* Use dynamic chartData */}
                <ApexChart options={{
                      chart: { id: 'reach-vs-engagement' },
                      xaxis: { categories: chartData.categories },
                    }}
                    series={[
                      { name: 'Views', data: chartData.series[2]?.data || [] }
                    ]} type="area" height={385} width={100} 
                />
              </div>
            </div>
          </div>
          <div className="bg-white h-[50vh] p-5 rounded-2xl shadow-sm transition-all hover:shadow-md">
            <div>
              <h2 className="text-xl font-semibold mb-4">Total Spend</h2>
              <div className="mt-4">
                {/* Use dynamic chartData, overriding type to line */}
                <ApexChart options={chartData} series={chartData.series} type="line" height={385} />
              </div>
            </div>
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
            options={chartData} 
            series={chartData.series} 
            type="area" 
            height="100%" 
        />
      </div>
    </div>
  </div>

</div>
</div>
    </div>
  )
}