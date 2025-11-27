import api from './api'

export async function fetchPage(pageId) {
  try {
    const response = await api.get(`/api/pages/${pageId}`)
    return response.data
  } catch (error) {
    console.error("Error fetching page data:", error)
    throw error
  }
}


export async function  get_pages() {
  try {
    const response = await api.get('/api/pages')
    const pages = response.data
  
    const mappedPages = pages.map((page) => ({
      id: page.id,
      name: page.page_name
    }));
    
    return mappedPages
  } catch (error) {
    console.error('Error fetching pages:', error)
    throw error
  }
}

export async function get_page_insights(pageId, since, until) {
  try { 
    const response = await api.get(`/api/pages/${pageId}/insights?since=${since}&until=${until}`)
    console.log('Insights response:', response.data);


    const mappedInsights = response.data.data.map((insight) => ({
      name : insight.metric_name,
      value : insight .total_value.toLocaleString(),
    }))

    return mappedInsights
  } catch (error) { 
      console.error("Error fetching insights: ", error)
      throw error
  }
}