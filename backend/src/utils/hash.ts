import { UnauthorizedException } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { User } from 'src/users/entities/user.entity';

const hashPassword = (password: string, salt: number = 10) => {
  return hash(password, salt);
};

const comparePassword = async (password: string, user: User) => {
  const verifying = compare(password, user.password);
  if (verifying) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...obj } = user;
    return obj;
  }
  throw new UnauthorizedException('Неверный пароль');
};

export { hashPassword, comparePassword };
