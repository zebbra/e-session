const initOptions = {
  disableAudioLevels: false,

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
  // serviceUrl: "https://open.meet.switch.ch/http-bind",
  hosts: {
    domain: "meet.jitsi",
    muc: "muc.meet.jitsi",
  },
  useStunTurn: true,
  enableLipSync: true,
  clientNode: "http://jitsi.org/jitsimeet",
};

const confOptions = {
  openBridgeChannel: true,
};

export { initOptions, options, confOptions };
