import { deLocalResource } from "./locale-resources/=de";
import { enLocalResource } from "./locale-resources/=en";
import { ruLocalResource } from "./locale-resources/=ru";
import { ukLocalResource } from "./locale-resources/=uk";

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
