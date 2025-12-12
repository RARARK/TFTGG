// src/routes/RootLayout.tsx
import { NavLink, Outlet } from 'react-router-dom';

export default function RootLayout() {
  return (
    <div className='min-h-screen flex'>
      {/* 사이드바 */}
      <aside className='w-56 border-r p-4 space-y-3'>
        <h1 className='text-xl font-bold'>MetaTftttt</h1>

        <nav className='flex flex-col gap-2'>
          <NavLink
            to='/champions'
            className={({ isActive }) =>
              isActive ? 'font-semibold text-blue-500' : ''
            }
          >
            Champions
          </NavLink>

          <NavLink
            to='/Augments'
            className={({ isActive }) =>
              isActive ? 'font-semibold text-blue-500' : ''
            }
          >
            Augment
          </NavLink>

          {/* 나중에 Builder, Meta, Augments 등 메뉴 추가 예정 */}
        </nav>
      </aside>

      {/* 메인 컨텐츠 영역 */}
      <main className='flex-1 p-4 overflow-auto'>
        <Outlet />
      </main>
    </div>
  );
}
