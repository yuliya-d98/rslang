import MainPage from './pages/main/main-page';
import BookPage from './pages/book/book-page';
import AudiocallPage from './pages/audiocall/audiocall-page';
import SprintPage from './pages/sprint/sprint-page';
import StatisticsPage from './pages/statistics/statistics-page';
import ErrorPage from './pages/error/error-page';

export const enum PageIds {
  mainPageHash = 'main-page',
  bookPageHash = 'book-page',
  audiocallPageHash = 'audiocall-page',
  sprintPageHash = 'sprint-page',
  statisticsPageHash = 'statistics-page',
}

class App {
  run() {
    this.renderNewPage(PageIds.mainPageHash);
    this.enableRouteChange();
  }

  private enableRouteChange() {
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.slice(1);
      this.renderNewPage(hash);
    });
  }

  renderNewPage(idPage: string) {
    let currentPage:
      | MainPage
      | BookPage
      | AudiocallPage
      | SprintPage
      | StatisticsPage
      | ErrorPage
      | null = null;

    switch (idPage) {
      case PageIds.mainPageHash:
        currentPage = new MainPage();
        break;
      case PageIds.bookPageHash:
        currentPage = new BookPage();
        break;
      case PageIds.audiocallPageHash:
        currentPage = new AudiocallPage();
        break;
      case PageIds.sprintPageHash:
        currentPage = new AudiocallPage();
        break;
      case PageIds.statisticsPageHash:
        currentPage = new StatisticsPage();
        break;
      default:
        currentPage = new ErrorPage();
        break;
    }

    currentPage.render();
  }
}

export default App;
