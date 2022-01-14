export const registerLightbox = () => {
  document.addEventListener('click', (e) => {
    const element = e.target
    if (element.tagName !== 'IMG' || !element.dataset.album) return

    const imgList = document.querySelectorAll(`img[data-album='${element.dataset.album}']`)
    const index = [...imgList].findIndex((x) => x === element)
  })
}
