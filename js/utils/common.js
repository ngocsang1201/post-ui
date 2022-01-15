import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

// add plugin to dayjs
dayjs.extend(relativeTime)

export const randomNumber = (min, max) => Math.trunc(Math.random() * (max - min + 1) + min)
export const randomImgUrl = () => `https://picsum.photos/id/${randomNumber(100, 1000)}/1368/800`

export const setTextContent = (parent, selector, text) => {
  if (!parent) return

  const element = parent.querySelector(selector)
  if (element) element.textContent = text
}

export const setImage = (parent, selector, imgUrl) => {
  if (!parent) return

  const element = parent.querySelector(selector)
  if (!element) return

  if (element.tagName === 'IMG') {
    element.src = imgUrl
    element.addEventListener('error', () => {
      element.src = randomImgUrl()
    })
  } else {
    element.style.backgroundImage = `url('${imgUrl}')`
  }
}

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength - 1)}\u2026`
}

export const formatTime = (timestamp, template) => {
  if (!timestamp || !template) return ''
  if (template === 'fromNow') return dayjs(timestamp).fromNow()
  return dayjs(timestamp).format(template)
}

export const setFieldValue = (form, selector, value) => {
  if (!form) return

  const field = form.querySelector(selector)
  if (field) field.value = value
}
