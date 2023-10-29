import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: "postgres",
        password: "postgres",
        database: 'test',
        //imports de entidades precisarão de atenção
        entities: [
            __dirname + '/../**/*.entity{.ts,.js}',
        ],
        //desativar esta opção em produção!
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];