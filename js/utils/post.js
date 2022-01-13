import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { setImageSrc, setTextContent, truncateText } from './common'

// add plugin to dayjs
dayjs.extend(relativeTime)

export const createPostElement = (post) => {
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

export const renderPostList = (elementId, postList) => {
  const ulElement = document.getElementById(elementId)
  if (!ulElement || !Array.isArray(postList)) return

  ulElement.textContent = ''
  postList.forEach((post) => {
    const liElement = createPostElement(post)
    ulElement.appendChild(liElement)
  })
}
