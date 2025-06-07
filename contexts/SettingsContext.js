import React, { createContext, useState, useEffect } from 'react';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [companyName, setCompanyName] = useState('Ma Société Ferroviaire');
  const [companySlogan, setCompanySlogan] = useState('Le transport ferroviaire simplifié');
  const [companyDescription, setCompanyDescription] = useState('Description de la société ferroviaire...');
  const [primaryColor, setPrimaryColor] = useState('#007bff');
  const [secondaryColor, setSecondaryColor] = useState('#6c757d');
  const [accentColor, setAccentColor] = useState('#28a745');
  const [appName, setAppName] = useState('Train Schedule Management');
  const [logoUrl, setLogoUrl] = useState('/images/logo-ter-mobigo.svg');
  const [faviconUrl, setFaviconUrl] = useState('/favicon.ico');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [buttonStyle, setButtonStyle] = useState('rounded');
  const [headerStyle, setHeaderStyle] = useState('default');
  const [footerContent, setFooterContent] = useState('© 2024 Ma Société Ferroviaire');
  const [footerRegions, setFooterRegions] = useState([]);
  const [customCss, setCustomCss] = useState('');

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          setCompanyName(data.companyName || 'Ma Société Ferroviaire');
          setCompanySlogan(data.companySlogan || 'Le transport ferroviaire simplifié');
          setCompanyDescription(data.companyDescription || 'Description de la société ferroviaire...');
          setPrimaryColor(data.primaryColor || '#007bff');
          setSecondaryColor(data.secondaryColor || '#6c757d');
          setAccentColor(data.accentColor || '#28a745');
          setAppName(data.appName || 'Train Schedule Management');
          setLogoUrl(data.logoUrl || '/images/logo-ter-mobigo.svg');
          setFaviconUrl(data.faviconUrl || '/favicon.ico');
          setFontFamily(data.fontFamily || 'Inter');
          setButtonStyle(data.buttonStyle || 'rounded');
          setHeaderStyle(data.headerStyle || 'default');
          setFooterContent(data.footerContent || '© 2024 Ma Société Ferroviaire');
          setFooterRegions(data.footerRegions || []);
          setCustomCss(data.customCss || '');
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      }
    }
    fetchSettings();
  }, []);

  // Apply custom CSS variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', primaryColor);
    root.style.setProperty('--secondary-color', secondaryColor);
    root.style.setProperty('--accent-color', accentColor);
    root.style.setProperty('--font-family', fontFamily);
    
    // Apply custom CSS if any
    let styleElement = document.getElementById('custom-styles');
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'custom-styles';
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = customCss;
  }, [primaryColor, secondaryColor, accentColor, fontFamily, customCss]);

  return (
    <SettingsContext.Provider
      value={{
        companyName,
        setCompanyName,
        companySlogan,
        setCompanySlogan,
        companyDescription,
        setCompanyDescription,
        primaryColor,
        setPrimaryColor,
        secondaryColor,
        setSecondaryColor,
        accentColor,
        setAccentColor,
        appName,
        setAppName,
        logoUrl,
        setLogoUrl,
        faviconUrl,
        setFaviconUrl,
        fontFamily,
        setFontFamily,
        buttonStyle,
        setButtonStyle,
        headerStyle,
        setHeaderStyle,
        footerContent,
        setFooterContent,
        footerRegions,
        setFooterRegions,
        customCss,
        setCustomCss,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
