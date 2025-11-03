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
  ok: true,
  value: T;
}

export type ErrResult = {
  ok: false,
  error: string;
}
