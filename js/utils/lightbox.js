const showModal = (modalElement) => {
  // bootstrap from Bootstrap scripts
  const modal = new bootstrap.Modal(modalElement)
  if (modal) modal.show()
}

export const registerLightbox = ({ modalId, imgSelector, prevSelector, nextSelector }) => {
  const modalElement = document.getElementById(modalId)
  if (!modalElement) return

  // selectors
  const imgElement = modalElement.querySelector(imgSelector)
  const prevButton = modalElement.querySelector(prevSelector)
  const nextButton = modalElement.querySelector(nextSelector)
  if (!imgElement || !prevButton || !nextButton) return

  // vars
  let imgList = []
  let currentIndex = 0

  const showImgAtIndex = (index) => {
    imgElement.src = imgList[index].src
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
    console.log('prev')
  })

  nextButton.addEventListener('click', () => {
    console.log('next')
  })
}
