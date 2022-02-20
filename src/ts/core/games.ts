import './games.scss';
import Page from './page';

class Games extends Page {
  numOfChapters: number;

  choosedChapter: number;

  constructor() {
    super();
    this.numOfChapters = 6;
    this.choosedChapter = 0;
  }

  renderChapterChoose() {
    const chapter = document.createElement('div');
    chapter.classList.add('game__chapter');

    const isFromBook = localStorage.getItem('isFromBook') === 'true';
    if (isFromBook) {
      const text = this.renderChapterText();
      chapter.append(text);
    } else {
      const input = this.renderChapterInput();
      chapter.append(input);
    }
    return chapter;
  }

  renderChapterText() {
    const text = document.createElement('p');
    text.classList.add('game__chapter_text');
    const currentChapter = +(localStorage.getItem('currentChapter') as string) + 1;
    this.choosedChapter = currentChapter;
    text.innerText = `Уровень ${currentChapter}`;
    return text;
  }

  renderChapterInput() {
    const select = document.createElement('select');
    select.classList.add('game__chapter_select');
    select.name = 'chapter';

    for (let i = 0; i < this.numOfChapters; i += 1) {
      const option = document.createElement('option');
      option.classList.add('game__chapter_option');
      option.value = i.toString();
      option.innerText = `Уровень ${(i + 1).toString()}`;
      select.append(option);
    }
    select.addEventListener('change', () => {
      this.choosedChapter = +select.value;
    });
    return select;
  }

  getWords() {
    console.log('get words');
  }
}

export default Games;
