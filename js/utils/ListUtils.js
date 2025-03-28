export class ListUtils {
  static getRandomItems = (arr, count) => {
    // Using Fisher-Yates shuffle for a uniform randomization
    const shuffled = [...arr]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = (Math.floor(Math.random() * (i + 1))[
        (shuffled[i], shuffled[j])
      ] = [shuffled[j], shuffled[i]])
    }
    return shuffled.slice(0, count)
  }

  static shuffleArray = (arr) => {
    const shuffled = [...arr]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = (Math.floor(Math.random() * (i + 1))[
        (shuffled[i], shuffled[j])
      ] = [shuffled[j], shuffled[i]])
    }
    return shuffled
  }
}
