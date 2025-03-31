import { JSON_URLS } from '../constants/urls.js'
import LocalStorageManager from '../utils/LocalStorageManager.js'

import va1a2 from '../../json/a1-a2/verb.json' with { type: 'json' }
import adja1a2 from '../../json/a1-a2/adjective.json' with { type: 'json' }
import adva1a2 from '../../json/a1-a2/adverb.json' with { type: 'json' }

import va2b1 from '../../json/a2-b1/verb.json' with { type: 'json' }
import adja2b1 from '../../json/a2-b1/adjective.json' with { type: 'json' }
import adva2b1 from '../../json/a2-b1/adverb.json' with { type: 'json' }

import vb1b2 from '../../json/b1-b2/verb.json' with { type: 'json' }
import adjb1b2 from '../../json/b1-b2/adjective.json' with { type: 'json' }
import advb1b2 from '../../json/b1-b2/adverb.json' with { type: 'json' }

import vc1c2 from '../../json/c1-c2/verb.json' with { type: 'json' }
import adjc1c2 from '../../json/c1-c2/adjective.json' with { type: 'json' }
import advc1c2 from '../../json/c1-c2/adverb.json' with { type: 'json' }

import vEinburger from '../../json/einburgerungstest/verb.json' with { type: 'json' }
import adjEinburger from '../../json/einburgerungstest/adjective.json' with { type: 'json' }
import advEinburger from '../../json/einburgerungstest/adverb.json' with { type: 'json' }

let staticWordLists = {
  b1telcpt1: {
    verb: va1a2,
    adjective: adja1a2,
    adverb: adva1a2
  },
  b1telcpt2: {
    verb: va2b1,
    adjective: adja2b1,
    adverb: adva2b1
  },
  b1telcpt3: {
    verb: vb1b2,
    adjective: adjb1b2,
    adverb: advb1b2
  },
  b1telcpt4: {
    verb: vc1c2,
    adjective: adjc1c2,
    adverb: advc1c2
  },
  b1telcpt4: {
    verb: vc1c2,
    adjective: adjc1c2,
    adverb: advc1c2
  },
  einburgerungstest: {
    verb: vEinburger,
    adjective: adjEinburger,
    adverb: advEinburger
  }
}

let learnedWithLearnWords = {
  b1telcpt1: {
    noun: [],
    verb: [],
    adjective: [],
    adverb: [],
  },
  b1telcpt2: {
    noun: [],
    verb: [],
    adjective: [],
    adverb: [],
  },
  b1telcpt3: {
    noun: [],
    verb: [],
    adjective: [],
    adverb: [],
  },
  b1telcpt4: {
    noun: [],
    verb: [],
    adjective: [],
    adverb: [],
  },
  einburgerungstest: {
    noun: [],
    verb: [],
    adjective: [],
    adverb: [],
  },
}

export let learnedWithExerciseWords = {
  b1telcpt1: { noun: [], verb: [], adjective: [], adverb: [] },
  b1telcpt2: { noun: [], verb: [], adjective: [], adverb: [] },
  b1telcpt3: { noun: [], verb: [], adjective: [], adverb: [] },
  b1telcpt4: { noun: [], verb: [], adjective: [], adverb: [] },
  einburgerungstest: { noun: [], verb: [], adjective: [], adverb: [] },
}

let inProgressWords = {
  b1telcpt1: { noun: [], verb: [], adjective: [], adverb: [] },
  b1telcpt2: { noun: [], verb: [], adjective: [], adverb: [] },
  b1telcpt3: { noun: [], verb: [], adjective: [], adverb: [] },
  b1telcpt4: { noun: [], verb: [], adjective: [], adverb: [] },
  einburgerungstest: { noun: [], verb: [], adjective: [], adverb: [] },
}

// Global variables
let currentLevel = 'b1telcpt1'
export const levels = ['b1telcpt1', 'b1telcpt2', 'b1telcpt3', 'b1telcpt4', 'einburgerungstest']

let currentType = 'noun'
export const types = ['noun', 'verb', 'adjective', 'adverb']

let kelimeListesi = []
let kelimeListesiExercise = []
let currentLearnIndex = 0
let currentExerciseIndex = 0
let totalWordsLearn = 0
let totalWordsExercise = 0

const learnedWords = LocalStorageManager.load('learnedWords', {
  b1telcpt1: { noun: 0, verb: 0, adjective: 0, adverb: 0 },
  b1telcpt2: { noun: 0, verb: 0, adjective: 0, adverb: 0 },
  b1telcpt3: { noun: 0, verb: 0, adjective: 0, adverb: 0 },
  b1telcpt4: { noun: 0, verb: 0, adjective: 0, adverb: 0 },
  einburgerungstest: { noun: 0, verb: 0, adjective: 0, adverb: 0 },
})

const correctAnswerWordsCounter = LocalStorageManager.load('correctAnswerWordsCounter', {
  b1telcpt1: { noun: 0, verb: 0, adjective: 0, adverb: 0 },
  b1telcpt2: { noun: 0, verb: 0, adjective: 0, adverb: 0 },
  b1telcpt3: { noun: 0, verb: 0, adjective: 0, adverb: 0 },
  b1telcpt4: { noun: 0, verb: 0, adjective: 0, adverb: 0 },
  einburgerungstest: { noun: 0, verb: 0, adjective: 0, adverb: 0 },
})

let initialTotalWords = 0 // Yeni eklenen değişken

async function executeInitialLoadAndShow() {
  const lastSelectedTopic = LocalStorageManager.load('lastSelectedTopic', 'b1telcpt1')
  await loadWords(lastSelectedTopic)
  console.log(currentType + 's ARE LOADED')
  showLearnWord()
  showExerciseWord()
}

Webflow.push(function () {
  console.log('Webflow tamamen yüklendi.')
  const nounTab = document.getElementById('nounTab')
  const verbTab = document.getElementById('verbTab')
  const adjectiveTab = document.getElementById('adjectiveTab')
  const adverbTab = document.getElementById('adverbTab')

  nounTab.addEventListener('click', function () {
    console.log('Noun seçildi.')
    updateType(types[0])
    console.log(currentType)

    executeInitialLoadAndShow()
  })

  verbTab.addEventListener('click', function () {
    console.log('Verb seçildi.')
    updateType(types[1])
    console.log(currentType)

    executeInitialLoadAndShow()
  })

  adjectiveTab.addEventListener('click', function () {
    console.log('Adjective seçildi.')
    updateType(types[2])
    console.log(currentType)

    executeInitialLoadAndShow()
  })

  adverbTab.addEventListener('click', function () {
    console.log('Adverb seçildi.')
    updateType(types[3])
    console.log(currentType)

    executeInitialLoadAndShow()
  })
})

function updateType(type) {
  currentType = type
}

function updateLevel(level) {
  currentLevel = level
}

// Utility function to shuffle arrays
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

// UI visibility functions
function showSkeleton() {
  const skeletonState = document.getElementById('skeletonState')
  const favoritesContainer = document.getElementById('favoritesContainer')

  if (skeletonState) {
    skeletonState.style.display = 'flex'
  }
  if (favoritesContainer) {
    favoritesContainer.style.display = 'none'
  }

  hideLearnElements()
}

function hideSkeleton() {
  const skeletonState = document.getElementById('skeletonState')
  const favoritesContainer = document.getElementById('favoritesContainer')

  if (skeletonState) {
    skeletonState.style.display = 'none'
  }
  if (favoritesContainer) {
    favoritesContainer.style.display = 'block'
  }

  showLearnElements()
}

const learnElementIds = [
  `addToFavoritesLearn-${currentType}`,
  `wordLearn-${currentType}`,
  `translationLearn-${currentType}`,
  `ruleLearn-${currentType}`,
  `sentenceHead-${currentType}`,
  `exampleLearn-${currentType}`,
]

// Learn elements visibility
function hideLearnElements() {
  const elementIds = [...learnElementIds]

  elementIds.forEach((id) => {
    const element = document.getElementById(id)
    if (element) {
      element.style.display = 'none'
    }
  })
}

function showLearnElements() {
  const elementIds = [...learnElementIds]

  elementIds.forEach((id) => {
    const element = document.getElementById(id)
    if (element) {
      const isAdjectiveOrAdverb =
        currentType === 'adjective' || currentType === 'adverb'
      const isElementRuleLearn = id === `ruleLearn-${currentType}`

      element.style.display =
        isAdjectiveOrAdverb && isElementRuleLearn ? 'none' : 'block'
    }
  })
}

// Dropdown seçeneklerini dinle
document.querySelectorAll('.level-dropdown-link').forEach((link) => {
  link.addEventListener('click', async function (event) {
    event.preventDefault()
    const selectedOption = link.getAttribute('data-option')
    const selectedText = link.innerText

    // Seçilen option'ı localStorage'a kaydet
    LocalStorageManager.save('lastSelectedTopic', selectedOption)
    updateLevel(selectedOption)

    if (selectedOption) {
      // Dropdown başlığını güncelle
      document.getElementById('dropdownHeader').innerText = selectedText

      // // Sayaçları sıfırla
      // Object.entries(learnedWords).forEach(([key, _]) => {
      //   learnedWords[key] = 0
      // })
      // LocalStorageManager.save('learnedWords', learnedWords)

      // Object.entries(correctAnswerWordsCounter).forEach(([key, _]) => {
      //   correctAnswerWordsCounter[key] = 0
      // })
      // LocalStorageManager.save(
      //   'correctAnswerWordsCounter',
      //   correctAnswerWordsCounter
      // )

      // UI'ı güncelle
      document.getElementById(
        'remainingWordsCountLearn-' + currentType
      ).innerText = learnedWords[currentLevel][currentType]
      document.getElementById(
        'remainingWordsCountExercise-' + currentType
      ).innerText = correctAnswerWordsCounter[currentLevel][currentType]

      // Seçilen konu başlığını güncelle
      updateTopicNames(selectedOption)

      // İndeksleri sıfırla
      currentLearnIndex = learnedWords[currentLevel][currentType]
      currentExerciseIndex = correctAnswerWordsCounter[currentLevel][currentType]

      try {
        await loadWords(selectedOption)
        console.log('JSON başarıyla yüklendi.')
        showLearnWord()
        showExerciseWord()
      } catch (error) {
        console.error('Kelime yükleme hatası:', error)
      }
    }
  })
})

// Kelime yükleme fonksiyonu
async function loadWords(topic) {
  try {
    showSkeleton()

    // Feedback mesajını temizle
    const feedbackMessage = document.getElementById(
      'feedbackMessage-' + currentType
    )
    if (feedbackMessage) {
      feedbackMessage.innerText = ''
    }

    const response = await fetch(JSON_URLS[currentType][topic])

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    kelimeListesi = [...data]
    kelimeListesiExercise = [...data]
    initialTotalWords = data.length
    totalWordsExercise = initialTotalWords
    totalWordsLearn = initialTotalWords

    shuffleArray(kelimeListesi)
    shuffleArray(kelimeListesiExercise)

    // LocalStorage'daki progress listelerini temizle
    LocalStorageManager.save('inProgressWords', inProgressWords)
    //localStorage.setItem("learnedWithExerciseWords", JSON.stringify([]));

    document.getElementById(
      'remainingWordsCountLearn-' + currentType
    ).innerText = learnedWords[currentLevel][currentType]
    document.getElementById(
      'remainingWordsCountExercise-' + currentType
    ).innerText = correctAnswerWordsCounter[currentLevel][currentType]
    document.getElementById('totalWordsCountLearn-' + currentType).innerText =
      totalWordsLearn
    document.getElementById(
      'totalWordsCountExercise-' + currentType
    ).innerText = totalWordsExercise

    hideSkeleton()
  } catch (error) {
    console.error('Error fetching JSON:', error)
    hideSkeleton()
    throw error
  }
}

// Konu başlıklarını güncelleme fonksiyonu
function updateTopicNames(selectedOption) {
  const topicNames = {
    b1telcpt1: 'Level: A1 - A2',
    b1telcpt2: 'Level: A2 - B1',
    b1telcpt3: 'Level: B1 - B2',
    b1telcpt4: 'Level: C1 - C2',
    einburgerungstest: 'Einbürgerungstest',
  }

  const topicName = topicNames[selectedOption] || 'Level: A1 - A2'
  if (document.getElementById(`selectedTopicName-${currentType}`)) {
    document.getElementById(`selectedTopicName-${currentType}`).innerText =
      topicName
  }
  if (document.getElementById(`selectedTopicNameExercise-${currentType}`)) {
    document.getElementById(
      `selectedTopicNameExercise-${currentType}`
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

function showLearnWord() {
  if (!kelimeListesi || kelimeListesi.length === 0) {
    document.getElementById('wordLearn-' + currentType).innerText =
      'No words to display.'
    document.getElementById('translationLearn-' + currentType).innerText = ''
    document.getElementById('exampleLearn-' + currentType).innerText = ''
    document.getElementById(`levelTagLearn-${currentType}`).innerText = ''
    document.getElementById('ruleLearn-' + currentType).innerText = '' // Kural boş

    const iKnowButton = document.getElementById(
      `iKnowButtonLearn-${currentType}`
    )
    const repeatButton = document.getElementById(
      `repeatButtonLearn-${currentType}`
    )

    if (iKnowButton) {
      iKnowButton.style.visibility = 'hidden'
    }
    if (repeatButton) {
      repeatButton.style.visibility = 'hidden'
    }
    return
  }

  const { almanca, ingilizce, ornek, highlight, seviye, kural } =
    kelimeListesi[currentLearnIndex]

  if (learnedWithLearnWords[currentLevel][currentType].length > 0) {
    kelimeListesi = kelimeListesi.filter(
      (word) =>
        !learnedWithLearnWords[currentLevel][currentType].some(
          (learned) => learned.almanca === word.almanca
        )
    )
  }

  switch (currentType) {
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
        'wordLearn-' + currentType
      ).innerHTML = `<span style="color: ${renk};">${highlightedWord}</span>`
      break
    case 'verb':
      document.getElementById('wordLearn-' + currentType).innerHTML = almanca
      break
    case 'adjective':
      document.getElementById('wordLearn-' + currentType).innerHTML = almanca
      break
    case 'adverb':
      document.getElementById('wordLearn-' + currentType).innerHTML = almanca
      break
  }

  document.getElementById(`levelTagLearn-${currentType}`).innerText =
    seviye || 'N/A'
  document.getElementById('translationLearn-' + currentType).innerText =
    ingilizce || 'N/A'
  document.getElementById('exampleLearn-' + currentType).innerText =
    ornek || 'N/A'

  const ruleLearnElement = document.getElementById('ruleLearn-' + currentType)
  const isAdjectiveOrAdverb =
    currentType === 'adjective' || currentType === 'adverb'

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
  updateFavoriteIcons()
}

function getRandomNumber(max) {
  // Ensure max is a non-negative number
  if (typeof max !== 'number' || max < 0) {
    throw new Error("The 'max' parameter must be a non-negative number.")
  }
  // Returns a random integer between 0 and max (inclusive)
  return Math.floor(Math.random() * (max + 1))
}

function shouldUseOwnMeaning() {
  // Math.random() returns a number between 0 (inclusive) and 1 (exclusive).
  // If the number is less than 0.6, that's a 60% chance.
  const useOwnMeaning = Math.random() < 0.6
  console.log(
    'decided as: ' + (useOwnMeaning ? 'own meaning' : 'different meaning')
  )
  return useOwnMeaning
}

function getRandomTranslationResult(selectedWord) {
  const kelimeListesiInstance = staticWordLists[currentLevel][currentType]
  const filteredKelimeListesiExercise = kelimeListesiInstance.filter(
    (kelimeExercise) => kelimeExercise.almanca !== selectedWord.almanca
  )

  console.log('kelime listesi exercise Instance:')
  console.log(kelimeListesiInstance)
  console.log('filtered kelime listesi exercise:')
  console.log(filteredKelimeListesiExercise)

  const randomIndex = getRandomNumber(filteredKelimeListesiExercise.length - 1)

  console.log(filteredKelimeListesiExercise[randomIndex])

  const randomResult = filteredKelimeListesiExercise[randomIndex].ingilizce

  return randomResult
}

function showExerciseWord() {
  if (!kelimeListesiExercise.length) {
    // Liste boşsa UI'ı temizle
    document.getElementById(`levelTagExercise-${currentType}`).innerText = ''
    document.getElementById('exerciseWord-' + currentType).innerText = ''
    document.getElementById('exerciseTranslation-' + currentType).innerText = ''
    return
  }

  // Index kontrolü
  if (currentExerciseIndex >= kelimeListesiExercise.length) {
    currentExerciseIndex = 0
  }

  inProgressWords =
    LocalStorageManager.load('inProgressWords', inProgressWords)

  learnedWithExerciseWords =
    LocalStorageManager.load('learnedWithExerciseWords', learnedWithExerciseWords)
    

  // 🟢 `kelimeListesi` içinden `learnedWords`'de olanları çıkar
  if (learnedWithExerciseWords[currentLevel][currentType].length > 0) {
    kelimeListesiExercise = kelimeListesiExercise.filter(
      (word) =>
        !learnedWithExerciseWords[currentLevel][currentType].some(
          (learned) => learned.almanca === word.almanca
        )
    )
  }

  if (kelimeListesiExercise.length === 0) {
    document.getElementById(`levelTagExercise-${currentType}`).innerText = ''
    console.log('Kelime listesi boş. Gösterilecek kelime yok.')
    return
  }

  if (
    correctAnswerWordsCounter[currentLevel][currentType] ===
    kelimeListesiExercise.length
  ) {
    document.getElementById(
      'remainingWordsCountExercise-' + currentType
    ).innerText = correctAnswerWordsCounter[currentLevel][currentType]
    showModal('You completed all exercise words! 🎉')
    document.getElementById('exampleLearn-' + currentType).innerText =
      'You learned all of the words, go to exercise section.'

    if (currentType === 'noun') {
      buttonDer.style.visibility = 'hidden'
      buttonDie.style.visibility = 'hidden'
      buttonDas.style.visibility = 'hidden'
    } else {
      document.getElementById('wrongButton-' + currentType).style.visibility =
        'hidden'
      document.getElementById('correctButton-' + currentType).style.visibility =
        'hidden'
    }

    document.getElementById(
      'feedbackMessage-' + currentType
    ).innerText = `You completed all exercise words! 🎉`
  }

  const currentWord = kelimeListesiExercise[currentExerciseIndex]
  const progressWord = inProgressWords[currentLevel][currentType].find(
    (item) => item.almanca === currentWord.almanca
  )

  const { kelime, ingilizce, seviye } =
    kelimeListesiExercise[currentExerciseIndex]
  // const renk = artikelRenk(artikel)

  // Kelimenin Almanca kısmını göster
  document.getElementById('exerciseWord-' + currentType).innerText = kelime
  document.getElementById(`levelTagExercise-${currentType}`).innerText =
    seviye || 'N/A'

  // İngilizce çeviriyi göster (ID üzerinden erişim)
  const exerciseTranslationElement = document.getElementById(
    'exerciseTranslation-' + currentType
  )
  if (exerciseTranslationElement) {
    let exerciseTranslationText = ''

    if (currentType === 'noun') {
      exerciseTranslationText = ingilizce
    } else if (
      currentType === 'verb' ||
      currentType === 'adjective' ||
      currentType === 'adverb'
    ) {
      if (shouldUseOwnMeaning()) {
        exerciseTranslationText = ingilizce
      } else {
        exerciseTranslationText = getRandomTranslationResult(currentWord)
        // todo: transfer data for checking the answer later
        const buttonWrong = document.getElementById(
          'wrongButton-' + currentType
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
    document.getElementById('progressLeft-' + currentType).style.opacity =
      counter >= 1 ? '1' : '0.5'
    document.getElementById('progressMiddle-' + currentType).style.opacity =
      counter >= 2 ? '1' : '0.5'
    document.getElementById('progressRight-' + currentType).style.opacity =
      counter >= 3 ? '1' : '0.5'
  } else {
    // Default state
    document.getElementById('progressLeft-' + currentType).style.opacity = '0.5'
    document.getElementById('progressMiddle-' + currentType).style.opacity =
      '0.5'
    document.getElementById('progressRight-' + currentType).style.opacity =
      '0.5'
  }

  // Default olarak boş bırakılan artikel alanı
  if (currentType === 'noun') {
    document.getElementById('correctAnswerField').innerHTML = '___'
  }

  document.getElementById('feedbackMessage-' + currentType).innerText = ''
}

function checkNonNounAnswer(userInput) {
  // Eğer liste boşsa veya index liste dışındaysa, işlemi durdur
  if (
    !kelimeListesiExercise.length ||
    currentExerciseIndex >= kelimeListesiExercise.length
  ) {
    currentExerciseIndex = 0
    return
  }

  const currentWord = kelimeListesiExercise[currentExerciseIndex]
  const { almanca, ingilizce, kural } = currentWord
  const buttonWrong = document.getElementById('wrongButton-' + currentType)
  const buttonCorrect = document.getElementById('correctButton-' + currentType)

  inProgressWords = LocalStorageManager.load('inProgressWords', inProgressWords)
  learnedWithExerciseWords =
    LocalStorageManager.load('learnedWithExerciseWords', learnedWithExerciseWords)
    

  const inProgressIndex = inProgressWords[currentLevel][currentType].findIndex(
    (item) => item.almanca === almanca
  )

  buttonWrong.style.visibility = 'hidden'
  buttonCorrect.style.visibility = 'hidden'

  const isAnswerCorrect = !buttonWrong.hasAttribute('wrong-but')

  if (userInput === isAnswerCorrect) {
    document.getElementById('feedbackMessage-' + currentType).innerText =
      'Correct! 🎉'
    document.getElementById('feedbackMessage-' + currentType).style.color =
      'green'

    //InProgress listesine kelimeyi ekle - Eger hic dogru bilinmemisse yeni ekle daha önce bilinmisse progress i arttir
    if (inProgressIndex === -1) {
      playSound(
        'https://github.com/heroofdarkroom/proje/raw/refs/heads/master/correct.mp3'
      )
      inProgressWords[currentLevel][currentType].push({
        type: currentWord.type,
        almanca: currentWord.almanca,
        counter: 1,
      })
      document.getElementById('progressLeft-' + currentType).style.opacity = '1'

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
      inProgressWords[currentLevel][currentType][inProgressIndex].counter += 1
      if (
        inProgressWords[currentLevel][currentType][inProgressIndex].counter ===
        2
      ) {
        document.getElementById('progressMiddle-' + currentType).style.opacity =
          '1'
      }
      //3 kere bilindiyse learnede ekle
      if (
        inProgressWords[currentLevel][currentType][inProgressIndex].counter >= 3
      ) {
        playSound(
          'https://github.com/heroofdarkroom/proje/raw/refs/heads/master/streak.mp3'
        )

        learnedWithExerciseWords[currentLevel][currentType].push({
          type: currentWord.type,
          almanca: currentWord.almanca,
          ingilizce: currentWord.ingilizce,
          seviye: currentWord.seviye || 'N/A',
        })

        if (
          inProgressWords[currentLevel][currentType][inProgressIndex]
            .counter === 3
        ) {
          document.getElementById(
            'feedbackMessage-' + currentType
          ).innerText = `This word: ${currentWord.almanca} added to learned list!🏆`
          document.getElementById(
            'feedbackMessage-' + currentType
          ).style.color = 'green'
          document.getElementById(
            'progressRight-' + currentType
          ).style.opacity = '1'
        }
        updateExerciseCounter()
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
          `'${currentWord.almanca}' learnedWithExerciseWords listesine taşındı.`
        )
      } else {
        playSound(
          'https://github.com/heroofdarkroom/proje/raw/refs/heads/master/correct.mp3'
        )
        kelimeListesiExercise.splice(currentExerciseIndex, 1)
        if (
          inProgressWords[currentLevel][currentType][inProgressIndex]
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
      // document.getElementById('correctAnswerField').innerHTML = '___' // Tekrar boş bırak
      buttonWrong.style.visibility = 'visible'
      buttonCorrect.style.visibility = 'visible'
      showExerciseWord()
    }, 1000)
    LocalStorageManager.save(
      'learnedWithExerciseWords',
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

      inProgressWords[currentLevel][currentType][inProgressIndex].counter = 0
      document.getElementById('progressRight-' + currentType).style.opacity =
        '0.5'
      document.getElementById('progressMiddle-' + currentType).style.opacity =
        '0.5'
      document.getElementById('progressLeft-' + currentType).style.opacity =
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
      'feedbackMessage-' + currentType
    ).innerText = `Upps! Try again. 💪`
    document.getElementById('feedbackMessage-' + currentType).style.color =
      'red'
    setTimeout(() => {
      // document.getElementById('correctAnswerField').innerHTML = '___' // Tekrar boş bırak
      buttonWrong.style.visibility = 'visible'
      buttonCorrect.style.visibility = 'visible'
      showExerciseWord()
    }, 3000)
  }

  buttonWrong.removeAttribute('wrong-but')
  LocalStorageManager.save('inProgressWords', inProgressWords)
}

function checkNounAnswer(userArtikel) {
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
  var buttonDer = document.getElementById('buttonDer')
  var buttonDie = document.getElementById('buttonDie')
  var buttonDas = document.getElementById('buttonDas')

  console.log(`'${currentExerciseIndex}' index böyleydi.`)
  console.log(
    `'${kelimeListesiExercise.length}' kelime listesi uzunlugu böyleydi.`
  )
  inProgressWords = LocalStorageManager.load('inProgressWords', inProgressWords)
  learnedWithExerciseWords =
    LocalStorageManager.load('learnedWithExerciseWords', learnedWithExerciseWords)
    

  const inProgressIndex = inProgressWords[currentLevel][currentType].findIndex(
    (item) => item.almanca === currentWord.almanca
  )

  buttonDer.style.visibility = 'hidden'
  buttonDie.style.visibility = 'hidden'
  buttonDas.style.visibility = 'hidden'
  console.log('Butonlar geçici olarak devre dışı bırakıldı.')

  if (userArtikel.toLowerCase() === artikel.toLowerCase()) {
    document.getElementById('feedbackMessage-' + currentType).innerText =
      'Correct! 🎉'
    document.getElementById('feedbackMessage-' + currentType).style.color =
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
      inProgressWords[currentLevel][currentType].push({
        type: currentWord.type,
        almanca: currentWord.almanca,
        counter: 1,
      })
      document.getElementById('progressLeft-' + currentType).style.opacity = '1'

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
      inProgressWords[currentLevel][currentType][inProgressIndex].counter += 1
      if (
        inProgressWords[currentLevel][currentType][inProgressIndex].counter ===
        2
      ) {
        document.getElementById('progressMiddle-' + currentType).style.opacity =
          '1'
      }
      //3 kere bilindiyse learnede ekle
      if (
        inProgressWords[currentLevel][currentType][inProgressIndex].counter >= 3
      ) {
        playSound(
          'https://github.com/heroofdarkroom/proje/raw/refs/heads/master/streak.mp3'
        )

        learnedWithExerciseWords[currentLevel][currentType].push({
          type: currentWord.type,
          almanca: currentWord.almanca,
          ingilizce: currentWord.ingilizce,
          seviye: currentWord.seviye || 'N/A',
        })

        if (
          inProgressWords[currentLevel][currentType][inProgressIndex]
            .counter === 3
        ) {
          document.getElementById(
            'feedbackMessage-' + currentType
          ).innerText = `This word: ${currentWord.almanca} added to learned list!🏆`
          document.getElementById(
            'feedbackMessage-' + currentType
          ).style.color = 'green'
          document.getElementById(
            'progressRight-' + currentType
          ).style.opacity = '1'
        }
        updateExerciseCounter()
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
          `'${currentWord.almanca}' learnedWithExerciseWords listesine taşındı.`
        )
      } else {
        playSound(
          'https://github.com/heroofdarkroom/proje/raw/refs/heads/master/correct.mp3'
        )
        kelimeListesiExercise.splice(currentExerciseIndex, 1)
        if (
          inProgressWords[currentLevel][currentType][inProgressIndex]
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
      buttonDer.style.visibility = 'visible'
      buttonDie.style.visibility = 'visible'
      buttonDas.style.visibility = 'visible'
      showExerciseWord()
    }, 1000)
    LocalStorageManager.save(
      'learnedWithExerciseWords',
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

      inProgressWords[currentLevel][currentType][inProgressIndex].counter = 0
      document.getElementById('progressRight-' + currentType).style.opacity =
        '0.5'
      document.getElementById('progressMiddle-' + currentType).style.opacity =
        '0.5'
      document.getElementById('progressLeft-' + currentType).style.opacity =
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
      'feedbackMessage-' + currentType
    ).innerText = `Upps! ⚠️ ${kural}`
    document.getElementById('feedbackMessage-' + currentType).style.color =
      'red'
    setTimeout(() => {
      document.getElementById('correctAnswerField').innerHTML = '___' // Tekrar boş bırak
      buttonDer.style.visibility = 'visible'
      buttonDie.style.visibility = 'visible'
      buttonDas.style.visibility = 'visible'
      showExerciseWord()
    }, 3000)
  }
  console.log(`'${currentExerciseIndex}' index bu sayiya güncellendi.`)
  console.log(
    `'${kelimeListesiExercise.length}' liste uzunlugu bu sayiya güncellendi.`
  )
  LocalStorageManager.save('inProgressWords', inProgressWords)
}

document
  .getElementById('buttonDer')
  .addEventListener('click', function (event) {
    event.preventDefault() // Sayfanın yukarı kaymasını engeller
    checkNounAnswer('der')
  })

document
  .getElementById('buttonDie')
  .addEventListener('click', function (event) {
    event.preventDefault()
    checkNounAnswer('die')
  })

document
  .getElementById('buttonDas')
  .addEventListener('click', function (event) {
    event.preventDefault()
    checkNounAnswer('das')
  })

document
  .getElementById('wrongButton-verb')
  .addEventListener('click', function (event) {
    event.preventDefault() // Sayfanın yukarı kaymasını engeller
    checkNonNounAnswer(false)
  })

document
  .getElementById('correctButton-verb')
  .addEventListener('click', function (event) {
    event.preventDefault()
    checkNonNounAnswer(true)
  })

document
  .getElementById('wrongButton-adjective')
  .addEventListener('click', function (event) {
    event.preventDefault() // Sayfanın yukarı kaymasını engeller
    checkNonNounAnswer(false)
  })

document
  .getElementById('correctButton-adjective')
  .addEventListener('click', function (event) {
    event.preventDefault()
    checkNonNounAnswer(true)
  })

document
  .getElementById('wrongButton-adverb')
  .addEventListener('click', function (event) {
    event.preventDefault() // Sayfanın yukarı kaymasını engeller
    checkNonNounAnswer(false)
  })

document
  .getElementById('correctButton-adverb')
  .addEventListener('click', function (event) {
    event.preventDefault()
    checkNonNounAnswer(true)
  })

// Learn functionality buttons
function repeatLearn() {
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
  showLearnWord()
}

function iKnowLearn() {
  if (
    !kelimeListesi.length ||
    currentLearnIndex >= kelimeListesi.length ||
    learnedWords[currentLevel][currentType] >= initialTotalWords
  ) {
    const iKnowButton = document.getElementById(
      `iKnowButtonLearn-${currentType}`
    )
    const repeatButton = document.getElementById(
      `repeatButtonLearn-${currentType}`
    )
    if (iKnowButton) {
      iKnowButton.style.visibility = 'hidden'
    }
    if (repeatButton) {
      repeatButton.style.visibility = 'hidden'
    }
    return
  }

  learnedWithLearnWords =
    LocalStorageManager.load('learnedWithLearnWords', learnedWithLearnWords)
  const currentWord = kelimeListesi[currentLearnIndex]

  // Kelimeyi öğrenilenlere ekle
  learnedWithLearnWords[currentLevel][currentType].push({
    almanca: currentWord.almanca,
    ingilizce: currentWord.ingilizce,
    seviye: currentWord.seviye || 'N/A',
  })

  if (learnedWords[currentLevel][currentType] < initialTotalWords) {
    learnedWords[currentLevel][currentType]++
    LocalStorageManager.save('learnedWords', learnedWords)

    learnedWithLearnWords[currentLevel][currentType].push({
      almanca: currentWord.almanca,
      ingilizce: currentWord.ingilizce,
      seviye: currentWord.seviye || 'N/A',
    })
    LocalStorageManager.save('learnedWithLearnWords', learnedWithLearnWords)

    kelimeListesi.splice(currentLearnIndex, 1)

    document.getElementById(
      'remainingWordsCountLearn-' + currentType
    ).innerText = learnedWords[currentLevel][currentType]
    document.getElementById('totalWordsCountLearn-' + currentType).innerText =
      initialTotalWords

    if (learnedWords[currentLevel][currentType] >= initialTotalWords) {
      showModal('You learned all words! 🎉')
      const iKnowButton = document.getElementById(
        `iKnowButtonLearn-${currentType}`
      )
      const repeatButton = document.getElementById(
        `repeatButtonLearn-${currentType}`
      )
      if (iKnowButton) {
        iKnowButton.style.visibility = 'hidden'
      }
      if (repeatButton) {
        repeatButton.style.visibility = 'hidden'
      }
    }

    if (kelimeListesi.length > 0) {
      currentLearnIndex = currentLearnIndex % kelimeListesi.length
      showLearnWord()
    }
  }
}

// ... existing code ...

function setupEventListeners() {
  try {
    // Butonları ID ile seçelim
    // const iKnowButton = document.getElementById(
    //   `iKnowButtonLearn-${currentType}`
    // )
    // const repeatButton = document.getElementById(
    //   `repeatButtonLearn-${currentType}`
    // )

    // const iKnowButtons = document.querySelectorAll('.i-know-buttons')
    // const repeatButtons = document.querySelectorAll('.repeat-buttons')

    // iKnowButtons.forEach((iKnowButton, index) => {
    //   setupListenerForIknowAndLearn(iKnowButton, repeatButtons[index])
    // })

    // const repeatButtonVerb = document.getElementById('repeatButtonLearnVerb')
    // const iKnowButtonVerb = document.getElementById('iKnowButtonLearnVerb')

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

function setupListenerForIknowAndLearn(iKnowButton, repeatButton) {
  // Repeat button
  if (repeatButton && !repeatButton.hasAttribute('listener-attached')) {
    repeatButton.addEventListener('click', function (event) {
      event.preventDefault()
      repeatLearn()
    })
    repeatButton.setAttribute('listener-attached', 'true')
  }

  // I Know button
  if (iKnowButton && !iKnowButton.hasAttribute('listener-attached')) {
    iKnowButton.addEventListener('click', function (event) {
      event.preventDefault()
      iKnowLearn()
    })
    iKnowButton.setAttribute('listener-attached', 'true')
  }
}

// Page Changes
document.addEventListener('DOMContentLoaded', () => {
  try {
    setupEventListeners()

    // Sayfa değişimlerini izle
    const observer = new MutationObserver((mutations) => {
      // Sadece gerekli değişikliklerde event listener'ları güncelle
      const shouldUpdate = mutations.some((mutation) => {
        return Array.from(mutation.addedNodes).some(
          (node) =>
            node.nodeType === 1 && // Element node
            (node.id === `repeatButtonLearn-${currentType}` ||
              node.id === `iKnowButtonLearn-${currentType}` ||
              node.id === `outfav-${currentType}` ||
              node.id === `infav-${currentType}`)
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

// E-mail Form
document.addEventListener('DOMContentLoaded', function () {
  document
    .getElementById('email-form')
    .addEventListener('submit', function (event) {
      event.preventDefault() // Formun hemen gönderilmesini engeller
      gtag_report_conversion()

      setTimeout(() => {
        this.submit() // Google Ads dönüşüm takibinin ardından formu gönder
      }, 300) // 300ms bekleyerek Google Ads dönüşümünün çalışmasını bekler
    })
})

function updateExerciseCounter() {
  correctAnswerWordsCounter[currentLevel][currentType]++
  LocalStorageManager.save(
    'correctAnswerWordsCounter',
    correctAnswerWordsCounter
  )

  document.getElementById(
    'remainingWordsCountExercise-' + currentType
  ).innerText = correctAnswerWordsCounter[currentLevel][currentType]
  document.getElementById('totalWordsCountExercise-' + currentType).innerText =
    initialTotalWords

  if (
    correctAnswerWordsCounter[currentLevel][currentType] >= initialTotalWords
  ) {
    showModalExercise('You completed all exercise words! 🎉')

    if (currentType === 'noun') {
      document.getElementById('buttonDer').style.visibility = 'hidden'
      document.getElementById('buttonDie').style.visibility = 'hidden'
      document.getElementById('buttonDas').style.visibility = 'hidden'
    } else if (
      currentType === 'verb' ||
      currentType === 'adjective' ||
      currentType === 'adverb'
    ) {
      document.getElementById(`wrongButton-${currentType}`).style.visibility =
        'hidden'
      document.getElementById(`correctButton-${currentType}`).style.visibility =
        'hidden'
    }
    document.getElementById('feedbackMessage-' + currentType).innerText =
      'You completed all exercise words! 🎉'
  }
}

function addToFavorites() {
  const inFavImage = document.getElementById(`infav-${currentType}`)
  const outFavImage = document.getElementById(`outfav-${currentType}`)
  const feedbackElement = document.getElementById(
    `favoritesFeedback-${currentType}`
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
  const isFavorite = isItInFavorites(currentWord, favoriteWords)

  // Favorilere ekle
  favoriteWords.push({
    type: currentType,
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

function isItInFavorites(currentWord, favoriteWords) {
  return favoriteWords.some((word) => word.almanca === currentWord.almanca)
}

function updateFavoriteIcons() {
  const inFavImage = document.getElementById(`infav-${currentType}`)
  const outFavImage = document.getElementById(`outfav-${currentType}`)

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

function removeFavorite() {
  // Favorilerden kaldır
  const feedbackElement = document.getElementById(
    `favoritesFeedback-${currentType}`
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
  updateFavoriteIcons()
}

function navigateToPage(pageId) {
  showSkeleton()
  setTimeout(() => {
    document.querySelectorAll('.page').forEach((page) => {
      page.style.display = 'none'
    })
    document.getElementById(pageId).style.display = 'block'
    hideSkeleton()

    // Sayfa değişiminde buton kontrolü
    if (learnedWords[currentLevel][currentType] >= initialTotalWords) {
      document.getElementById(
        'iKnowButtonLearn-' + currentType
      ).style.visibility = 'hidden'
      document.getElementById(
        'repeatButtonLearn-' + currentType
      ).style.visibility = 'hidden'
    }
    if (
      learnedWithExerciseWords[currentLevel][currentType] >= initialTotalWords
    ) {
      if (currentType === 'noun') {
        document.getElementById('buttonDer').style.visibility = 'hidden'
        document.getElementById('buttonDie').style.visibility = 'hidden'
        document.getElementById('buttonDas').style.visibility = 'hidden'
      } else if (
        currentType === 'verb' ||
        currentType === 'adjective' ||
        currentType === 'adverb'
      ) {
        document.getElementById(`wrongButton-${currentType}`).style.visibility =
          'hidden'
        document.getElementById(
          `correctButton-${currentType}`
        ).style.visibility = 'hidden'
      }
    }
  }, 500)
}

const clearDeprecatedLocalStorageItems = () => {
  const currentAppVersion = "1.0.6"
  const APP_VERSION = LocalStorageManager.load('APP_VERSION', null)
  
  if (APP_VERSION === null || APP_VERSION !== currentAppVersion) {
    LocalStorageManager.remove('lastSelectedTopic')
    LocalStorageManager.remove('inProgressWords')
    LocalStorageManager.remove('learnedWithExerciseWords')
    LocalStorageManager.remove('learnedWords')
    LocalStorageManager.remove('learnedWithLearnWords')
    LocalStorageManager.remove('correctAnswerWordsCounter')
    LocalStorageManager.remove('favoriteWords')

    LocalStorageManager.save('APP_VERSION', currentAppVersion)
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  showSkeleton()
  clearDeprecatedLocalStorageItems()

  try {
    const lastSelectedTopic = 'b1telcpt1'
    LocalStorageManager.save('lastSelectedTopic', lastSelectedTopic)
    await loadWords(lastSelectedTopic)
    showLearnWord()
    showExerciseWord()

    // Sayfa yüklendiğinde buton kontrolü
    if (learnedWords[currentLevel][currentType] >= initialTotalWords) {
      document.getElementById(
        'iKnowButtonLearn-' + currentType
      ).style.visibility = 'hidden'
      document.getElementById(
        'repeatButtonLearn-' + currentType
      ).style.visibility = 'hidden'
    }
    if (
      learnedWithExerciseWords[currentLevel][currentType] >= initialTotalWords
    ) {
      if (currentType === 'noun') {
        document.getElementById('buttonDer').style.visibility = 'hidden'
        document.getElementById('buttonDie').style.visibility = 'hidden'
        document.getElementById('buttonDas').style.visibility = 'hidden'
      } else if (
        currentType === 'verb' ||
        currentType === 'adjective' ||
        currentType === 'adverb'
      ) {
        document.getElementById(`wrongButton-${currentType}`).style.visibility =
          'hidden'
        document.getElementById(
          `correctButton-${currentType}`
        ).style.visibility = 'hidden'
      }
    }
  } catch (error) {
    console.error('Başlangıç yüklemesi hatası:', error)
  } finally {
    hideSkeleton()
  }
})

function resetExerciseButtons() {
  if (currentType === 'noun') {
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
      newButtonDer.addEventListener('click', function (event) {
        event.preventDefault()
        checkNounAnswer('der')
      })

      newButtonDie.addEventListener('click', function (event) {
        event.preventDefault()
        checkNounAnswer('die')
      })

      newButtonDas.addEventListener('click', function (event) {
        event.preventDefault()
        checkNounAnswer('das')
      })

      console.log('🔥 Der, Die, Das butonları tekrar aktif hale getirildi.')
    }
  } else if (
    currentType === 'verb' ||
    currentType === 'adjective' ||
    currentType === 'adverb'
  ) {
    var buttonWrong = document.getElementById(`wrongButton-${currentType}`)
    var buttonCorrect = document.getElementById(`correctButton-${currentType}`)

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
      newButtonWrong.addEventListener('click', function (event) {
        event.preventDefault()
        checkNonNounAnswer(false)
      })

      newButtonCorrect.addEventListener('click', function (event) {
        event.preventDefault()
        checkNonNounAnswer(true)
      })

      console.log(
        `🔥 Correct-${currentType}, Wrong-${currentType} butonları tekrar aktif hale getirildi.`
      )
    }
  }
}

function showModal(message) {
  var modal = document.getElementById(`customModal-${currentType}`)
  var modalMessage = document.getElementById(`modalMessage-${currentType}`)
  var closeButton = document.querySelector('.close-button')

  modalMessage.innerText = message // **Mesajı değiştir**
  modal.style.display = 'block' // **Modali aç**

  closeButton.addEventListener('click', function () {
    modal.style.display = 'none' // **Kapatma butonuna tıklanınca gizle**
    resetExerciseButtons() // **🔥 Butonları tekrar aktif et**
  })

  setTimeout(() => {
    modal.style.display = 'none' // **3 saniye sonra otomatik kapanır**
    resetExerciseButtons() // **🔥 Butonları tekrar aktif et**
  }, 3000)
}

function showModalExercise(message) {
  var modal = document.getElementById(`customModalExercise-${currentType}`)
  var modalMessage = document.getElementById(
    `modalMessageExercise-${currentType}`
  )
  var closeButton = document.querySelector('.close-button')

  modalMessage.innerText = message // **Mesajı değiştir**
  modal.style.display = 'block' // **Modali aç**

  closeButton.addEventListener('click', function () {
    modal.style.display = 'none' // **Kapatma butonuna tıklanınca gizle**
    resetExerciseButtons() // **🔥 Butonları tekrar aktif et**
  })

  setTimeout(() => {
    modal.style.display = 'none' // **3 saniye sonra otomatik kapanır**
    resetExerciseButtons() // **🔥 Butonları tekrar aktif et**
  }, 3000)
}

function playSound(audioUrl) {
  const audio = new Audio(audioUrl)
  audio.play()
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
