export type ErrorConfig = {
  i18nKey: string;
  i18nValues: Array<string | number>;
  hint?: ErrorConfig | undefined;
};

export type ErrorRange = [number, number];
