// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import RootLayout from './routes/RootLayout'
import ChampionsPage from './features/champions/ChampionsPage'
import { ChampionDetailPage } from './features/champions/ChampionDetailPage'

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<Navigate to="/champions" replace />} />
        <Route path="/champions" element={<ChampionsPage />} />
        <Route path='champions/:apiName' element={<ChampionDetailPage/>}></Route>
        <Route path="*" element={<p>404 Not Found</p>} />
      </Route>
    </Routes>
  )
}
