import i18next from 'i18next';
import * as localesConfig from '../../locales';
import path from 'path';

let i18nInstance = null;

export const fallbackLanguage = 'cs';

const commonOptions = {
  fallbackLng: fallbackLanguage,
  load: 'languageOnly',
  ns: localesConfig.namespaces,
  defaultNS: localesConfig.namespaces[0],
  whitelist: localesConfig.languages,
  interpolation: {
    escapeValue: false,
    formatSeparator: ',',
    format: (value, format) =>
      format === 'uppercase' ? value.toUpperCase() : value
  },
  react: {
    wait: true
  }
};

const initPromise = (i18n, options) =>
  new Promise((resolve, reject) => {
    i18n.init(options, err => {
      if (err) reject(err);
      else resolve(i18n);
    });
  });

export const initBrowser = (options = {}) => {
  if (!i18nInstance) {
    let lang;
    let langInCookie = false;

    const browserCookies = require('browser-cookies');
    const langCookie = browserCookies.get('lang');

    if (langCookie) {
      lang = langCookie;
      langInCookie = true;
    }

    if (!lang && navigator.language) lang = navigator.language;
    if (!lang) lang = fallbackLanguage;

    i18nInstance = i18next.createInstance();
    i18nInstance.use(require('i18next-xhr-backend'));
    i18nInstance.init({
      lng: lang,
      ...commonOptions,
      ...options
    });

    i18nInstance.on('languageChanged', lng => {
      browserCookies.set('lang', lng);
    });

    if (!langInCookie) {
      browserCookies.set('lang', lang);
    }
  }
  return i18nInstance;
};

export default async (options = {}) => {
  if (!i18nInstance) {
    i18nInstance = i18next.createInstance();
    const fsBackend = await import('i18next-node-fs-backend');

    i18nInstance.use(fsBackend);
    const localesPath = path.join(
      __dirname,
      '../../locales/{{lng}}/{{ns}}.json'
    );
    i18nInstance = await initPromise(i18nInstance, {
      ...commonOptions,
      initImmediate: false,
      preload: commonOptions.whitelist,
      backend: {
        loadPath: localesPath
      },
      ...options
    });
  }

  return i18nInstance;
};
