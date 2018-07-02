module.exports = {
  base: 'express-frappe',
  port: 9000,
  serviceWorker: true,
  title: 'Express Frappe 🥤',
  description: 'Express Frappe 🥤 - build express application another way.',
  locales: {
    '/': {
      lang: '🇺🇸 EN', // this will be set as the lang attribute on <html>
      title: 'Express Frappe 🥤',
      description: 'Express Frappe 🥤 - build express application another way.'
    },
    '/es/': {
      lang: '🇪🇸 ES',
      title: 'Express Frappe 🥤',
      description: 'Express Frappe 🥤 - construir la aplicación express de otra manera.'
    }
  }
};
