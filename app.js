export default (express, bodyParser, createReadStream, crypto, http) => {
  const app = express();

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET,POST,PUT,PATCH,OPTIONS,DELETE'
    );

    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }

    if (!req.path.endsWith('/')) {
      const query = req.url.includes('?')
        ? req.url.substring(req.url.indexOf('?'))
        : '';
      return res.redirect(301, req.path + '/' + query);
    }

    next();
  });

  app.get('/login/', (req, res) => {
    res.send('maxim_borovskiy');
  });

  app.get('/code/', (req, res) => {
    createReadStream(new URL(import.meta.url)).pipe(res);
  });

  app.get('/sha1/:input/', (req, res) => {
    res.send(
      crypto.createHash('sha1').update(req.params.input).digest('hex')
    );
  });

  const reqHandler = (req, res) => {
    const addr = req.method === 'POST'
      ? req.body.addr
      : req.query.addr;

    if (!addr) return res.send('');

    http.get(addr, response => {
      let data = '';

      response.on('data', chunk => {
        data += chunk;
      });

      response.on('end', () => {
        res.send(data);
      });

    }).on('error', () => {
      res.status(500).send('error');
    });
  };

  app.get('/req/', reqHandler);
  app.post('/req/', reqHandler);

  app.all('*', (req, res) => {
    res.send('maxim_borovskiy');
  });

  return app;
};