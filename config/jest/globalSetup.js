/**
 * Register a unhandledRejection to print sensible error messages
 * as jest does not show any details about unhandledRejections
 */

process.on('unhandledRejection', (error) => {
  console.error('UnhandledRejection', error);
});
