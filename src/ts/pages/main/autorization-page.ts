import './authorization-page.scss';
import Users from '../../core/api/authorization';

const users = new Users();

class AuthorizationPage {
  body: HTMLBodyElement;

  isRegistration: boolean;

  constructor() {
    this.body = document.body as HTMLBodyElement;
    this.isRegistration = true;
  }

  open() {
    const background = document.createElement('div');
    background.classList.add('authorization__background');
    background.addEventListener('click', () => {
      this.close();
    });
    this.body.append(background);

    const container = document.createElement('div');
    container.classList.add('authorization__container');

    const closeButton = document.createElement('div');
    closeButton.classList.add('authorization__close-btn');
    closeButton.innerText = 'X';
    closeButton.addEventListener('click', () => {
      this.close();
    });
    container.append(closeButton);

    const registration = document.createElement('input');
    registration.classList.add('authorization__radio');
    registration.type = 'radio';
    registration.checked = true;
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
    signIn.checked = false;
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

    const registration = document.querySelectorAll('.authorization__radio')[0] as HTMLInputElement;
    if (registration.checked) {
      this.isRegistration = true;
      this.openRegistration();
    } else {
      this.isRegistration = false;
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
            console.log(content);
          })
          .then(() => {
            this.close();
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
    container.append(submit);

    return container;
  }

  close() {
    const background = document.querySelector('.authorization__background');
    const form = document.querySelector('.authorization__container');
    background?.remove();
    form?.remove();
  }
}

export default AuthorizationPage;
