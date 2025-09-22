import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'hi' | 'ar';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    itinerary: 'Itinerary',
    identity: 'Identity',
    settings: 'Settings',
    
    // Blockchain Verification
    identityVerificationStatus: 'Identity Verification Status',
    documentType: 'Document Type',
    documentNumber: 'Document Number',
    blockchainTransaction: 'Blockchain Transaction',
    yourDigitalTravelIds: 'Your Digital Travel IDs',
    createDigitalTravelId: 'Create Digital Travel ID',
    noTripsAvailable: 'No Trips Available',
    needCreateTrip: 'You need to create a trip first to generate a digital travel ID.',
    createTrip: 'Create a Trip',
    selectTripForDigitalId: 'Select Trip for Digital ID',
    chooseTrip: 'Choose a trip',
    verificationProgress: 'Verification Progress',
    verifyingOnBlockchain: 'Verifying on blockchain...',
    verificationComplete: 'Verification complete',
    verifyIdentityCreateDigitalId: 'Verify Identity & Create Digital ID',
    identityVerifiedSuccessfully: 'Identity Verified Successfully',
    identityVerifiedDescription: 'Your identity has been verified and stored on the blockchain. You can now create digital travel IDs for your trips.',
    viewQrCode: 'View QR Code',
    
    // Settings
    account: 'Account',
    loggedInAs: 'Logged in as:',
    verifiedTourist: 'Verified Tourist',
    languageRegion: 'Language & Region',
    preferredLanguage: 'Preferred Language',
    selectLanguage: 'Select language',
    privacySafety: 'Privacy & Safety',
    pushNotifications: 'Push Notifications',
    receiveSafetyAlerts: 'Receive safety alerts and updates',
    locationSharing: 'Location Sharing',
    shareLocationEmergency: 'Share location with emergency contacts',
    emergencyContacts: 'Emergency Contacts',
    addEmergencyContact: 'Add Emergency Contact',
    name: 'Name',
    phone: 'Phone',
    relationship: 'Relationship',
    addContact: 'Add Contact',
    logout: 'Logout',
    
    // Status
    verified: 'VERIFIED',
    pending: 'PENDING',
    rejected: 'REJECTED',
  },
  es: {
    // Navigation
    dashboard: 'Panel',
    itinerary: 'Itinerario',
    identity: 'Identidad',
    settings: 'Configuración',
    
    // Blockchain Verification
    identityVerificationStatus: 'Estado de Verificación de Identidad',
    documentType: 'Tipo de Documento',
    documentNumber: 'Número de Documento',
    blockchainTransaction: 'Transacción Blockchain',
    yourDigitalTravelIds: 'Sus IDs de Viaje Digitales',
    createDigitalTravelId: 'Crear ID de Viaje Digital',
    noTripsAvailable: 'No Hay Viajes Disponibles',
    needCreateTrip: 'Necesita crear un viaje primero para generar un ID de viaje digital.',
    createTrip: 'Crear un Viaje',
    selectTripForDigitalId: 'Seleccionar Viaje para ID Digital',
    chooseTrip: 'Elegir un viaje',
    verificationProgress: 'Progreso de Verificación',
    verifyingOnBlockchain: 'Verificando en blockchain...',
    verificationComplete: 'Verificación completa',
    verifyIdentityCreateDigitalId: 'Verificar Identidad y Crear ID Digital',
    identityVerifiedSuccessfully: 'Identidad Verificada Exitosamente',
    identityVerifiedDescription: 'Su identidad ha sido verificada y almacenada en blockchain. Ahora puede crear IDs de viaje digitales para sus viajes.',
    viewQrCode: 'Ver Código QR',
    
    // Settings
    account: 'Cuenta',
    loggedInAs: 'Conectado como:',
    verifiedTourist: 'Turista Verificado',
    languageRegion: 'Idioma y Región',
    preferredLanguage: 'Idioma Preferido',
    selectLanguage: 'Seleccionar idioma',
    privacySafety: 'Privacidad y Seguridad',
    pushNotifications: 'Notificaciones Push',
    receiveSafetyAlerts: 'Recibir alertas de seguridad y actualizaciones',
    locationSharing: 'Compartir Ubicación',
    shareLocationEmergency: 'Compartir ubicación con contactos de emergencia',
    emergencyContacts: 'Contactos de Emergencia',
    addEmergencyContact: 'Agregar Contacto de Emergencia',
    name: 'Nombre',
    phone: 'Teléfono',
    relationship: 'Relación',
    addContact: 'Agregar Contacto',
    logout: 'Cerrar Sesión',
    
    // Status
    verified: 'VERIFICADO',
    pending: 'PENDIENTE',
    rejected: 'RECHAZADO',
  },
  fr: {
    // Navigation
    dashboard: 'Tableau de Bord',
    itinerary: 'Itinéraire',
    identity: 'Identité',
    settings: 'Paramètres',
    
    // Blockchain Verification
    identityVerificationStatus: 'Statut de Vérification d\'Identité',
    documentType: 'Type de Document',
    documentNumber: 'Numéro de Document',
    blockchainTransaction: 'Transaction Blockchain',
    yourDigitalTravelIds: 'Vos IDs de Voyage Numériques',
    createDigitalTravelId: 'Créer un ID de Voyage Numérique',
    noTripsAvailable: 'Aucun Voyage Disponible',
    needCreateTrip: 'Vous devez d\'abord créer un voyage pour générer un ID de voyage numérique.',
    createTrip: 'Créer un Voyage',
    selectTripForDigitalId: 'Sélectionner un Voyage pour l\'ID Numérique',
    chooseTrip: 'Choisir un voyage',
    verificationProgress: 'Progrès de Vérification',
    verifyingOnBlockchain: 'Vérification sur blockchain...',
    verificationComplete: 'Vérification terminée',
    verifyIdentityCreateDigitalId: 'Vérifier l\'Identité et Créer un ID Numérique',
    identityVerifiedSuccessfully: 'Identité Vérifiée avec Succès',
    identityVerifiedDescription: 'Votre identité a été vérifiée et stockée sur la blockchain. Vous pouvez maintenant créer des IDs de voyage numériques pour vos voyages.',
    viewQrCode: 'Voir le Code QR',
    
    // Settings
    account: 'Compte',
    loggedInAs: 'Connecté en tant que:',
    verifiedTourist: 'Touriste Vérifié',
    languageRegion: 'Langue et Région',
    preferredLanguage: 'Langue Préférée',
    selectLanguage: 'Sélectionner la langue',
    privacySafety: 'Confidentialité et Sécurité',
    pushNotifications: 'Notifications Push',
    receiveSafetyAlerts: 'Recevoir des alertes de sécurité et des mises à jour',
    locationSharing: 'Partage de Localisation',
    shareLocationEmergency: 'Partager la localisation avec les contacts d\'urgence',
    emergencyContacts: 'Contacts d\'Urgence',
    addEmergencyContact: 'Ajouter un Contact d\'Urgence',
    name: 'Nom',
    phone: 'Téléphone',
    relationship: 'Relation',
    addContact: 'Ajouter un Contact',
    logout: 'Déconnexion',
    
    // Status
    verified: 'VÉRIFIÉ',
    pending: 'EN ATTENTE',
    rejected: 'REJETÉ',
  },
  de: {
    // Navigation
    dashboard: 'Dashboard',
    itinerary: 'Reiseplan',
    identity: 'Identität',
    settings: 'Einstellungen',
    
    // Blockchain Verification
    identityVerificationStatus: 'Identitätsverifizierungsstatus',
    documentType: 'Dokumenttyp',
    documentNumber: 'Dokumentnummer',
    blockchainTransaction: 'Blockchain-Transaktion',
    yourDigitalTravelIds: 'Ihre Digitalen Reise-IDs',
    createDigitalTravelId: 'Digitale Reise-ID Erstellen',
    noTripsAvailable: 'Keine Reisen Verfügbar',
    needCreateTrip: 'Sie müssen zuerst eine Reise erstellen, um eine digitale Reise-ID zu generieren.',
    createTrip: 'Eine Reise Erstellen',
    selectTripForDigitalId: 'Reise für Digitale ID Auswählen',
    chooseTrip: 'Eine Reise wählen',
    verificationProgress: 'Verifizierungsfortschritt',
    verifyingOnBlockchain: 'Verifizierung auf Blockchain...',
    verificationComplete: 'Verifizierung abgeschlossen',
    verifyIdentityCreateDigitalId: 'Identität Verifizieren & Digitale ID Erstellen',
    identityVerifiedSuccessfully: 'Identität Erfolgreich Verifiziert',
    identityVerifiedDescription: 'Ihre Identität wurde verifiziert und auf der Blockchain gespeichert. Sie können jetzt digitale Reise-IDs für Ihre Reisen erstellen.',
    viewQrCode: 'QR-Code Anzeigen',
    
    // Settings
    account: 'Konto',
    loggedInAs: 'Angemeldet als:',
    verifiedTourist: 'Verifizierter Tourist',
    languageRegion: 'Sprache und Region',
    preferredLanguage: 'Bevorzugte Sprache',
    selectLanguage: 'Sprache auswählen',
    privacySafety: 'Datenschutz und Sicherheit',
    pushNotifications: 'Push-Benachrichtigungen',
    receiveSafetyAlerts: 'Sicherheitswarnungen und Updates erhalten',
    locationSharing: 'Standort Teilen',
    shareLocationEmergency: 'Standort mit Notfallkontakten teilen',
    emergencyContacts: 'Notfallkontakte',
    addEmergencyContact: 'Notfallkontakt Hinzufügen',
    name: 'Name',
    phone: 'Telefon',
    relationship: 'Beziehung',
    addContact: 'Kontakt Hinzufügen',
    logout: 'Abmelden',
    
    // Status
    verified: 'VERIFIZIERT',
    pending: 'AUSSTEHEND',
    rejected: 'ABGELEHNT',
  },
  hi: {
    // Navigation
    dashboard: 'डैशबोर्ड',
    itinerary: 'यात्रा कार्यक्रम',
    identity: 'पहचान',
    settings: 'सेटिंग्स',
    
    // Blockchain Verification
    identityVerificationStatus: 'पहचान सत्यापन स्थिति',
    documentType: 'दस्तावेज़ प्रकार',
    documentNumber: 'दस्तावेज़ संख्या',
    blockchainTransaction: 'ब्लॉकचेन लेनदेन',
    yourDigitalTravelIds: 'आपकी डिजिटल यात्रा आईडी',
    createDigitalTravelId: 'डिजिटल यात्रा आईडी बनाएं',
    noTripsAvailable: 'कोई यात्रा उपलब्ध नहीं',
    needCreateTrip: 'डिजिटल यात्रा आईडी बनाने के लिए पहले आपको एक यात्रा बनानी होगी।',
    createTrip: 'एक यात्रा बनाएं',
    selectTripForDigitalId: 'डिजिटल आईडी के लिए यात्रा चुनें',
    chooseTrip: 'एक यात्रा चुनें',
    verificationProgress: 'सत्यापन प्रगति',
    verifyingOnBlockchain: 'ब्लॉकचेन पर सत्यापन...',
    verificationComplete: 'सत्यापन पूर्ण',
    verifyIdentityCreateDigitalId: 'पहचान सत्यापित करें और डिजिटल आईडी बनाएं',
    identityVerifiedSuccessfully: 'पहचान सफलतापूर्वक सत्यापित',
    identityVerifiedDescription: 'आपकी पहचान सत्यापित हो गई है और ब्लॉकचेन पर संग्रहीत है। अब आप अपनी यात्राओं के लिए डिजिटल यात्रा आईडी बना सकते हैं।',
    viewQrCode: 'QR कोड देखें',
    
    // Settings
    account: 'खाता',
    loggedInAs: 'इस रूप में लॉग इन:',
    verifiedTourist: 'सत्यापित पर्यटक',
    languageRegion: 'भाषा और क्षेत्र',
    preferredLanguage: 'पसंदीदा भाषा',
    selectLanguage: 'भाषा चुनें',
    privacySafety: 'गोपनीयता और सुरक्षा',
    pushNotifications: 'पुश सूचनाएं',
    receiveSafetyAlerts: 'सुरक्षा अलर्ट और अपडेट प्राप्त करें',
    locationSharing: 'स्थान साझाकरण',
    shareLocationEmergency: 'आपातकालीन संपर्कों के साथ स्थान साझा करें',
    emergencyContacts: 'आपातकालीन संपर्क',
    addEmergencyContact: 'आपातकालीन संपर्क जोड़ें',
    name: 'नाम',
    phone: 'फोन',
    relationship: 'रिश्ता',
    addContact: 'संपर्क जोड़ें',
    logout: 'लॉग आउट',
    
    // Status
    verified: 'सत्यापित',
    pending: 'लंबित',
    rejected: 'अस्वीकृत',
  },
  ar: {
    // Navigation
    dashboard: 'لوحة التحكم',
    itinerary: 'خط الرحلة',
    identity: 'الهوية',
    settings: 'الإعدادات',
    
    // Blockchain Verification
    identityVerificationStatus: 'حالة التحقق من الهوية',
    documentType: 'نوع الوثيقة',
    documentNumber: 'رقم الوثيقة',
    blockchainTransaction: 'معاملة البلوك تشين',
    yourDigitalTravelIds: 'هويات السفر الرقمية الخاصة بك',
    createDigitalTravelId: 'إنشاء هوية سفر رقمية',
    noTripsAvailable: 'لا توجد رحلات متاحة',
    needCreateTrip: 'تحتاج إلى إنشاء رحلة أولاً لتوليد هوية سفر رقمية.',
    createTrip: 'إنشاء رحلة',
    selectTripForDigitalId: 'اختر رحلة للهوية الرقمية',
    chooseTrip: 'اختر رحلة',
    verificationProgress: 'تقدم التحقق',
    verifyingOnBlockchain: 'التحقق على البلوك تشين...',
    verificationComplete: 'اكتمل التحقق',
    verifyIdentityCreateDigitalId: 'تحقق من الهوية وأنشئ هوية رقمية',
    identityVerifiedSuccessfully: 'تم التحقق من الهوية بنجاح',
    identityVerifiedDescription: 'تم التحقق من هويتك وتخزينها على البلوك تشين. يمكنك الآن إنشاء هويات سفر رقمية لرحلاتك.',
    viewQrCode: 'عرض رمز QR',
    
    // Settings
    account: 'الحساب',
    loggedInAs: 'مسجل الدخول كـ:',
    verifiedTourist: 'سائح معتمد',
    languageRegion: 'اللغة والمنطقة',
    preferredLanguage: 'اللغة المفضلة',
    selectLanguage: 'اختر اللغة',
    privacySafety: 'الخصوصية والأمان',
    pushNotifications: 'الإشعارات الفورية',
    receiveSafetyAlerts: 'تلقي تنبيهات الأمان والتحديثات',
    locationSharing: 'مشاركة الموقع',
    shareLocationEmergency: 'مشاركة الموقع مع جهات الاتصال الطارئة',
    emergencyContacts: 'جهات الاتصال الطارئة',
    addEmergencyContact: 'إضافة جهة اتصال طارئة',
    name: 'الاسم',
    phone: 'الهاتف',
    relationship: 'العلاقة',
    addContact: 'إضافة جهة اتصال',
    logout: 'تسجيل الخروج',
    
    // Status
    verified: 'معتمد',
    pending: 'معلق',
    rejected: 'مرفوض',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>('en');

  useEffect(() => {
    const savedSettings = localStorage.getItem('tourist-safety-settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      if (settings.language) {
        setLanguageState(settings.language);
      }
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    const savedSettings = localStorage.getItem('tourist-safety-settings');
    const settings = savedSettings ? JSON.parse(savedSettings) : {};
    settings.language = lang;
    localStorage.setItem('tourist-safety-settings', JSON.stringify(settings));
  };

  const t = (key: string): string => {
    return translations[language]?.[key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};