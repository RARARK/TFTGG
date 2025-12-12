// src/features/champions/ChampionsPage.tsx
import { Link } from 'react-router-dom';
import { useGetChampionsQuery } from './championsApi';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { useState, useMemo } from 'react';
import { ChampionFilters } from './ChampionsFilters';

export default function ChampionsPage() {
  const { data, isLoading, isError } = useGetChampionsQuery();
  const [searchText, setSearchText] = useState('');
  const champs = data ?? [];
  const [selectedCost, setSelectedCost] = useState<'all' | number>('all');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  type Cost = 1 | 2 | 3 | 4 | 5;

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
              <h3 className='font-semibold text-sm'>{champ.name}</h3>
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
