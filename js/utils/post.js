import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { setImageSrc, setTextContent, truncateText } from './common'

// add plugin to dayjs
dayjs.extend(relativeTime)

export const createPostElement = (post) => {
  if (!post) return

  const postTemplate = document.getElementById('postTemplate')
  if (!postTemplate) return

  const liElement = postTemplate.content.firstElementChild.cloneNode(true)

  setTextContent(liElement, '[data-id="title"]', post.title)
  setTextContent(liElement, '[data-id="description"]', truncateText(post.description, 100))
  setTextContent(liElement, '[data-id="author"]', post.author)
  setTextContent(liElement, '[data-id="title"]', post.title)
  setTextContent(liElement, '[data-id="timeSpan"]', `- ${dayjs(post.createdAt).fromNow()}`)
  setImageSrc(liElement, '[data-id="thumbnail"]', post.thumbnail)

  const divElement = liElement.firstElementChild
  if (divElement) {
    divElement.addEventListener('click', () => {
      window.location.assign(`/post-detail.html?id=${post.id}`)
    })
  }

  return liElement
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
