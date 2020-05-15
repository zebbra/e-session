import { Context } from "@nuxt/types";
import { NuxtApp, DefaultNuxtLoading } from "@nuxt/types/app";
import { AxiosRequestConfig } from "axios";

export default function (context: Context) {
  // A noop loading inteterface for when $nuxt is not yet ready
  const noopLoading = {
    finish: () => {},
    start: () => {},
    fail: () => {},
    set: () => {},
  };

  let currentRequests = 0;
  let $loading;

  context.$axios.onRequest(
    (config: AxiosRequestConfig & { progress?: boolean }) => {
      if (!$loading && context.app.router && context.app.router.app) {
        const $nuxt = context.app.router.app as NuxtApp;
        $loading = () =>
          $nuxt && $nuxt.$loading && ($nuxt.$loading as DefaultNuxtLoading).set
            ? ($nuxt.$loading as DefaultNuxtLoading)
            : noopLoading;
      }
      if (config && config.progress === false) {
        return;
      }

      currentRequests++;
      if (currentRequests === 1) {
        $loading().start();
      }
    },
  );

  context.$axios.onResponse((response) => {
    if (
      response &&
      response.config &&
      (response.config as AxiosRequestConfig & { progress?: boolean })
        .progress === false
    ) {
      return;
    }

    currentRequests--;
    if (currentRequests <= 0) {
      currentRequests = 0;
      $loading().finish();
    }
  });

  context.$axios.onError((error) => {
    if (
      error &&
      error.config &&
      (error.config as AxiosRequestConfig & { progress?: boolean }).progress ===
        false
    ) {
      return;
    }

    currentRequests--;

    if (context.$axios.isCancel(error)) {
      return;
    }

    $loading().fail();
    $loading().finish();
  });

  const onProgress = (e: any) => {
    if (!currentRequests) {
      return;
    }
    if (currentRequests > 1) {
      const progress = (e.loaded * 100) / (e.total * currentRequests);
      $loading().set(Math.min(100, progress));
    }
  };

  context.$axios.defaults.onUploadProgress = onProgress;
  context.$axios.defaults.onDownloadProgress = onProgress;
}
