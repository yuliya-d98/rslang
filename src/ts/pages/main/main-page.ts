import './main-page.scss';
import Page, { authors } from '../../core/page';

const cardsText = [
  {
    header: 'Запоминай',
    text: 'Для лучшего понимания сложных слов отмечай их и повторяй отдельно',
  },
  {
    header: 'Изучай',
    text: 'Библиотека из 4000 часто встречающихся слов. Изучай в своем темпе',
  },
  {
    header: 'Играй',
    text: 'Для лучшего запоминания играй и делись результатами с другими',
  },
  {
    header: 'Анализируй',
    text: 'Подробная статистика твоих достижений, изученных слов и ошибок',
  },
];

class MainPage extends Page {
  render() {
    this.body.innerHTML = '';
    this.renderHeader();
    const background = document.createElement('div');
    background.classList.add('main__background');

    const section = document.createElement('section');
    section.classList.add('section-container');

    const header = document.createElement('h1');
    header.classList.add('main__header');
    header.innerText = 'RS Lang';

    const aboutApp = this.aboutApp();
    const aboutAuthors = this.aboutAuthors();
    section.append(header, aboutApp, aboutAuthors);

    background.append(section);
    this.body.append(background);
    this.aboutApp();
    this.aboutAuthors();
    this.renderFooter();
  }

  aboutApp() {
    const container = document.createElement('div');
    container.classList.add('about-app');

    const header = document.createElement('h2');
    header.classList.add('about-app__header');
    header.innerText = 'Немного о rslang';
    container.append(header);

    for (let i = 0; i < cardsText.length; i += 1) {
      const card = this.createCardAboutApp(cardsText[i].header, cardsText[i].text);
      container.append(card);
    }

    return container;
  }

  createCardAboutApp(headerText: string, text: string) {
    const card = document.createElement('div');
    card.classList.add('about-app__card');

    const header = document.createElement('h3');
    header.classList.add('about-app__card_header');
    header.innerText = headerText;
    card.append(header);

    const describing = document.createElement('p');
    describing.classList.add('about-app__card_text');
    describing.innerText = text;
    card.append(describing);

    return card;
  }

  aboutAuthors() {
    const container = document.createElement('div');
    container.classList.add('about-authors');

    const header = document.createElement('h2');
    header.classList.add('about-authors__header');
    header.innerText = 'И немного о нас';
    container.append(header);

    const cardsContainer = document.createElement('div');
    cardsContainer.classList.add('about-authors__cards');

    for (let i = 0; i < authors.length; i += 1) {
      const card = this.createCardAboutAuthor(authors[i]);
      cardsContainer.append(card);
    }

    container.append(cardsContainer);

    return container;
  }

  createCardAboutAuthor(author: {
    name: string;
    fullName: string;
    photo: string;
    position: string;
    made: string;
    shortlink: string;
  }) {
    const card = document.createElement('a');
    card.classList.add('about-authors__card');
    card.href = `https://github.com/${author.shortlink}`;
    card.target = '_blank';

    const image = document.createElement('img');
    image.classList.add('about-authors__card_image');
    image.src = author.photo;
    card.append(image);

    const name = document.createElement('h3');
    name.classList.add('about-authors__card_name');
    name.innerText = author.name;
    card.append(name);

    const position = document.createElement('p');
    position.classList.add('about-authors__card_position');
    position.innerText = author.position;
    card.append(position);

    const made = document.createElement('p');
    made.classList.add('about-authors__card_made');
    made.innerText = author.made;
    card.append(made);

    return card;
  }
}

export default MainPage;
