import { randomImgUrl, setFieldValue, setImage, setTextContent } from './common'
import * as yup from 'yup'

const fieldNames = ['title', 'author', 'description', 'imageUrl']

const setFormValues = (form, values) => {
  fieldNames.forEach((name) => setFieldValue(form, `[name='${name}']`, values?.[name]))
  setImage(document, '#postHeroImage', values.imageUrl)
}

const getFormValues = (form) => {
  const formValues = {}

  //? S1: get value each input field
  // for (const name of fieldNames) {
  //   const field = form.querySelector(`[name='${name}']`)
  //   formValues[name] = field.value
  // }

  //? S2: using form data
  const formData = new FormData(form)
  for (const [field, value] of formData) {
    formValues[field] = value
  }

  return formValues
}

const getPostSchema = () =>
  yup.object().shape({
    title: yup.string().required('Please enter a title'),
    author: yup
      .string()
      .required('Please enter an author')
      .test(
        'at-least-2-words',
        'Please enter at least 2 words',
        (value) => value.split(' ').filter((x) => x).length >= 2
      ),
    description: yup.string(),
    imageUrl: yup.string().url('Please enter a valid URL').required('Please choose an image'),
  })

const setFieldError = (form, name, error) => {
  const element = form.querySelector(`[name='${name}']`)
  if (element) {
    element.setCustomValidity(error)
    setTextContent(element.parentElement, '.invalid-feedback', error)
  }
}

const validatePostForm = async (form, formValues) => {
  try {
    // reset errors
    fieldNames.forEach((name) => setFieldError(form, name, ''))

    // validate
    const schema = getPostSchema()
    await schema.validate(formValues, { abortEarly: false })
  } catch (error) {
    const errorLogs = {}

    if ((error.name = 'ValidationError')) {
      for (const validationError of error.inner) {
        const name = validationError.path

        if (errorLogs[name]) continue

        setFieldError(form, name, validationError.message)
        errorLogs[name] = true
      }
    }
  }

  const isValid = form.checkValidity()
  if (!isValid) form.classList.add('was-validated')
  return isValid
}

const showLoading = (form, state) => {
  const button = form.querySelector('button[type="submit"]')
  if (button) {
    button.disabled = state
    button.textContent = state ? 'Saving...' : 'Save'
  }
}

const initRandomImage = (form) => {
  const randomButton = document.getElementById('postChangeImage')
  if (!randomButton) return

  randomButton.addEventListener('click', () => {
    const imageUrl = randomImgUrl()
    setFieldValue(form, '[name="imageUrl"]', imageUrl)
    setImage(document, '#postHeroImage', imageUrl)
  })
}

export const initPostForm = ({ formId, defaultValues, onSubmit }) => {
  const form = document.getElementById(formId)
  if (!form) return

  initRandomImage(form)

  let submitting = false
  setFormValues(form, defaultValues)

  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    if (submitting) return
    showLoading(form, true)
    submitting = true

    const formValues = getFormValues(form)
    formValues.id = defaultValues.id

    const isValid = await validatePostForm(form, formValues)
    if (isValid) await onSubmit?.(formValues)

    showLoading(form, false)
    submitting = false
  })
}
