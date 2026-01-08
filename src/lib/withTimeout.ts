export class TimeoutError extends Error {
  constructor(message = '요청 시간이 초과되었습니다.') {
    super(message);
    this.name = 'TimeoutError';
  }
}

// Promise처럼 "then"이 있는 객체도 Promise로 감싸서 처리
export function withTimeout<T>(value: PromiseLike<T>, ms = 8000): Promise<T> {
  const promise = Promise.resolve(value); // thenable -> Promise로 정규화

  return new Promise<T>((resolve, reject) => {
    const t = window.setTimeout(() => reject(new TimeoutError()), ms);

    promise.then(
      (v) => {
        window.clearTimeout(t);
        resolve(v);
      },
      (e) => {
        window.clearTimeout(t);
        reject(e);
      }
    );
  });
}
