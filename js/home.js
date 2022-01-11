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

;(async () => {
  try {
    const params = {
      _page: 1,
      _limit: 6,
    }
    const { data, pagination } = await postApi.getAll(params)
    renderPostList(data)
  } catch (error) {
    console.log('Failed to fetch post list', error)
  }
})()
