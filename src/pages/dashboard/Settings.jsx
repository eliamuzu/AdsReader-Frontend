import { useState } from 'react'
import DateRangePicker from '../../components/DateRangePicker'
import Dropdown from '../../components/Dropdown'
import { useSidebar } from '../../contexts/SidebarContext'

export default function Settings() {
  const { toggleSidebar } = useSidebar()
  const [selectedPage, setSelectedPage] = useState('All')

// --- CLIENT ACCESS MANAGEMENT STATE ---
  const [clients, setClients] = useState([
    // Dummy data structure for existing clients
    { 
      id: 1, 
      name: 'Marketing Team', 
      email: 'marketing@corp.com',
      pages: ['Bel-Ice', 'BelCola'], 
      startDate: '2025-01-01', 
      endDate: '2025-12-31' 
    },
    { 
      id: 2, 
      name: 'Finance Dept.', 
      email: 'finance@corp.com',
      pages: ['BelPak', 'Bel7Star'], 
      startDate: '2025-03-01', 
      endDate: '2025-09-30' 
    },
  ])
  // State for the Add New Client form fields
  const [newClientName, setNewClientName] = useState('')
  const [newClientEmail, setNewClientEmail] = useState('')
  const [newClientPassword, setNewClientPassword] = useState('')
  const [newClientPages, setNewClientPages] = useState([])
  const [newClientDateRange, setNewClientDateRange] = useState({ startDate: '', endDate: '' })
// ---------------------------------------------

  const pageOptions = [
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
    console.log('Date range changed for header:', range)
    // Note: This header DateRangePicker is typically for viewing data, 
    // not for setting client access, but the original logic is preserved.
  }

  const handlePageSelect = (page) => {
    setSelectedPage(page)
    console.log('Page selected in header:', page)
  }

// --- NEW FUNCTIONS FOR CLIENT ACCESS MANAGEMENT ---

  const handlePageToggle = (page) => {
    // Toggles a page in the new client's list of accessible pages
    setNewClientPages(prevPages => 
      prevPages.includes(page)
        ? prevPages.filter(p => p !== page)
        : [...prevPages, page]
    )
  }

  const handleAddClient = () => {
    if (
      newClientEmail.trim() && 
      newClientPassword.trim() && 
      newClientPages.length > 0 && 
      newClientDateRange.startDate && 
      newClientDateRange.endDate
    ) {
      const newClient = {
        id: Date.now(), 
        name: newClientName || newClientEmail.split('@')[0], // Use name or default from email
        email: newClientEmail,
        // WARNING: In a production app, the password MUST be hashed on the server before saving. 
        // This front-end state is for demonstration only.
        password: newClientPassword, 
        pages: newClientPages,
        startDate: newClientDateRange.startDate,
        endDate: newClientDateRange.endDate,
      }
      
      // In a real application, make an API call to save to the database here.
      setClients([...clients, newClient])

      // Reset form fields
      setNewClientName('')
      setNewClientEmail('')
      setNewClientPassword('')
      setNewClientPages([])
      setNewClientDateRange({ startDate: '', endDate: '' })
      alert(`Client ${newClient.email} added! Remember to securely manage the password.`);
    } else {
      alert('Please fill in email, password, select pages, and define the start and end date range.');
    }
  }

  const handleRemoveClient = (id) => {
    setClients(clients.filter(client => client.id !== id))
  }
// ---------------------------------------------------

  return (
    <div>
      {/* --- ORIGINAL HEADER --- */}
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
          options={pageOptions}
          onSelect={handlePageSelect}
          selectedValue={selectedPage}
        />
        <DateRangePicker onDateRangeChange={handleDateRangeChange} />
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="p-5">
        <div className="mt-4">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Settings</h2>
            <p className="text-gray-600 mb-6">Use this section to manage client credentials and access permissions.</p>

            <h3 className="text-xl font-semibold mb-3 border-t pt-4">👤 Manage Client Access</h3>
            
            {/* --- ADD NEW CLIENT FORM --- */}
            <div className='p-4 border rounded-lg mb-6 bg-gray-50'>
              <h4 className='text-lg font-medium mb-3'>Add New Client Rule</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 items-end">
                
                {/* Client Email Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client Email</label>
                  <input
                    type="email"
                    value={newClientEmail}
                    onChange={(e) => setNewClientEmail(e.target.value)}
                    placeholder="client@example.com"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Client Password Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Set Password</label>
                  <input
                    type="password"
                    value={newClientPassword}
                    onChange={(e) => setNewClientPassword(e.target.value)}
                    placeholder="Secure Password"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                {/* Client Name Input (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client Name (Optional)</label>
                  <input
                    type="text"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    placeholder="e.g., John Doe"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
              </div>

              {/* Date Range for Client Access */}
              <label className="block text-sm font-medium text-gray-700 mb-1">Access Date Range</label>
              <div className="flex gap-4 mb-4 items-center">
                  <input
                    type="date"
                    value={newClientDateRange.startDate}
                    onChange={(e) => setNewClientDateRange({ ...newClientDateRange, startDate: e.target.value })}
                    className="p-2 border border-gray-300 rounded-md"
                    title="Start Date"
                  />
                  <span className="text-gray-600">to</span>
                  <input
                    type="date"
                    value={newClientDateRange.endDate}
                    onChange={(e) => setNewClientDateRange({ ...newClientDateRange, endDate: e.target.value })}
                    className="p-2 border border-gray-300 rounded-md"
                    title="End Date"
                  />
              </div>

              {/* Page Selection Checkboxes (Multi-select) */}
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Accessible Pages:</label>
              <div className="flex flex-wrap gap-x-4 gap-y-2 p-2 border border-gray-300 rounded-md bg-white mb-4">
                {pageOptions.slice(1).map(page => ( // Skipping 'All' for granular control
                  <div key={page} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`page-${page}`}
                      checked={newClientPages.includes(page)}
                      onChange={() => handlePageToggle(page)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={`page-${page}`} className="ml-2 text-sm font-medium text-gray-900">{page}</label>
                  </div>
                ))}
              </div>
              
              {/* Add Button */}
              <button
                onClick={handleAddClient}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150"
              >
                Create Client and Access Rule
              </button>
            </div>
            
            {/* --- CURRENT CLIENTS TABLE --- */}
            <h4 className='text-lg font-medium mb-3'>Existing Access Rules</h4>
            <div className="overflow-x-auto border rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Name/ID</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accessible Pages</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Range</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{client.name}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">{client.email}</td>
                      <td className="px-4 py-2 whitespace-normal text-sm text-gray-600 max-w-xs">{client.pages.join(', ')}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                        {client.startDate} to {client.endDate}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleRemoveClient(client.id)}
                          className="text-red-600 hover:text-red-800 transition duration-150"
                        >
                          Remove
                        </button>
                      </td>
                  </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}