import { Link } from 'react-router-dom';
import { UserIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
import { useGetMyProfileQuery } from '../features/Mypage/profileApi';
import { supabase } from '../lib/supabaseClient';

export function UserAvatarButton() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    const sync = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!alive) return;
      if (error) {
        setUserId(null);
        return;
      }
      setUserId(data.session?.user?.id ?? null);
    };

    sync();

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      sync();
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const { data: profile } = useGetMyProfileQuery(userId!, { skip: !userId });

  const to = userId ? '/profile' : '/auth';

  return (
    <Link to={to} aria-label={userId ? 'profile' : 'login'}>
      {profile?.avatar_url ? (
        <img
          src={profile.avatar_url}
          alt='profile avatar'
          className='w-8 h-8 rounded-full object-cover'
        />
      ) : (
        <UserIcon className='w-8 h-8 text-slate-400 hover:text-slate-800 cursor-pointer' />
      )}
    </Link>
  );
}
