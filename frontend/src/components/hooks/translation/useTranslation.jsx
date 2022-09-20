import React, { useContext } from 'react';
import { TranslationContext} from '../../contexts/TranslationContext'
import translations from './translations.json';

export default function() {
  const { currentLanguage } = useContext(TranslationContext);

  const trans = (text) => {
    return translations[currentLanguage][text];
  };

  return { trans, currentLanguage };
}
