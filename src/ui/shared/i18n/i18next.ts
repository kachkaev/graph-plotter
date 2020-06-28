import i18next from "i18next";
import ICU from "i18next-icu";
import de from "i18next-icu/locale-data/de";
import en from "i18next-icu/locale-data/en";
import ru from "i18next-icu/locale-data/ru";
import uk from "i18next-icu/locale-data/uk";

import { defaultLanguage, localeResourceLookup } from "./localeResources";

const icu = new ICU();
icu.addLocaleData(de);
icu.addLocaleData(en);
icu.addLocaleData(ru);
icu.addLocaleData(uk);
i18next.use(icu);

i18next.init({
  fallbackLng: defaultLanguage,
  resources: localeResourceLookup,
  keySeparator: "###",
});

export { i18next };
