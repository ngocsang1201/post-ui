export function setTextContent(parent, selector, text) {
  if (!parent) return

  const element = parent.querySelector(selector)
  if (element) element.textContent = text
}

export function setImageSrc(parent, selector, imgSrc) {
  if (!parent) return

  const element = parent.querySelector(selector)
  if (element) {
    element.src = imgSrc

    element.addEventListener('error', () => {
      element.src = 'https://via.placeholder.com/1368x400.png'
    })
  }
}

export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text

  return `${text.slice(0, maxLength - 1)}\u2026`
}
