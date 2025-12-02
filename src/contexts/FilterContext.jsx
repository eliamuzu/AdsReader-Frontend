import React, { createContext, useContext, useState } from 'react';

const FilterContext = createContext();

export function FilterProvider({ children }) {
  const [selectedFilter, setSelectedFilter] = useState();
  const [insightsData, setInsightsData] = useState(null);
  const [dateRange, setDateRange] = useState(() => {
    const today = new Date();
    const last30Days = new Date();
      last30Days.setDate(today.getDate() - 30);

      return {
        since: last30Days.toISOString().split('T')[0], // Format as YYYY-MM-DD
        until: today.toISOString().split('T')[0], // Format as YYYY-MM-DD
      }; 
  });

  return (
    <FilterContext.Provider value={{ selectedFilter, setSelectedFilter, insightsData, setInsightsData, dateRange, setDateRange }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
}