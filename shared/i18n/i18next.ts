import { createInstance, type i18n } from "i18next";
import ICU from "i18next-icu";

import { defaultLanguage, localeResourceLookup } from "./locale-resources";

function createI18nextInstance(): i18n {
  const instance = createInstance().use(new ICU());

  // Resources are inline, so initialisation completes synchronously
  void instance.init({
    fallbackLng: defaultLanguage,
    resources: localeResourceLookup,
    keySeparator: "###",
  });

  return instance;
}

export const i18next = createI18nextInstance();
