// src/features/champions/ChampionsPage.tsx
import { Link } from 'react-router-dom';
import { useGetChampionsQuery } from './championsApi';
import { MagnifyingGlassIcon, UserIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { useState, useMemo, useEffect } from 'react';
import { ChampionFilters } from './ChampionsFilters';
import { supabase } from '../../lib/supabaseClient';
import { UserAvatarButton } from '../../components/UserAvatarButton';

export default function ChampionsPage() {
  const { data, isLoading, isError } = useGetChampionsQuery();
  const [searchText, setSearchText] = useState('');
  const champs = data ?? [];
  const [selectedCost, setSelectedCost] = useState<'all' | number>('all');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  const toggleFavorite = async (champId: string) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      alert('로그인이 필요합니다');
      return;
    }

    if (favoriteIds.has(champId)) {
      // 이미 즐겨찾기 → 삭제
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', session.user.id)
        .eq('kind', 'champion')
        .eq('target', champId);

      setFavoriteIds((prev) => {
        const next = new Set(prev);
        next.delete(champId);
        return next;
      });
    } else {
      // 즐겨찾기 추가
      await supabase.from('favorites').insert({
        user_id: session.user.id,
        kind: 'champion',
        target: champId,
      });

      setFavoriteIds((prev) => new Set(prev).add(champId));
    }
  };

  const COST_BG_CLASS: Record<number, string> = {
    1: 'from-slate-800 to-slate-700',
    2: 'from-emerald-800 to-emerald-600',
    3: 'from-sky-800 to-sky-600',
    4: 'from-purple-800 to-purple-600',
    5: 'from-yellow-700 to-yellow-500',
  };

  function getCostBgGradient(cost: number): string {
    if (cost >= 5) return COST_BG_CLASS[5];
    return COST_BG_CLASS[cost] ?? COST_BG_CLASS[1];
  }

  const { allRoles, allTraits } = useMemo(() => {
    const rolesSet = new Set<string>();
    const traitsSet = new Set<string>();

    champs.forEach((champ) => {
      if (champ.role) rolesSet.add(champ.role);
      champ.traits.forEach((t) => traitsSet.add(t));
    });

    return {
      allRoles: Array.from(rolesSet),
      allTraits: Array.from(traitsSet),
    };
  }, [champs]);

  // Role / Trait toggle helpers
  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const toggleTrait = (trait: string) => {
    setSelectedTraits((prev) =>
      prev.includes(trait) ? prev.filter((r) => r !== trait) : [...prev, trait]
    );
  };

  const filteredChamps = useMemo(() => {
    return champs.filter((champ) => {
      const keyword = searchText.toLowerCase().trim();
      const nameMatch = champ.name.toLowerCase().includes(keyword);

      const costMatch =
        selectedCost === 'all' ? true : champ.cost === selectedCost;

      const roleMatch =
        selectedRoles.length === 0
          ? true
          : selectedRoles.includes(champ.role ?? '');

      const traitMatch =
        selectedTraits.length === 0
          ? true
          : selectedTraits.every((t) => champ.traits.includes(t));

      return nameMatch && costMatch && roleMatch && traitMatch;
    });
  }, [champs, searchText, selectedCost, selectedRoles, selectedTraits]);

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

  if (isLoading)
    return <p className='text-gray-400 animate-pulse'>로딩 중...</p>;
  if (isError)
    return <p className='text-red-500'>데이터를 불러오지 못했습니다.</p>;

  return (
    <div>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-2xl font-bold'>
          챔피언 목록 ({filteredChamps?.length ?? 0})
        </h2>

        <div className='flex items-center gap-2 pr-8'>
          <MagnifyingGlassIcon className='w-4 h-4 text-slate-400' />
          <input
            type='text'
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className='rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-1 text-sm text-slate-100 w-[170px]'
          />
          <UserAvatarButton />
        </div>
      </div>

      {/* ⭐ Chip 필터 UI */}
      <ChampionFilters
        cost={selectedCost}
        roles={selectedRoles}
        traits={selectedTraits}
        allRoles={allRoles}
        allTraits={allTraits}
        onCostChange={setSelectedCost}
        onRoleToggle={toggleRole}
        onTraitToggle={toggleTrait}
      />

      {/* 챔피언 카드 그리드 */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>
        {filteredChamps?.map((champ) => (
          <Link
            key={champ.id}
            to={`/champions/${champ.id}`}
            className='border rounded-lg p-2 shadow hover:shadow-md transition'
          >
            <img
              src={champ.icon}
              alt={champ.name}
              className={` w-full h-24 object-contain rounded
                bg-gradient-to-br ${getCostBgGradient(champ.cost)}`}
            />
            <div className='mt-2'>
              <div className='flex items-center'>
                <h3 className='font-semibold text-sm'>{champ.name}</h3>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(champ.id);
                  }}
                  aria-label='즐겨찾기'
                >
                  {favoriteIds.has(champ.id) ? (
                    <StarSolid className='w-5 h-5 text-yellow-400 hover:text-yellow-300 transition-colors' />
                  ) : (
                    <StarOutline className='w-5 h-5 text-gray-400 hover:text-yellow-300 transition-colors' />
                  )}
                </button>
              </div>
              <p className='text-xs text-gray-500'>
                Cost: {champ.cost} / {champ.traits.join(', ')}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
