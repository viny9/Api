import dotenv from 'dotenv'
dotenv.config() // Para que as variáveis de ambiente sejam visíveis nesse arquivo

const config = {
  client: 'mysql',
  connection: {
    host: process.env.HOST || '',
    port: process.env.DB_PORT,
    user: process.env.USER || '',
    password: process.env.PASSWORD,
    database: process.env.DATABASE
  },
  migrations: {
    directory: './src/migrations',
  }
}

export = config 