import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";
import { I18nManager } from "react-native"; 

import en from './languages/en.json';
import he from './languages/he.json';

const i18n = new I18n({ en, he });

i18n.locale = getLocales()[0].languageCode;
i18n.enableFallback = true;
i18n.defaultLocale = "en";

const isRTL = i18n.locale === 'he';
I18nManager.allowRTL(isRTL);
I18nManager.forceRTL(isRTL);

export default i18n;