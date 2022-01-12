import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import postApi from './api/postApi'
import {
  getPostListElement,
  getPostTemplate,
  getUlPagination,
  setImageSrc,
  setTextContent,
  truncateText,
} from './utils'

// add plugin to dayjs
dayjs.extend(relativeTime)

function createPostElement(post) {
  if (!post) return

  const postTemplate = getPostTemplate()
  if (!postTemplate) return

  const postElement = postTemplate.content.firstElementChild.cloneNode(true)

  setTextContent(postElement, '[data-id="title"]', post.title)
  setTextContent(postElement, '[data-id="description"]', truncateText(post.description, 100))
  setTextContent(postElement, '[data-id="author"]', post.author)
  setTextContent(postElement, '[data-id="title"]', post.title)
  setTextContent(postElement, '[data-id="timeSpan"]', `- ${dayjs(post.createdAt).fromNow()}`)
  setImageSrc(postElement, '[data-id="thumbnail"]', post.thumbnail)

  return postElement
}

function renderPostList(postList) {
  if (!Array.isArray(postList) || postList.length === 0) return

  const ulElement = getPostListElement()
  if (!ulElement) return

  ulElement.textContent = ''

  postList.forEach((post) => {
    const liElement = createPostElement(post)
    ulElement.appendChild(liElement)
  })
}

async function handleFilterChange(name, value) {
  try {
    const url = new URL(window.location)
    url.searchParams.set(name, value)

    history.pushState({}, '', url)

    const queryParams = new URLSearchParams(url.searchParams)
    const { data, pagination } = await postApi.getAll(queryParams)

    render(data, pagination)
  } catch (error) {
    console.log('Failed to change filter', error)
  }
}

function renderPagination(pagination) {
  const ulPagination = getUlPagination()
  if (!pagination || !ulPagination) return

  const { _page, _limit, _totalRows } = pagination
  const totalPages = Math.ceil(_totalRows / _limit)

  ulPagination.dataset.page = _page
  ulPagination.dataset.totalPages = totalPages

  if (_page <= 1) ulPagination.firstElementChild?.classList.add('disabled')
  else ulPagination.firstElementChild?.classList.remove('disabled')

  if (_page >= totalPages) ulPagination.lastElementChild?.classList.add('disabled')
  else ulPagination.lastElementChild?.classList.remove('disabled')
}

function handlePrevClick(e) {
  e.preventDefault()

  const ulPagination = getUlPagination()
  if (!ulPagination) return

  const page = parseInt(ulPagination.dataset.page) || 1
  if (page <= 1) return

  handleFilterChange('_page', page - 1)
}

function handleNextClick(e) {
  e.preventDefault()

  const ulPagination = getUlPagination()
  if (!ulPagination) return

  const page = parseInt(ulPagination.dataset.page) || 1
  const totalPages = parseInt(ulPagination.dataset.totalPages) || 1
  if (page >= totalPages) return

  handleFilterChange('_page', page + 1)
}

function initPagination() {
  const ulPagination = getUlPagination()
  if (!ulPagination) return

  const prevLink = ulPagination.firstElementChild?.firstElementChild
  if (prevLink) {
    prevLink.addEventListener('click', handlePrevClick)
  }

  const nextLink = ulPagination.lastElementChild?.firstElementChild
  if (nextLink) {
    nextLink.addEventListener('click', handleNextClick)
  }
}

function initUrl() {
  const url = new URL(window.location)

  if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
  if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6)

  history.pushState({}, '', url)
}

function render(postList, pagination) {
  renderPostList(postList)
  renderPagination(pagination)
}

;(async () => {
  try {
    initPagination()
    initUrl()

    const queryParams = new URLSearchParams(window.location.search)
    const { data, pagination } = await postApi.getAll(queryParams)
    render(data, pagination)
  } catch (error) {
    console.log('Failed to fetch post list', error)
  }
})()
