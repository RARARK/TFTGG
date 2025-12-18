// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import RootLayout from './routes/RootLayout';
import ChampionsPage from './features/champions/ChampionsPage';
import { ChampionDetailPage } from './features/champions/ChampionDetailPage';
import { AugmentsPage } from './features/Items/AugmentPage';
import { AuthQuickTest } from './features/auth/AuthQuickTest';
import { FavoritesPage } from './features/Favorites/FavoritesPage';

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<Navigate to='/champions' replace />} />
        <Route path='/champions' element={<ChampionsPage />} />
        <Route path='/Augments' element={<AugmentsPage />} />
        <Route path='/Favorites' element={<FavoritesPage />} />
        <Route
          path='champions/:apiName'
          element={<ChampionDetailPage />}
        ></Route>
        <Route path='auth' element={<AuthQuickTest />} />
        <Route path='*' element={<p>404 Not Found</p>} />
      </Route>
    </Routes>
  );
}
