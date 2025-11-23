import { useState, useEffect, useRef } from 'react'
import DateRangePicker from '../../components/DateRangePicker'
import Dropdown from '../../components/Dropdown'
import MetricCard from '../../components/MetricCard'
import ApexChart from '../../components/Chart'
import { useSidebar } from '../../contexts/SidebarContext'
import { get_pages, fetchPage } from '../../services/pages'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const platformOptions = ['Facebook', 'Instagram']

const chartOptions = {
    series: [
      {
        name: 'series1',
        data: [31, 40, 28, 51, 42, 109, 100, 200],
      },
      // {
      //   name: 'series2',
      //   data: [11, 32, 45, 32, 34, 52, 41, 150],
      // },
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
  const chartOption = {
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

  // 1. Donut Chart Data
  // const donutChartSeries = [44, 55, 41, 17, 15]
  // const donutChartOptions = {
  //   labels: ['Organic', 'Paid Search', 'Social Media', 'Referral', 'Direct'],
  //   chart: {
  //     type: 'donut',
  //   },
  //   responsive: [
  //     {
  //       breakpoint: 480,
  //       options: {
  //         chart: {
  //           width: 200,
  //         },
  //         legend: {
  //           position: 'bottom',
  //         },
  //       },
  //     },
  //   ],
  // }

  // 2. Radial Bar Chart Data
  // const radialBarSeries = [78] // Represents 78% progress
  // const radialBarOptions = {
  //   labels: ['Goal Completion'],
  //   chart: {
  //     type: 'radialBar',
  //   },
  //   plotOptions: {
  //     radialBar: {
  //       hollow: {
  //         size: '70%',
  //       },
  //       dataLabels: {
  //         showOn: 'always',
  //         name: {
  //           show: true,
  //           fontSize: '22px',
  //         },
  //         value: {
  //           show: true,
  //           fontSize: '16px',
  //           formatter: function (val) {
  //             return val + '%'
  //           },
  //         },
  //       },
  //     },
  //   },
  // }
  
  // 3. Heatmap Chart Data
  // const heatmapSeries = [
  //   {
  //     name: 'Mon',
  //     data: [{x: '9AM', y: 44}, {x: '10AM', y: 55}, {x: '11AM', y: 41}, {x: '12PM', y: 67}, {x: '1PM', y: 22}, {x: '2PM', y: 43}, {x: '3PM', y: 21}],
  //   },
  //   {
  //     name: 'Tue',
  //     data: [{x: '9AM', y: 13}, {x: '10AM', y: 23}, {x: '11AM', y: 20}, {x: '12PM', y: 8}, {x: '1PM', y: 5}, {x: '2PM', y: 12}, {x: '3PM', y: 27}],
  //   },
  //   {
  //     name: 'Wed',
  //     data: [{x: '9AM', y: 25}, {x: '10AM', y: 34}, {x: '11AM', y: 19}, {x: '12PM', y: 40}, {x: '1PM', y: 45}, {x: '2PM', y: 22}, {x: '3PM', y: 8}],
  //   },
  //   {
  //     name: 'Thu',
  //     data: [{x: '9AM', y: 49}, {x: '10AM', y: 58}, {x: '11AM', y: 23}, {x: '12PM', y: 40}, {x: '1PM', y: 43}, {x: '2PM', y: 22}, {x: '3PM', y: 8}],
  //   },
  //   {
  //     name: 'Fri',
  //     data: [{x: '9AM', y: 12}, {x: '10AM', y: 25}, {x: '11AM', y: 34}, {x: '12PM', y: 48}, {x: '1PM', y: 7}, {x: '2PM', y: 15}, {x: '3PM', y: 26}],
  //   },
  // ];

  // const heatmapOptions = {
  //   chart: {
  //     type: 'heatmap',
  //   },
  //   dataLabels: {
  //     enabled: false,
  //   },
  //   colors: ["#008FFB"],
  //   title: {
  //     text: 'Hourly Activity Intensity',
  //   },
  //   xaxis: {
  //     type: 'category', // Override default 'datetime'
  //     categories: ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM'],
  //   },
  //   tooltip: {
  //     x: {
  //       show: true,
  //       formatter: (val) => val,
  //     },
  //   },
  // };

  // // 4. Bubble Chart Data (3D data representation: X, Y, and Size)
  // const generateData = (baseval, count, yrange) => {
  //   let i = 0;
  //   let series = [];
  //   while (i < count) {
  //     let x = baseval;
  //     let y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
  //     let z = Math.floor(Math.random() * (75 - 15 + 1)) + 15; // Size (Z)
  //     series.push([x, y, z]);
  //     baseval += 86400000; // Increment x by 1 day
  //     i++;
  //   }
  //   return series;
  // };

  // const bubbleSeries = [
  //   {
  //     name: 'Product A',
  //     data: generateData(new Date('11 Feb 2017 GMT').getTime(), 20, { min: 10, max: 60 }),
  //   },
  //   {
  //     name: 'Product B',
  //     data: generateData(new Date('11 Feb 2017 GMT').getTime(), 20, { min: 20, max: 70 }),
  //   },
  //   {
  //     name: 'Product C',
  //     data: generateData(new Date('11 Feb 2017 GMT').getTime(), 20, { min: 30, max: 80 }),
  //   },
  // ];

  // const bubbleOptions = {
  //   chart: {
  //     type: 'bubble',
  //   },
  //   xaxis: {
  //     tickAmount: 12,
  //     type: 'datetime',
  //     labels: {
  //       formatter: function(val) {
  //         return new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  //       }
  //     }
  //   },
  //   yaxis: {
  //     max: 100,
  //   },
  //   fill: {
  //     opacity: 0.8,
  //   },
  // };

export default function Analytics() {
  const { toggleSidebar } = useSidebar()
  const [filterOptions, setFilterOptions] = useState([])
  const [selectedFilter, setSelectedFilter] = useState('All') 
  const [chartData, setChartData] = useState(chartOptions);
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
  }, [])

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
          
          setChartData(chartOptions);
          return;
        }
        
        try {
          console.log(`Loading analytics for ${selectedFilter} on ${selectedPlatform}`)
          const response = await fetchPage(selectedFilter); 
          
          if (response && response.series && response.xaxis) {
            
            setChartData(response);
          } else {
            
            console.warn(`No valid data received for filter: ${selectedFilter}. Using default data.`);
            setChartData(defaultChartData);
          }
        } catch (error) {
          console.error(`Failed to fetch data for ${selectedFilter}:`, error);
         
          setChartData(chartOptions);
        }
      };
  
      loadPageData();
    }, [selectedFilter, selectedPlatform]);
  
  

  const handleDateRangeChange = (range) => {
    console.log('Date range changed:', range)
  }

  const handleFilterSelect = (filter) => {
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
     
      const headerElement = document.querySelector('.fixed.top-0')
      if (headerElement) {
        headerElement.style.display = 'none'
      }

      
      await new Promise(resolve => setTimeout(resolve, 1000))

      const canvas = await html2canvas(dashboardRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      })

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

      const fileName = `Dashboard_Analytics_${selectedFilter}_${selectedPlatform}_${new Date().toISOString().slice(0, 10)}.pdf`
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
      <div className="fixed top-0 left-[260px] w-[calc(100%-260px)] h-[60px] bg-transparent backdrop-blur-sm flex justify-end items-center gap-2 px-4 shadow-md z-[2000] transition-all duration-300 max-md:left-0 max-md:w-full">
       <button
        onClick={toggleSidebar}
        className="bg-transparent border-none p-2 rounded text-gray-800 hover:bg-gray-100 cursor-pointer md:hidden"
        aria-label="Toggle sidebar"
      >
        <span className="material-symbols-outlined text-2xl">menu</span>
      </button>
        <div className="flex items-center gap-2">
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
            <span className="relative z-10">Download PDF</span>
          </button>
        </div>
      </div>

      <div className="p-2.5 mr-5" ref={dashboardRef}>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2.5 p-2.5 mr-5">
          <MetricCard title="Total Views" value="1,504" icon="eye-outline" />
          <MetricCard title="Total Reach" value="284" icon="globe-outline" />
          <MetricCard title="Total Engagement" value="284" icon="megaphone-outline" />
          <MetricCard title="Total Spend" value="$7,842" icon="cash-outline" />
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-2.5 p-2.5 mr-5 mt-2.5">
          {/* 1. Bar Chart */}
          <div className="bg-white h-[50vh] p-5 rounded-2xl shadow-sm transition-all hover:shadow-md">
            <div>
              <h2 className="text-xl font-semibold mb-4">Reach Vrs Engagement</h2>
              <div id="bar">
                <ApexChart
                  options={{ ...chartOption, chart: { type: 'bar' } }}
                  series={chartOption.series}
                  type="bar"
                  height={420}
                />
              </div>
            </div>
          </div>
          {/* 2. Line Chart */}
          <div className="bg-white h-[50vh] p-5 rounded-2xl shadow-sm transition-all hover:shadow-md">
            <div>
              <h2 className="text-xl font-semibold mb-4">Reach Over Time </h2>
              <div id="Reach-line">
                <ApexChart
                  options={{ ...chartOptions, chart: { type: 'line' } }}
                  series={chartOptions.series}
                  type="line"
                  height={420}
                />
              </div>
            </div>
          </div>
          {/* 3. Area Chart */}
          <div className="bg-white h-[50vh] p-5 rounded-2xl shadow-sm transition-all hover:shadow-md">
            <div>
              <h2 className="text-xl font-semibold mb-4">Engagement Over Time</h2>
              <div className="mt-4">
                <div id="line">
                  <ApexChart 
                    options={chartOptions} 
                    series={chartOptions.series}
                    type="line" 
                    height={420} 
                  />
                </div>
              </div>
            </div>
          </div>
          {/* 4. Line Chart (Second Instance) */}
          <div className="bg-white h-[50vh] p-5 rounded-2xl shadow-sm transition-all hover:shadow-md">
            <div>
              <h2 className="text-xl font-semibold mb-4">Spends</h2>
              <div id="area">
                <ApexChart
                  options={{ ...chartOptions, chart: { type: 'line' } }}
                  series={chartOptions.series}
                  type="area"
                  height={420}
                />
              </div>
            </div>
          </div>
          {/* 5. Area Chart */}
          <div className="bg-white h-[50vh] p-5 rounded-2xl shadow-sm transition-all hover:shadow-md">
            <div>
              <h2 className="text-xl font-semibold mb-4">Page Growth</h2>
              <div className="mt-4">
                <div id="area">
                  <ApexChart 
                    options={chartOptions} 
                    series={chartOptions.series}
                    type="area" 
                    height={420} 
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white h-[50vh] p-5 rounded-2xl shadow-sm transition-all hover:shadow-md">
            <div>
              <h2 className="text-xl font-semibold mb-4">Views Over Time</h2>
              <div className="mt-4">
                <div id="area">
                  <ApexChart 
                    options={chartOptions} 
                    series={chartOptions.series}
                    type="area" 
                    height={420} 
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* 6. Radial Bar Chart (New) */}
          {/* <div className="bg-white h-[50vh] p-5 rounded-2xl shadow-sm transition-all hover:shadow-md">
            <div>
              <h2 className="text-xl font-semibold mb-4">Quarterly Goal Progress (Radial Bar)</h2>
              <div id="radialbar">
                <ApexChart
                  options={radialBarOptions}
                  series={radialBarSeries}
                  type="radialBar"
                  height={420}
                />
              </div>
            </div>
          </div> */}
          {/* 7. Heatmap Chart (New) */}
          {/* <div className="bg-white h-[50vh] p-5 rounded-2xl shadow-sm transition-all hover:shadow-md">
            <div>
              <h2 className="text-xl font-semibold mb-4">Daily Engagement Intensity (Heatmap)</h2>
              <div id="heatmap">
                <ApexChart
                  options={heatmapOptions}
                  series={heatmapSeries}
                  type="heatmap"
                  height={420}
                />
              </div>
            </div>
          </div> */}
          {/* 8. Bubble Chart (New) */}
          {/* <div className="bg-white h-[50vh] p-5 rounded-2xl shadow-sm transition-all hover:shadow-md">
            <div>
              <h2 className="text-xl font-semibold mb-4">Product Performance (Bubble)</h2>
              <div id="bubble">
                <ApexChart
                  options={bubbleOptions}
                  series={bubbleSeries}
                  type="bubble"
                  height={420}
                />
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}