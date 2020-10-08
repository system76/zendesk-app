export default async function (ctx, inject) {
  const observer = new MutationObserver(() => ctx.$zendesk.resize())

  observer.observe(document, {
    attributes: true,
    childList: true,
    subtree: true
  })

  document.addEventListener('animationend', () => ctx.$zendesk.resize())
}
