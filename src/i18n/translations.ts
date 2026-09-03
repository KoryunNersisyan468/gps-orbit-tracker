import { Language } from '../types';
import { createTranslator, I18N_DICTS, translateKey, validateTranslations } from './index';

export const TRANSLATIONS: Record<Language, any> = {
  en: createTranslator('en'),
  ru: createTranslator('ru'),
  hy: createTranslator('hy'),
};

export type TranslationKeys = any;

export { createTranslator, translateKey, I18N_DICTS, validateTranslations };
