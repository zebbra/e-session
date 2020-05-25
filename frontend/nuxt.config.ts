import { Configuration } from "@nuxt/types";

const config: Configuration = {
  mode: "universal",

  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: "%s - " + process.env.npm_package_name,
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || "",
      },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    script: [
      { src: "https://meet.jit.si/libs/lib-jitsi-meet.min.js" },
      {
        src:
          "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js",
      },
    ],
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: "red" },

  /*
   ** Global CSS
   */
  css: [],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],

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
  ],

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
  // build: {
  //   /*
  //    ** You can extend webpack config here
  //    */
  //   extend(config, ctx) {}
  // }
};

export default config;
