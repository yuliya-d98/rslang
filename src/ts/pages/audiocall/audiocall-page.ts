import './audiocall-page.scss';
import Games from '../../core/games';

class AudiocallPage extends Games {
  currentQuestionNumber: number;

  constructor() {
    super();
    this.currentQuestionNumber = 0;
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
    console.log('1', this.words);
    console.log('1', this.wordsDifficulty);
  }

  closeGame() {}
}

export default AudiocallPage;
