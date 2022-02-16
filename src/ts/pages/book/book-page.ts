import './book-page.scss';
import Book from '../../core/api/book';
import Page from '../../core/page';
import { Word } from '../../core/typings/book';

const book = new Book();

class BookPage extends Page {
  currentChapter: number;

  chapters: number;

  pages: number;

  pageNumber: number;

  constructor() {
    super();
    this.currentChapter = 0;
    this.chapters = Boolean(localStorage.getItem('token')) ? 7 : 6;
    this.pages = 30;
    this.pageNumber = 0;
  }

  render() {
    this.body.innerHTML = '';
    this.renderHeader();
    const bookSection = document.createElement('section');
    bookSection.classList.add('book');

    const container = document.createElement('div');
    container.classList.add('section-container');

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
    chapters.addEventListener('click', (event) => {
      if ((event.target as HTMLParagraphElement).closest('.book__chapters_chapter')) {
        const target = (event.target as HTMLParagraphElement).closest(
          '.book__chapters_chapter'
        ) as HTMLParagraphElement;
        if (!target.classList.contains('showing')) {
          this.currentChapter = +(target.dataset.chapter as string);
          this.render();
        }
      }
    });
    container.append(chapters);

    const pagination = document.createElement('div');
    pagination.classList.add('book__pagination');
    const prev = document.createElement('p');
    prev.classList.add('book__pagination_btn');
    prev.innerText = '<<';
    prev.addEventListener('click', () => {
      this.pageNumber = this.pageNumber === 0 ? 0 : this.pageNumber - 1;
      this.render();
    });
    pagination.append(prev);
    const current = document.createElement('p');
    current.classList.add('book__pagination_btn');
    current.innerText = (this.pageNumber + 1).toString();
    pagination.append(current);
    const next = document.createElement('p');
    next.classList.add('book__pagination_btn');
    next.innerText = '>>';
    next.addEventListener('click', () => {
      this.pageNumber = this.pageNumber === this.pages ? this.pageNumber : this.pageNumber + 1;
      this.render();
    });
    pagination.append(next);
    container.append(pagination);

    const words = document.createElement('div');
    words.classList.add('book__words');
    container.append(words);

    bookSection.append(container);
    this.body.append(bookSection);
    this.renderWords();
    this.renderFooter();
  }

  renderWords() {
    const container = document.querySelector('.book__words') as HTMLDivElement;
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

  renderWord(wordContent: Word) {
    const word = document.createElement('div');
    word.classList.add('word');
    word.dataset.wordId = wordContent.id;

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
    textContainer.append(wordTranscription);

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
    textContainer.append(sound);

    const wordTranslation = document.createElement('p');
    wordTranslation.classList.add('word__transcription', 'rus');
    wordTranslation.innerText = wordContent.wordTranslate;
    textContainer.append(wordTranslation);

    const meaningEng = document.createElement('p');
    meaningEng.classList.add('word__text');
    meaningEng.innerHTML = wordContent.textMeaning;
    textContainer.append(meaningEng);

    const meaningRus = document.createElement('p');
    meaningRus.classList.add('word__text', 'rus');
    meaningRus.innerText = wordContent.textMeaningTranslate;
    textContainer.append(meaningRus);

    const example = document.createElement('p');
    example.classList.add('word__text');
    example.innerHTML = wordContent.textExample;
    textContainer.append(example);

    const exampleRus = document.createElement('p');
    exampleRus.classList.add('word__text', 'rus');
    exampleRus.innerText = wordContent.textExampleTranslate;
    textContainer.append(exampleRus);

    word.append(textContainer);

    const wordsContainer = document.querySelector('.book__words');
    wordsContainer?.append(word);
  }
}

export default BookPage;
