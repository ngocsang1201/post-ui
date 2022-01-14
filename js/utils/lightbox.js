const showModal = (modalElement) => {
  // bootstrap from Bootstrap scripts
  const modal = new bootstrap.Modal(modalElement)
  if (modal) modal.show()
}

export const registerLightbox = ({
  modalId,
  imgSelector,
  prevSelector,
  nextSelector,
  descriptionSelector,
}) => {
  const modalElement = document.getElementById(modalId)
  if (!modalElement) return

  if (!!modalElement.dataset.registered) return
  modalElement.dataset.registered = true

  // selectors
  const imgElement = modalElement.querySelector(imgSelector)
  const prevButton = modalElement.querySelector(prevSelector)
  const nextButton = modalElement.querySelector(nextSelector)
  const description = modalElement.querySelector(descriptionSelector)
  if (!imgElement || !prevButton || !nextButton || !description) return

  // vars
  let imgList = []
  let currentIndex = 0

  const showImgAtIndex = (index) => {
    imgElement.src = imgList[index].src
    description.textContent = `${index + 1}/${imgList.length} - ${imgList[index].dataset.album}`
  }

  document.addEventListener('click', (e) => {
    const element = e.target
    if (element.tagName !== 'IMG' || !element.dataset.album) return

    imgList = [...document.querySelectorAll(`img[data-album='${element.dataset.album}']`)]
    currentIndex = imgList.findIndex((x) => x === element)

    showImgAtIndex(currentIndex)
    showModal(modalElement)
  })

  prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + imgList.length) % imgList.length
    showImgAtIndex(currentIndex)
  })

  nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % imgList.length
    showImgAtIndex(currentIndex)
  })
}
