import 'reflect-metadata';
import { DependencyContainer } from 'tsyringe';
import { UserRepo } from './repositories/users/user.repo';

////////////////////////////////////////////////////////////////////////////////

export class SequelizeInjector {

    static registerInjections(container: DependencyContainer) {
        container.register('IUserRepo', UserRepo);
    }

}
