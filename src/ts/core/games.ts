import Book from './api/book';
import './games.scss';
import Page from './page';
import { UserWords, Words } from './typings/book';

const book = new Book();

class Games extends Page {
  numOfChapters: number;

  choosedChapter: number;

  currentPage: number;

  numOfPages: number;

  isAuthorized: boolean;

  words: Words;

  numOfQuestions: number;

  userWords: UserWords;

  wordsDifficulty: string[];

  constructor() {
    super();
    this.numOfChapters = 6;
    this.choosedChapter = 0;
    this.currentPage = localStorage.getItem('currentBookPage')
      ? +(localStorage.getItem('currentBookPage') as string)
      : 0;
    this.numOfPages = 30;
    this.isAuthorized = Boolean(localStorage.getItem('userId'));
    this.words = [];
    this.numOfQuestions = 30;
    this.userWords = [];
    this.wordsDifficulty = [];
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
    this.choosedChapter = localStorage.getItem('currentChapter')
      ? +(localStorage.getItem('currentChapter') as string)
      : 0;
    const currentChapter = this.choosedChapter + 1;
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

  async getWords(chapter: number, pageNumber: number) {
    if (this.words.length >= this.numOfQuestions) {
      this.words.length = this.numOfQuestions;
      if (this.isAuthorized) this.wordsDifficulty.length = this.numOfQuestions;
    } else if (!this.isAuthorized) {
      const content = await book.getWordsOnPage(chapter, pageNumber);
      this.words.push(...content);
      if (pageNumber > 0) {
        this.getWords(chapter, pageNumber - 1).catch((e) => console.error(e));
      } else if (pageNumber === 0 && chapter > 0) {
        this.getWords(chapter - 1, pageNumber).catch((e) => console.error(e));
      }
    } else {
      const userWords = await book.getAllUserWords();
      this.userWords.push(...userWords);
      const content = await book.getWordsOnPage(chapter, pageNumber);
      this.words.push(...content);
      for (let i = 0; i < content.length; i += 1) {
        const wordId = (content[i].id || content[i]._id) as string;
        let difficulty = 'normal';
        for (let j = 0; j < this.userWords.length; j += 1) {
          if (this.userWords[j].wordId === wordId) {
            difficulty = this.userWords[j].difficulty;
          }
        }
        this.wordsDifficulty.push(difficulty);
      }
      console.log('chapter, pageNumber', chapter, pageNumber);
      if (pageNumber > 0) {
        await this.getWords(chapter, pageNumber - 1).catch((e) => console.error(e));
      } else if (pageNumber === 0 && chapter > 0) {
        await this.getWords(chapter - 1, this.numOfPages - 1).catch((e) => console.error(e));
      } else if (pageNumber === 0 && chapter === 0 && this.words.length > 30) {
        this.words.length = this.numOfQuestions;
        this.wordsDifficulty.length = this.numOfQuestions;
      }
    }
  }
}

export default Games;
