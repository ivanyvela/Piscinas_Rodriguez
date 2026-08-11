/**
 * Internationalization module for Piscinas Rodríguez
 */

const LOCAL_STORAGE_KEY = 'piscinas_rodriguez_lang';
let currentLang = 'es';
let translations = {};

/**
 * Utility to get a nested value from an object using a dot-notation key path.
 * @param {Object} obj - The object to search.
 * @param {string} path - The dot-notation path (e.g. 'hero.title').
 * @returns {string|null} - The string value, or null if not found.
 */
function getTranslation(obj, path) {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj) || null;
}

/**
 * Loads translations from a JSON file.
 * @param {string} lang - The language code ('es' or 'en').
 * @returns {Promise<Object>} - The translations object.
 */
async function fetchTranslations(lang) {
  try {
    const response = await fetch(`i18n/${lang}.json`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Could not load translations for language '${lang}':`, error);
    return {};
  }
}

/**
 * Updates all DOM elements with the loaded translations.
 */
function applyTranslations() {
  if (!translations || Object.keys(translations).length === 0) return;

  // Update document language
  document.documentElement.lang = currentLang;

  // Replace text content
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const text = getTranslation(translations, key);
    if (text) {
      el.textContent = text;
    }
  });

  // Replace placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const text = getTranslation(translations, key);
    if (text) {
      el.setAttribute('placeholder', text);
    }
  });

  // Replace aria-labels
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria');
    const text = getTranslation(translations, key);
    if (text) {
      el.setAttribute('aria-label', text);
    }
  });

  // Update language toggle button text
  const toggleBtn = document.querySelector('.lang-toggle');
  if (toggleBtn) {
    toggleBtn.textContent = currentLang === 'es' ? 'EN' : 'ES';
  }
}

/**
 * Switches the language and re-applies translations.
 * @param {string} lang - The new language code.
 */
async function setLanguage(lang) {
  if (lang !== 'es' && lang !== 'en') return;
  
  currentLang = lang;
  localStorage.setItem(LOCAL_STORAGE_KEY, lang);
  
  translations = await fetchTranslations(currentLang);
  applyTranslations();
}

/**
 * Toggles between 'es' and 'en'.
 */
function toggleLanguage() {
  const nextLang = currentLang === 'es' ? 'en' : 'es';
  setLanguage(nextLang);
}

/**
 * Initializes the internationalization system.
 */
export async function initI18n() {
  const savedLang = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (savedLang && (savedLang === 'es' || savedLang === 'en')) {
    currentLang = savedLang;
  }

  // Initial load
  await setLanguage(currentLang);

  // Set up event listeners
  const toggleBtn = document.querySelector('.lang-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleLanguage);
  }
}
