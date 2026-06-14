import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aurevix.flow',
  appName: 'AurevixFlow',
  webDir: 'dist',
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
};

export default config;