export function setTextContent(parent, selector, text) {
  if (!parent) return

  const element = parent.querySelector(selector)
  if (element) element.textContent = text
}

export function setImageSrc(parent, selector, imgSrc) {
  if (!parent) return

  const element = parent.querySelector(selector)
  if (element) element.src = imgSrc
}
