import { CURRENT_LEVEL_KEY, CURRENT_WORD_TYPE_KEY, DEFAULT_VALUE, LEARNED_WITH_EXERCISE_WORDS_KEY, LEARNED_WITH_LEARN_WORDS_KEY, CURRENT_CATEGORY_KEY } from '../constants/storageKeys.js'
import { JSON_URLS } from '../constants/urls.js'
import { LEARN_ELEMENT_IDS } from '../constants/elements.js'
import LocalStorageManager from '../utils/LocalStorageManager.js'
import ExerciseUtils from '../utils/home/ExerciseUtils.js'
import ListUtils from '../utils/ListUtils.js'
import SetContentbyUserPrefs from '../utils/home/SetContentbyUserPrefs.js'
import { types } from '../constants/props.js'
//#region import Json files
import verbdefault1 from '../../json/a1-a2/default/verb.json' with { type: 'json' }
import verbdefault2 from '../../json/a2-b1/default/verb.json' with { type: 'json' }
import verbdefault3 from '../../json/b1-b2/default/verb.json' with { type: 'json' }
import verbdefault4 from '../../json/c1-c2/default/verb.json' with { type: 'json' }
import verbdirty1 from '../../json/a1-a2/dirty/verb.json' with { type: 'json' }
import verbdirty2 from '../../json/a2-b1/dirty/verb.json' with { type: 'json' }
import verbdirty3 from '../../json/b1-b2/dirty/verb.json' with { type: 'json' }
import verbdirty4 from '../../json/c1-c2/dirty/verb.json' with { type: 'json' }
import verbdoctor1 from '../../json/a1-a2/doctor/verb.json' with { type: 'json' }
import verbdoctor2 from '../../json/a2-b1/doctor/verb.json' with { type: 'json' }
import verbdoctor3 from '../../json/b1-b2/doctor/verb.json' with { type: 'json' }
import verbdoctor4 from '../../json/c1-c2/doctor/verb.json' with { type: 'json' }
import verbmusic1 from '../../json/a1-a2/music/verb.json' with { type: 'json' }
import verbmusic2 from '../../json/a2-b1/music/verb.json' with { type: 'json' }
import verbmusic3 from '../../json/b1-b2/music/verb.json' with { type: 'json' }
import verbmusic4 from '../../json/c1-c2/music/verb.json' with { type: 'json' }

import adverbdefault1 from '../../json/a1-a2/default/adverb.json' with { type: 'json' }
import adverbdefault2 from '../../json/a2-b1/default/adverb.json' with { type: 'json' }
import adverbdefault3 from '../../json/b1-b2/default/adverb.json' with { type: 'json' }
import adverbdefault4 from '../../json/c1-c2/default/adverb.json' with { type: 'json' }
import adverbdirty1 from '../../json/a1-a2/dirty/adverb.json' with { type: 'json' }
import adverbdirty2 from '../../json/a2-b1/dirty/adverb.json' with { type: 'json' }
import adverbdirty3 from '../../json/b1-b2/dirty/adverb.json' with { type: 'json' }
import adverbdirty4 from '../../json/c1-c2/dirty/adverb.json' with { type: 'json' }
import adverbdoctor1 from '../../json/a1-a2/doctor/adverb.json' with { type: 'json' }
import adverbdoctor2 from '../../json/a2-b1/doctor/adverb.json' with { type: 'json' }
import adverbdoctor3 from '../../json/b1-b2/doctor/adverb.json' with { type: 'json' }
import adverbdoctor4 from '../../json/c1-c2/doctor/adverb.json' with { type: 'json' }
import adverbmusic1 from '../../json/a1-a2/music/adverb.json' with { type: 'json' }
import adverbmusic2 from '../../json/a2-b1/music/adverb.json' with { type: 'json' }
import adverbmusic3 from '../../json/b1-b2/music/adverb.json' with { type: 'json' }
import adverbmusic4 from '../../json/c1-c2/music/adverb.json' with { type: 'json' }

import adjectivedefault1 from '../../json/a1-a2/default/adjective.json' with { type: 'json' }
import adjectivedefault2 from '../../json/a2-b1/default/adjective.json' with { type: 'json' }
import adjectivedefault3 from '../../json/b1-b2/default/adjective.json' with { type: 'json' }
import adjectivedefault4 from '../../json/c1-c2/default/adjective.json' with { type: 'json' }
import adjectivedirty1 from '../../json/a1-a2/dirty/adjective.json' with { type: 'json' }
import adjectivedirty2 from '../../json/a2-b1/dirty/adjective.json' with { type: 'json' }
import adjectivedirty3 from '../../json/b1-b2/dirty/adjective.json' with { type: 'json' }
import adjectivedirty4 from '../../json/c1-c2/dirty/adjective.json' with { type: 'json' }
import adjectivedoctor1 from '../../json/a1-a2/doctor/adjective.json' with { type: 'json' }
import adjectivedoctor2 from '../../json/a2-b1/doctor/adjective.json' with { type: 'json' }
import adjectivedoctor3 from '../../json/b1-b2/doctor/adjective.json' with { type: 'json' }
import adjectivedoctor4 from '../../json/c1-c2/doctor/adjective.json' with { type: 'json' }
import adjectivemusic1 from '../../json/a1-a2/music/adjective.json' with { type: 'json' }
import adjectivemusic2 from '../../json/a2-b1/music/adjective.json' with { type: 'json' }
import adjectivemusic3 from '../../json/b1-b2/music/adjective.json' with { type: 'json' }
import adjectivemusic4 from '../../json/c1-c2/music/adjective.json' with { type: 'json' }
//#endregion

import vEinburger from '../../json/einburgerungstest/verb.json' with { type: 'json' }
import adjEinburger from '../../json/einburgerungstest/adjective.json' with { type: 'json' }
import advEinburger from '../../json/einburgerungstest/adverb.json' with { type: 'json' }

//#region static json Arrays
let staticWordLists = {
  b1telcpt1: {
    default: {
      verb: verbdefault1,
      adjective: adjectivedefault1,
      adverb: adverbdefault1
    },
    dirty: {
      verb: verbdirty1,
      adjective: adjectivedirty1,
      adverb: adverbdirty1
    },
    doctor: {
      verb: verbdoctor1,
      adjective: adjectivedoctor1,
      adverb: adverbdoctor1
    },
    music: {
      verb: verbmusic1,
      adjective: adjectivemusic1,
      adverb: adverbmusic1
    }
  },
  b1telcpt2: {
    default: {
      verb: verbdefault2,
      adjective: adjectivedefault2,
      adverb: adverbdefault2
    },
    dirty: {
      verb: verbdirty2,
      adjective: adjectivedirty2,
      adverb: adverbdirty2
    },
    doctor: {
      verb: verbdoctor2,
      adjective: adjectivedoctor2,
      adverb: adverbdoctor2
    },
    music: {
      verb: verbmusic2,
      adjective: adjectivemusic2,
      adverb: adverbmusic2
    }
  },
  b1telcpt3: {
    default: {
      verb: verbdefault3,
      adjective: adjectivedefault3,
      adverb: adverbdefault3
    },
    dirty: {
      verb: verbdirty3,
      adjective: adjectivedirty3,
      adverb: adverbdirty3
    },
    doctor: {
      verb: verbdoctor3,
      adjective: adjectivedoctor3,
      adverb: adverbdoctor3
    },
    music: {
      verb: verbmusic3,
      adjective: adjectivemusic3,
      adverb: adverbmusic3
    }
  },
  b1telcpt4: {
    default: {
      verb: verbdefault4,
      adjective: adjectivedefault4,
      adverb: adverbdefault4
    },
    dirty: {
      verb: verbdirty4,
      adjective: adjectivedirty4,
      adverb: adverbdirty4
    },
    doctor: {
      verb: verbdoctor4,
      adjective: adjectivedoctor4,
      adverb: adverbdoctor4
    },
    music: {
      verb: verbmusic4,
      adjective: adjectivemusic4,
      adverb: adverbmusic4
    }
  },
  einburgerungstest: {
    einburgerungstest: {
      verb: vEinburger,
      adjective: adjEinburger,
      adverb: advEinburger
    }
  }
}
//#endregion

// yeni comment
let inProgressWords = {
  b1telcpt1: {
    default: {
      noun: [],
      verb: [],
      adjective: [],
      adverb: [],
    },
    dirty: {
      noun: [],
      verb: [],
      adjective: [],
      adverb: [],
    },
    doctor: {
      noun: [],
      verb: [],
      adjective: [],
      adverb: [],
    },
    music: {
      noun: [],
      verb: [],
      adjective: [],
      adverb: [],
    },
  },
  b1telcpt2: {
    default: {
      noun: [],
      verb: [],
      adjective: [],
      adverb: [],
    },
    dirty: {
      noun: [],
      verb: [],
      adjective: [],
      adverb: [],
    },
    doctor: {
      noun: [],
      verb: [],
      adjective: [],
      adverb: [],
    },
    music: {
      noun: [],
      verb: [],
      adjective: [],
      adverb: [],
    },
  },
  b1telcpt3: {
    default: {
      noun: [],
      verb: [],
      adjective: [],
      adverb: [],
    },
    dirty: {
      noun: [],
      verb: [],
      adjective: [],
      adverb: [],
    },
    doctor: {
      noun: [],
      verb: [],
      adjective: [],
      adverb: [],
    },
    music: {
      noun: [],
      verb: [],
      adjective: [],
      adverb: [],
    },
  },
  b1telcpt4: {
    default: {
      noun: [],
      verb: [],
      adjective: [],
      adverb: [],
    },
    dirty: {
      noun: [],
      verb: [],
      adjective: [],
      adverb: [],
    },
    doctor: {
      noun: [],
      verb: [],
      adjective: [],
      adverb: [],
    },
    music: {
      noun: [],
      verb: [],
      adjective: [],
      adverb: [],
    },
  },
  einburgerungstest: {
    einburgerungstest: { noun: [], verb: [], adjective: [], adverb: [] }
  },
}

let kelimeListesi = []
let kelimeListesiExercise = []
let currentLearnIndex = 0
let currentExerciseIndex = 0
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
  const defaultLearnedWithLearnWords = LocalStorageManager.load(LEARNED_WITH_LEARN_WORDS_KEY, DEFAULT_VALUE.LEARNED_WITH_LEARN_WORDS)
  console.log("learnedwithlearn: " + defaultLearnedWithLearnWords)
  const defaultLearnedWithExerciseWords = LocalStorageManager.load(LEARNED_WITH_EXERCISE_WORDS_KEY, DEFAULT_VALUE.LEARNED_WITH_EXERCISE_WORDS)
  console.log("learnedwithexercise: " + defaultLearnedWithExerciseWords)
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

async function executeInitialLoadAndShow(level, wordType, learnedWithLearnWords, learnedWithExerciseWords, category) {
  checkCurrentIndexes()
  try {
    await loadWords(level, wordType, learnedWithLearnWords, learnedWithExerciseWords, category)
    showLearnWord(level, wordType, learnedWithLearnWords, category)
    showExerciseWord(level, wordType, learnedWithExerciseWords, category)
  } catch (error) {
    console.error('Kelime yükleme hatası:', error)
  }
}

// Kelime yükleme fonksiyonu
async function loadWords(level, wordType, learnedWithLearnWords, learnedWithExerciseWords, category) {

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
    kelimeListesi = [...data]
    kelimeListesiExercise = [...data]
    initialTotalWords = data.length
    totalWordsExercise = initialTotalWords
    totalWordsLearn = initialTotalWords

    ListUtils.shuffleArray(kelimeListesi)
    ListUtils.shuffleArray(kelimeListesiExercise)

    // LocalStorage'daki progress listelerini temizle
    LocalStorageManager.save('inProgressWords', inProgressWords)
    //localStorage.setItem("learnedWithExerciseWords", JSON.stringify([]));

    document.getElementById(
      `remainingWordsCountLearn-${wordType}`
    ).innerText = learnedWithLearnWords[level][category][wordType].length
    document.getElementById(
      `remainingWordsCountExercise-${wordType}`
    ).innerText = learnedWithExerciseWords[level][category][wordType].length
    document.getElementById(`totalWordsCountLearn-${wordType}`).innerText =
      totalWordsLearn
    document.getElementById(
      `totalWordsCountExercise-${wordType}`
    ).innerText = totalWordsExercise

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

// On Page Navigation
function navigateToPage(pageId) {
  const level = LocalStorageManager.load(CURRENT_LEVEL_KEY)
  const wordType = LocalStorageManager.load(CURRENT_WORD_TYPE_KEY)
  const learnedWithLearnWords = LocalStorageManager.load(LEARNED_WITH_LEARN_WORDS_KEY, DEFAULT_VALUE.LEARNED_WITH_LEARN_WORDS)
  const learnedWithExerciseWords = LocalStorageManager.load(LEARNED_WITH_EXERCISE_WORDS_KEY, DEFAULT_VALUE.LEARNED_WITH_EXERCISE_WORDS)



  showSkeleton(wordType)
  setTimeout(() => {
    document.querySelectorAll('.page').forEach((page) => {
      page.style.display = 'none'
    })
    document.getElementById(pageId).style.display = 'block'
    hideSkeleton(recentWordType)

    // Sayfa değişiminde buton kontrolü
    if (learnedWithLearnWords[level][wordType].length >= initialTotalWords) {
      document.getElementById(
        'iKnowButtonLearn-' + wordType
      ).style.visibility = 'hidden'
      document.getElementById(
        'repeatButtonLearn-' + wordType
      ).style.visibility = 'hidden'
    }
    if (
      learnedWithExerciseWords[level][wordType] >= initialTotalWords
    ) {
      if (wordType === 'noun') {
        document.getElementById('buttonDer').style.visibility = 'hidden'
        document.getElementById('buttonDie').style.visibility = 'hidden'
        document.getElementById('buttonDas').style.visibility = 'hidden'
      } else if (
        wordType === 'verb' ||
        wordType === 'adjective' ||
        wordType === 'adverb'
      ) {
        document.getElementById(`wrongButton-${wordType}`).style.visibility =
          'hidden'
        document.getElementById(
          `correctButton-${wordType}`
        ).style.visibility = 'hidden'
      }
    }
  }, 500)
}

// On Learn: Repeat Click
function repeatLearn(level, wordType, learnedWithLearnWords, category) {
  if (!kelimeListesi.length || currentLearnIndex >= kelimeListesi.length) {
    console.log('No words to repeat')
    return
  }

  // Get current word and move it to the end
  const currentWord = kelimeListesi.splice(currentLearnIndex, 1)[0]
  kelimeListesi.push(currentWord)

  // Keep the index within bounds
  currentLearnIndex = currentLearnIndex % kelimeListesi.length

  // Show the next word
  showLearnWord(level, wordType, learnedWithLearnWords, category)
}

// On Learn: I Know Click
function iKnowLearn(level, wordType, learnedWithLearnWords, category) {

  if (learnedWithLearnWords[level][category][wordType].length + 1 === initialTotalWords) {
    showModal('You learned all words! 🎉', wordType)
  }

  const currentWord = kelimeListesi[totalWordsLearn - currentLearnIndex]

  learnedWithLearnWords[level][category][wordType].push({
    ...currentWord
  })
  LocalStorageManager.save(LEARNED_WITH_LEARN_WORDS_KEY, learnedWithLearnWords)

  kelimeListesi.splice(currentLearnIndex, 1)

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

  if (kelimeListesi.length === 0 || currentLearnIndex >= kelimeListesi.length) {
    feedbackElement.innerText = 'No word to add to favorites!'
    feedbackElement.style.color = 'red'
    feedbackElement.style.display = 'block'
    setTimeout(() => {
      feedbackElement.style.display = 'none'
    }, 3000)
    return
  }

  const currentWord = kelimeListesi[currentLearnIndex]
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
  const currentWord = kelimeListesi[currentLearnIndex]
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

// Konu başlıklarını güncelleme fonksiyonu
function updateTopicNames(level, wordType) {
  const topicNames = {
    b1telcpt1: 'Level: A1 - A2',
    b1telcpt2: 'Level: A2 - B1',
    b1telcpt3: 'Level: B1 - B2',
    b1telcpt4: 'Level: C1 - C2',
    einburgerungstest: 'Einbürgerungstest',
  }

  const topicName = topicNames[level] || 'Level: A1 - A2'
  if (document.getElementById(`selectedTopicName-${wordType}`)) {
    document.getElementById(`selectedTopicName-${wordType}`).innerText =
      topicName
  }
  if (document.getElementById(`selectedTopicNameExercise-${wordType}`)) {
    document.getElementById(
      `selectedTopicNameExercise-${wordType}`
    ).innerText = topicName
  }
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
    kelimeListesi[currentLearnIndex]

  if (learnedWithLearnWords[level][category][wordType].length > 0) {
    kelimeListesi = kelimeListesi.filter(
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
      const renk = artikelRenk(kelimeListesi[currentLearnIndex].artikel)
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

function showExerciseWord(level, wordType, learnedWithExerciseWords, category) {
  // updated indexes
  document.getElementById(
    `remainingWordsCountExercise-${wordType}`
  ).innerText = learnedWithExerciseWords[level][category][wordType].length
  document.getElementById('totalWordsCountExercise-' + wordType).innerText =
    totalWordsExercise

  const buttonDer = document.getElementById('buttonDer')
  const buttonDie = document.getElementById('buttonDie')
  const buttonDas = document.getElementById('buttonDas')
  const buttonWrong = document.getElementById(`wrongButton-${wordType}`)
  const buttonCorrect = document.getElementById(`correctButton-${wordType}`)

  // max index -> hiding buttons, early return
  if (
    learnedWithExerciseWords[level][category][wordType].length ===
    totalWordsExercise
  ) {
    document.getElementById(`levelTagExercise-${wordType}`).innerText = ''
    document.getElementById(`exerciseWord-${wordType}`).innerText = ''
    document.getElementById(`exerciseTranslation-${wordType}`).innerText = ''
    document.getElementById(
      `feedbackMessage-${wordType}`
    ).innerText = `You completed all exercise words! 🎉`

    if (wordType === 'noun') {
      buttonDer.style.visibility = 'hidden'
      buttonDie.style.visibility = 'hidden'
      buttonDas.style.visibility = 'hidden'
    } else if (['verb', 'adjective', 'adverb'].includes(wordType)) {
      buttonWrong.style.visibility =
        'hidden'
      buttonCorrect.style.visibility =
        'hidden'
    }
    return
  }

  // else
  // // reactivate buttons
  if (wordType === 'noun') {
    buttonDer.style.visibility = 'visible'
    buttonDie.style.visibility = 'visible'
    buttonDas.style.visibility = 'visible'
  } else if (['verb', 'adjective', 'adverb'].includes(wordType)) {
    buttonWrong.style.visibility =
      'visible'
    buttonCorrect.style.visibility =
      'visible'
  }

  // Index kontrolü
  if (currentExerciseIndex > kelimeListesiExercise.length) {
    currentExerciseIndex = 0
  }

  inProgressWords =
    LocalStorageManager.load('inProgressWords', inProgressWords)


  // 🟢 `kelimeListesi` içinden `learnedWords`'de olanları çıkar
  if (learnedWithExerciseWords[level][category][wordType].length > 0) {
    kelimeListesiExercise = kelimeListesiExercise.filter(
      (word) =>
        !learnedWithExerciseWords[level][category][wordType].some(
          (learned) => learned.almanca === word.almanca
        )
    )
  }

  if (kelimeListesiExercise.length === 0) {
    document.getElementById(`levelTagExercise-${wordType}`).innerText = ''
    console.log('Kelime listesi boş. Gösterilecek kelime yok.')
    return
  }

  const currentWord = kelimeListesiExercise[currentExerciseIndex]
  const progressWord = inProgressWords[level][category][wordType].find(
    (item) => item.almanca === currentWord.almanca
  )

  const { kelime, ingilizce, seviye } =
    kelimeListesiExercise[currentExerciseIndex]
  // const renk = artikelRenk(artikel)

  // Kelimenin Almanca kısmını göster
  document.getElementById(`exerciseWord-${wordType}`).innerText = kelime
  document.getElementById(`levelTagExercise-${wordType}`).innerText =
    seviye || 'N/A'

  // İngilizce çeviriyi göster (ID üzerinden erişim)
  const exerciseTranslationElement = document.getElementById(
    `exerciseTranslation-${wordType}`
  )
  if (exerciseTranslationElement) {
    let exerciseTranslationText = ''

    if (wordType === 'noun') {
      exerciseTranslationText = ingilizce
    } else if (
      wordType === 'verb' ||
      wordType === 'adjective' ||
      wordType === 'adverb'
    ) {
      if (ExerciseUtils.shouldUseOwnMeaning()) {
        exerciseTranslationText = ingilizce
      } else {
        exerciseTranslationText = ExerciseUtils.getRandomTranslationResult(level, currentWord, staticWordLists, category)
        // todo: transfer data for checking the answer later
        const buttonWrong = document.getElementById(
          `wrongButton-${wordType}`
        )
        buttonWrong.setAttribute('wrong-but', true)
      }
    }

    exerciseTranslationElement.innerText = exerciseTranslationText
  } else {
    console.error('exerciseTranslation ID not found!')
  }

  if (progressWord) {
    const counter = progressWord.counter
    document.getElementById(`progressLeft-${wordType}`).style.opacity =
      counter >= 1 ? '1' : '0.5'
    document.getElementById(`progressMiddle-${wordType}`).style.opacity =
      counter >= 2 ? '1' : '0.5'
    document.getElementById(`progressRight-${wordType}`).style.opacity =
      counter >= 3 ? '1' : '0.5'
  } else {
    // Default state
    document.getElementById(`progressLeft-${wordType}`).style.opacity = '0.5'
    document.getElementById(`progressMiddle-${wordType}`).style.opacity =
      '0.5'
    document.getElementById(`progressRight-${wordType}`).style.opacity =
      '0.5'
  }

  // Default olarak boş bırakılan artikel alanı
  if (wordType === 'noun') {
    document.getElementById('correctAnswerField').innerHTML = '___'
  }

  document.getElementById(`feedbackMessage-${wordType}`).innerText = ''
}

export const nounDerAnswerClickHandler = function (event) {
  const level = LocalStorageManager.load(CURRENT_LEVEL_KEY)
  const category = LocalStorageManager.load(CURRENT_CATEGORY_KEY)
  const wordType = LocalStorageManager.load(CURRENT_WORD_TYPE_KEY)
  const learnedWithExerciseWords = LocalStorageManager.load(LEARNED_WITH_EXERCISE_WORDS_KEY)

  event.preventDefault() // Sayfanın yukarı kaymasını engeller
  checkNounAnswer('der', level, wordType, learnedWithExerciseWords, category)
}

export const nounDieAnswerClickHandler = function (event) {
  const level = LocalStorageManager.load(CURRENT_LEVEL_KEY)
  const category = LocalStorageManager.load(CURRENT_CATEGORY_KEY)
  const wordType = LocalStorageManager.load(CURRENT_WORD_TYPE_KEY)
  const learnedWithExerciseWords = LocalStorageManager.load(LEARNED_WITH_EXERCISE_WORDS_KEY)

  event.preventDefault() // Sayfanın yukarı kaymasını engeller
  checkNounAnswer('die', level, wordType, learnedWithExerciseWords, category)
}

export const nounDasAnswerClickHandler = (event) => {
  const level = LocalStorageManager.load(CURRENT_LEVEL_KEY)
  const category = LocalStorageManager.load(CURRENT_CATEGORY_KEY)
  const wordType = LocalStorageManager.load(CURRENT_WORD_TYPE_KEY)
  const learnedWithExerciseWords = LocalStorageManager.load(LEARNED_WITH_EXERCISE_WORDS_KEY)

  event.preventDefault() // Sayfanın yukarı kaymasını engeller
  checkNounAnswer('das', level, wordType, learnedWithExerciseWords, category)
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

function checkNonNounAnswer(isUserInputCorrect, level, wordType, learnedWithExerciseWords, category) {
  // Eğer liste boşsa veya index liste dışındaysa, işlemi durdur
  if (
    !kelimeListesiExercise.length ||
    currentExerciseIndex >= kelimeListesiExercise.length
  ) {
    currentExerciseIndex = 0
    return
  }

  inProgressWords = LocalStorageManager.load('inProgressWords', inProgressWords)

  const currentWord = kelimeListesiExercise[currentExerciseIndex]
  const { almanca, ingilizce, kural } = currentWord
  const buttonWrong = document.getElementById(`wrongButton-${wordType}`)
  const buttonCorrect = document.getElementById(`correctButton-${wordType}`)


  const inProgressIndex = inProgressWords[level][category][wordType].findIndex(
    (item) => item.almanca === almanca
  )

  buttonWrong.style.visibility = 'hidden'
  buttonCorrect.style.visibility = 'hidden'

  const isAnswerCorrect = !buttonWrong.hasAttribute('wrong-but')

  if (isUserInputCorrect === isAnswerCorrect) {
    document.getElementById(`feedbackMessage-${wordType}`).innerText =
      'Correct! 🎉'
    document.getElementById(`feedbackMessage-${wordType}`).style.color =
      'green'

    //InProgress listesine kelimeyi ekle - Eger hic dogru bilinmemisse yeni ekle daha önce bilinmisse progress i arttir
    if (inProgressIndex === -1) {
      playSound(
        'https://github.com/heroofdarkroom/proje/raw/refs/heads/master/correct.mp3'
      )
      inProgressWords[level][category][wordType].push({
        type: currentWord.type,
        almanca: currentWord.almanca,
        counter: 1,
      })
      document.getElementById('progressLeft-' + wordType).style.opacity = '1'

      // Liste manipülasyonlarından sonra index kontrolü
      if (currentExerciseIndex >= kelimeListesiExercise.length) {
        currentExerciseIndex = 0
      }

      kelimeListesiExercise.splice(currentExerciseIndex, 1)
      if (kelimeListesiExercise.length > currentExerciseIndex + 4) {
        kelimeListesiExercise.splice(currentExerciseIndex + 4, 0, currentWord)
      } else {
        kelimeListesiExercise.push(currentWord)
      }

      currentExerciseIndex++
      if (currentExerciseIndex >= kelimeListesiExercise.length) {
        currentExerciseIndex = 0
      }
    } else {
      inProgressWords[level][category][wordType][inProgressIndex].counter += 1
      if (
        inProgressWords[level][category][wordType][inProgressIndex].counter ===
        2
      ) {
        document.getElementById(`progressMiddle-${wordType}`).style.opacity =
          '1'
      }
      //3 kere bilindiyse learnede ekle
      if (
        inProgressWords[level][category][wordType][inProgressIndex].counter >= 3
      ) {
        playSound(
          'https://github.com/heroofdarkroom/proje/raw/refs/heads/master/streak.mp3'
        )

        learnedWithExerciseWords[level][category][wordType].push({
          type: currentWord.type,
          almanca: currentWord.almanca,
          ingilizce: currentWord.ingilizce,
          seviye: currentWord.seviye || 'N/A',
        })

        LocalStorageManager.save(LEARNED_WITH_EXERCISE_WORDS_KEY, learnedWithExerciseWords)

        // if exercise is ended
        if (learnedWithExerciseWords[level][category][wordType].length === totalWordsExercise) {
          showModalExercise('You completed all exercise words! 🎉', wordType)
        }

        if (
          inProgressWords[level][category][wordType][inProgressIndex]
            .counter === 3
        ) {
          document.getElementById(
            `feedbackMessage-${wordType}`
          ).innerText = `This word: ${currentWord.almanca} added to learned list!🏆`
          document.getElementById(
            `feedbackMessage-${wordType}`
          ).style.color = 'green'
          document.getElementById(
            `progressRight-${wordType}`
          ).style.opacity = '1'
        }
        // updateExerciseCounter(level, wordType, learnedWithExerciseWords)
        kelimeListesiExercise.splice(currentExerciseIndex, 1)
        currentExerciseIndex--
        if (currentExerciseIndex >= kelimeListesiExercise.length) {
          currentExerciseIndex =
            currentExerciseIndex % kelimeListesiExercise.length
          if (currentExerciseIndex == 0) {
            currentExerciseIndex++
          }
        }
        // inProgressWords.splice(inProgressIndex, 1); // inProgressWords'ten çıkar
        console.log(
          `'${currentWord.almanca}' ${LEARNED_WITH_EXERCISE_WORDS_KEY} listesine taşındı.`
        )
        setTimeout(() => {
          showExerciseWord(level, wordType, learnedWithExerciseWords, category)
        }, 1000)
      } else {
        playSound(
          'https://github.com/heroofdarkroom/proje/raw/refs/heads/master/correct.mp3'
        )
        kelimeListesiExercise.splice(currentExerciseIndex, 1)
        if (
          inProgressWords[level][category][wordType][inProgressIndex]
            .counter === 1
        ) {
          kelimeListesiExercise.splice(
            currentExerciseIndex + 8,
            0,
            currentWord
          )[0]
        } else {
          kelimeListesiExercise.splice(
            currentExerciseIndex + 12,
            0,
            currentWord
          )[0]
        }
        currentExerciseIndex++
        if (currentExerciseIndex >= kelimeListesiExercise.length) {
          currentExerciseIndex =
            currentExerciseIndex % kelimeListesiExercise.length
          if (currentExerciseIndex == 0) {
            currentExerciseIndex++
          }
        }
      }
    }

    setTimeout(() => {
      showExerciseWord(level, wordType, learnedWithExerciseWords, category)
    }, 1000)
    LocalStorageManager.save(
      LEARNED_WITH_EXERCISE_WORDS_KEY,
      learnedWithExerciseWords
    )
  } else {
    if (inProgressIndex !== -1) {
      kelimeListesiExercise.splice(currentExerciseIndex, 1)

      if (kelimeListesiExercise.length > currentExerciseIndex + 10) {
        kelimeListesiExercise.splice(currentExerciseIndex + 10, 0, currentWord)
      } else {
        kelimeListesiExercise.push(currentWord)
      }

      inProgressWords[level][category][wordType][inProgressIndex].counter = 0
      document.getElementById(`progressRight-${wordType}`).style.opacity =
        '0.5'
      document.getElementById(`progressMiddle-${wordType}`).style.opacity =
        '0.5'
      document.getElementById(`progressLeft-${wordType}`).style.opacity =
        '0.5'

      currentExerciseIndex++
      if (currentExerciseIndex >= kelimeListesiExercise.length) {
        currentExerciseIndex =
          currentExerciseIndex % kelimeListesiExercise.length
        if (currentExerciseIndex == 0) {
          currentExerciseIndex++
        }
      }
    } else {
      currentExerciseIndex++
      if (currentExerciseIndex >= kelimeListesiExercise.length) {
        currentExerciseIndex =
          currentExerciseIndex % kelimeListesiExercise.length
        if (currentExerciseIndex == 0) {
          currentExerciseIndex++
        }
      }
    }
    document.getElementById(
      `feedbackMessage-${wordType}`
    ).innerText = `Upps! Try again. 💪`
    document.getElementById(`feedbackMessage-${wordType}`).style.color =
      'red'
    setTimeout(() => {
      // document.getElementById('correctAnswerField').innerHTML = '___' // Tekrar boş bırak
      // buttonWrong.style.visibility = 'visible'
      // buttonCorrect.style.visibility = 'visible'
      showExerciseWord(level, wordType, learnedWithExerciseWords, category)
    }, 3000)
  }

  buttonWrong.removeAttribute('wrong-but')
  LocalStorageManager.save('inProgressWords', inProgressWords)
}

function checkNounAnswer(userArtikel, level, wordType, learnedWithExerciseWords, category) {
  // Eğer liste boşsa veya index liste dışındaysa, işlemi durdur
  if (
    !kelimeListesiExercise.length ||
    currentExerciseIndex >= kelimeListesiExercise.length
  ) {
    currentExerciseIndex = 0
    return
  }

  const currentWord = kelimeListesiExercise[currentExerciseIndex]
  const { artikel, kural, kelime } = currentWord
  const buttonDer = document.getElementById('buttonDer')
  const buttonDie = document.getElementById('buttonDie')
  const buttonDas = document.getElementById('buttonDas')

  console.log(`'${currentExerciseIndex}' index böyleydi.`)
  console.log(
    `'${kelimeListesiExercise.length}' kelime listesi uzunlugu böyleydi.`
  )
  inProgressWords = LocalStorageManager.load('inProgressWords', inProgressWords)

  const inProgressIndex = inProgressWords[level][category][wordType].findIndex(
    (item) => item.almanca === currentWord.almanca
  )

  buttonDer.style.visibility = 'hidden'
  buttonDie.style.visibility = 'hidden'
  buttonDas.style.visibility = 'hidden'
  console.log('Butonlar geçici olarak devre dışı bırakıldı.')

  if (userArtikel.toLowerCase() === artikel.toLowerCase()) {
    document.getElementById(`feedbackMessage-${wordType}`).innerText =
      'Correct! 🎉'
    document.getElementById(`feedbackMessage-${wordType}`).style.color =
      'green'

    // Doğru artikeli göster
    const renk = artikelRenk(artikel)
    document.getElementById(
      'correctAnswerField'
    ).innerHTML = `<span style="color: ${renk};">${artikel}</span>`

    //InProgress listesine kelimeyi ekle - Eger hic dogru bilinmemisse yeni ekle daha önce bilinmisse progress i arttir
    if (inProgressIndex === -1) {
      playSound(
        'https://github.com/heroofdarkroom/proje/raw/refs/heads/master/correct.mp3'
      )
      inProgressWords[level][category][wordType].push({
        type: currentWord.type,
        almanca: currentWord.almanca,
        counter: 1,
      })
      document.getElementById(`progressLeft-${wordType}`).style.opacity = '1'

      // Liste manipülasyonlarından sonra index kontrolü
      if (currentExerciseIndex >= kelimeListesiExercise.length) {
        currentExerciseIndex = 0
      }

      kelimeListesiExercise.splice(currentExerciseIndex, 1)
      if (kelimeListesiExercise.length > currentExerciseIndex + 4) {
        kelimeListesiExercise.splice(currentExerciseIndex + 4, 0, currentWord)
      } else {
        kelimeListesiExercise.push(currentWord)
      }

      currentExerciseIndex++
      if (currentExerciseIndex >= kelimeListesiExercise.length) {
        currentExerciseIndex = 0
      }
    } else {
      inProgressWords[level][category][wordType][inProgressIndex].counter += 1
      if (
        inProgressWords[level][category][wordType][inProgressIndex].counter ===
        2
      ) {
        document.getElementById(`progressMiddle-${wordType}`).style.opacity =
          '1'
      }
      //3 kere bilindiyse learnede ekle
      if (
        inProgressWords[level][category][wordType][inProgressIndex].counter >= 3
      ) {
        playSound(
          'https://github.com/heroofdarkroom/proje/raw/refs/heads/master/streak.mp3'
        )

        learnedWithExerciseWords[level][category][wordType].push({
          type: currentWord.type,
          almanca: currentWord.almanca,
          ingilizce: currentWord.ingilizce,
          seviye: currentWord.seviye || 'N/A',
        })

        LocalStorageManager.save(LEARNED_WITH_EXERCISE_WORDS_KEY, learnedWithExerciseWords)

        // if exercise is ended
        if (learnedWithExerciseWords[level][category][wordType].length === totalWordsExercise) {
          showModalExercise('You completed all exercise words! 🎉', wordType)
        }


        if (
          inProgressWords[level][category][wordType][inProgressIndex]
            .counter === 3
        ) {
          document.getElementById(
            `feedbackMessage-${wordType}`
          ).innerText = `This word: ${currentWord.almanca} added to learned list!🏆`
          document.getElementById(
            `feedbackMessage-${wordType}`
          ).style.color = 'green'
          document.getElementById(
            `progressRight-${wordType}`
          ).style.opacity = '1'
        }
        // updateExerciseCounter(level, wordType, learnedWithExerciseWords)
        kelimeListesiExercise.splice(currentExerciseIndex, 1)
        currentExerciseIndex--
        if (currentExerciseIndex >= kelimeListesiExercise.length) {
          currentExerciseIndex =
            currentExerciseIndex % kelimeListesiExercise.length
          if (currentExerciseIndex == 0) {
            currentExerciseIndex++
          }
        }
        // inProgressWords.splice(inProgressIndex, 1); // inProgressWords'ten çıkar
        console.log(
          `'${currentWord.almanca}' ${LEARNED_WITH_EXERCISE_WORDS_KEY} listesine taşındı.`
        )
        setTimeout(() => {
          showExerciseWord(level, wordType, learnedWithExerciseWords, category)
        }, 1000)
      } else {
        playSound(
          'https://github.com/heroofdarkroom/proje/raw/refs/heads/master/correct.mp3'
        )
        kelimeListesiExercise.splice(currentExerciseIndex, 1)
        if (
          inProgressWords[level][category][wordType][inProgressIndex]
            .counter === 1
        ) {
          kelimeListesiExercise.splice(
            currentExerciseIndex + 8,
            0,
            currentWord
          )[0]
        } else {
          kelimeListesiExercise.splice(
            currentExerciseIndex + 12,
            0,
            currentWord
          )[0]
        }
        currentExerciseIndex++
        if (currentExerciseIndex >= kelimeListesiExercise.length) {
          currentExerciseIndex =
            currentExerciseIndex % kelimeListesiExercise.length
          if (currentExerciseIndex == 0) {
            currentExerciseIndex++
          }
        }
      }
    }

    setTimeout(() => {
      document.getElementById('correctAnswerField').innerHTML = '___' // Tekrar boş bırak
      // buttonDer.style.visibility = 'visible'
      // buttonDie.style.visibility = 'visible'
      // buttonDas.style.visibility = 'visible'
      showExerciseWord(level, wordType, learnedWithExerciseWords, category)
    }, 1000)
    LocalStorageManager.save(
      LEARNED_WITH_EXERCISE_WORDS_KEY,
      learnedWithExerciseWords
    )
  } else {
    if (inProgressIndex !== -1) {
      kelimeListesiExercise.splice(currentExerciseIndex, 1)

      if (kelimeListesiExercise.length > currentExerciseIndex + 10) {
        kelimeListesiExercise.splice(currentExerciseIndex + 10, 0, currentWord)
      } else {
        kelimeListesiExercise.push(currentWord)
      }

      inProgressWords[level][category][wordType][inProgressIndex].counter = 0
      document.getElementById(`progressRight-${wordType}`).style.opacity =
        '0.5'
      document.getElementById(`progressMiddle-${wordType}`).style.opacity =
        '0.5'
      document.getElementById(`progressLeft-${wordType}`).style.opacity =
        '0.5'

      currentExerciseIndex++
      if (currentExerciseIndex >= kelimeListesiExercise.length) {
        currentExerciseIndex =
          currentExerciseIndex % kelimeListesiExercise.length
        if (currentExerciseIndex == 0) {
          currentExerciseIndex++
        }
      }
    } else {
      currentExerciseIndex++
      if (currentExerciseIndex >= kelimeListesiExercise.length) {
        currentExerciseIndex =
          currentExerciseIndex % kelimeListesiExercise.length
        if (currentExerciseIndex == 0) {
          currentExerciseIndex++
        }
      }
    }
    document.getElementById(
      `feedbackMessage-${wordType}`
    ).innerText = `Upps! ⚠️ ${kural}`
    document.getElementById(`feedbackMessage-${wordType}`).style.color =
      'red'
    setTimeout(() => {
      document.getElementById('correctAnswerField').innerHTML = '___' // Tekrar boş bırak
      // buttonDer.style.visibility = 'visible'
      // buttonDie.style.visibility = 'visible'
      // buttonDas.style.visibility = 'visible'
      showExerciseWord(level, wordType, learnedWithExerciseWords, category)
    }, 3000)
  }
  console.log(`'${currentExerciseIndex}' index bu sayiya güncellendi.`)
  console.log(
    `'${kelimeListesiExercise.length}' liste uzunlugu bu sayiya güncellendi.`
  )
  LocalStorageManager.save('inProgressWords', inProgressWords)
}

const nonNounWrongAnswerClickHandler = (event) => {
  event.preventDefault() // Sayfanın yukarı kaymasını engeller

  const level = LocalStorageManager.load(CURRENT_LEVEL_KEY)
  const category = LocalStorageManager.load(CURRENT_CATEGORY_KEY)
  const wordType = LocalStorageManager.load(CURRENT_WORD_TYPE_KEY)
  const learnedWithExerciseWords = LocalStorageManager.load(LEARNED_WITH_EXERCISE_WORDS_KEY)

  checkNonNounAnswer(false, level, wordType, learnedWithExerciseWords, category)
}

const nonNounCorrectAnswerClickHandler = (event) => {
  event.preventDefault() // Sayfanın yukarı kaymasını engeller

  const level = LocalStorageManager.load(CURRENT_LEVEL_KEY)
  const category = LocalStorageManager.load(CURRENT_CATEGORY_KEY)
  const wordType = LocalStorageManager.load(CURRENT_WORD_TYPE_KEY)
  const learnedWithExerciseWords = LocalStorageManager.load(LEARNED_WITH_EXERCISE_WORDS_KEY)

  checkNonNounAnswer(true, level, wordType, learnedWithExerciseWords, category)
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

// E-mail Form
// document.addEventListener('DOMContentLoaded', function () {
//   document
//     .getElementById('email-form')
//     .addEventListener('submit', function (event) {
//       event.preventDefault() // Formun hemen gönderilmesini engeller
//       gtag_report_conversion()

//       setTimeout(() => {
//         this.submit() // Google Ads dönüşüm takibinin ardından formu gönder
//       }, 300) // 300ms bekleyerek Google Ads dönüşümünün çalışmasını bekler
//     })
// })

function updateExerciseCounter(level, wordType, learnedWithExerciseWords, category) {
  // correctAnswerWordsCounter[currentLevel][currentType]++
  // LocalStorageManager.save(
  //   'correctAnswerWordsCounter',
  //   correctAnswerWordsCounter
  // )

  document.getElementById(
    'remainingWordsCountExercise-' + wordType
  ).innerText = learnedWithExerciseWords[level][category][wordType].length
  document.getElementById('totalWordsCountExercise-' + wordType).innerText =
    initialTotalWords

  if (
    learnedWithExerciseWords[level][category][wordType].length >= initialTotalWords
  ) {
    showModalExercise('You completed all exercise words! 🎉', wordType)

    if (wordType === 'noun') {
      document.getElementById('buttonDer').style.visibility = 'hidden'
      document.getElementById('buttonDie').style.visibility = 'hidden'
      document.getElementById('buttonDas').style.visibility = 'hidden'
    } else if (
      wordType === 'verb' ||
      wordType === 'adjective' ||
      wordType === 'adverb'
    ) {
      document.getElementById(`wrongButton-${wordType}`).style.visibility =
        'hidden'
      document.getElementById(`correctButton-${wordType}`).style.visibility =
        'hidden'
    }
    document.getElementById(`feedbackMessage-${wordType}`).innerText =
      'You completed all exercise words! 🎉'
  }
}

function isItInFavorites(currentWord, favoriteWords) {
  return favoriteWords.some((word) => word.almanca === currentWord.almanca)
}

function updateFavoriteIcons(wordType) {
  const inFavImage = document.getElementById(`infav-${wordType}`)
  const outFavImage = document.getElementById(`outfav-${wordType}`)

  const currentWord = kelimeListesi[currentLearnIndex]
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

const resetLearnButtons = (wordType) => {

  const iKnowButton = document.getElementById(`iKnowButtonLearn-${wordType}`)
  const repeatButton = document.getElementById(`repeatButtonLearn-${wordType}`)

  if (iKnowButton && repeatButton) {
    // **Butonları tekrar görünür hale getir**
    iKnowButton.style.visibility = 'visible'
    repeatButton.style.visibility = 'visible'

    // **Önce eski event listener'ları kaldır**
    const newIKnowButton = iKnowButton.cloneNode(true)
    const newRepeatButton = repeatButton.cloneNode(true)

    iKnowButton.parentNode.replaceChild(newIKnowButton, iKnowButton)
    repeatButton.parentNode.replaceChild(newRepeatButton, repeatButton)

    // **Yeni event listener'ları ekleyelim**
    newIKnowButton.addEventListener('click', iKnowButtonClickHandler)
    newRepeatButton.addEventListener('click', repeatButtonClickHandler)
  }
}


function resetExerciseButtons(wordType) {
  if (wordType === 'noun') {
    var buttonDer = document.getElementById('buttonDer')
    var buttonDie = document.getElementById('buttonDie')
    var buttonDas = document.getElementById('buttonDas')

    if (buttonDer && buttonDie && buttonDas) {
      // **Butonları tekrar görünür hale getir**
      buttonDer.style.visibility = 'visible'
      buttonDie.style.visibility = 'visible'
      buttonDas.style.visibility = 'visible'

      // **Önce eski event listener'ları kaldır**
      var newButtonDer = buttonDer.cloneNode(true)
      var newButtonDie = buttonDie.cloneNode(true)
      var newButtonDas = buttonDas.cloneNode(true)

      buttonDer.parentNode.replaceChild(newButtonDer, buttonDer)
      buttonDie.parentNode.replaceChild(newButtonDie, buttonDie)
      buttonDas.parentNode.replaceChild(newButtonDas, buttonDas)

      // **Yeni event listener'ları ekleyelim**
      newButtonDer.addEventListener('click', nounDerAnswerClickHandler)

      newButtonDie.addEventListener('click', nounDieAnswerClickHandler)

      newButtonDas.addEventListener('click', nounDasAnswerClickHandler)

      console.log('🔥 Der, Die, Das butonları tekrar aktif hale getirildi.')
    }
  } else if (
    wordType === 'verb' ||
    wordType === 'adjective' ||
    wordType === 'adverb'
  ) {
    var buttonWrong = document.getElementById(`wrongButton-${wordType}`)
    var buttonCorrect = document.getElementById(`correctButton-${wordType}`)

    if (buttonWrong && buttonCorrect) {
      // **Butonları tekrar görünür hale getir**
      buttonWrong.style.visibility = 'visible'
      buttonCorrect.style.visibility = 'visible'

      // **Önce eski event listener'ları kaldır**
      var newButtonWrong = buttonWrong.cloneNode(true)
      var newButtonCorrect = buttonCorrect.cloneNode(true)

      buttonWrong.parentNode.replaceChild(newButtonWrong, buttonWrong)
      buttonCorrect.parentNode.replaceChild(newButtonCorrect, buttonCorrect)

      // **Yeni event listener'ları ekleyelim**
      newButtonWrong.addEventListener('click', nonNounWrongAnswerClickHandler)
      newButtonCorrect.addEventListener('click', nonNounCorrectAnswerClickHandler)
    }
  }
}

function showModal(message, wordType) {
  var modal = document.getElementById(`customModal-${wordType}`)
  var modalMessage = document.getElementById(`modalMessage-${wordType}`)
  var closeButton = document.querySelector('.close-button')

  modalMessage.innerText = message // **Mesajı değiştir**
  modal.style.display = 'block' // **Modali aç**

  closeButton.addEventListener('click', function () {
    modal.style.display = 'none' // **Kapatma butonuna tıklanınca gizle**
    // resetLearnButtons(wordType) // **🔥 Butonları tekrar aktif et**
  })

  setTimeout(() => {
    modal.style.display = 'none' // **3 saniye sonra otomatik kapanır**
    // resetLearnButtons(wordType) // **🔥 Butonları tekrar aktif et**
  }, 3000)
}

function showModalExercise(message, wordType) {
  var modal = document.getElementById(`customModalExercise-${wordType}`)
  var modalMessage = document.getElementById(
    `modalMessageExercise-${wordType}`
  )
  var closeButton = document.querySelector('.close-button')

  modalMessage.innerText = message // **Mesajı değiştir**
  modal.style.display = 'block' // **Modali aç**

  closeButton.addEventListener('click', function () {
    modal.style.display = 'none' // **Kapatma butonuna tıklanınca gizle**
    // resetExerciseButtons(wordType) // **🔥 Butonları tekrar aktif et**
  })

  setTimeout(() => {
    modal.style.display = 'none' // **3 saniye sonra otomatik kapanır**
    // resetExerciseButtons(wordType) // **🔥 Butonları tekrar aktif et**
  }, 3000)
}

function playSound(audioUrl) {
  const audio = new Audio(audioUrl)
  audio.play()
}

function isRegularLevel(level) {
  return !(level === '' || level === "einburgerungstest")
}

function isSelected(prop) {
  return !(prop === '' || prop === null)
}

function checkCurrentIndexes() {
  if (currentExerciseIndex < 0 || currentLearnIndex < 0) {
    if (currentExerciseIndex < 0) {
      currentExerciseIndex = 0
    }
    if (currentLearnIndex < 0) {
      currentLearnIndex = 0
    }
  }
  return
}

function showOrHideDecks(level) {
  if (isRegularLevel(level)) {
    document.getElementById('decksContainer').style.display = 'flex'
    return
  }
  document.getElementById('decksContainer').style.display = 'none'
  return
}

function showOrHideMainContent(level, category) {
  if (level === 'einburgerungstest') {
    document.getElementById('contentContainer').style.display = 'block'
    document.getElementById('warnImage').style.display = 'none'
    return
  }
  if (isRegularLevel(level) && isSelected(category)) {
    document.getElementById('contentContainer').style.display = 'block'
    document.getElementById('warnImage').style.display = 'none'
    return
  }
}

function gtag_report_conversion(url) {
  var callback = function () {
    if (typeof url !== 'undefined') {
      window.location = url
    }
  }

  gtag('event', 'conversion', {
    send_to: 'AW-16867938378/ChUxCNiDnZ8aEMqgoes-',
    event_callback: callback,
  })

  return false // Sayfanın hemen yönlendirilmesini engeller, gtag'ın çalışmasını bekler.
}

$('a').click(function () {
  $('nav').removeClass('w--open')
})
$('a').click(function () {
  $('div').removeClass('w--open')
})
