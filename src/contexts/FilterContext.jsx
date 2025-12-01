import React, { createContext, useContext, useState } from 'react';

const FilterContext = createContext();

export function FilterProvider({ children }) {
  const [selectedFilter, setSelectedFilter] = useState();
  const [insightsData, setInsightsData] = useState(null);

  return (
    <FilterContext.Provider value={{ selectedFilter, setSelectedFilter, insightsData, setInsightsData }}>
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