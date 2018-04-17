import path from 'path';
import next from 'next';
import express from 'express';
import initI18n from '../app/lib/i18n';

const dev = process.env.NODE_ENV !== 'production';
const dir = process.env.AZURE ? '../../' : '.';

const app = next({ dev, dir, distDir: 'build/.next' });
const handler = app.getRequestHandler();

const startServer = ([i18n]) => {
  const server = express();

  server.use(
    '/locales',
    express.static(path.join(process.cwd(), dir, 'locales'))
  );

  server.use('/', (req, res, next) => {
    let lang;
    let langInCookie = false;
    if (req.query.lang) {
      lang = req.query.lang;
    }
    if (!lang && req.headers.cookie) {
      let cookies = req.headers.cookie.split(';').reduce((acc, c) => {
        const newAcc = { ...acc };
        const [key, value] = c.trim().split('=');
        newAcc[key] = value;
        return newAcc;
      }, {});
      if (cookies.lang) {
        lang = cookies.lang;
        langInCookie = true;
      }
    }
    if (!lang) {
      lang = i18n.options.fallbackLng[0];
    }
    if (!langInCookie) {
      let setCookies = [];
      if (res.hasHeader('Set-Cookie')) {
        setCookies = res.getHeaders()['Set-Cookie'];
      }
      res.setHeader('Set-Cookie', [`lang=${lang}`].concat(setCookies));
    }

    req.i18n = i18n.cloneInstance({
      lng: lang
    });
    req.i18n.toJSON = () => null;
    next();
  });

  server.get('*', (req, res) => handler(req, res));

  server.listen(3000, err => {
    if (err) throw err;
    console.log('Ready on http://localhost:3000/');
  });
};

Promise.all([initI18n(), app.prepare()]).then(startServer);
