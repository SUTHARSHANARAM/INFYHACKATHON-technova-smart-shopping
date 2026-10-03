import app from './app';
import { env } from './config/env';
import { prisma } from './config/prisma';

const server = app.listen(env.PORT, () => {
  console.log(`🚀 TechNova Backend API running on port ${env.PORT} [${env.NODE_ENV}]`);
  console.log(`📡 Customer Client URL: ${env.CLIENT_URL}`);
  console.log(`📡 Admin Client URL: ${env.ADMIN_CLIENT_URL}`);
});

const gracefulShutdown = async (signal: string) => {
  console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    console.log('🔒 HTTP server closed.');
    await prisma.$disconnect();
    console.log('💾 Database connection closed.');
    process.exit(0);
  });
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

process.on('unhandledRejection', (reason: any) => {
  console.error('💥 Unhandled Rejection:', reason);
});
