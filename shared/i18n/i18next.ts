import i18next from "i18next";
import ICU from "i18next-icu";

import { defaultLanguage, localeResourceLookup } from "./locale-resources";

const icu = new ICU();
i18next.use(icu);

// eslint-disable-next-line @typescript-eslint/no-floating-promises
i18next.init({
  fallbackLng: defaultLanguage,
  resources: localeResourceLookup,
  keySeparator: "###",
});

export { default as i18next } from "i18next";
