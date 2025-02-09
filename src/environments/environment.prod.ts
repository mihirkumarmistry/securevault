import packageInfo from '../../package.json';

export const environment = {
  apiUrl: "https://localhost:44357/",
  appVersion: packageInfo.version,
  production: true
};
