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
export const supportedLanguages: SupportedLanguage[] = ["de", "en", "ru", "uk"];

export const defaultLanguage: SupportedLanguage = "en";
