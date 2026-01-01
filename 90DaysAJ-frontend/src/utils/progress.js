export function calculateProgress(startDate, endDate, today) {
  const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
  const daysElapsed = Math.max(0, Math.min(totalDays, Math.ceil((today - startDate) / (1000 * 60 * 60 * 24))))
  const progress = Math.min(100, (daysElapsed / totalDays) * 100)
  return { progress, daysElapsed, totalDays }
}

