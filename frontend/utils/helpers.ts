function delay(ms: number = 1000) {
  let ctr: any, rej: any;
  const p: any = new Promise((resolve, reject) => {
    ctr = setTimeout(resolve, ms);
    rej = reject;
  });

  p.cancel = () => {
    clearTimeout(ctr);
    rej(Error("Cancelled"));
  };
  return p;
}

export { delay };
