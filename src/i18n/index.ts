import { Language } from '../types';
import enJson from './en.json';
import ruJson from './ru.json';
import hyJson from './hy.json';

export type TranslationDictionary = typeof enJson;

export const I18N_DICTS: Record<Language, any> = {
  en: enJson,
  ru: ruJson,
  hy: hyJson,
};

// Development-time validation check to detect missing keys across languages
export function validateTranslations() {
  if (process.env.NODE_ENV !== 'production') {
    const getKeys = (obj: any, prefix = ''): string[] => {
      let keys: string[] = [];
      for (const k of Object.keys(obj)) {
        const val = obj[k];
        const fullKey = prefix ? `${prefix}.${k}` : k;
        if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
          keys = keys.concat(getKeys(val, fullKey));
        } else {
          keys.push(fullKey);
        }
      }
      return keys;
    };

    const enKeys = new Set(getKeys(enJson));
    const ruKeys = new Set(getKeys(ruJson));
    const hyKeys = new Set(getKeys(hyJson));

    const missingInRu = [...enKeys].filter((k) => !ruKeys.has(k));
    const missingInHy = [...enKeys].filter((k) => !hyKeys.has(k));

    if (missingInRu.length > 0) {
      console.warn(`[i18n] Missing keys in ru.json:`, missingInRu);
    }
    if (missingInHy.length > 0) {
      console.warn(`[i18n] Missing keys in hy.json:`, missingInHy);
    }
    if (missingInRu.length === 0 && missingInHy.length === 0) {
      console.log(`[i18n] Translation keys fully verified across en, ru, and hy!`);
    }
  }
}

// Run validation at import time
validateTranslations();

// Helper to look up dot-delimited key with fallback and parameter replacement
export function translateKey(
  language: Language,
  key: string,
  params?: Record<string, string | number>
): string {
  const dict = I18N_DICTS[language] || I18N_DICTS.en;
  const parts = key.split('.');
  
  let current: any = dict;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      current = undefined;
      break;
    }
  }

  // Fallback to English if not found
  if (current === undefined || typeof current !== 'string') {
    let fallback: any = I18N_DICTS.en;
    for (const part of parts) {
      if (fallback && typeof fallback === 'object' && part in fallback) {
        fallback = fallback[part];
      } else {
        fallback = undefined;
        break;
      }
    }
    current = typeof fallback === 'string' ? fallback : key;
  }

  // Replace params e.g. {count} or {name}
  if (params && typeof current === 'string') {
    return Object.entries(params).reduce((str, [pKey, pVal]) => {
      return str.replace(new RegExp(`\\{${pKey}\\}`, 'g'), String(pVal));
    }, current);
  }

  return current;
}

// Factory to create a callable translation function that also acts as dictionary proxy
export function createTranslator(language: Language) {
  const dict = I18N_DICTS[language] || I18N_DICTS.en;

  const fn = (key: string, params?: Record<string, string | number>) => {
    return translateKey(language, key, params);
  };

  // Legacy mappings for top-level keys previously used in components
  const legacyExtras: Record<string, any> = {
    appTitle: dict.app?.title,
    appSubtitle: dict.app?.subtitle,
    navTitle: dict.app?.title,
    navSubtitle: dict.app?.subtitle,
    mode3D: dict.nav?.mode3d,
    mode2D: dict.nav?.mode2d,
    polarSkyView: dict.nav?.modeSky,
    academy: dict.nav?.modeAcademy,
    errorLabBtn: dict.nav?.modeErrors,
    detectionDashboard: dict.nav?.modeDetection,
    search: dict.common?.search,
    searchPrompt: dict.nav?.searchPlaceholder,
    tabSpoofLab: dict.spoofing?.title,
    tabSatellites: dict.satellites?.title,
    tabReceiver: dict.receiver?.title,
    realReceiver: dict.receiver?.realPosition,
    dopTitle: dict.dop?.title,
    spoofedTarget: dict.receiver?.spoofedPosition,
  };

  // Combine dict, legacyExtras and function call
  return new Proxy(fn, {
    get(target, prop: string) {
      if (prop in legacyExtras) {
        return legacyExtras[prop];
      }
      if (prop in dict) {
        return dict[prop];
      }
      return (target as any)[prop];
    },
  });
}
