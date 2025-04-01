import packageInfo from '../../package.json';

export const environment = {
  apiUrl: "http://127.0.0.1:8000/securevaultapi",
  appVersion: packageInfo.version,
  production: true
};
