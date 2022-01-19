import { randomImgUrl, setFieldValue, setImage, setTextContent } from './common'
import * as yup from 'yup'

export const ImageSource = {
  PICSUM: 'picsum',
  UPLOAD: 'upload',
}

const setFormValues = (form, values) => {
  ;['title', 'author', 'description', 'imageUrl'].forEach((name) =>
    setFieldValue(form, `[name='${name}']`, values?.[name])
  )
  setImage(document, '#postHeroImage', values.imageUrl)
}

const getFormValues = (form) => {
  const formValues = {}

  //? S1: get value each input field
  // const fieldNames = ['title', 'author', 'description', 'imageUrl', 'image']
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
    imageSource: yup
      .string()
      .required('Please select an image source')
      .oneOf([ImageSource.PICSUM, ImageSource.UPLOAD], 'Invalid image source'),
    imageUrl: yup.string().when('imageSource', {
      is: ImageSource.PICSUM,
      then: yup
        .string()
        .required('Please random an image from picsum')
        .url('Please enter a valid URL'),
    }),
    image: yup.mixed().when('imageSource', {
      is: ImageSource.UPLOAD,
      then: yup
        .mixed()
        .test('required', 'Please select an image from your computer', (file) => !!file.name)
        .test('max-size', 'Image size should be less than 5MB', (file) => {
          const fileSize = file?.size || 0
          const maxSize = 5 * 1024 * 1024 // 5MB
          return fileSize <= maxSize
        }),
    }),
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
    ;['title', 'author', 'imageUrl', 'image'].forEach((name) => setFieldError(form, name, ''))

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

const validateFormField = async (form, formValues, name) => {
  try {
    // reset error
    setFieldError(form, name, '')

    const schema = getPostSchema()
    await schema.validateAt(name, formValues)

    const field = form.querySelector(`[name='${name}']`)
    if (field && !field.checkValidity()) {
      field.parentElement.classList.add('was-validated')
    }
  } catch (error) {
    setFieldError(form, name, error.message)
  }
}

const showLoading = (form, state) => {
  const button = form.querySelector('button[type="submit"]')
  if (button) {
    button.disabled = state
    button.textContent = state ? 'Saving...' : 'Save'
  }
}

const initRandomImage = (form) => {
  const randomButton = form.querySelector('#postChangeImage')
  if (!randomButton) return

  randomButton.addEventListener('click', () => {
    const imageUrl = randomImgUrl()
    setFieldValue(form, '[name="imageUrl"]', imageUrl)
    setImage(document, '#postHeroImage', imageUrl)
  })
}

const renderImageSourceControl = (form, selectedValue) => {
  const controlList = form.querySelectorAll('[data-id="imageSource"]')
  controlList.forEach((control) => {
    control.hidden = control.dataset.imageSource !== selectedValue
  })
}

const initRadioImageSource = (form) => {
  const radioList = form.querySelectorAll('input[name="imageSource"]')
  radioList.forEach((radio) => {
    radio.addEventListener('change', (e) => renderImageSourceControl(form, e.target.value))
  })
}

const initUploadImage = (form) => {
  const uploadImage = form.querySelector('[name="image"]')
  if (!uploadImage) return

  uploadImage.addEventListener('change', (e) => {
    const file = e.target.files[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setImage(document, '#postHeroImage', imageUrl)

      validateFormField(
        form,
        {
          imageSource: ImageSource.UPLOAD,
          image: file,
        },
        'image'
      )
    }
  })
}

const initValidateOnChange = (form) => {
  ;['title', 'author'].forEach((name) => {
    const field = form.querySelector(`[name='${name}']`)
    if (field) {
      field.addEventListener('input', (e) => {
        validateFormField(form, { [name]: e.target.value }, name)
      })
    }
  })
}

export const initPostForm = ({ formId, defaultValues, onSubmit }) => {
  const form = document.getElementById(formId)
  if (!form) return

  initRandomImage(form)
  initRadioImageSource(form)
  initUploadImage(form)
  initValidateOnChange(form)

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
