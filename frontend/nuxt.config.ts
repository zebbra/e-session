import { Configuration } from "@nuxt/types";

const config: Configuration = {
  mode: "universal",

  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: "%s - E-Session",
    title: "Join ",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: "The Online Parliament Showcase",
      },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    script: [
      { src: "https://hello.zebbra.ch/libs/lib-jitsi-meet.min.js" },
      {
        src:
          "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js",
      },
      // {
      //   src:
      //     "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/dist/face-api.min.js",
      // },
    ],
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: "red" },

  router: {
    middleware: ["roomContext"],
  },

  /*
   ** Global CSS
   */
  css: [],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: "~/plugins/jitsi.client", mode: "client" },
    { src: "~/plugins/face.api", ssr: false },
  ],

  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    "@nuxt/typescript-build",
    "@nuxtjs/vuetify",
    // Doc: https://github.com/nuxt-community/composition-api
    "nuxt-composition-api",
    // Doc: https://github.com/nuxt-community/apollo-module
    "@nuxtjs/apollo",
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://www.npmjs.com/package/nuxt-lazy-load/v/latest
    "nuxt-lazy-load",
    // Doc: https://pwa.nuxtjs.org/
    ["@nuxtjs/pwa", { meta: false, icon: false, manifest: false }],
    // Doc: https://github.com/nuxt-community/dotenv-module
    "@nuxtjs/dotenv",
    [
      "nuxt-env",
      {
        keys: ["HTTP_GRAPHQL_ENDPOINT", "WS_GRAPHQL_ENDPOINT"],
      },
    ],
    // Doc: https://github.com/nuxt-community/style-resources-module
    "@nuxtjs/style-resources",
  ],

  styleResources: {
    sass: ["assets/sass/background.sass"],
  },

  /**
   * Apollo module configuration
   * See https://github.com/nuxt-community/apollo-module
   */
  apollo: {
    // (Optional) Default 'apollo' definition
    defaultOptions: {
      // See 'apollo' definition
      // For example: default query options
      $query: {
        loadingKey: "loading",
        fetchPolicy: "cache-and-network",
      },
    },
    // required
    clientConfigs: {
      default: "~/apollo/client-config/default",
    },
  },

  proxy: {
    "/graphql": {
      target: process.env.API_PROXY_URL || "http://localhost:3001/",
    },
  },

  /**
   * Enable runtime linting after save file
   * See https://typescript.nuxtjs.org/guide/lint.html#configuration
   */
  typescript: {
    typeCheck: {
      eslint: true,
    },
  },

  /*
   ** vuetify module configuration
   ** See https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    treeShake: true,
    optionsPath: "~/vuetify.options.ts",
  },

  loaders: [
    {
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: "graphql-tag/loader",
    },
  ],

  /*
   ** Build configuration
   */
  build: {
    babel: {
      babelrc: false,
      presets: [
        [
          "@nuxt/babel-preset-app",
          {
            modules: false,
          },
        ],
      ],
    },

    /*
     ** You can extend webpack config here
     */
    extend(config, { isClient }) {
      // @see https://github.com/nuxt/nuxt.js/pull/3480#issuecomment-404150387
      config.output.globalObject = "this";

      if (isClient) {
        // web workers are only available client-side
        config.module.rules.push({
          test: /\.worker\.js$/,
          use: { loader: "workerize-loader" },
          exclude: /(node_modules)/,
        });
      }
    },
  },
  /* server: {
    host: "0.0.0.0",
    https: {
      key: fs.readFileSync(path.resolve(__dirname, "server.key")),
      cert: fs.readFileSync(path.resolve(__dirname, "server.crt")),
    },
  }, */
};

export default config;
