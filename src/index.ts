import { RequestListener, Server } from 'http';
import { createServer } from 'https';
import open from 'open';
import { prepareCertificate } from './certs';
import {
  addDomainAliases,
  isDomainsRegistrationRequired,
} from './registerHosts';

interface ServerConfig {
  domain: string;
  port: number;
  subdomains?: string[];
  openBrowser?: boolean;
  logger?: (...args: any) => void;
}

export async function createHttpsDevServer(
  handler: RequestListener,
  {
    domain,
    port,
    subdomains = [],
    openBrowser = true,
    logger = console.info,
  }: ServerConfig,
) {
  console.warn('\n⚠️  Never use essy-https in production!\n\n');

  // Check temp files to see if domains are already registered.
  // This is to avoid having to ask for sudo on every start.
  if (isDomainsRegistrationRequired(domain, subdomains)) {
    logger(
      'Preparing domain aliases. You might have to provide sudo password so your hosts file can be edited...',
    );
    await addDomainAliases(domain, subdomains, logger);
  } else {
    logger(`Domain aliases are already registered.`);
  }

  logger('Starting the server...');
  logger('Setting up certificate...');
  const certs = await prepareCertificate(domain);
  logger('Certificate ready');

  const server = await new Promise<Server>(resolve => {
    const newServer = createServer(
      {
        ...certs,
      },
      handler,
    ).listen(port, () => {
      resolve(newServer);
    });
  });

  const url = `https://${domain}:${port}`;

  if (openBrowser) {
    logger(`Opening browser: ${url}`);

    open(url);
  }

  return { url, server };
}
