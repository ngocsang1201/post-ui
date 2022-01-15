import { setFieldValue, setImage } from './common'

const fieldNames = ['title', 'author', 'description', 'imageUrl']

const setFormValues = (form, values) => {
  for (const name of fieldNames) {
    setFieldValue(form, `[name='${name}']`, values?.[name])
  }
  setImage(document, '#postHeroImage', values.imageUrl)
}

const getFormValues = (form) => {
  const formValues = {}

  // S1: get value each input field
  // for (const name of fieldNames) {
  //   const field = form.querySelector(`[name='${name}']`)
  //   formValues[name] = field.value
  // }

  // S2: using form data
  const formData = new FormData(form)
  for (const [field, value] of formData) {
    formValues[field] = value
  }

  return formValues
}

export const initPostForm = ({ formId, defaultValues, onSubmit }) => {
  const form = document.getElementById(formId)
  if (!form) return

  setFormValues(form, defaultValues)

  form.addEventListener('submit', (e) => {
    e.preventDefault()

    const formValues = getFormValues(form)
    console.log(formValues)
  })
}
