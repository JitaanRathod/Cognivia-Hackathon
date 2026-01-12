import { useState } from 'react';

export default function useLanguage() {
  const [lang, setLang] = useState('en'); // en | hi

  const t = (en, hi) => (lang === 'hi' ? hi : en);

  return { lang, setLang, t };
}
