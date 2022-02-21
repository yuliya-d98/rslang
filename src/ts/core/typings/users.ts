export type User = {
  name: string;
  email: string;
  password: string;
};

export type CreateUserResponce = {
  id: string;
  name: string;
  email: string;
};

export type LoginUser = {
  email: string;
  password: string;
};

export type LoginUserResponce = {
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
};
