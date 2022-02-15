import Page from '../../core/page';

class BookPage extends Page {
  currentChapter: number;

  chapters: number;

  pages: number;

  pageNumber: number;

  constructor() {
    super();
    this.currentChapter = 1;
    this.chapters = Boolean(localStorage.getItem('token')) ? 7 : 6;
    this.pages = 30;
    this.pageNumber = 1;
  }

  render() {
    this.body.innerHTML = '';
    this.renderHeader();
    const book = document.createElement('section');
    book.classList.add('book');

    const container = document.createElement('div');
    container.classList.add('section-container');

    const chapters = document.createElement('div');
    chapters.classList.add('book__chapters');
    for (let i = 1; i <= this.chapters; i += 1) {
      const chapter = document.createElement('p');
      chapter.classList.add('book__chapters_chapter');
      if (this.currentChapter === i) {
        chapter.classList.add('showing');
      }
      chapter.innerText = i.toString();
      chapter.dataset.chapter = i.toString();
      chapters.append(chapter);
    }
    chapters.addEventListener('click', (event) => {
      if ((event.currentTarget as HTMLParagraphElement).closest('.book__chapters_chapter')) {
        const target = (event.currentTarget as HTMLParagraphElement).closest(
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
      this.pageNumber = this.pageNumber === 1 ? 1 : this.pageNumber - 1;
      this.render();
    });
    pagination.append(prev);
    const current = document.createElement('p');
    current.classList.add('book__pagination_btn');
    current.innerText = this.pageNumber.toString();
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
    this.renderWords();
    container.append(words);

    book.append(container);
    this.body.append(book);
    this.renderFooter();
  }

  renderWords() {
    console.log('words');
  }
}

export default BookPage;
