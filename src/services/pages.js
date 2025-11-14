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
    
    const mappedPages = pages.map((page) => page.page_name )
    
    console.log('Fetched pages:', mappedPages)
    return mappedPages
  } catch (error) {
    console.error('Error fetching pages:', error)
    throw error
  }
}