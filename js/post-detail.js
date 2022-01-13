import postApi from './api/postApi'
import { formatTime, setImage, setTextContent } from './utils'

const renderPost = (post) => {
  if (!post) return

  setTextContent(document, '#postDetailTitle', post.title)
  setTextContent(document, '#postDetailDescription', post.description)
  setTextContent(document, '#postDetailAuthor', post.author)
  setTextContent(document, '#postDetailTimeSpan', formatTime(post.createdAt, ' - HH:mm DD/MM/YYYY'))
  setImage(document, '#postHeroImage', post.thumbnail)

  const editPostLink = document.getElementById('goToEditPageLink')
  if (editPostLink) {
    editPostLink.href = `/add-edit-post.html?${post.id}`
  }
}

;(async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search)
    const postId = searchParams.get('id')
    if (!postId) return

    const post = await postApi.getById(postId)
    renderPost(post)
  } catch (error) {
    console.log('Failed to fetch post', error)
  }
})()
