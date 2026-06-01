export function exportToCSV(data, filename) {
  if (!data || data.length === 0) return alert('No data to export')
  const headers = Object.keys(data[0])
  const csvRows = [headers.join(',')]
  for (const row of data) {
    const values = headers.map(h => {
      const val = row[h] === null || row[h] === undefined ? '' : row[h].toString().replace(/"/g, '""')
      return `"${val}"`
    })
    csvRows.push(values.join(','))
  }
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}
