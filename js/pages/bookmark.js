import { DEFAULT_VALUE, LEARNED_WITH_EXERCISE_WORDS_KEY } from "../constants/storageKeys.js"
import LocalStorageManager from "../utils/LocalStorageManager.js"
import { levels, categories, types } from "../constants/props.js"

// On Initial Load
document.addEventListener('DOMContentLoaded', () => {
  LocalStorageManager.clearDeprecatedLocalStorageItems()
})

function listFavorites() {
  const favoritesContainer = document.getElementById('favoritesContainer')

  // FavoritesContainer için scrollable alan ayarları
  favoritesContainer.style.maxHeight = '420px' // Maksimum yükseklik
  favoritesContainer.style.overflowY = 'auto' // Dikey kaydırma
  favoritesContainer.style.padding = '12px' // İçerik padding
  favoritesContainer.style.border = '0px solid #ccc' // Çerçeve
  favoritesContainer.style.borderRadius = '16px' // Köşeleri yuvarla
  favoritesContainer.style.display = 'block' // Varsayılan düzen

  favoritesContainer.innerHTML = '' // Mevcut listeyi temizle

  const favoriteWords = JSON.parse(localStorage.getItem('favoriteWords')) || []

  if (favoriteWords.length === 0) {
    // Favori kelime yokken gösterilecek mesaj
    showNoWordsMessage(favoritesContainer)
    return
  }

  // Favori kelimeler mevcutsa düzeni geri yükle
  favoritesContainer.style.display = 'block' // Flex değil, varsayılan düzen

  favoriteWords.forEach((word, index) => {
    // Tüm favori bloğunu kapsayan div
    const favAllBlock = document.createElement('div')
    favAllBlock.classList.add('favAllBlock')
    favAllBlock.style.display = 'flex'
    favAllBlock.style.justifyContent = 'space-between' // Yatayda aralık
    favAllBlock.style.alignItems = 'center' // Dikeyde ortalama
    favAllBlock.style.padding = '12px 0' // Bloklar arası boşluk
    favAllBlock.style.borderBottom = '1px solid #ccc' // Alt çizgi ile ayırma

    // Almanca ve İngilizce kelimeler
    const favWordsBlock = document.createElement('div')
    favWordsBlock.classList.add('favWordsBlock')
    favWordsBlock.style.display = 'flex'
    favWordsBlock.style.flexDirection = 'column' // Dikey hizalama
    favWordsBlock.style.textAlign = 'left' // Sola hizalama
    favWordsBlock.style.flex = '1' // Otomatik genişleme

    const germanWord = document.createElement('p')
    germanWord.classList.add('favoriteWordGerman')
    germanWord.style.margin = '0' // Varsayılan margin sıfırlama
    germanWord.style.fontWeight = 'bold' // Kalın yazı
    germanWord.textContent = word.almanca

    const englishWord = document.createElement('p')
    englishWord.classList.add('favoriteWordEnglish')
    englishWord.style.margin = '4px 0 0 0' // Üstte boşluk
    englishWord.textContent = word.ingilizce

    favWordsBlock.appendChild(germanWord)
    favWordsBlock.appendChild(englishWord)

    // Seviye ve silme butonu
    const favLevelBlock = document.createElement('div')
    favLevelBlock.classList.add('favLevelBlock')
    favLevelBlock.style.display = 'flex'
    favLevelBlock.style.alignItems = 'center' // Dikeyde ortalama
    favLevelBlock.style.gap = '8px' // Level ve buton arası boşluk

    const levelTag = document.createElement('p')
    levelTag.classList.add('favoriteWordLevel')
    levelTag.style.margin = '0' // Varsayılan margin sıfırlama
    levelTag.style.color = '#999' // Gri renk
    levelTag.textContent = word.seviye

    const typeTag = document.createElement('p')
    typeTag.classList.add('favoriteWordType')
    typeTag.style.margin = '0'
    typeTag.style.color = '#999'
    typeTag.textContent = word.type

    const removeButton = document.createElement('button')
    removeButton.classList.add('removeButton')
    removeButton.style.border = 'none'
    removeButton.style.background = 'none'
    removeButton.style.cursor = 'pointer'
    removeButton.style.display = 'flex'
    removeButton.style.alignItems = 'center' // İkon hizalama
    removeButton.innerHTML = '🗑️' // Çöp kutusu ikonu
    removeButton.onclick = () => removeFavorite(index)

    favLevelBlock.appendChild(typeTag)
    favLevelBlock.appendChild(levelTag)
    favLevelBlock.appendChild(removeButton)

    // Ana bloğa ekle
    favAllBlock.appendChild(favWordsBlock)
    favAllBlock.appendChild(favLevelBlock)

    // Favoriler kapsayıcısına ekle
    favoritesContainer.appendChild(favAllBlock)
  })
}

// Favori kelimeyi silme
function removeFavorite(index) {
  let favoriteWords = JSON.parse(localStorage.getItem('favoriteWords')) || []
  favoriteWords.splice(index, 1) // İlgili indeksi kaldır
  localStorage.setItem('favoriteWords', JSON.stringify(favoriteWords))
  listFavorites() // Listeyi yeniden yükle
}

function listLearnedWords() {
  const learnedWordsContainer = document.getElementById('learnedWordsContainer');

  // Container ayarları
  learnedWordsContainer.style.maxHeight = '420px';
  learnedWordsContainer.style.overflowY = 'auto';
  learnedWordsContainer.style.padding = '12px';
  learnedWordsContainer.style.border = '0px solid #ccc';
  learnedWordsContainer.style.borderRadius = '16px';
  learnedWordsContainer.style.display = 'block';
  learnedWordsContainer.innerHTML = '';

  // Yerel depodan veriyi yükle
  const learnedWithExerciseWords = LocalStorageManager.load(LEARNED_WITH_EXERCISE_WORDS_KEY, DEFAULT_VALUE.LEARNED_WITH_EXERCISE_WORDS);

  // Eğer tüm word listeleri boşsa, mesaj göster
  if (areAllWordListsEmpty(learnedWithExerciseWords)) {
    showNoWordsMessage(learnedWordsContainer);
    return;
  }

  // levels, categories ve types üzerinden doğru derinlikte iterate et
  levels.forEach(level => {
    const levelObj = learnedWithExerciseWords[level];
    if (!levelObj) return; // Seviye yoksa atla

    categories.forEach(category => {
      const categoryObj = levelObj[category];
      if (!categoryObj) return; // Kategori yoksa atla

      types.forEach(type => {
        const wordsArray = categoryObj[type];
        if (Array.isArray(wordsArray) && wordsArray.length > 0) {
          wordsArray.forEach(word => {
            // Öğrenilmiş kelimeler bloğunu kapsayan div
            const learnedWordsAllBlock = document.createElement('div');
            learnedWordsAllBlock.classList.add('learnedWordsAllBlock');
            learnedWordsAllBlock.style.display = 'flex';
            learnedWordsAllBlock.style.justifyContent = 'space-between';
            learnedWordsAllBlock.style.alignItems = 'center';
            learnedWordsAllBlock.style.padding = '12px 0';
            learnedWordsAllBlock.style.borderBottom = '1px solid #ccc';

            // Kelime bilgilerini içeren div
            const learnedWordsBlock = document.createElement('div');
            learnedWordsBlock.classList.add('learnedWordsBlock');
            learnedWordsBlock.style.display = 'flex';
            learnedWordsBlock.style.flexDirection = 'column';
            learnedWordsBlock.style.textAlign = 'left';
            learnedWordsBlock.style.flex = '1';

            const germanWord = document.createElement('p');
            germanWord.classList.add('learnedWordGerman');
            germanWord.style.margin = '0';
            germanWord.style.fontWeight = 'bold';
            germanWord.textContent = word.almanca;

            const englishWord = document.createElement('p');
            englishWord.classList.add('learnedWordEnglish');
            englishWord.style.margin = '4px 0 0 0';
            englishWord.textContent = word.ingilizce;

            learnedWordsBlock.appendChild(germanWord);
            learnedWordsBlock.appendChild(englishWord);

            // Seviye ve tip bilgisini gösteren blok
            const learnedWordsLevelBlock = document.createElement('div');
            learnedWordsLevelBlock.classList.add('favLevelBlock');
            learnedWordsLevelBlock.style.display = 'flex';
            learnedWordsLevelBlock.style.alignItems = 'center';
            learnedWordsLevelBlock.style.gap = '8px';

            const levelTag = document.createElement('p');
            levelTag.classList.add('learnedWordLevel');
            levelTag.style.margin = '0';
            levelTag.style.color = '#999';
            levelTag.textContent = word.seviye;

            const typeTag = document.createElement('p');
            typeTag.classList.add('favoriteWordType');
            typeTag.style.margin = '0';
            typeTag.style.color = '#999';
            typeTag.textContent = word.type;

            learnedWordsLevelBlock.appendChild(typeTag);
            learnedWordsLevelBlock.appendChild(levelTag);

            // Ana bloğa ekle
            learnedWordsAllBlock.appendChild(learnedWordsBlock);
            learnedWordsAllBlock.appendChild(learnedWordsLevelBlock);
            learnedWordsContainer.appendChild(learnedWordsAllBlock);
          });
        }
      });
    });
  });
}

function showNoWordsMessage(elem) {

  elem.style.display = 'flex' // Flex düzen
  elem.style.justifyContent = 'center' // Yatayda ortala
  elem.style.alignItems = 'center' // Dikeyde ortala
  elem.style.textAlign = 'center' // Yazıları ortala

  const noWordsMessageElement = document.createElement('div')
  noWordsMessageElement.style.color = '#666' // Gri renk
  noWordsMessageElement.style.fontFamily = 'Montserrat, sans-serif' // Font ailesi
  noWordsMessageElement.style.fontSize = '16px' // Font boyutu
  noWordsMessageElement.style.fontWeight = '500' // Yazı kalınlığı
  noWordsMessageElement.style.padding = '16px' // Mesaj için padding
  noWordsMessageElement.style.lineHeight = '1.5' // Satır yüksekliği

  if (elem.id === 'learnedWordsContainer') {
    noWordsMessageElement.innerHTML = `
      <p>No words learned yet!</p>
      <p>Go to the "Exercise" and answer correctly a word three times in a row!!!</p>
    `
    elem.appendChild(noWordsMessageElement)
    return
  }

  if (elem.id === 'favoritesContainer') {
    noWordsMessageElement.innerHTML = `
      <p>No favorites added yet!</p>
      <p>Click the "Add to Favorites" button to start saving words 🌟</p>
    `

    elem.appendChild(noWordsMessageElement)
    return
  }
}

function areAllWordListsEmpty(data) {
  for (const level of levels) {
    const levelObj = data[level];
    if (!levelObj) continue;

    for (const category of categories) {
      const categoryObj = levelObj[category];
      if (!categoryObj) continue;

      for (const type of types) {
        const wordList = categoryObj[type];
        if (Array.isArray(wordList) && wordList.length > 0) {
          return false; // Eğer herhangi bir liste doluysa false döner
        }
      }
    }
  }
  return true; // Hepsi boşsa true döner
}

// Sayfa yüklendiğinde favorileri listele
document.addEventListener('DOMContentLoaded', listFavorites)
document.addEventListener('DOMContentLoaded', listLearnedWords)
