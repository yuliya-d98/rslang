import './book-page.scss';
import Book from '../../core/api/book';
import Page from '../../core/page';
import { UserWords, Word, ChapterNames } from '../../core/typings/book';

const book = new Book();

class BookPage extends Page {
  currentChapter: number;

  chapters: number;

  pages: number;

  pageNumber: number;

  isDifficultWords: boolean;

  userWords: UserWords | null;

  constructor() {
    super();
    this.currentChapter = +(localStorage.getItem('currentChapter') as string) || 0;
    this.chapters = 6;
    this.pageNumber = +(localStorage.getItem('currentBookPage') as string) || 0;
    this.pages = 30;

    this.isDifficultWords = false;
    this.userWords = null;
  }

  render() {
    this.body.innerHTML = '';
    this.renderHeader();
    const bookSection = document.createElement('section');
    bookSection.classList.add('book');

    const container = document.createElement('div');
    container.classList.add('section-container');

    const chapters = this.renderChapters();
    const chapterText = document.createElement('h2');
    chapterText.innerText = ChapterNames[this.currentChapter];
    chapterText.classList.add('book__header');
    const pagination = this.currentChapter < this.chapters ? this.renderPagination() : '';
    container.append(chapters, chapterText, pagination);

    const wordsContainer = document.createElement('div');
    wordsContainer.classList.add('book__words');
    container.append(wordsContainer);

    bookSection.append(container);
    this.body.append(bookSection);
    this.renderWords();
    this.renderFooter();
  }

  renderChapters() {
    const chapters = document.createElement('div');
    chapters.classList.add('book__chapters');
    for (let i = 0; i < this.chapters; i += 1) {
      const chapter = document.createElement('p');
      chapter.classList.add('book__chapters_chapter');
      if (this.currentChapter === i) {
        chapter.classList.add('showing');
      }
      chapter.innerText = (i + 1).toString();
      chapter.dataset.chapter = i.toString();
      chapters.append(chapter);
    }

    const hardWords = document.createElement('p');
    hardWords.classList.add('book__chapters_chapter');
    if (this.currentChapter === this.chapters) {
      hardWords.classList.add('showing');
    }
    hardWords.innerText = 'Сложные слова';
    hardWords.dataset.chapter = this.chapters.toString();

    const learnedWords = document.createElement('p');
    learnedWords.classList.add('book__chapters_chapter');
    if (this.currentChapter === this.chapters + 1) {
      learnedWords.classList.add('showing');
    }
    learnedWords.innerText = 'Изученные слова';
    learnedWords.dataset.chapter = (this.chapters + 1).toString();

    if (this.isAuthorized) {
      chapters.append(hardWords, learnedWords);
    }

    chapters.addEventListener('click', (event) => {
      if ((event.target as HTMLParagraphElement).closest('.book__chapters_chapter')) {
        const target = (event.target as HTMLParagraphElement).closest(
          '.book__chapters_chapter'
        ) as HTMLParagraphElement;
        if (!target.classList.contains('showing')) {
          this.currentChapter = +(target.dataset.chapter as string);
          localStorage.setItem('currentChapter', target.dataset.chapter as string);
          this.render();
        }
      }
    });
    return chapters;
  }

  renderPagination() {
    const pagination = document.createElement('div');
    pagination.classList.add('book__pagination');
    const first = document.createElement('p');
    first.classList.add('book__pagination_btn');
    first.innerText = '<<';
    first.addEventListener('click', () => {
      this.pageNumber = 0;
      localStorage.setItem('currentBookPage', this.pageNumber.toString());
      this.render();
    });
    pagination.append(first);
    const prev = document.createElement('p');
    prev.classList.add('book__pagination_btn');
    prev.innerText = '<';
    prev.addEventListener('click', () => {
      this.pageNumber = this.pageNumber === 0 ? 0 : this.pageNumber - 1;
      localStorage.setItem('currentBookPage', this.pageNumber.toString());
      this.render();
    });
    pagination.append(prev);
    const current = document.createElement('p');
    current.classList.add('book__pagination_btn');
    current.innerText = (this.pageNumber + 1).toString();
    pagination.append(current);
    const next = document.createElement('p');
    next.classList.add('book__pagination_btn');
    next.innerText = '>';
    next.addEventListener('click', () => {
      this.pageNumber = this.pageNumber === this.pages - 1 ? this.pageNumber : this.pageNumber + 1;
      localStorage.setItem('currentBookPage', this.pageNumber.toString());
      this.render();
    });
    pagination.append(next);
    const last = document.createElement('p');
    last.classList.add('book__pagination_btn');
    last.innerText = '>>';
    last.addEventListener('click', () => {
      this.pageNumber = this.pages - 1;
      localStorage.setItem('currentBookPage', this.pageNumber.toString());
      this.render();
    });
    pagination.append(last);
    return pagination;
  }

  renderAnonymousWords(container: HTMLDivElement) {
    this.isDifficultWords = false;
    book
      .getWordsOnPage(this.currentChapter, this.pageNumber)
      .then((content) => {
        container.innerHTML = '';
        for (let i = 0; i < content.length; i += 1) {
          this.renderWord(content[i]);
        }
      })
      .catch((e) => console.error(e));
  }

  renderAuthorizedWords(container: HTMLDivElement) {
    this.isDifficultWords = false;
    book
      .getAllUserWords()
      .then((userWords) => {
        this.userWords = userWords;
        book
          .getWordsOnPage(this.currentChapter, this.pageNumber)
          .then((content) => {
            container.innerHTML = '';
            for (let i = 0; i < content.length; i += 1) {
              const wordId = (content[i].id || content[i]._id) as string;
              let difficulty = 'normal';
              for (let j = 0; j < (this.userWords as UserWords).length; j += 1) {
                if ((this.userWords as UserWords)[j].wordId === wordId) {
                  difficulty = (this.userWords as UserWords)[j].difficulty;
                }
              }
              this.renderWord(content[i], difficulty);
            }
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  renderDifficultWords(container: HTMLDivElement) {
    this.isDifficultWords = true;
    book
      .getFilteredWords('hard')
      .then((content) => {
        container.innerHTML = '';
        if (content.length === 0) {
          this.renderEmptyPage(container);
          return;
        } else {
          for (let i = 0; i < content.length; i += 1) {
            this.renderWord(content[i]);
          }
        }
      })
      .catch((e) => console.error(e));
  }

  renderEmptyPage(container: HTMLDivElement) {
    const text = document.createElement('p');
    text.innerText = 'Нет слов, соответствующих запросу';
    container.append(text);
  }

  renderLearnedWords(container: HTMLDivElement) {
    this.isDifficultWords = true;
    book
      .getFilteredWords('learned')
      .then((content) => {
        container.innerHTML = '';
        for (let i = 0; i < content.length; i += 1) {
          this.renderWord(content[i]);
        }
      })
      .catch((e) => console.error(e));
  }

  renderWords() {
    const container = document.querySelector('.book__words') as HTMLDivElement;
    if (!this.isAuthorized) {
      this.renderAnonymousWords(container);
    } else if (this.isAuthorized && this.currentChapter < this.chapters) {
      this.renderAuthorizedWords(container);
    } else if (this.isAuthorized && this.currentChapter === this.chapters) {
      this.renderDifficultWords(container);
    } else {
      this.renderLearnedWords(container);
    }
  }

  renderWord(wordContent: Word, wordDifficulty = 'normal') {
    const word = document.createElement('div');
    word.classList.add('word', wordDifficulty);
    word.dataset.wordId = (wordContent.id || wordContent._id) as string;

    const image = document.createElement('img');
    image.classList.add('word__image');
    image.src = `https://${book.backendDeploy}.herokuapp.com/${wordContent.image}`;
    image.alt = wordContent.wordTranslate;
    word.append(image);

    const textContainer = document.createElement('div');
    textContainer.classList.add('word__container');

    const wordTranscription = document.createElement('p');
    wordTranscription.classList.add('word__transcription');
    wordTranscription.innerText = `${wordContent.word} - ${wordContent.transcription}`;

    const sound = document.createElement('div');
    sound.classList.add('word__sound');
    sound.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path></svg>`;
    sound.addEventListener('click', () => {
      const sound1 = new Audio();
      sound1.src = `https://${book.backendDeploy}.herokuapp.com/${wordContent.audio}`;

      const sound2 = new Audio();
      sound2.src = `https://${book.backendDeploy}.herokuapp.com/${wordContent.audioMeaning}`;

      const sound3 = new Audio();
      sound3.src = `https://${book.backendDeploy}.herokuapp.com/${wordContent.audioExample}`;

      sound1.addEventListener('ended', () => {
        sound2.play().catch((e) => console.error(e));
      });

      sound2.addEventListener('ended', () => {
        sound3.play().catch((e) => console.error(e));
      });

      sound1.play().catch((e) => console.error(e));
    });

    const wordTranslation = document.createElement('p');
    wordTranslation.classList.add('word__transcription', 'rus');
    wordTranslation.innerText = wordContent.wordTranslate;

    const meaningEng = document.createElement('p');
    meaningEng.classList.add('word__text');
    meaningEng.innerHTML = wordContent.textMeaning;

    const meaningRus = document.createElement('p');
    meaningRus.classList.add('word__text', 'rus');
    meaningRus.innerText = wordContent.textMeaningTranslate;

    const example = document.createElement('p');
    example.classList.add('word__text');
    example.innerHTML = wordContent.textExample;

    const exampleRus = document.createElement('p');
    exampleRus.classList.add('word__text', 'rus');
    exampleRus.innerText = wordContent.textExampleTranslate;

    textContainer.append(
      wordTranscription,
      sound,
      wordTranslation,
      meaningEng,
      meaningRus,
      example,
      exampleRus
    );

    if (this.isAuthorized && !this.isDifficultWords && word.classList.contains('normal')) {
      this.addDifAndLearnedBtnsTo(textContainer, word.dataset.wordId);
    } else if (this.isAuthorized && this.isDifficultWords) {
      this.addRemoveFromDifficultBtn(textContainer, word.dataset.wordId);
    }

    word.append(textContainer);

    const wordsContainer = document.querySelector('.book__words');
    wordsContainer?.append(word);
  }

  addDifAndLearnedBtnsTo(container: HTMLDivElement, wordId: string) {
    const addToDifficult = document.createElement('div');
    addToDifficult.classList.add('word__btn', 'difficult');
    addToDifficult.innerText = 'Добавить в сложные';
    addToDifficult.addEventListener('click', () => {
      this.addUserWordToDifficulty('hard', wordId);
    });
    const addToLearned = document.createElement('div');
    addToLearned.classList.add('word__btn', 'learned');
    addToLearned.innerText = 'Добавить в изученные';
    addToLearned.addEventListener('click', () => {
      this.addUserWordToDifficulty('learned', wordId);
    });
    container.append(addToDifficult, addToLearned);
  }

  addUserWordToDifficulty(difficulty: string, wordId: string) {
    let isUserWord = false;
    for (let i = 0; i < (this.userWords as UserWords).length; i += 1) {
      if ((this.userWords as UserWords)[i].wordId === wordId) {
        isUserWord = true;
      }
    }
    if (isUserWord) {
      book
        .changeUserWordDifficulty(wordId, difficulty)
        .then(() => {
          this.render();
        })
        .catch((e) => console.error(e));
    } else {
      book
        .createUserWord(wordId, difficulty)
        .then(() => {
          this.render();
        })
        .catch((e) => console.error(e));
    }
  }

  addRemoveFromDifficultBtn(container: HTMLDivElement, wordId: string) {
    const removeFromDifficultBtn = document.createElement('div');
    removeFromDifficultBtn.classList.add('word__btn', 'remove');
    removeFromDifficultBtn.innerText = 'X';
    removeFromDifficultBtn.addEventListener('click', () => {
      book
        .updateUserWord(wordId, 'normal')
        .then(() => {
          this.render();
        })
        .catch((e) => console.error(e));
    });
    container.prepend(removeFromDifficultBtn);
  }
}

export default BookPage;
