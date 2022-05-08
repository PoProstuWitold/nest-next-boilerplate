import { DynamicModule, Provider } from "@nestjs/common";
import { getDataSourceToken } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { TYPEORM_EX_CUSTOM_REPOSITORY } from "./typeorm-ex.decorator";

export class TypeOrmExModule {
    public static forCustomRepository<T extends new (...args: any[]) => any>(repositories: T[]): DynamicModule {
        const providers: Provider[] = [];

        for (const repository of repositories) {
        const entity = Reflect.getMetadata(TYPEORM_EX_CUSTOM_REPOSITORY, repository);

        if (!entity) {
            continue;
        }

        providers.push({
            inject: [getDataSourceToken()],
                provide: repository,
                useFactory: (dataSource: DataSource): typeof repository => {
                    const baseRepository = dataSource.getRepository<any>(entity);
                    return new repository(baseRepository.target, baseRepository.manager, baseRepository.queryRunner);
                }
            })
        }

        return {
            exports: providers,
            module: TypeOrmExModule,
            providers,
        }
    }
}