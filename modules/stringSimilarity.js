function levenshteinDistance(a, b) {
  const matrix = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  )

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,       // deletion
        matrix[i][j - 1] + 1,       // insertion
        matrix[i - 1][j - 1] + cost // substitution
      )
    }
  }

  return matrix[a.length][b.length]
}

function compareTwoStrings(one, two) {
  one = one.toLowerCase()
  two = two.toLowerCase()

  if (one === two) return 1
  if (!one.length || !two.length) return 0

  const distance = levenshteinDistance(one, two)
  const maxLength = Math.max(one.length, two.length)
  return (maxLength - distance) / maxLength
}

function findBestMatch(mainString, targetStrings) {
  if (!Array.isArray(targetStrings) || targetStrings.length === 0) {
    throw new Error('Second argument must be a non-empty array of strings')
  }

  const ratings = targetStrings.map(target => ({
    target,
    rating: compareTwoStrings(mainString, target)
  }))

  const bestMatch = ratings.reduce((best, current) =>
    current.rating > best.rating ? current : best
  )

  return { ratings, bestMatch }
}

export default {
  compareTwoStrings,
  findBestMatch
}
