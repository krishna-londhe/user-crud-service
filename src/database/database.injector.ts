import 'reflect-metadata';
import { DependencyContainer } from 'tsyringe';
import { SequelizeInjector } from './sql/sequelize/sequelize.injector';

////////////////////////////////////////////////////////////////////////////////

export class DatabaseInjector {

    static registerInjections(container: DependencyContainer) {
        SequelizeInjector.registerInjections(container);
    }

}
