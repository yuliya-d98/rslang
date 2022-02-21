import Api from './api';
import { User, CreateUserResponce, LoginUser, LoginUserResponce } from '../typings/users';

class Users extends Api {
  async createNewUser(user: User) {
    const rawResponse = await fetch(`https://${this.backendDeploy}.herokuapp.com/users`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    if (rawResponse.status === 422) {
      alert('Incorrect e-mail or password');
    }
    const content = (await rawResponse.json()) as CreateUserResponce;
    return content;
  }

  async signIn(user: LoginUser) {
    const rawResponse = await fetch(`https://${this.backendDeploy}.herokuapp.com/signin`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    if (rawResponse.status === 403) {
      alert('Incorrect e-mail or password');
    }
    if (rawResponse.status === 404) {
      alert(`Couldn't find a user with this email`);
    }
    const content = (await rawResponse.json()) as LoginUserResponce;
    return content;
  }

  async getNewUserTokens(userId: string) {
    const rawResponse = await fetch(
      `https://${this.backendDeploy}.herokuapp.com/users/${userId}/tokens`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      }
    );
    const content = (await rawResponse.json()) as LoginUserResponce;
    localStorage.setItem('token', content.token);
    localStorage.setItem('refreshToken', content.refreshToken);

    return content;
  }
}

export default Users;
