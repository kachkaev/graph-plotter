import i18next from "i18next";
import ICU from "i18next-icu";

import { defaultLanguage, localeResourceLookup } from "./localeResources";

const icu = new ICU();
i18next.use(icu);

i18next.init({
  fallbackLng: defaultLanguage,
  resources: localeResourceLookup,
  keySeparator: "###",
});

export { i18next };
