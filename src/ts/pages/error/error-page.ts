import Page from '../../core/page';

class ErrorPage extends Page {
  render() {
    this.body.innerHTML = '';
    this.renderHeader();

    const container = document.createElement('div');
    container.classList.add('section-container');

    const text = document.createElement('p');
    text.innerText = 'Страница не найдена';
    container.append(text);

    this.body.append(container);
    this.renderFooter();
  }
}

export default ErrorPage;
