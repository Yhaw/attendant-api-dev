export interface IDatabaseConfigAttributes {
  username?: string;
  password?: string;
  database?: string;
  host?: string;
  port?: number | string;
  dialect?: string;
  urlDatabase?: string;
  ssl?: boolean;
  dialectOptions?: {
    ssl?: {
      require?: boolean;
      rejectUnauthorized?: boolean;
    };
  };
  autoLoadModels: boolean;
  synchronize: boolean;
  models?: any[];
}

export interface IDatabaseConfig {
  development: IDatabaseConfigAttributes;
  test: IDatabaseConfigAttributes;
  production: IDatabaseConfigAttributes;
}
