import './audiocall-page.scss';
import Games from '../../core/games';
import Book from '../../core/api/book';

const book = new Book();

class AudiocallPage extends Games {
  currentQuestionNumber: number;

  answerOptions: string[];

  constructor() {
    super();
    this.currentQuestionNumber = 0;
    this.answerOptions = [];
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
    const enter = document.createElement('li');
    enter.classList.add('audiocall__screen_text');
    enter.innerText = 'enter для перехода к следующему вопросу.';
    controls.append(numbers, space, enter);
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
    const rightAnswer = this.words[this.currentQuestionNumber];

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
        this.openModal((answer.dataset.answer as string) === rightAnswer.wordTranslate);
      }
    });
    container.append(answerOptions);

    const section = document.querySelector('.section-container') as HTMLDivElement;
    section.append(container);

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
  }

  closeGame() {
    const question = document.querySelector('.question__container') as HTMLDivElement;
    question.remove();
  }

  createAnswerOptions() {
    this.answerOptions = [this.words[this.currentQuestionNumber].wordTranslate];
    while (this.answerOptions.length < 5) {
      const random = this.randomInteger(0, this.words.length);
      const answerOption = this.words[random].wordTranslate;
      if (!this.answerOptions.includes(answerOption)) {
        this.answerOptions.push(answerOption);
      }
    }
    this.answerOptions = this.shuffleArray(this.answerOptions);
  }

  randomInteger(min: number, max: number) {
    const random = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(random);
  }

  shuffleArray(answers: string[]) {
    const answersCopy = answers.slice();
    for (let i = answersCopy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * i);
      const temp = answersCopy[i];
      answersCopy[i] = answersCopy[j];
      answersCopy[j] = temp;
    }
    return answersCopy;
  }
}

export default AudiocallPage;
