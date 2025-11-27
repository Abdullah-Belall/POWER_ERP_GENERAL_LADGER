import { Request } from 'express';
import { UserTokenInterface } from './user-token.interface';

export interface CustomRequest extends Request {
  user: UserTokenInterface | null;
}
