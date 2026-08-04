export class HttpError extends Error {
  public constructor(
    public readonly status: number,
    message: string,
    public readonly bodyPreview?: string,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}
