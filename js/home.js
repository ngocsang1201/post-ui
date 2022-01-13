import postApi from './api/postApi'
import { initPagination, registerSearchInput, renderPagination, renderPostList } from './utils'

const getDataAndRender = async (queryParams) => {
  try {
    const { data, pagination } = await postApi.getAll(queryParams)
    renderPostList('postList', data)
    renderPagination('pagination', pagination)
  } catch (error) {
    console.log('Failed to get data', error)
  }
}

const handleFilterChange = (name, value) => {
  const url = new URL(window.location)
  url.searchParams.set(name, value)

  if (name === 'title_like') url.searchParams.set('_page', 1)

  history.pushState({}, '', url)

  getDataAndRender(url.searchParams)
}

const getQueryParams = () => {
  const url = new URL(window.location)

  if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
  if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6)

  history.pushState({}, '', url)

  return url.searchParams
}

;(async () => {
  const queryParams = getQueryParams()
  getDataAndRender(queryParams)

  initPagination({
    elementId: 'pagination',
    defaultParams: queryParams,
    onChange: (page) => handleFilterChange('_page', page),
  })

  registerSearchInput({
    elementId: 'searchInput',
    defaultParams: queryParams,
    onChange: (value) => handleFilterChange('title_like', value),
  })
})()
