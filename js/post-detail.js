import postApi from './api/postApi'
import { formatTime, randomImgUrl, setImage, setTextContent } from './utils'
import { registerLightbox } from './utils/lightbox'

const renderPost = (post) => {
  if (!post) return

  setTextContent(document, '#postDetailTitle', post.title)
  setTextContent(document, '#postDetailDescription', post.description)
  setTextContent(document, '#postDetailAuthor', post.author)
  setTextContent(document, '#postDetailTimeSpan', formatTime(post.createdAt, ' - HH:mm DD/MM/YYYY'))
  setImage(document, '#postHeroImage', post.thumbnail)

  const imgList = document.querySelectorAll('img.post-image')
  for (const img of imgList) {
    img.dataset.album = post.title
    img.src = randomImgUrl()

    img.addEventListener('error', () => {
      img.src = randomImgUrl()
    })
  }

  const editPostLink = document.getElementById('goToEditPageLink')
  if (editPostLink) {
    editPostLink.href = `/add-edit-post.html?${post.id}`
  }
}

;(async () => {
  registerLightbox()

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
