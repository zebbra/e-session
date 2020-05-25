const initOptions = {
  disableAudioLevels: true,

  // The ID of the jidesha extension for Chrome.
  desktopSharingChromeExtId: "mbocklcggfhnbahlnepmldehdhpjfcjp",

  // Whether desktop sharing should be disabled on Chrome.
  desktopSharingChromeDisabled: false,

  // The media sources to use when using screen sharing with the Chrome
  // extension.
  desktopSharingChromeSources: ["screen", "window"],

  // Required version of Chrome extension
  desktopSharingChromeMinExtVersion: "0.1",

  // Whether desktop sharing should be disabled on Firefox.
  desktopSharingFirefoxDisabled: true,
};

const options = {
  serviceUrl: "https://hello.zebbra.ch/http-bind",
  // serviceUrl: "//localhost:8000/http-bind",
  hosts: {
    domain: "meet.jitsi",
    muc: "muc.meet.jitsi",
  },
  useStunTurn: true,
  enableLipSync: true,
  clientNode: "http://localhost/jitsimeet",
};

const confOptions = {
  openBridgeChannel: true,
};

export { initOptions, options, confOptions };
