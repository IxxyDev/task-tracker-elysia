export const Ok = <T>(value: T): OkResult<T> => ({
  ok: true,
  value
})

export const Err = (error: string): ErrResult => ({
  ok: false,
  error
})

export type Result<T> = OkResult<T> | ErrResult;

export type OkResult<T> = {
  ok: true;
  value: T;
  error?: never;
}

export type ErrResult = {
  ok: false;
  value?: never;
  error: string;
}
