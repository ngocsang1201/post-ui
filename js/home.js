import postApi from './api/postApi'
import { setImageSrc, setTextContent, truncateText } from './utils'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

// add plugin to dayjs
dayjs.extend(relativeTime)

function createPostElement(post) {
  if (!post) return

  const postTemplate = document.getElementById('postTemplate')
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

  const ulElement = document.getElementById('postList')
  if (!ulElement) return

  postList.forEach((post) => {
    const liElement = createPostElement(post)
    ulElement.appendChild(liElement)
  })
}

function handleFilterChange(name, value) {
  const url = new URL(window.location)
  url.searchParams.set(name, value)

  history.pushState({}, '', url)

  // TODO: fetch data
  // TODO: render data
}

function handlePrevClick(e) {
  e.preventDefault()
}

function handleNextClick(e) {
  e.preventDefault()
}

function initPagination() {
  const ulPagination = document.getElementById('pagination')
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

;(async () => {
  try {
    initPagination()
    initUrl()

    const queryParams = new URLSearchParams(window.location.search)
    const { data, pagination } = await postApi.getAll(queryParams)
    renderPostList(data)
  } catch (error) {
    console.log('Failed to fetch post list', error)
  }
})()
