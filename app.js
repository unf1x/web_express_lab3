export default (express, bodyParser, createReadStream, crypto, http) => {
  const app = express();

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,OPTIONS,DELETE');

    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }

    next();
  });

  app.get('/login/', (req, res) => {
    res.type('text/plain');
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

  app.get('/req/', (req, res) => {
    const addr = req.query.addr;
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
  });

  app.post('/req/', (req, res) => {
    const addr = req.body.addr;
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
  });

  app.all('*', (req, res) => {
    res.send('maxim_borovskiy');
  });

  return app;
};