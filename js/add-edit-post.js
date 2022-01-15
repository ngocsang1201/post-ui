import postApi from './api/postApi'

;(async () => {
  try {
    const params = new URLSearchParams(window.location.search)
    const postId = params.get('id')

    const defaultValues = postId
      ? await postApi.getById(postId)
      : {
          title: '',
          description: '',
          author: '',
          imageUrl: '',
        }

    console.log({ postId, defaultValues })
  } catch (error) {
    console.log('Failed to fetch post detail', error)
  }
})()
