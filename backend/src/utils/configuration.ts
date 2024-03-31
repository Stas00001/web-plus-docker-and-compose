export default () => ({
  port: Number(process.env.PORT) || 3000,
  dbHost: process.env.POSTGRES_HOST || 'localhost',
  dbPort: Number(process.env.POSTGRES_PORT) || 5432,
  dbName: process.env.POSTGRES_DB || 'kupipodariday',
  dbUsername: process.env.POSTGRES_USER || 'student',
  dbPassword: process.env.POSTGRES_PASSWORD || 'student',
  jwt_secret: process.env.JWT_SECRET || 'secret_key',
});
