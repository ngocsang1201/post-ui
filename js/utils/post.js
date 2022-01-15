import { formatTime, setImage, setTextContent, truncateText } from './common'

// add plugin to dayjs

export const createPostElement = (post) => {
  if (!post) return

  const postTemplate = document.getElementById('postTemplate')
  if (!postTemplate) return

  const liElement = postTemplate.content.firstElementChild.cloneNode(true)

  setTextContent(liElement, '[data-id="title"]', post.title)
  setTextContent(liElement, '[data-id="description"]', truncateText(post.description, 100))
  setTextContent(liElement, '[data-id="author"]', post.author)
  setTextContent(liElement, '[data-id="title"]', post.title)
  setTextContent(liElement, '[data-id="timeSpan"]', `- ${formatTime(post.updatedAt, 'fromNow')}`)
  setImage(liElement, '[data-id="thumbnail"]', post.imageUrl)

  const divElement = liElement.firstElementChild
  if (divElement) {
    divElement.addEventListener('click', (e) => {
      const menuElement = divElement.querySelector('.post-item-menu')
      if (menuElement.contains(e.target)) return

      window.location.assign(`/post-detail.html?id=${post.id}`)
    })
  }

  const editButton = divElement.querySelector(`[data-id='edit']`)
  if (editButton) {
    editButton.addEventListener('click', (e) => {
      // e.stopPropagation()
      window.location.assign(`/add-edit-post.html?id=${post.id}`)
    })
  }

  const removeButton = divElement.querySelector(`[data-id='remove']`)
  if (removeButton) {
    removeButton.addEventListener('click', (e) => {
      // e.stopPropagation()
      console.log('remove click')
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
