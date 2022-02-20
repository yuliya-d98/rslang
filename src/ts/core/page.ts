import './page.scss';
import { PageIds } from '../app';
import AuthorizationPage from '../pages/main/autorization-page';

const authorisationPage = new AuthorizationPage();

export const authors = [
  {
    name: 'Никита',
    fullName: 'Комякевич Никита',
    photo: '../../../assets/user-mal.png',
    position: 'developer',
    made: 'Спринт, прогресс изучения, статистика',
    shortlink: 'nikitsch',
  },
  {
    name: 'Юля',
    fullName: 'Дубовик Юлия',
    photo: '../../../assets/user-fem.png',
    position: 'developer',
    made: 'Главная страница, авторизация, учебник',
    shortlink: 'yuliya-d98',
  },
  // {
  //   name: 'Алексей',
  //   fullName: 'Жарский Алексей',
  //   photo: '../../../assets/user-mal.png',
  //   position: 'developer',
  //   made: 'Список слов, аудиовызов, адаптивность',
  //   shortlink: 'aleks1012',
  // },
];

class Page {
  body: HTMLBodyElement;

  isAuthorized: boolean;

  constructor() {
    this.body = document.body as HTMLBodyElement;
    this.isAuthorized = Boolean(localStorage.getItem('token'));
  }

  renderHeader() {
    const header = document.createElement('header');
    header.classList.add('header');

    const container = document.createElement('div');
    container.classList.add('container');

    const headerLinks = document.createElement('div');
    headerLinks.classList.add('header__links');

    const mainLink = document.createElement('a');
    mainLink.classList.add('header__links-link');
    mainLink.innerText = 'Главная';
    mainLink.href = `#${PageIds.mainPageHash}`;
    headerLinks.append(mainLink);

    const bookLink = document.createElement('a');
    bookLink.classList.add('header__links-link');
    bookLink.innerText = 'Учебник';
    bookLink.href = `#${PageIds.bookPageHash}`;
    headerLinks.append(bookLink);

    const audiocallLink = document.createElement('a');
    audiocallLink.classList.add('header__links-link');
    audiocallLink.innerText = 'Аудиовызов';
    audiocallLink.href = `#${PageIds.audiocallPageHash}`;
    headerLinks.append(audiocallLink);

    const sprintLink = document.createElement('a');
    sprintLink.classList.add('header__links-link');
    sprintLink.innerText = 'Спринт';
    sprintLink.href = `#${PageIds.sprintPageHash}`;
    headerLinks.append(sprintLink);

    const statisticsLink = document.createElement('a');
    statisticsLink.classList.add('header__links-link');
    statisticsLink.innerText = 'Статистика';
    statisticsLink.href = `#${PageIds.statisticsPageHash}`;
    headerLinks.append(statisticsLink);

    container.append(headerLinks);

    const headerAutorization = document.createElement('div');
    headerAutorization.classList.add('header__autorization');
    headerAutorization.addEventListener('click', () => {
      authorisationPage.open();
    });
    headerAutorization.innerHTML =
      '<svg focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"></path></svg>';
    container.append(headerAutorization);

    header.append(container);

    this.body.append(header);
  }

  renderFooter() {
    const footer = document.createElement('footer');
    footer.classList.add('footer');

    const container = document.createElement('div');
    container.classList.add('container');

    const footerAuthors = document.createElement('div');
    footerAuthors.classList.add('footer__authors');
    for (let i = 0; i < authors.length; i += 1) {
      const author = document.createElement('a');
      author.classList.add('footer__authors-author');
      author.innerText = authors[i].fullName;
      author.href = `https://github.com/${authors[i].shortlink}`;
      footerAuthors.append(author);
    }
    container.append(footerAuthors);

    const footerYear = document.createElement('p');
    footerYear.classList.add('footer__text');
    footerYear.innerText = '2022';
    container.append(footerYear);

    const schoolLogo = document.createElement('a');
    schoolLogo.classList.add('footer__logo');
    schoolLogo.href = 'https://rs.school/';
    container.append(schoolLogo);

    footer.append(container);

    this.body.append(footer);
  }
}

export default Page;
