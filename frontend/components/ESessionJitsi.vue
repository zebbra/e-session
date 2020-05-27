<template>
  <section />
</template>

<script lang="ts">
import {
  defineComponent,
  onBeforeMount,
  useContext,
} from "nuxt-composition-api";

export default defineComponent({
  name: "ESessionJitsi",
  setup() {
    const { app } = useContext();

    onBeforeMount(() => {
      if (process.browser) {
        app.jitsi.lib.setLogLevel(app.jitsi.lib.logLevels.WARN);
        app.jitsi.lib.init({
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
        });

        const connection = new app.jitsi.lib.JitsiConnection(null, null, {
          serviceUrl: "https://hello.zebbra.ch/http-bind",
          // serviceUrl: "//localhost:8000/http-bind",
          hosts: {
            domain: "meet.jitsi",
            muc: "muc.meet.jitsi",
          },
          useStunTurn: true,
          enableLipSync: true,
          clientNode: "http://localhost/jitsimeet",
        });

        connection.addEventListener(
          app.jitsi.lib.events.connection.CONNECTION_ESTABLISHED,
          (event) => onConnectionSuccess(event, connection),
        );
        connection.addEventListener(
          app.jitsi.lib.events.connection.CONNECTION_FAILED,
          (error) => onConnectionFailed(error),
        );
        connection.addEventListener(
          app.jitsi.lib.events.connection.CONNECTION_DISCONNECTED,
          () => onDisconnect(),
        );

        connection.connect();
      }
    });

    function onConnectionSuccess(_event, connection) {
      app.jitsi.connection = connection;
    }

    function onConnectionFailed(error) {
      console.log(error);
    }

    function onDisconnect() {
      console.log("disconnect");
    }
  },
});
</script>
