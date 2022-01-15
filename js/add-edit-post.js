import postApi from './api/postApi'
import { initPostForm } from './utils'

// main
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

    initPostForm({
      formId: 'postForm',
      defaultValues,
      onSubmit: (formValues) => console.log('submit', formValues),
    })
  } catch (error) {
    console.log('Failed to fetch post detail', error)
  }
})()
