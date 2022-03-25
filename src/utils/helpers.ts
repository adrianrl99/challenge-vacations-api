export const diffDates = (
  a: number | string | Date,
  b: number | string | Date,
) => {
  let date1 = new Date(a).getTime()
  let date2 = new Date(b).getTime()

  if (date1 < date2) {
    const date3 = date1
    date1 = date2
    date2 = date3
  }

  const diffTime = Math.abs(date2 - date1)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
}
