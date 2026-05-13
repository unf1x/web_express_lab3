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
    res.setHeader('Access-Control-Allow-Headers', '*');

    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }

    next();
  });

  app.get('/login/', (req, res) => {
    res.send('maxim_borovskiy');
  });

  app.get('/code/', (req, res) => {
    createReadStream(new URL(import.meta.url).pathname).pipe(res);
  });

  app.get('/sha1/:input/', (req, res) => {
    res.send(
      crypto.createHash('sha1').update(req.params.input).digest('hex')
    );
  });

  const requestHandler = (addr, res) => {
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

  app.get('/req/', (req, res) => {
    requestHandler(req.query.addr, res);
  });

  app.post('/req/', (req, res) => {
    requestHandler(req.body.addr, res);
  });

  app.all('*', (req, res) => {
    res.send('maxim_borovskiy');
  });

  return app;
};