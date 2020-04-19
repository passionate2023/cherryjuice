export class FormattingError extends Error {
  name = 'Formatting Error';
  constructor(public message: string) {
    super(message);
  }
}
