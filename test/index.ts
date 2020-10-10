import { createHttpsDevServer } from '../src';

async function start() {
  const server = await createHttpsDevServer(
    async (req, res) => {
      res.statusCode = 200;
      res.write('ok');
      res.end();
    },
    {
      domain: 'my-app.dev',
      port: 3000,
      subdomains: ['test'],
      openBrowser: true,
    },
  );
}

start();
