export const renderPagination = (elementId, pagination) => {
  const ulPagination = document.getElementById(elementId)
  if (!ulPagination || !pagination) return

  const { _page, _limit, _totalRows } = pagination
  const totalPages = Math.ceil(_totalRows / _limit)

  ulPagination.dataset.page = _page
  ulPagination.dataset.totalPages = totalPages

  if (_page <= 1) ulPagination.firstElementChild?.classList.add('disabled')
  else ulPagination.firstElementChild?.classList.remove('disabled')

  if (_page >= totalPages) ulPagination.lastElementChild?.classList.add('disabled')
  else ulPagination.lastElementChild?.classList.remove('disabled')
}

export const initPagination = ({ elementId, defaultParams, onChange }) => {
  const ulPagination = document.getElementById(elementId)
  if (!ulPagination) return

  // TODO: set page number -> defaultParams

  const prevLink = ulPagination.firstElementChild?.firstElementChild
  if (prevLink) {
    prevLink.addEventListener('click', (e) => {
      e.preventDefault()

      const page = parseInt(ulPagination.dataset.page) || 1
      if (page >= 2) onChange?.(page - 1)
    })
  }

  const nextLink = ulPagination.lastElementChild?.firstElementChild
  if (nextLink) {
    nextLink.addEventListener('click', (e) => {
      e.preventDefault()

      const page = parseInt(ulPagination.dataset.page) || 1
      const totalPages = parseInt(ulPagination.dataset.totalPages) || 1
      if (page < totalPages) onChange(page + 1)
    })
  }
}
