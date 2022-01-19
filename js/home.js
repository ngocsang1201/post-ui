import postApi from './api/postApi'
import {
  initPagination,
  registerSearchInput,
  renderPagination,
  renderPostList,
  toast,
} from './utils'

const getDataAndRender = async (queryParams) => {
  try {
    const { data, pagination } = await postApi.getAll(queryParams)
    renderPostList('postList', data)
    renderPagination('pagination', pagination)
  } catch (error) {
    console.log('Failed to get data', error)
  }
}

const handleFilterChange = async (name, value) => {
  const url = new URL(window.location)
  if (name) url.searchParams.set(name, value)

  if (name === 'title_like') url.searchParams.set('_page', 1)

  history.pushState({}, '', url)

  await getDataAndRender(url.searchParams)
}

const registerRemovePostEvent = () => {
  document.addEventListener('remove-post', async (e) => {
    try {
      const post = e.detail

      const message = `Are you sure you want to delete "${post.title}"?`
      if (window.confirm(message)) {
        await postApi.remove(post.id)
        await handleFilterChange()
      }
    } catch (error) {
      toast.error(error.message)
    }
  })
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

  registerRemovePostEvent()

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
