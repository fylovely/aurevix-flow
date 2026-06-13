import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'AurevixFlow',
  webDir: 'dist'
};

export default config;

plugins: {
  SplashScreen: {
    launchShowDuration: 2500,
    backgroundColor: "#0b1410",
    showSpinner: true,
    spinnerColor: "#00ff9d"
  },
  StatusBar: {
    style: "DARK"
  }
}