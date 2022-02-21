import Page from '../../core/page';

class ErrorPage extends Page {
  render() {
    this.body.innerHTML = '';
    this.renderHeader();

    const background = document.createElement('div');
    background.classList.add('background');

    const container = document.createElement('div');
    container.classList.add('section-container');

    const text = document.createElement('p');
    text.innerText = 'Страница не найдена';
    container.append(text);

    background.append(container);
    this.body.append(background);
    this.renderFooter();
  }
}

export default ErrorPage;
