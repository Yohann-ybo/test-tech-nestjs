export class User {
  email!: string;
  name!: string;
  id!: number;

  constructor(id: number, email: string, name: string) {
    this.email = email;
    this.name = name;
    this.id = id;
  }

  toJSON() {
    return {
      email: this.email,
      name: this.name,
      id: this.id,
    };
  }
}

export class LoginPayload {
  email!: string;
  password!: string;
  name!: string;
  id!: number;
}

export class LoginResponse {
  access_token!: string;

  user!: User;

  constructor(access_token: string, user: User) {
    this.access_token = access_token;
    this.user = user;
  }
}
