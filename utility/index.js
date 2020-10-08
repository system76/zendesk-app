/**
 * Outputs a number to localized currency string
 *
 * @param {Number} value
 * @return {String}
 */
export function currency (value) {
  if (isNaN(value)) {
    return ''
  }

  const formatOpts = {
    style: 'currency',
    currency: 'USD'
  }

  // this is unsupported on IE <= 10
  return Number(value).toLocaleString('en-US', formatOpts)
}
