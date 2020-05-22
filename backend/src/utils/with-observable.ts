export function withCancel<T>(
  asyncIterator: AsyncIterator<T | undefined>,
  onCancel: (...cancelParams) => void,
  ...cancelParams: any
): AsyncIterator<T | undefined> {
  if (!asyncIterator.return) {
    asyncIterator.return = () =>
      Promise.resolve({ value: undefined, done: true });
  }

  const savedReturn = asyncIterator.return.bind(asyncIterator);
  asyncIterator.return = () => {
    onCancel(...cancelParams);
    return savedReturn();
  };

  return asyncIterator;
}
