import { useState } from 'react'
import DateRangePicker from '../../components/DateRangePicker'
import Dropdown from '../../components/Dropdown'
import { useSidebar } from '../../contexts/SidebarContext'
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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

  // NOTE: I've added a header row for the Excel export
  const tableData = [
    // Data objects
    { month: 'January', reach: 1000, engagement: 500, spend: 2000, views: 5000 },
    { month: 'February', reach: 1200, engagement: 600, spend: 2500, views: 6000 },
    // You can use a state hook if the data changes, but using the constant array for the demo
  ]

  const handleDateRangeChange = (range) => {
    console.log('Date range changed:', range)
    // TODO: Fetch table data for the selected date range
  }

  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter)
    console.log('Filter selected:', filter)
    // TODO: Fetch table data filtered by the selected filter
  }

  // UPDATED: Function to download the data as an Excel sheet (XLSX)
  const handleDownload = () => {
    // 1. Prepare data (add headers)
    const worksheet = XLSX.utils.json_to_sheet(tableData);

    // 2. Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "OverviewData");

    // 3. Write the workbook to a buffer (binary format)
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
    // 4. Create a Blob and save the file
    const data = new Blob([excelBuffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'});
    saveAs(data, `Overview_Report_${selectedFilter}_${new Date().toISOString().slice(0, 10)}.xlsx`);

    console.log('Table data downloaded as XLSX file.');
  }

  return (
    <div>
      {/* Header Bar */}
      <div className="fixed top-0 left-[260px] w-[calc(100%-260px)] h-[60px] bg-transparent backdrop-blur-sm flex justify-between items-center gap-2 px-4 shadow-md z-[2000] transition-all duration-300 max-md:left-0 max-md:w-full">
        <button
        onClick={toggleSidebar}
        className="bg-transparent border-none p-2 rounded text-gray-800 hover:bg-gray-100 cursor-pointer md:hidden"
        aria-label="Toggle sidebar"
        >
        <span className="material-symbols-outlined text-2xl">menu</span>
        </button>
        
        <Dropdown
          label="Brands / Filter"
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