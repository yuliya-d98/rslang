import AuthorizationPage from '../../pages/main/autorization-page';
import { DifWord, Words, FilteredResponce, UserWords } from '../typings/book';
import Api from './api';
import Users from './authorization';

const users = new Users();
const authorization = new AuthorizationPage();

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
    const content = (await rawResponse.json()) as Words;
    return content;
  }

  async changeUserWordDifficulty(wordId: string, difficulty: string, optional = {}) {
    const userId = localStorage.getItem('userId') as string;
    const rawResponse = await fetch(
      `https://${this.backendDeploy}.herokuapp.com/users/${userId}/words/${wordId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') as string}`,
          Accept: 'application/json',
        },
      }
    );

    if (rawResponse.status === 401) {
      authorization.tokenOutOfTime();
    } else if (rawResponse.status === 404) {
      this.createUserWord(wordId, difficulty, optional).catch((e) => console.error(e));
    } else {
      const content = (await rawResponse.json()) as DifWord;
      this.updateUserWord(wordId, difficulty, content.optional).catch((e) => console.error(e));
    }
  }

  async getWordDifficulty(wordId: string) {
    let difficulty = 'normal';
    const userId = localStorage.getItem('userId') as string;
    const rawResponse = await fetch(
      `https://${this.backendDeploy}.herokuapp.com/users/${userId}/words/${wordId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') as string}`,
          Accept: 'application/json',
        },
      }
    );
    if (rawResponse.status === 401) {
      users
        .getNewUserTokens(userId)
        .then(() => {
          this.getWordDifficulty(wordId).catch((e) => console.error(e));
        })
        .catch((e) => console.error(e));
    } else if (rawResponse.status === 404) {
      difficulty = 'normal';
    } else {
      const content = (await rawResponse.json()) as DifWord;
      if (!content.difficulty || content.difficulty === 'normal') {
        difficulty = 'normal';
      } else if (content.difficulty === 'hard') {
        difficulty = 'hard';
      } else if (content.difficulty === 'learned') {
        difficulty = 'learned';
      }
    }
    return difficulty;
  }

  async createUserWord(wordId: string, difficulty: string, optional = {}) {
    const rawResponse = await fetch(
      `https://${this.backendDeploy}.herokuapp.com/users/${
        localStorage.getItem('userId') as string
      }/words/${wordId}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') as string}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          difficulty: difficulty,
          optional: optional,
        }),
      }
    );
    const content = (await rawResponse.json()) as DifWord;
    return content;
  }

  async updateUserWord(wordId: string, difficulty: string, optional = {}) {
    const rawResponse = await fetch(
      `https://${this.backendDeploy}.herokuapp.com/users/${
        localStorage.getItem('userId') as string
      }/words/${wordId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') as string}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          difficulty: difficulty,
          optional: optional,
        }),
      }
    );
    const content = (await rawResponse.json()) as DifWord;
    return content;
  }

  async getAllUserWords() {
    const rawResponse = await fetch(
      `https://${this.backendDeploy}.herokuapp.com/users/${
        localStorage.getItem('userId') as string
      }/words`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') as string}`,
          Accept: 'application/json',
        },
      }
    );
    if (rawResponse.status === 402) {
      authorization.tokenOutOfTime();
    }
    const content = (await rawResponse.json()) as UserWords;
    return content;
  }

  async getFilteredWords(difficulty: string) {
    let content: Words = [];
    const rawResponse = await fetch(
      `https://${this.backendDeploy}.herokuapp.com/users/${
        localStorage.getItem('userId') as string
      }/aggregatedWords?filter=%7B%22userWord.difficulty%22%3A%22${difficulty}%22%7D`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') as string}`,
          Accept: 'application/json',
        },
      }
    );

    if (rawResponse.status === 401) {
      authorization.tokenOutOfTime();
    } else {
      content = ((await rawResponse.json()) as FilteredResponce)[0].paginatedResults;
    }
    return content;
  }
}

export default Book;
