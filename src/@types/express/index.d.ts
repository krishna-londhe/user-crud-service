import { CurrentUser } from '../../domain.types/miscellaneous/current.user';

declare global {
    namespace Express {
        interface Request {
            currentUser?: CurrentUser;
        }
    }
}

export {};
