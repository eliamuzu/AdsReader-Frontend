import { useState } from 'react'
import DateRangePicker from '../../components/DateRangePicker'

export default function Overview() {
  const [tableData, setTableData] = useState([
    // Sample data - replace with API call
    { month: 'January', reach: 1000, engagement: 500, spend: 2000, views: 5000 },
    { month: 'February', reach: 1200, engagement: 600, spend: 2500, views: 6000 },
  ])

  const handleDateRangeChange = (range) => {
    console.log('Date range changed:', range)
    // TODO: Fetch table data for the selected date range
  }

  const handleDownload = () => {
    // TODO: Implement download functionality
    console.log('Download clicked')
  }

  return (
    <div>
      <div className="fixed top-0 left-[260px] w-[calc(100%-260px)] h-[60px] bg-transparent backdrop-blur-sm flex justify-end items-center px-4 shadow-md z-[2000] transition-all duration-300 max-md:left-0 max-md:w-full">
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

