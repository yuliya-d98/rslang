import './authorization-page.scss';
import Users from '../../core/api/authorization';

const users = new Users();

class AuthorizationPage {
  body: HTMLBodyElement;

  isRegistration: boolean;

  isAuthorized: boolean;

  isUserOpened: boolean;

  constructor() {
    this.body = document.body as HTMLBodyElement;
    this.isRegistration = true;
    this.isAuthorized = Boolean(localStorage.getItem('token'));
    this.isUserOpened = false;
  }

  tokenOutOfTime() {
    this.logOut();
    this.isRegistration = false;
    this.openModal();
    // await users.getNewUserTokens(localStorage.getItem('userId') as string);
  }

  open() {
    if (this.isAuthorized && !this.isUserOpened) {
      this.showUser();
    } else if (this.isAuthorized && this.isUserOpened) {
      this.closeUser();
    } else {
      this.openModal();
    }
  }

  showUser() {
    const container = document.createElement('div');
    container.classList.add('user');

    const text = document.createElement('p');
    text.classList.add('user__name');
    text.innerText = 'Твой юзернейм:';
    container.append(text);

    const username = document.createElement('p');
    username.classList.add('user__name');
    username.innerText = localStorage.getItem('name') || 'no username';
    container.append(username);

    const logout = document.createElement('div');
    logout.classList.add('user__logout');
    logout.innerText = 'Выйти';
    logout.addEventListener('click', () => {
      this.logOut();
      this.closeUser();
    });
    container.append(logout);

    const header = document.querySelectorAll('.container')[0];
    header?.append(container);
    this.isUserOpened = true;
  }

  logOut() {
    localStorage.removeItem('name');
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }

  closeUser() {
    const user = document.querySelector('.user');
    user?.remove();
    this.isUserOpened = false;
  }

  openModal() {
    const background = document.createElement('div');
    background.classList.add('authorization__background');
    background.addEventListener('click', () => {
      this.closeModal();
    });
    this.body.append(background);

    const container = document.createElement('div');
    container.classList.add('authorization__container');

    const closeButton = document.createElement('div');
    closeButton.classList.add('authorization__close-btn');
    closeButton.innerText = 'X';
    closeButton.addEventListener('click', () => {
      this.closeModal();
    });
    container.append(closeButton);

    const registration = document.createElement('input');
    registration.classList.add('authorization__radio');
    registration.type = 'radio';
    registration.checked = this.isRegistration;
    registration.id = 'registration';
    registration.name = 'authorization';
    registration.addEventListener('change', () => {
      this.openForm();
    });
    container.append(registration);
    const registrationLabel = document.createElement('label');
    registrationLabel.classList.add('authorization__label');
    registrationLabel.htmlFor = 'registration';
    registrationLabel.innerText = 'Регистрация';
    container.append(registrationLabel);

    const signIn = document.createElement('input');
    signIn.classList.add('authorization__radio');
    signIn.type = 'radio';
    signIn.checked = !this.isRegistration;
    signIn.id = 'sign-in';
    signIn.name = 'authorization';
    signIn.addEventListener('change', () => {
      this.openForm();
    });
    container.append(signIn);
    const signInLabel = document.createElement('label');
    signInLabel.classList.add('authorization__label');
    signInLabel.htmlFor = 'sign-in';
    signInLabel.innerText = 'Войти';
    container.append(signInLabel);

    const form = document.createElement('form');
    form.classList.add('authorization__forms');
    container.append(form);

    this.body.append(container);

    this.openForm();
  }

  openForm() {
    const form = document.querySelector('.authorization__forms') as HTMLDivElement;
    form.innerHTML = '';

    const registr = document.querySelectorAll('.authorization__radio')[0] as HTMLInputElement;
    this.isRegistration = registr.checked;
    if (this.isRegistration) {
      this.openRegistration();
    } else {
      this.openSignIn();
    }
  }

  openRegistration() {
    const container = document.querySelector('.authorization__forms') as HTMLDivElement;

    // create name input
    const nameLabel = document.createElement('label');
    nameLabel.classList.add('authorization__forms_label');
    nameLabel.htmlFor = 'name';
    nameLabel.innerText = 'Имя пользователя';
    container.append(nameLabel);
    const nameInput = document.createElement('input');
    nameInput.classList.add('authorization__forms_input');
    nameInput.type = 'text';
    nameInput.placeholder = 'username';
    nameInput.required = true;
    container.append(nameInput);

    // create mail input
    const mailLabel = document.createElement('label');
    mailLabel.classList.add('authorization__forms_label');
    mailLabel.htmlFor = 'mail';
    mailLabel.innerText = 'Адрес электронной почты';
    container.append(mailLabel);
    const mailInput = document.createElement('input');
    mailInput.classList.add('authorization__forms_input');
    mailInput.type = 'email';
    mailInput.placeholder = 'example@gmail.com';
    mailInput.required = true;
    mailInput.autocomplete = 'email';
    container.append(mailInput);

    // create password input
    const passwordLabel = document.createElement('label');
    passwordLabel.classList.add('authorization__forms_label');
    passwordLabel.htmlFor = 'password';
    passwordLabel.innerText = 'Пароль';
    container.append(passwordLabel);
    const passwordInput = document.createElement('input');
    passwordInput.classList.add('authorization__forms_input');
    passwordInput.type = 'password';
    passwordInput.minLength = 8;
    passwordInput.placeholder = '********';
    passwordInput.required = true;
    passwordInput.autocomplete = 'new-password';
    container.append(passwordInput);

    const submit = document.createElement('button');
    submit.classList.add('authorization__forms_submit-btn');
    submit.type = 'submit';
    submit.innerText = 'Зарегистрироваться';
    submit.addEventListener('click', (e) => {
      e.preventDefault();
      if (nameInput.validity.valid && mailInput.validity.valid && passwordInput.validity.valid) {
        users
          .createNewUser({
            name: nameInput.value,
            email: mailInput.value,
            password: passwordInput.value,
          })
          .then((content) => {
            localStorage.setItem('name', content.name);
            localStorage.setItem('userId', content.id);
            return content;
          })
          .then(() => {
            users
              .signIn({
                email: mailInput.value,
                password: passwordInput.value,
              })
              .then((responce) => {
                localStorage.setItem('token', responce.token);
                localStorage.setItem('refreshToken', responce.refreshToken);
                this.closeModal();
                this.isAuthorized = true;
              })
              .catch((error) => console.error(error));
          })
          .catch((error) => console.error(error));
      }
    });
    container.append(submit);

    return container;
  }

  openSignIn() {
    const container = document.querySelector('.authorization__forms') as HTMLDivElement;

    // create mail input
    const mailLabel = document.createElement('label');
    mailLabel.classList.add('authorization__forms_label');
    mailLabel.htmlFor = 'mail';
    mailLabel.innerText = 'Адрес электронной почты';
    container.append(mailLabel);
    const mailInput = document.createElement('input');
    mailInput.classList.add('authorization__forms_input');
    mailInput.type = 'email';
    mailInput.placeholder = 'example@gmail.com';
    mailInput.required = true;
    mailInput.autocomplete = 'email';
    container.append(mailInput);

    // create password input
    const passwordLabel = document.createElement('label');
    passwordLabel.classList.add('authorization__forms_label');
    passwordLabel.htmlFor = 'password';
    passwordLabel.innerText = 'Пароль';
    container.append(passwordLabel);
    const passwordInput = document.createElement('input');
    passwordInput.classList.add('authorization__forms_input');
    passwordInput.type = 'password';
    passwordInput.minLength = 8;
    passwordInput.placeholder = '********';
    passwordInput.required = true;
    passwordInput.autocomplete = 'current-password';
    container.append(passwordInput);

    const submit = document.createElement('button');
    submit.classList.add('authorization__forms_submit-btn');
    submit.type = 'submit';
    submit.innerText = 'Войти';
    submit.addEventListener('click', (e) => {
      e.preventDefault();
      users
        .signIn({
          email: mailInput.value,
          password: passwordInput.value,
        })
        .then((responce) => {
          localStorage.setItem('name', responce.name);
          localStorage.setItem('userId', responce.userId);
          users
            .getNewUserTokens(responce.userId)
            .then((content) => {
              localStorage.setItem('token', content.token);
              localStorage.setItem('refreshToken', content.refreshToken);
            })
            .then(() => {
              this.closeModal();
            })
            .catch((error) => console.error(error));
        })
        .catch((error) => console.error(error));
    });
    container.append(submit);

    return container;
  }

  closeModal() {
    const background = document.querySelector('.authorization__background');
    const form = document.querySelector('.authorization__container');
    background?.remove();
    form?.remove();
  }
}

export default AuthorizationPage;
