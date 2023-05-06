export function numberFormatter(value) {
  return (value)?.toString()?.replace(/[^0-9]/g, '')?.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}