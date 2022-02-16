import { Words } from '../typings/book';
import Api from './api';

class Book extends Api {
  async getWordsOnPage(group: number, page: number) {
    const rawResponse = await fetch(
      `https://${
        this.backendDeploy
      }.herokuapp.com/words?page=${page.toString()}&group=${group.toString()}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      }
    );
    if (!rawResponse.ok) {
      throw new Error(rawResponse.statusText);
    }
    const content = (await rawResponse.json()) as Words;
    return content;
  }
}

export default Book;
