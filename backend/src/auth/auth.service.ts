import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginPayload, LoginResponse, User } from './entities/login.interface';

const valid_email = 'toto@kresus.eu';
const valid_password = 'test';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  async validateUser({ email, password }: LoginPayload): Promise<User | null> {
    try {
      if (email !== valid_email || password !== valid_password) return null;
      return new User(email, password);
    } catch (e) {
      console.error(
        `An error occured during an user authentication (email: ${email})`
      );
      throw e;
    }
  }

  login(user: User): LoginResponse {
    const payload = { email: user.email };
    return new LoginResponse(this.jwtService.sign(payload), user);
  }
}
