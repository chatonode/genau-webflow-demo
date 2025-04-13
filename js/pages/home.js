import { CURRENT_LEVEL_KEY, CURRENT_WORD_TYPE_KEY, DEFAULT_VALUE, LEARNED_WITH_EXERCISE_WORDS_KEY, LEARNED_WITH_LEARN_WORDS_KEY, CURRENT_CATEGORY_KEY, WORD_LIST_EXERCISE_KEY, IN_PROGRESS_WORDS_KEY, WORD_LIST_KEY } from '../constants/storageKeys.js'
import { JSON_URLS } from '../constants/urls.js'
import { LEARN_ELEMENT_IDS } from '../constants/elements.js'
import LocalStorageManager from '../utils/LocalStorageManager.js'
import ListUtils from '../utils/ListUtils.js'
import { types } from '../constants/props.js'
import checkNonNounAnswer from '../utils/home/checkNonNounAnswer.js'
import { showModal, showModalExercise } from '../utils/home/ModalManager.js'
import showExerciseWord from '../utils/home/ShowExerciseWord.js'
import checkNounAnswer from '../utils/home/checkNounAnswer.js'

// yeni comment
let wordList = []
let wordListExercise = []
let currentLearnIndex = 0
let totalWordsLearn = 0
let totalWordsExercise = 0

let initialTotalWords = 0 // Yeni eklenen değişken

// On Initial Load
document.addEventListener('DOMContentLoaded', async () => {
  LocalStorageManager.clearDeprecatedLocalStorageItems()
  const defaultLevel = DEFAULT_VALUE.CURRENT_LEVEL
  LocalStorageManager.save(CURRENT_LEVEL_KEY, defaultLevel)
  const defaultWordType = DEFAULT_VALUE.CURRENT_WORD_TYPE
  LocalStorageManager.save(CURRENT_WORD_TYPE_KEY, defaultWordType)
  const defaultCategory = DEFAULT_VALUE.CURRENT_CATEGORY
  LocalStorageManager.save(CURRENT_CATEGORY_KEY, defaultCategory)
  const defaultWordListExercise = DEFAULT_VALUE.WORD_LIST_EXERCISE
  LocalStorageManager.save(WORD_LIST_EXERCISE_KEY, defaultWordListExercise)
  const defaultLearnedWithLearnWords = LocalStorageManager.load(LEARNED_WITH_LEARN_WORDS_KEY, DEFAULT_VALUE.LEARNED_WITH_LEARN_WORDS)
  const defaultLearnedWithExerciseWords = LocalStorageManager.load(LEARNED_WITH_EXERCISE_WORDS_KEY, DEFAULT_VALUE.LEARNED_WITH_EXERCISE_WORDS)

  showSkeleton(defaultWordType)
  await executeInitialLoadAndShow(defaultLevel, defaultWordType, defaultLearnedWithLearnWords, defaultLearnedWithExerciseWords, defaultCategory)
})

// On Level Change
document.querySelectorAll('.level-dropdown-link').forEach((link) => {
  link.addEventListener('click', async function (event) {
    event.preventDefault()
    const updatedLevel = link.getAttribute('data-option')
    const selectedText = link.innerText
    const currentCategory = LocalStorageManager.load(CURRENT_CATEGORY_KEY)
    const wordType = LocalStorageManager.load(CURRENT_WORD_TYPE_KEY)
    const learnedWithLearnWords = LocalStorageManager.load(LEARNED_WITH_LEARN_WORDS_KEY, DEFAULT_VALUE.LEARNED_WITH_LEARN_WORDS)
    const learnedWithExerciseWords = LocalStorageManager.load(LEARNED_WITH_EXERCISE_WORDS_KEY, DEFAULT_VALUE.LEARNED_WITH_EXERCISE_WORDS)

    // Seçilen option'ı localStorage'a kaydet
    LocalStorageManager.save(CURRENT_LEVEL_KEY, updatedLevel)

    // Dropdown başlığını güncelle
    document.getElementById('dropdownHeader').innerText = selectedText

    if (updatedLevel === 'einburgerungstest') {
      LocalStorageManager.save(CURRENT_CATEGORY_KEY, 'einburgerungstest')
      showOrHideDecks('einburgerungstest')
      await executeInitialLoadAndShow(updatedLevel, wordType, learnedWithLearnWords, learnedWithExerciseWords, 'einburgerungstest')
      return
    }
    if (currentCategory === 'einburgerungstest' && isRegularLevel(updatedLevel)) {
      showOrHideDecks(updatedLevel)
      const lastSelectedDeck = document.querySelector('.selectedimg').getAttribute('data-option')
      LocalStorageManager.save(CURRENT_CATEGORY_KEY, lastSelectedDeck)
      await executeInitialLoadAndShow(updatedLevel, wordType, learnedWithLearnWords, learnedWithExerciseWords, LocalStorageManager.load(CURRENT_CATEGORY_KEY))
      return
    }
    await executeInitialLoadAndShow(updatedLevel, wordType, learnedWithLearnWords, learnedWithExerciseWords, currentCategory)
  })
})

document.querySelectorAll('.deck').forEach((elem) => {
  elem.addEventListener('click', async function (event) {
    event.preventDefault()
    const selectedCategory = elem.getAttribute('data-option')
    console.log("updated category: " + selectedCategory)
    const currentCategory = LocalStorageManager.load(CURRENT_CATEGORY_KEY)
    LocalStorageManager.save(CURRENT_CATEGORY_KEY, selectedCategory)
    console.log("current category: " + currentCategory)
    const wordType = LocalStorageManager.load(CURRENT_WORD_TYPE_KEY)
    const learnedWithLearnWords = LocalStorageManager.load(LEARNED_WITH_LEARN_WORDS_KEY, DEFAULT_VALUE.LEARNED_WITH_LEARN_WORDS)
    const learnedWithExerciseWords = LocalStorageManager.load(LEARNED_WITH_EXERCISE_WORDS_KEY, DEFAULT_VALUE.LEARNED_WITH_EXERCISE_WORDS)
    const currentLevel = LocalStorageManager.load(CURRENT_LEVEL_KEY)

    if (!elem.classList.contains('selectedimg')) {
      elem.style.border = '2px solid black'
      elem.style.borderRadius = '16px'
      document.querySelectorAll('.deck').forEach((deck) => {
        if (deck.classList.contains('selectedimg')) {
          deck.classList.remove('selectedimg')
          deck.style.border = ''
          deck.style.borderRadius = ''
        }
      })
      elem.classList.add('selectedimg')
    }

    await executeInitialLoadAndShow(currentLevel, wordType, learnedWithLearnWords, learnedWithExerciseWords, selectedCategory)
  })
})

// On Word Type Change
document.getElementById('nounTab').addEventListener('click', async () => {
  const level = LocalStorageManager.load(CURRENT_LEVEL_KEY)
  const category = LocalStorageManager.load(CURRENT_CATEGORY_KEY)
  const learnedWithLearnWords = LocalStorageManager.load(LEARNED_WITH_LEARN_WORDS_KEY, DEFAULT_VALUE.LEARNED_WITH_LEARN_WORDS)
  const learnedWithExerciseWords = LocalStorageManager.load(LEARNED_WITH_EXERCISE_WORDS_KEY, DEFAULT_VALUE.LEARNED_WITH_EXERCISE_WORDS)

  console.log('Noun seçildi.')
  const nounType = types[0]
  LocalStorageManager.save(CURRENT_WORD_TYPE_KEY, nounType)
  await executeInitialLoadAndShow(level, nounType, learnedWithLearnWords, learnedWithExerciseWords, category)
})

document.getElementById('verbTab').addEventListener('click', async () => {
  const level = LocalStorageManager.load(CURRENT_LEVEL_KEY)
  const category = LocalStorageManager.load(CURRENT_CATEGORY_KEY)
  const learnedWithLearnWords = LocalStorageManager.load(LEARNED_WITH_LEARN_WORDS_KEY, DEFAULT_VALUE.LEARNED_WITH_LEARN_WORDS)
  const learnedWithExerciseWords = LocalStorageManager.load(LEARNED_WITH_EXERCISE_WORDS_KEY, DEFAULT_VALUE.LEARNED_WITH_EXERCISE_WORDS)

  console.log('Verb seçildi.')
  const verbType = types[1]
  LocalStorageManager.save(CURRENT_WORD_TYPE_KEY, verbType)

  await executeInitialLoadAndShow(level, verbType, learnedWithLearnWords, learnedWithExerciseWords, category)
})

document.getElementById('adjectiveTab').addEventListener('click', async () => {
  const level = LocalStorageManager.load(CURRENT_LEVEL_KEY)
  const category = LocalStorageManager.load(CURRENT_CATEGORY_KEY)
  const learnedWithLearnWords = LocalStorageManager.load(LEARNED_WITH_LEARN_WORDS_KEY, DEFAULT_VALUE.LEARNED_WITH_LEARN_WORDS)
  const learnedWithExerciseWords = LocalStorageManager.load(LEARNED_WITH_EXERCISE_WORDS_KEY, DEFAULT_VALUE.LEARNED_WITH_EXERCISE_WORDS)

  console.log('Adjective seçildi.')
  const adjectiveType = types[2]
  LocalStorageManager.save(CURRENT_WORD_TYPE_KEY, adjectiveType)

  await executeInitialLoadAndShow(level, adjectiveType, learnedWithLearnWords, learnedWithExerciseWords, category)
})

document.getElementById('adverbTab').addEventListener('click', async () => {
  const level = LocalStorageManager.load(CURRENT_LEVEL_KEY)
  const category = LocalStorageManager.load(CURRENT_CATEGORY_KEY)
  const learnedWithLearnWords = LocalStorageManager.load(LEARNED_WITH_LEARN_WORDS_KEY, DEFAULT_VALUE.LEARNED_WITH_LEARN_WORDS)
  const learnedWithExerciseWords = LocalStorageManager.load(LEARNED_WITH_EXERCISE_WORDS_KEY, DEFAULT_VALUE.LEARNED_WITH_EXERCISE_WORDS)

  console.log('Adverb seçildi.')
  const adverbType = types[3]
  LocalStorageManager.save(CURRENT_WORD_TYPE_KEY, adverbType)

  await executeInitialLoadAndShow(level, adverbType, learnedWithLearnWords, learnedWithExerciseWords, category)
})

async function executeInitialLoadAndShow() {
  try {
    await loadWords()
    showLearnWord(level, wordType, learnedWithLearnWords, category)
    showExerciseWord(0)
  } catch (error) {
    console.error('Kelime yükleme hatası:', error)
  }
}

// Kelime yükleme fonksiyonu
async function loadWords() {
  const level = LocalStorageManager.load(CURRENT_LEVEL_KEY, DEFAULT_VALUE.CURRENT_LEVEL)
  const category = LocalStorageManager.load(CURRENT_CATEGORY_KEY, DEFAULT_VALUE.CURRENT_CATEGORY)
  const wordType = LocalStorageManager.load(CURRENT_WORD_TYPE_KEY, DEFAULT_VALUE.CURRENT_WORD_TYPE)
  const learnedWithExerciseWords = LocalStorageManager.load(LEARNED_WITH_EXERCISE_WORDS_KEY, DEFAULT_VALUE.LEARNED_WITH_EXERCISE_WORDS)
  const learnedWithLearnWords = LocalStorageManager.load(LEARNED_WITH_LEARN_WORDS_KEY, DEFAULT_VALUE.LEARNED_WITH_LEARN_WORDS)
  try {
    showSkeleton(wordType)

    // Feedback mesajını temizle
    const feedbackMessage = document.getElementById(
      `feedbackMessage-${wordType}`
    )
    if (feedbackMessage) {
      feedbackMessage.innerText = ''
    }

    const response = await fetch(JSON_URLS[wordType][level][category])

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    wordList = [...data]
    wordListExercise = [...data]

    LocalStorageManager.save(WORD_LIST_KEY, ListUtils.shuffleArray(wordList))
    LocalStorageManager.save(WORD_LIST_EXERCISE_KEY, ListUtils.shuffleArray(wordListExercise))
    

    // LocalStorage'daki progress listelerini temizle
    LocalStorageManager.save(IN_PROGRESS_WORDS_KEY, DEFAULT_VALUE.IN_PROGRESS_WORDS)
    //localStorage.setItem("learnedWithExerciseWords", JSON.stringify([]));

    document.getElementById(
      `remainingWordsCountLearn-${wordType}`
    ).innerText = learnedWithLearnWords[level][category][wordType].length
    document.getElementById(
      `remainingWordsCountExercise-${wordType}`
    ).innerText = learnedWithExerciseWords[level][category][wordType].length
    document.getElementById(`totalWordsCountLearn-${wordType}`).innerText =
      wordList.length
    document.getElementById(
      `totalWordsCountExercise-${wordType}`
    ).innerText = wordList.length

    hideSkeleton(wordType)
  } catch (error) {
    console.error('Error fetching JSON:', error)
    hideSkeleton(wordType)
    throw error
  }
}

// On Page Changes
document.addEventListener('DOMContentLoaded', async () => {
  try {
    //const level = LocalStorageManager.load(CURRENT_LEVEL_KEY)
    const wordType = LocalStorageManager.load(CURRENT_WORD_TYPE_KEY)
    setupEventListeners()

    // Sayfa değişimlerini izle
    const observer = new MutationObserver((mutations) => {
      // Sadece gerekli değişikliklerde event listener'ları güncelle
      const shouldUpdate = mutations.some((mutation) => {
        return Array.from(mutation.addedNodes).some(
          (node) =>
            node.nodeType === 1 && // Element node
            (node.id === `repeatButtonLearn-${wordType}` ||
              node.id === `iKnowButtonLearn-${wordType}` ||
              node.id === `outfav-${wordType}` ||
              node.id === `infav-${wordType}`)
        )
      })

      if (shouldUpdate) {
        setupEventListeners()
      }
    })

    // Sadece body içindeki değişiklikleri izle
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  } catch (error) {
    console.error('Error in DOMContentLoaded:', error)
  }
})

// On Learn: Repeat Click
function repeatLearn(level, wordType, learnedWithLearnWords, category) {
  if (!wordList.length || currentLearnIndex >= wordList.length) {
    console.log('No words to repeat')
    return
  }

  // Get current word and move it to the end
  const currentWord = wordList.splice(currentLearnIndex, 1)[0]
  wordList.push(currentWord)

  // Keep the index within bounds
  currentLearnIndex = currentLearnIndex % wordList.length

  // Show the next word
  showLearnWord(level, wordType, learnedWithLearnWords, category)
}

// On Learn: I Know Click
function iKnowLearn(level, wordType, learnedWithLearnWords, category) {

  if (learnedWithLearnWords[level][category][wordType].length + 1 === initialTotalWords) {
    showModal('You learned all words! 🎉', wordType)
  }

  const currentWord = wordList[totalWordsLearn - currentLearnIndex]

  learnedWithLearnWords[level][category][wordType].push({
    ...currentWord
  })
  LocalStorageManager.save(LEARNED_WITH_LEARN_WORDS_KEY, learnedWithLearnWords)

  wordList.splice(currentLearnIndex, 1)

  document.getElementById(
    `remainingWordsCountLearn-${wordType}`
  ).innerText = learnedWithLearnWords[level][category][wordType].length
  document.getElementById(`totalWordsCountLearn-${wordType}`).innerText =
    initialTotalWords

  showLearnWord(level, wordType, learnedWithLearnWords, category)

}

// On Learn: Add to Favorites Click
const addToFavorites = () => {
  const wordType = LocalStorageManager.load(CURRENT_WORD_TYPE_KEY)

  const inFavImage = document.getElementById(`infav-${wordType}`)
  const outFavImage = document.getElementById(`outfav-${wordType}`)
  const feedbackElement = document.getElementById(
    `favoritesFeedback-${wordType}`
  )

  if (wordList.length === 0 || currentLearnIndex >= wordList.length) {
    feedbackElement.innerText = 'No word to add to favorites!'
    feedbackElement.style.color = 'red'
    feedbackElement.style.display = 'block'
    setTimeout(() => {
      feedbackElement.style.display = 'none'
    }, 3000)
    return
  }

  const currentWord = wordList[currentLearnIndex]
  let favoriteWords = LocalStorageManager.load('favoriteWords', [])

  // Favorilere ekle
  favoriteWords.push({
    type: currentWord.type,
    almanca: currentWord.almanca,
    ingilizce: currentWord.ingilizce,
    seviye: currentWord.seviye || 'N/A',
  })
  LocalStorageManager.save('favoriteWords', favoriteWords)

  feedbackElement.innerText = `"${currentWord.almanca}" has been added to favorites!`
  feedbackElement.style.color = 'green'

  // Görselleri güncelle
  inFavImage.style.display = 'block' // infav göster
  outFavImage.style.display = 'none' // outfav gizle

  feedbackElement.style.display = 'block'
  setTimeout(() => {
    feedbackElement.style.display = 'none'
  }, 2000)
}

// On Learn: Remove from Favorites Click
function removeFavorite() {
  const wordType = LocalStorageManager.load(CURRENT_WORD_TYPE_KEY)

  // Favorilerden kaldır
  const feedbackElement = document.getElementById(
    `favoritesFeedback-${wordType}`
  )
  const currentWord = wordList[currentLearnIndex]
  let favoriteWords = LocalStorageManager.load('favoriteWords', [])
  favoriteWords = favoriteWords.filter(
    (word) => word.almanca !== currentWord.almanca
  )
  LocalStorageManager.save('favoriteWords', favoriteWords)

  feedbackElement.innerText = `"${currentWord.almanca}" has been removed from favorites.`
  feedbackElement.style.color = 'orange'

  feedbackElement.style.display = 'block'
  setTimeout(() => {
    feedbackElement.style.display = 'none'
  }, 2000)
  // Görselleri güncelle
  updateFavoriteIcons(wordType)
}

function artikelRenk(artikel) {
  if (artikel.toLowerCase() === 'der') {
    return 'blue'
  }
  if (artikel.toLowerCase() === 'die') {
    return 'red'
  }
  if (artikel.toLowerCase() === 'das') {
    return 'green'
  }
  return 'black'
}

function showLearnWord(level, wordType, learnedWithLearnWords, category) {
  const iKnowButton = document.getElementById(
    `iKnowButtonLearn-${wordType}`
  )
  const repeatButton = document.getElementById(
    `repeatButtonLearn-${wordType}`
  )

  if (learnedWithLearnWords[level][category][wordType].length === totalWordsLearn) {
    document.getElementById(`wordLearn-${wordType}`).innerText =
      'No words to display.'
    document.getElementById(`translationLearn-${wordType}`).innerText = ''
    document.getElementById(`exampleLearn-${wordType}`).innerText = ''
    document.getElementById(`levelTagLearn-${wordType}`).innerText = ''
    document.getElementById(`ruleLearn-${wordType}`).innerText = '' // Kural boş

    if (iKnowButton) {
      iKnowButton.style.visibility = 'hidden'
    }
    if (repeatButton) {
      repeatButton.style.visibility = 'hidden'
    }
    return
  }
  // else
  // // reactivate buttons
  iKnowButton.style.visibility = 'visible'
  repeatButton.style.visibility = 'visible'

  const { almanca, ingilizce, ornek, highlight, seviye, kural } =
    wordList[currentLearnIndex]

  if (learnedWithLearnWords[level][category][wordType].length > 0) {
    wordList = wordList.filter(
      (word) =>
        !learnedWithLearnWords[level][category][wordType].some(
          (learned) => learned.almanca === word.almanca
        )
    )
  }

  switch (wordType) {
    case 'noun':
      // Highlight kısmını vurgula
      let highlightedWord = almanca
      if (highlight) {
        const regex = new RegExp(`(${highlight})`, 'i')
        highlightedWord = almanca.replace(
          regex,
          `<span class="highlight">$1</span>`
        )
      }
      const renk = artikelRenk(wordList[currentLearnIndex].artikel)
      document.getElementById(
        'wordLearn-' + wordType
      ).innerHTML = `<span style="color: ${renk};">${highlightedWord}</span>`
      break
    case 'verb':
      document.getElementById('wordLearn-' + wordType).innerHTML = almanca
      break
    case 'adjective':
      document.getElementById('wordLearn-' + wordType).innerHTML = almanca
      break
    case 'adverb':
      document.getElementById('wordLearn-' + wordType).innerHTML = almanca
      break
  }

  document.getElementById(`levelTagLearn-${wordType}`).innerText =
    seviye || 'N/A'
  document.getElementById('translationLearn-' + wordType).innerText =
    ingilizce || 'N/A'
  document.getElementById('exampleLearn-' + wordType).innerText =
    ornek || 'N/A'

  const ruleLearnElement = document.getElementById('ruleLearn-' + wordType)
  const isAdjectiveOrAdverb =
    wordType === 'adjective' || wordType === 'adverb'

  // Kural setini göster
  if (!kural || isAdjectiveOrAdverb) {
    ruleLearnElement.innerText = ''
    ruleLearnElement.style.display = 'none'
  } else {
    ruleLearnElement.innerText = `${kural}`
    ruleLearnElement.style.display = 'block'

    // Animasyonu tekrar ettir
    ruleLearnElement.classList.remove('highlight-animation')
    void ruleLearnElement.offsetWidth // Bu satır animasyonu yeniden tetikler
    ruleLearnElement.classList.add('highlight-animation')
  }

  // Favori ikonlarını güncelle
  updateFavoriteIcons(wordType)
}

export const nounDerAnswerClickHandler = function (event) {
  event.preventDefault() // Sayfanın yukarı kaymasını engeller
  checkNounAnswer('der')
}

export const nounDieAnswerClickHandler = function (event) {
  event.preventDefault() // Sayfanın yukarı kaymasını engeller
  checkNounAnswer('die')
}

export const nounDasAnswerClickHandler = (event) => {
  event.preventDefault() // Sayfanın yukarı kaymasını engeller
  checkNounAnswer('das')
}

document
  .getElementById('buttonDer')
  .addEventListener('click', nounDerAnswerClickHandler)

document
  .getElementById('buttonDie')
  .addEventListener('click', nounDieAnswerClickHandler)

document
  .getElementById('buttonDas')
  .addEventListener('click', nounDasAnswerClickHandler)

const nonNounWrongAnswerClickHandler = (event) => {
  event.preventDefault() // Sayfanın yukarı kaymasını engeller
  checkNonNounAnswer(false)
}

const nonNounCorrectAnswerClickHandler = (event) => {
  event.preventDefault() // Sayfanın yukarı kaymasını engeller
  checkNonNounAnswer(true)
}

document
  .getElementById('wrongButton-verb')
  .addEventListener('click', nonNounWrongAnswerClickHandler)

document
  .getElementById('correctButton-verb')
  .addEventListener('click', nonNounCorrectAnswerClickHandler)

document
  .getElementById('wrongButton-adjective')
  .addEventListener('click', nonNounWrongAnswerClickHandler)

document
  .getElementById('correctButton-adjective')
  .addEventListener('click', nonNounCorrectAnswerClickHandler)

document
  .getElementById('wrongButton-adverb')
  .addEventListener('click', nonNounWrongAnswerClickHandler)

document
  .getElementById('correctButton-adverb')
  .addEventListener('click', nonNounCorrectAnswerClickHandler)

// ... existing code ...

function setupEventListeners() {
  try {
    // Butonları ID ile seçelim
    const iKnowButtonNoun = document.getElementById(`iKnowButtonLearn-noun`)
    const repeatButtonNoun = document.getElementById(`repeatButtonLearn-noun`)
    const iKnowButtonVerb = document.getElementById(`iKnowButtonLearn-verb`)
    const repeatButtonVerb = document.getElementById(`repeatButtonLearn-verb`)
    const iKnowButtonAdjective = document.getElementById(
      `iKnowButtonLearn-adjective`
    )
    const repeatButtonAdjective = document.getElementById(
      `repeatButtonLearn-adjective`
    )
    const iKnowButtonAdverb = document.getElementById(`iKnowButtonLearn-adverb`)
    const repeatButtonAdverb = document.getElementById(
      `repeatButtonLearn-adverb`
    )

    setupListenerForIknowAndLearn(iKnowButtonNoun, repeatButtonNoun)
    setupListenerForIknowAndLearn(iKnowButtonVerb, repeatButtonVerb)
    setupListenerForIknowAndLearn(iKnowButtonAdjective, repeatButtonAdjective)
    setupListenerForIknowAndLearn(iKnowButtonAdverb, repeatButtonAdverb)

    const outfavNoun = document.getElementById(`outfav-noun`)
    const infavNoun = document.getElementById(`infav-noun`)
    const outfavVerb = document.getElementById(`outfav-verb`)
    const infavVerb = document.getElementById(`infav-verb`)
    const outfavAdjective = document.getElementById(`outfav-adjective`)
    const infavAdjective = document.getElementById(`infav-adjective`)
    const outfavAdverb = document.getElementById(`outfav-adverb`)
    const infavAdverb = document.getElementById(`infav-adverb`)

    // Noun - Favorite buttons
    if (outfavNoun && !outfavNoun.hasAttribute('listener-attached')) {
      outfavNoun.addEventListener('click', addToFavorites)
      outfavNoun.setAttribute('listener-attached', 'true')
    }

    if (infavNoun && !infavNoun.hasAttribute('listener-attached')) {
      infavNoun.addEventListener('click', removeFavorite)
      infavNoun.setAttribute('listener-attached', 'true')
    }
    // Verb - Favorite buttons
    if (outfavVerb && !outfavVerb.hasAttribute('listener-attached')) {
      outfavVerb.addEventListener('click', addToFavorites)
      outfavVerb.setAttribute('listener-attached', 'true')
    }

    if (infavVerb && !infavVerb.hasAttribute('listener-attached')) {
      infavVerb.addEventListener('click', removeFavorite)
      infavVerb.setAttribute('listener-attached', 'true')
    }
    // Adjective - Favorite buttons
    if (outfavAdjective && !outfavAdjective.hasAttribute('listener-attached')) {
      outfavAdjective.addEventListener('click', addToFavorites)
      outfavAdjective.setAttribute('listener-attached', 'true')
    }

    if (infavAdjective && !infavAdjective.hasAttribute('listener-attached')) {
      infavAdjective.addEventListener('click', removeFavorite)
      infavAdjective.setAttribute('listener-attached', 'true')
    }
    // Adverb - Favorite buttons
    if (outfavAdverb && !outfavAdverb.hasAttribute('listener-attached')) {
      outfavAdverb.addEventListener('click', addToFavorites)
      outfavAdverb.setAttribute('listener-attached', 'true')
    }

    if (infavAdverb && !infavAdverb.hasAttribute('listener-attached')) {
      infavAdverb.addEventListener('click', removeFavorite)
      infavAdverb.setAttribute('listener-attached', 'true')
    }
  } catch (error) {
    console.error('Error in setupEventListeners:', error)
  }
}

const iKnowButtonClickHandler = (event) => {
  event.preventDefault()

  const level = LocalStorageManager.load(CURRENT_LEVEL_KEY)
  const category = LocalStorageManager.load(CURRENT_CATEGORY_KEY)
  const wordType = LocalStorageManager.load(CURRENT_WORD_TYPE_KEY)
  const learnedWithLearnWords = LocalStorageManager.load(LEARNED_WITH_LEARN_WORDS_KEY)

  iKnowLearn(level, wordType, learnedWithLearnWords, category)
}

const repeatButtonClickHandler = (event) => {
  event.preventDefault()

  const level = LocalStorageManager.load(CURRENT_LEVEL_KEY)
  const category = LocalStorageManager.load(CURRENT_CATEGORY_KEY)
  const wordType = LocalStorageManager.load(CURRENT_WORD_TYPE_KEY)
  const learnedWithLearnWords = LocalStorageManager.load(LEARNED_WITH_LEARN_WORDS_KEY)

  repeatLearn(level, wordType, learnedWithLearnWords, category)
}

function setupListenerForIknowAndLearn(iKnowButton, repeatButton) {
  // I Know button
  if (iKnowButton && !iKnowButton.hasAttribute('listener-attached')) {
    iKnowButton.addEventListener('click', iKnowButtonClickHandler)
    iKnowButton.setAttribute('listener-attached', 'true')
  }
  // Repeat button
  if (repeatButton && !repeatButton.hasAttribute('listener-attached')) {
    repeatButton.addEventListener('click', repeatButtonClickHandler)
    repeatButton.setAttribute('listener-attached', 'true')
  }
}

// UI visibility functions
function showSkeleton(wordType) {
  const skeletonState = document.getElementById('skeletonState')
  const favoritesContainer = document.getElementById('favoritesContainer')

  if (skeletonState) {
    skeletonState.style.display = 'flex'
  }
  if (favoritesContainer) {
    favoritesContainer.style.display = 'none'
  }

  hideLearnElements(wordType)
}

function hideSkeleton(wordType) {
  const skeletonState = document.getElementById('skeletonState')
  const favoritesContainer = document.getElementById('favoritesContainer')

  if (skeletonState) {
    skeletonState.style.display = 'none'
  }
  if (favoritesContainer) {
    favoritesContainer.style.display = 'block'
  }

  showLearnElements(wordType)
}

// Learn elements visibility
function hideLearnElements(wordType) {
  const elementIds = [...LEARN_ELEMENT_IDS(wordType)]

  elementIds.forEach((id) => {
    const element = document.getElementById(id)
    if (element) {
      element.style.display = 'none'
    }
  })
}

function showLearnElements(wordType) {
  const elementIds = [...LEARN_ELEMENT_IDS(wordType)]

  elementIds.forEach((id) => {
    const element = document.getElementById(id)
    if (element) {
      const isAdjectiveOrAdverb =
        wordType === 'adjective' || wordType === 'adverb'
      const isElementRuleLearn = id === `ruleLearn-${wordType}`

      element.style.display =
        isAdjectiveOrAdverb && isElementRuleLearn ? 'none' : 'block'
    }
  })
}

function isItInFavorites(currentWord, favoriteWords) {
  return favoriteWords.some((word) => word.almanca === currentWord.almanca)
}

function updateFavoriteIcons(wordType) {
  const inFavImage = document.getElementById(`infav-${wordType}`)
  const outFavImage = document.getElementById(`outfav-${wordType}`)

  const currentWord = wordList[currentLearnIndex]
  const favoriteWords = LocalStorageManager.load('favoriteWords', [])
  const isFavorite = isItInFavorites(currentWord, favoriteWords)

  if (isFavorite) {
    inFavImage.style.display = 'block' // Görseli görünür yap
    outFavImage.style.display = 'none' // Diğerini gizle
  } else {
    inFavImage.style.display = 'none' // Görseli gizle
    outFavImage.style.display = 'block' // Diğerini görünür yap
  }
}

function isRegularLevel(level) {
  return !(level === '' || level === "einburgerungstest")
}

function showOrHideDecks(level) {
  if (isRegularLevel(level)) {
    document.getElementById('decksContainer').style.display = 'flex'
    return
  }
  document.getElementById('decksContainer').style.display = 'none'
  return
}

$('a').click(function () {
  $('nav').removeClass('w--open')
})
$('a').click(function () {
  $('div').removeClass('w--open')
})
