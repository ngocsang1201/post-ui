import postApi from './api/postApi'
import { initPostForm, toast } from './utils'

const handleFormSubmit = async (formValues) => {
  try {
    const savedPost = formValues.id
      ? await postApi.update(formValues)
      : await postApi.add(formValues)

    toast.success('Saved post successfully!')

    // setTimeout(() => {
    //   window.location.assign(`/post-detail.html?id=${savedPost.id}`)
    // }, 2000)
  } catch (error) {
    console.log('Failed to submit post form', error)
    toast.error(error.message)
  }
}

//? main
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
      onSubmit: handleFormSubmit,
    })
  } catch (error) {
    console.log('Failed to fetch post detail', error)
  }
})()
