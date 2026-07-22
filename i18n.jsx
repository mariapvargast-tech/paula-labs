// i18n — shared language context
const LangContext = React.createContext({ lang: 'en', setLang: () => {} });
const useLang = () => React.useContext(LangContext);
window.LangContext = LangContext;
window.useLang = useLang;
