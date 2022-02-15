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
    if (!rawResponse.ok) {
      throw new Error(rawResponse.statusText);
    }
    const content = (await rawResponse.json()) as CreateUserResponce;
    return content;
  }

  async getUser(userId: string) {
    const rawResponse = await fetch(`https://${this.backendDeploy}.herokuapp.com/users/${userId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
    if (!rawResponse.ok) {
      throw new Error(rawResponse.statusText);
    }
    const content = (await rawResponse.json()) as User;

    console.log(content);
  }

  async updateUser(userId: string, user: LoginUser) {
    const rawResponse = await fetch(`https://${this.backendDeploy}.herokuapp.com/users/${userId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    if (!rawResponse.ok) {
      throw new Error(rawResponse.statusText);
    }
    const content = (await rawResponse.json()) as User;

    console.log(content);
  }

  async deleteUser(userId: string) {
    const rawResponse = await fetch(`https://${this.backendDeploy}.herokuapp.com/users/${userId}`, {
      method: 'DELETE',
    });
    if (!rawResponse.ok) {
      throw new Error(rawResponse.statusText);
    }
    if (rawResponse.ok) return;
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
    if (!rawResponse.ok) {
      throw new Error(rawResponse.statusText);
    }
    const content = (await rawResponse.json()) as LoginUserResponce;

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
    if (!rawResponse.ok) {
      throw new Error(rawResponse.statusText);
    }
    const content = (await rawResponse.json()) as LoginUserResponce;

    return content;
  }
}

export default Users;
