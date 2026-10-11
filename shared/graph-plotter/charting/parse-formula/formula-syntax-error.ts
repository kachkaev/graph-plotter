export class FormulaSyntaxError extends Error {
  readonly start: number;
  readonly end: number;

  constructor(start: number, end: number) {
    super(`Formula syntax error at ${start}…${end}`);
    this.name = "FormulaSyntaxError";
    this.start = start;
    this.end = end;
  }
}
