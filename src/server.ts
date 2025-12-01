import app from './app';
import config from './config';
import { Logger } from './utils/logger';

const PORT = config.port;

const server = app.listen(PORT, () => {
  Logger.success(`🚀 Server is running on port ${PORT}`);
  Logger.info(`📝 Environment: ${config.nodeEnv}`);
  Logger.info(`🌐 CORS Origin: ${config.corsOrigin}`);
  Logger.info(`\n✨ Server ready to accept requests!\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  Logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    Logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  Logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    Logger.info('HTTP server closed');
    process.exit(0);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: Error) => {
  Logger.error('Unhandled Rejection:', reason);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  Logger.error('Uncaught Exception:', error);
  server.close(() => {
    process.exit(1);
  });
});

export default server;
