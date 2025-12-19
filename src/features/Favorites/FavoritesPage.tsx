import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useGetChampionsQuery } from '../champions/championsApi';
import type { Champion } from '../champions/types';

type FavoriteRow = { target: string };

export default function FavoritesPage() {
  const { data: champs = [], isLoading, isError } = useGetChampionsQuery();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [authChecked, setAuthChecked] = useState(false);

  const championsById = useMemo(() => {
    const m = new Map<string, Champion>();
    champs.forEach((c) => m.set(c.id, c));
    return m;
  }, [champs]);

  const favoriteChamps = useMemo(() => {
    // Set -> 실제 champ 객체 배열로 변환 (+ 없는 id는 걸러냄)
    return Array.from(favoriteIds)
      .map((id) => championsById.get(id))
      .filter(isChampion);
  }, [favoriteIds, championsById]);

  const COST_BG_CLASS: Record<number, string> = {
    1: 'from-slate-800 to-slate-700',
    2: 'from-emerald-800 to-emerald-600',
    3: 'from-sky-800 to-sky-600',
    4: 'from-purple-800 to-purple-600',
    5: 'from-yellow-700 to-yellow-500',
  };

  const traitCounts = useMemo(() => {
    const m = new Map<string, number>();

    favoriteChamps.forEach((champ) => {
      champ.traits.forEach((t) => {
        m.set(t, (m.get(t) ?? 0) + 1);
      });
    });

    return m;
  }, [favoriteChamps]);

  const traitList = useMemo(() => {
    // 화면 표시용 배열로 변환 + 정렬(개수 desc, 이름 asc)
    return Array.from(traitCounts.entries()).sort(
      (a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'ko')
    );
  }, [traitCounts]);

  function isChampion(c: Champion | undefined): c is Champion {
    return c !== undefined;
  }

  function getCostBgGradient(cost: number): string {
    if (cost >= 5) return COST_BG_CLASS[5];
    return COST_BG_CLASS[cost] ?? COST_BG_CLASS[1];
  }

  useEffect(() => {
    let alive = true;

    const loadFavorites = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // 로그인 안 됨: 비우고 종료
      if (!session?.user) {
        if (alive) {
          setFavoriteIds(new Set());
          setAuthChecked(true);
        }
        return;
      }

      const { data, error } = await supabase
        .from('favorites')
        .select('target')
        .eq('user_id', session.user.id)
        .eq('kind', 'champion');

      if (alive) setAuthChecked(true);

      if (error) {
        console.error(error);
        if (alive) setFavoriteIds(new Set());
        return;
      }

      const ids = new Set(
        (data as FavoriteRow[] | null)?.map((row) => row.target) ?? []
      );
      if (alive) setFavoriteIds(ids);
    };

    loadFavorites();

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      loadFavorites();
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (isLoading)
    return <p className='text-gray-400 animate-pulse'>로딩 중...</p>;
  if (isError)
    return <p className='text-red-500'>챔피언 데이터를 불러오지 못했습니다.</p>;

  // auth 체크 전에는 깜빡임 방지용으로 잠깐 대기
  if (!authChecked)
    return <p className='text-gray-400 animate-pulse'>인증 확인 중...</p>;

  return (
    <div className='space-y-4'>
      <h2 className='text-2xl font-bold'>
        즐겨찾기 (챔피언) ({favoriteChamps.length})
      </h2>
      <div className='flex flex-wrap gap-2'>
        {traitList.map(([trait, count]) => (
          <span
            key={trait}
            className='rounded-full border border-slate-700 bg-slate-900/60 px-2 py-1 text-xs text-slate-100'
          >
            {trait}({count})
          </span>
        ))}
      </div>

      {favoriteIds.size === 0 ? (
        <p className='text-slate-400'>
          즐겨찾기한 챔피언이 없거나, 로그인이 필요합니다.
        </p>
      ) : (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>
          {favoriteChamps.map((champ) => (
            <Link
              key={champ.id}
              to={`/champions/${champ.id}`}
              className='border rounded-lg p-2 shadow hover:shadow-md transition'
            >
              <img
                src={champ.icon}
                alt={champ.name}
                className={`w-full h-24 object-contain rounded bg-gradient-to-br ${getCostBgGradient(
                  champ.cost ?? 1
                )}`}
              />
              <div className='mt-2'>
                <h3 className='font-semibold text-sm'>{champ.name}</h3>
                <p className='text-xs text-gray-500'>
                  Cost: {champ.cost}/ {champ.traits.join(', ')}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
