import { setFieldValue, setImage } from './common'

const setFormValues = (form, values) => {
  setFieldValue(form, '[name="title"]', values.title)
  setFieldValue(form, '[name="author"]', values.author)
  setFieldValue(form, '[name="description"]', values.description)
  setFieldValue(form, '[name="imageUrl"]', values.imageUrl)
  setImage(document, '#postHeroImage', values.imageUrl)
}

export const initPostForm = ({ formId, defaultValues, onSubmit }) => {
  const form = document.getElementById(formId)
  if (!form) return

  setFormValues(form, defaultValues)
}
