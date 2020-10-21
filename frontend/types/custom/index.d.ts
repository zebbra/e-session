declare module "workerize-loader!*" {
  class WebpackWorker extends Worker {}

  export = WebpackWorker;
}
