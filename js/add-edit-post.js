import postApi from './api/postApi'
import { ImageSource, initPostForm, toast } from './utils'

const removeUnusedFields = (formValues) => {
  const payload = { ...formValues }

  if (payload.imageSource === ImageSource.UPLOAD) {
    delete payload.imageUrl
  } else {
    delete payload.image
  }

  delete payload.imageSource

  if (!payload.id) delete payload.id

  return payload
}

const objectToFormData = (obj) => {
  const formData = new FormData()

  for (const key in obj) {
    formData.set(key, obj[key])
  }

  return formData
}

const handleFormSubmit = async (formValues) => {
  try {
    const payload = removeUnusedFields(formValues)
    const formData = objectToFormData(payload)

    const savedPost = formValues.id
      ? await postApi.updateFormData(formData)
      : await postApi.addFormData(formData)

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
