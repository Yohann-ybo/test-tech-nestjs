export class User {
  email!: string;
  password!: string;
  name!: string;

  constructor(email: string, password: string, name: string) {
    this.email = email;
    this.password = password;
    this.name = name;
  }
}

export class LoginPayload {
  email!: string;
  password!: string;
  name!: string;
}

export class LoginResponse {
  access_token!: string;

  user!: User;

  constructor(access_token: string, user: User) {
    this.access_token = access_token;
    this.user = user;
  }
}
