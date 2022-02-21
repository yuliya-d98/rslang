import './audiocall-page.scss';
import Games from '../../core/games';
import Book from '../../core/api/book';
import { Word } from '../../core/typings/book';

const book = new Book();

class AudiocallPage extends Games {
  currentQuestionNumber: number;

  answerOptions: string[];

  rightAnswers: Word[];

  wrongAnswers: Word[];

  constructor() {
    super();
    this.currentQuestionNumber = 0;
    this.answerOptions = [];

    this.rightAnswers = [];
    this.wrongAnswers = [];
  }

  render() {
    this.body.innerHTML = '';
    this.renderHeader();

    const background = document.createElement('div');
    background.classList.add('audiocall__background');

    const container = document.createElement('div');
    container.classList.add('section-container');

    const splashScreen = this.renderSplashScreen();
    container.append(splashScreen);

    background.append(container);
    this.body.append(background);
    this.renderFooter();
  }

  renderSplashScreen() {
    const screen = document.createElement('section');
    screen.classList.add('audiocall__screen');

    const header = document.createElement('h3');
    header.classList.add('audiocall__screen_header');
    header.innerText = 'Аудиовызов';
    screen.append(header);

    const rules = document.createElement('p');
    rules.classList.add('audiocall__screen_text', 'rules');
    rules.innerText =
      'В этой игре Вам нужно узнать слово по произношению и выбрать его перевод среди предложенных слов.';
    screen.append(rules);

    const controls = document.createElement('ul');
    controls.classList.add('audiocall__screen_text');
    controls.innerText = 'Кроме мыши можно использовать клавиатуру:';
    const numbers = document.createElement('li');
    numbers.classList.add('audiocall__screen_text');
    numbers.innerText = 'для выбора варианта ответа используйте клавиши от 1 до 5;';
    const space = document.createElement('li');
    space.classList.add('audiocall__screen_text');
    space.innerText = 'используйте пробел для повтроного звучания слова;';
    controls.append(numbers, space);
    screen.append(controls);

    const chapter = this.renderChapterChoose();
    screen.append(chapter);

    const start = document.createElement('div');
    start.classList.add('audiocall__screen_start-btn');
    start.innerText = 'Начать игру';
    start.addEventListener('click', () => {
      this.startGame();
    });
    screen.append(start);

    return screen;
  }

  startGame() {
    this.words = [];
    this.wordsDifficulty = [];
    this.getWords(this.choosedChapter, this.currentPage)
      .then(() => this.renderQuestion())
      .catch((e) => console.error(e));
  }

  renderQuestion() {
    this.currentQuestionNumber = 0;
    const container = document.createElement('div');
    container.classList.add('question__container');

    const closeBtn = document.createElement('div');
    closeBtn.classList.add('question__close');
    closeBtn.innerText = 'X';
    closeBtn.addEventListener('click', () => {
      this.closeGame();
    });
    container.append(closeBtn);

    const circles = document.createElement('div');
    circles.classList.add('question__circles');
    for (let i = 0; i < this.numOfQuestions; i += 1) {
      const circle = document.createElement('div');
      circle.classList.add('question__circles_circle');
      circles.append(circle);
    }
    container.append(circles);

    const section = document.querySelector('.section-container') as HTMLDivElement;
    section.append(container);

    this.nextQuestion();
  }

  nextQuestion() {
    const rightAnswer = this.words[this.currentQuestionNumber];

    const container = document.querySelector('.question__container') as HTMLDivElement;

    const sound = new Audio();
    sound.src = `https://${book.backendDeploy}.herokuapp.com/${rightAnswer.audio}`;
    const soundBtn = document.createElement('div');
    soundBtn.classList.add('question__sound-btn');
    soundBtn.innerHTML = `<svg class="MuiSvgIcon-root jss147" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path></svg>`;
    soundBtn.addEventListener('click', () => {
      sound.play().catch((e) => console.error(e));
    });
    container.append(soundBtn);

    this.createAnswerOptions();
    const answerOptions = document.createElement('div');
    answerOptions.classList.add('question__answer-options');
    for (let i = 0; i < this.answerOptions.length; i += 1) {
      const answerOption = document.createElement('p');
      answerOption.classList.add('question__answer-option');
      answerOption.dataset.answer = this.answerOptions[i];
      answerOption.innerText = `${(i + 1).toString()}. ${this.answerOptions[i]}`;
      answerOptions.append(answerOption);
    }
    answerOptions.addEventListener('click', (e) => {
      if ((e.target as HTMLDivElement).closest('.question__answer-option')) {
        const answer = (e.target as HTMLDivElement).closest(
          '.question__answer-option'
        ) as HTMLParagraphElement;

        const isRightAnswer = (answer.dataset.answer as string) === rightAnswer.wordTranslate;

        const circles = document.querySelectorAll('.question__circles_circle');
        circles[this.currentQuestionNumber].classList.add(isRightAnswer ? 'right' : 'wrong');

        if (isRightAnswer) {
          this.rightAnswers.push(rightAnswer);
        } else {
          this.wrongAnswers.push(rightAnswer);
        }

        this.openModal(isRightAnswer);
      }
    });
    container.append(answerOptions);

    sound.play().catch((e) => console.error(e));
  }

  openModal(isRightAnswer: boolean) {
    const rightAnswer = this.words[this.currentQuestionNumber];

    const background = document.createElement('div');
    background.classList.add('modal__background');
    background.addEventListener('click', () => {
      this.closeModal();
    });
    const modal = document.createElement('div');
    modal.classList.add('modal');

    const closeModalBtn = document.createElement('div');
    closeModalBtn.classList.add('modal__close');
    closeModalBtn.innerText = 'X';
    closeModalBtn.addEventListener('click', () => {
      this.closeModal();
    });

    const result = document.createElement('p');
    result.classList.add('modal__result');
    result.innerText = isRightAnswer ? 'Верно' : 'Неверно';

    const image = document.createElement('img');
    image.classList.add('modal__image');
    image.src = `https://${book.backendDeploy}.herokuapp.com/${rightAnswer.image}`;

    const text = document.createElement('p');
    text.classList.add('modal__text');
    text.innerText = `${rightAnswer.word} - ${rightAnswer.wordTranslate}`;

    modal.append(closeModalBtn, result, image, text);

    const section = document.querySelector('.section-container') as HTMLDivElement;
    section.append(background, modal);
  }

  closeModal() {
    const background = document.querySelector('.modal__background');
    background?.remove();
    const modal = document.querySelector('.modal');
    modal?.remove();
    const sound = document.querySelector('.question__sound-btn');
    sound?.remove();
    const answerOptions = document.querySelector('.question__answer-options');
    answerOptions?.remove();
    this.currentQuestionNumber += 1;
    if (this.currentQuestionNumber === this.words.length) {
      this.closeGame();
      this.openResults();
    } else {
      this.nextQuestion();
    }
  }

  openResults() {
    const background = document.createElement('div');
    background.classList.add('result__background');
    background.addEventListener('click', () => {
      this.closeResults();
    });

    const results = document.createElement('div');
    results.classList.add('result');

    const closeBtn = document.createElement('div');
    closeBtn.classList.add('result__close');
    closeBtn.innerText = 'X';
    closeBtn.addEventListener('click', () => {
      this.closeResults();
    });
    results.append(closeBtn);

    const innerContainer = document.createElement('div');
    innerContainer.classList.add('result__inner-container');

    if (this.wrongAnswers.length) {
      const mistakes = document.createElement('p');
      mistakes.classList.add('result__header');
      mistakes.innerText = 'Ошибок';
      const mistakesCount = document.createElement('p');
      mistakesCount.classList.add('result__header_number', 'wrong');
      mistakesCount.innerText = this.wrongAnswers.length.toString();
      innerContainer.append(mistakes, mistakesCount);
      for (let i = 0; i < this.wrongAnswers.length; i += 1) {
        this.addWordToResults(this.wrongAnswers[i], innerContainer);
      }
    }

    if (this.wrongAnswers.length && this.rightAnswers.length) {
      const line = document.createElement('hr');
      line.classList.add('result__line');
      innerContainer.append(line);
    }

    if (this.rightAnswers.length) {
      const rightAnswer = document.createElement('p');
      rightAnswer.classList.add('result__header');
      rightAnswer.innerText = 'Знаю';
      const rightAnswerCount = document.createElement('p');
      rightAnswerCount.classList.add('result__header_number', 'right');
      rightAnswerCount.innerText = this.rightAnswers.length.toString();
      innerContainer.append(rightAnswer, rightAnswerCount);
      for (let i = 0; i < this.rightAnswers.length; i += 1) {
        this.addWordToResults(this.rightAnswers[i], innerContainer);
      }
    }

    results.append(innerContainer);
    const section = document.querySelector('.section-container') as HTMLDivElement;
    section.append(background, results);
  }

  closeResults() {
    const background = document.querySelector('.result__background');
    const results = document.querySelector('.result');
    background?.remove();
    results?.remove();
    this.rightAnswers = [];
    this.wrongAnswers = [];
  }

  addWordToResults(word: Word, outerContainer: HTMLDivElement) {
    const container = document.createElement('div');
    container.classList.add('result__word');

    const sound = document.createElement('div');
    sound.classList.add('result__word_sound');
    sound.innerHTML = `<svg class="MuiSvgIcon-root jss147" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path></svg>`;
    sound.addEventListener('click', () => {
      const audio = new Audio(`https://${book.backendDeploy}.herokuapp.com/${word.audio}`);
      audio.play().catch((e) => console.error(e));
    });

    const text = document.createElement('p');
    text.classList.add('result__word_text');
    text.innerHTML = `<b>${word.word}</b> - ${word.wordTranslate}`;

    container.append(sound, text);
    outerContainer.append(container);
  }

  closeGame() {
    const question = document.querySelector('.question__container') as HTMLDivElement;
    question.remove();
  }

  createAnswerOptions() {
    this.answerOptions = [this.words[this.currentQuestionNumber].wordTranslate];
    while (this.answerOptions.length < 5) {
      const random = this.randomInteger(0, this.words.length - 1);
      const answerOption = this.words[random].wordTranslate;
      if (!this.answerOptions.includes(answerOption)) {
        this.answerOptions.push(answerOption);
      }
    }
    this.answerOptions = this.shuffleArray(this.answerOptions);
  }
}

export default AudiocallPage;
