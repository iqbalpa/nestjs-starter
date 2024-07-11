import { SetMetadata } from '@nestjs/common';
import { IS_ADMIN_KEY, IS_USER_KEY } from './constants';

export const IsUser = () => SetMetadata(IS_USER_KEY, true);
export const IsAdmin = () => SetMetadata(IS_ADMIN_KEY, true);
