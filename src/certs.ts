// @ts-ignore
import { getCerts } from 'https-localhost/certs';
import { wait } from './utils';

export async function prepareCertificate(domain: string) {
  try {
    // Create certificate that supports both domain and all subdomains.
    const certs = await getCerts(`*.${domain} ${domain}`);

    // for some reason getCerts returns before files are correctly saved - it would make boot fail.
    await wait(500);

    return certs;
  } catch (error) {}
}
