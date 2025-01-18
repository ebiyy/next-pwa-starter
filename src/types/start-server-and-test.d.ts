declare module "start-server-and-test" {
  interface StartServerOptions {
    start: string;
    url: string;
    server: () => Promise<void>;
  }

  function startServer(options: StartServerOptions): Promise<void>;
  export { startServer };
}
