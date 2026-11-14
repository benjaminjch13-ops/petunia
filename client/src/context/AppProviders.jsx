import { FavoritesProvider } from './FavoritesContext.jsx';
import { CompareProvider } from './CompareContext.jsx';
import { PreferencesProvider } from './PreferencesContext.jsx';
import { MascotProvider } from './MascotContext.jsx';

export function AppProviders({ children }) {
  return (
    <PreferencesProvider>
      <FavoritesProvider>
        <CompareProvider>
          <MascotProvider>{children}</MascotProvider>
        </CompareProvider>
      </FavoritesProvider>
    </PreferencesProvider>
  );
}
