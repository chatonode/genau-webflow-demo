import QuestionManager from '../utils/einburgerungstest/QuestionManager.js'

import LocalStorageManager from '../utils/LocalStorageManager.js'

import {
  LEARN__STATE__QUESTION_INDEX_KEY,
  LEARN_STATE_KEY,
  SHOULD_SHOW_ANSWER_KEY,
  DEFAULT_VALUE,
} from '../constants/storageKeys.js'

// On Initial Load
document.addEventListener('DOMContentLoaded', () => {
  // get recent local storage items
  const currentState = LocalStorageManager.load(
    LEARN_STATE_KEY,
    DEFAULT_VALUE.LEARN_STATE
  )
  const shouldShowAnswer = LocalStorageManager.load(
    SHOULD_SHOW_ANSWER_KEY,
    DEFAULT_VALUE.SHOULD_SHOW_ANSWER
  )
  const currentLearnQuestionIndex = LocalStorageManager.load(
    new LEARN__STATE__QUESTION_INDEX_KEY(currentState),
    DEFAULT_VALUE.LEARN_QUESTION_INDEX
  )

  // get filtered questions
  const questions = QuestionManager.getLearnQuestionsByState(currentState)

  // show initial question
  const recentQuestion = questions[currentLearnQuestionIndex - 1]
  setLearnTabElements(
    currentLearnQuestionIndex,
    questions.length,
    shouldShowAnswer,
    recentQuestion
  )
})

// On State Change
document.querySelectorAll('.state-dropdown-link').forEach((stateLink) => {
  stateLink.addEventListener('click', function (event) {
    event.preventDefault()
    // set updated local storage item
    const currentState = stateLink.getAttribute('data-option')
    LocalStorageManager.save(LEARN_STATE_KEY, currentState)
    // get recent local storage items
    const shouldShowAnswer = LocalStorageManager.load(
      SHOULD_SHOW_ANSWER_KEY,
      DEFAULT_VALUE.SHOULD_SHOW_ANSWER
    )
    const currentLearnQuestionIndex = LocalStorageManager.load(
      new LEARN__STATE__QUESTION_INDEX_KEY(currentState),
      DEFAULT_VALUE.LEARN_QUESTION_INDEX
    )

    // get filtered questions
    const questions = QuestionManager.getLearnQuestionsByState(currentState)

    // update ui
    // // show updated state header
    document.getElementById('dropdown-header').innerText = currentState
    // // show updated question
    const updatedQuestion = questions[currentLearnQuestionIndex - 1]
    setLearnTabElements(
      currentLearnQuestionIndex,
      questions.length,
      shouldShowAnswer,
      updatedQuestion
    )
  })
})

// On Toggle Change
document
  .getElementById('should-show-answer-switch')
  .addEventListener('click', () => {
    const offOptionElement = document.getElementById('hide-answers-option')
    const onOptionElement = document.getElementById('show-answers-option')
    if (offOptionElement && offOptionElement.classList.contains('active')) {
      console.log('hiding learn answers...')
      // set updated local storage item
      LocalStorageManager.save(SHOULD_SHOW_ANSWER_KEY, false)
    } else if (
      onOptionElement &&
      onOptionElement.classList.contains('active')
    ) {
      console.log('showing learn answers...')
      // set updated local storage item
      LocalStorageManager.save(SHOULD_SHOW_ANSWER_KEY, true)
    }
  })

/** UI Changes
 * They CANNOT access local storage items
 * */

const setLearnTabElements = (
  currentQuestionIndex,
  totalNumberOfQuestions,
  shouldShowAnswer,
  currentQuestion
) => {
  document.getElementById('learn-question-index').innerText =
    currentQuestionIndex
  document.getElementById('learn-questions-length').innerText =
    totalNumberOfQuestions

  document.getElementById(
    'learn-current-question-index-label'
  ).innerText = `Aufgabe ${currentQuestionIndex}`
  document.getElementById(
    'learn-current-question-description-label'
  ).innerText = currentQuestion.question

  currentQuestion.answers.forEach((answer, i) => {
    const answerElement = document.getElementById(
      `learn-current-question-answer-${i + 1}`
    )
    answerElement.innerText = answer

    if (shouldShowAnswer && answer === currentQuestion.correct_answer) {
      answerElement.style.backgroundColor === '#0cac92'
    }
  })
}
