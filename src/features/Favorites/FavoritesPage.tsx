import { useGetChampionsQuery } from '../champions/championsApi';
import { supabase } from '../../lib/supabaseClient';
import { useEffect } from 'react';

export function FavoritesPage() {
  const { data, isLoading, isError } = useGetChampionsQuery();
  const champs = data ?? [];

  useEffect(() => {
    let alive = true;

    const loadFavorites = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // 로그인 안 됨 → 즐겨찾기 비움
      if (!session?.user) {
        if (alive) setFavoriteIds(new Set());
        return;
      }

      const { data, error } = await supabase
        .from('favorites')
        .select('target')
        .eq('user_id', session.user.id)
        .eq('kind', 'champion');

      if (error) {
        console.error(error);
        if (alive) setFavoriteIds(new Set());
        return;
      }

      const ids = new Set((data ?? []).map((row) => row.target));
      if (alive) setFavoriteIds(ids);
    };

    loadFavorites();

    // auth 변화(로그인/로그아웃) 시에도 다시 로드
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      loadFavorites();
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);
  return <></>;
}
