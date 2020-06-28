import { deLocalResource } from "./=de";
import { enLocalResource } from "./=en";
import { ruLocalResource } from "./=ru";
import { ukLocalResource } from "./=uk";

export const localeResourceLookup = {
  de: deLocalResource,
  en: enLocalResource,
  ru: ruLocalResource,
  uk: ukLocalResource,
};

export type SupportedLanguage = keyof typeof localeResourceLookup;
export const supportedLanguages = Object.keys(
  localeResourceLookup,
) as SupportedLanguage[];

export const defaultLanguage: SupportedLanguage = "en";
