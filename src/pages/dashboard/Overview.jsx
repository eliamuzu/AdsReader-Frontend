import { useState, useEffect } from 'react'
import DateRangePicker from '../../components/DateRangePicker'
import Dropdown from '../../components/Dropdown'
import { useSidebar } from '../../contexts/SidebarContext'
import { useFilter } from '../../contexts/FilterContext'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver';
import { get_pages, get_page_insights} from '../../services/pages'

const platformOptions = ['Facebook', 'Instagram']

const defaultTableData = [
  { date: 'January', reach: 1000, engagement: 500, spend: 2000, views: 5000 },
  { date: 'February', reach: 1200, engagement: 600, spend: 2500, views: 6000 },
]

export default function Overview() {
  const { toggleSidebar } = useSidebar()
  const { selectedFilter, setSelectedFilter, insightsData, setInsightsData } = useFilter()

  const [filterOptions, setFilterOptions] = useState([])
  const [tableData, setTableData] = useState(defaultTableData)
  const [selectedPlatform, setSelectedPlatform] = useState(platformOptions[0])
  const [dateRange, setDateRange] = useState(() => {
  const today = new Date();
  const last30Days = new Date();
  last30Days.setDate(today.getDate() - 30);

  return {
    since: last30Days.toISOString().split('T')[0], // Format as YYYY-MM-DD
    until: today.toISOString().split('T')[0], // Format as YYYY-MM-DD
  };
});
  
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
    if (!selectedFilter || selectedFilter === 'All') {
      setTableData(defaultTableData);
      return;
    }

    try {
      let rawData = insightsData; // Use global insights data if available
      console.log('Using global insights data:', rawData);

      if (!rawData) {
        console.log('Global insights data not available. Fetching from backend...');
        const responseData = await get_page_insights(selectedFilter.id, dateRange.since, dateRange.until); // Fetch from backend
        if (responseData) {
          const [inisghts, rawData] = responseData; // Set rawData to the fetched data
          console.log('Fetched insights data from backend:', rawData);
          setInsightsData(rawData); // Update the global insights data
        } else {
          console.warn('No valid data received from backend.'); 
          setTableData(defaultTableData);
          return;
        }
      }

      // Process raw data and aggregate by date
      const processedData = rawData.reduce((acc, metric) => {
        metric.values.forEach((value) => {
          // Normalize the date to remove the time component
          const normalizedDate = new Date(value.end_time).toLocaleDateString();

          const existingRow = acc.find((row) => row.date === normalizedDate);

          if (existingRow) {
            // Add the metric value to the existing row
            if (metric.name === 'page_impressions_unique') {
              existingRow.reach += value.value;
            } else if (metric.name === 'page_media_view') {
              existingRow.views += value.value;
            } else if (metric.name === 'page_post_engagements') {
              existingRow.engagement += value.value;
            }
          } else {
            // Create a new row for this date
            acc.push({
              date: normalizedDate, // Use the normalized date
              reach: metric.name === 'page_impressions_unique' ? value.value : 0,
              views: metric.name === 'page_media_view' ? value.value : 0,
              engagement: metric.name === 'page_post_engagements' ? value.value : 0,
              spend: 0, // Add spend if available in the raw data
            });
          }
        });
        return acc;
      }, []);

      setTableData(processedData);
    } catch (error) {
      console.error(`Failed to fetch data for ${selectedFilter.name}:`, error);
      setTableData(defaultTableData);
    }
  };

  loadPageData();
}, [selectedFilter, insightsData]);


  const handleDateRangeChange = (range) => {
    console.log('Date range changed:', range)
    // TODO: Fetch table data for the selected date range
  }

  const handleFilterSelect = async (filterId) => {
    const selected = filterOptions.find(option => option.id === filterId);
    setSelectedFilter(selected);
    setInsightsData(null); // Clear previous insights data
};

  const handlePlatformSelect = (platform) => {
    setSelectedPlatform(platform)
    console.log('Platform selected:', platform)
    // TODO: Fetch data filtered by platformt
  }

 
  const handleDownload = () => {
    
    const worksheet = XLSX.utils.json_to_sheet(tableData);

    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "OverviewData");

    
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
   
    const data = new Blob([excelBuffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'});
    saveAs(data, `Overview_Report_${selectedFilter}_${new Date().toISOString().slice(0, 10)}.xlsx`);

    console.log('Table data downloaded as XLSX file.');
  }

  return (
    <div>
      {/* Header Bar */}
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
        </div>
      </div>

      <div className="p-5">
        <div className="mt-4">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden"> 
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-3 border border-gray-300 text-left bg-[#273c75] text-white">
                    Date
                  </th>
                  <th className="p-3 border border-gray-300 text-left bg-[#273c75] text-white">
                    Reach
                  </th>
                  <th className="p-3 border border-gray-300 text-left bg-[#273c75] text-white">
                    Engagement
                  </th>
                  <th className="p-3 border border-gray-300 text-left bg-[#273c75] text-white">
                    Views
                  </th>
                  <th className="p-3 border border-gray-300 text-left bg-[#273c75] text-white">
                    Spend
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, idx) => (
                  <tr key={idx}>
                    <td className="p-3 border border-gray-300">{row.date}</td>
                    <td className="p-3 border border-gray-300">{row.reach}</td>
                    <td className="p-3 border border-gray-300">{row.engagement}</td>
                    <td className="p-3 border border-gray-300">{row.views}</td>
                    <td className="p-3 border border-gray-300">${row.spend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 flex justify-center"> 
            <button
              onClick={handleDownload}
              className="relative font-bold text-white bg-gray-900 py-2 px-8 border-none rounded-lg cursor-pointer overflow-hidden hover:bg-gray-800 flex justify-center items-center"
            >
              <span className="relative z-10">Download Table</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}