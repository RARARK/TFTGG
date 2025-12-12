// src/features/champions/ChampionFilters.tsx

interface ChampionFiltersProps {
  cost: 'all' | number;
  roles: string[];
  traits: string[];
  allRoles: string[];
  allTraits: string[];
  onCostChange: (c: 'all' | number) => void;
  onRoleToggle: (role: string) => void;
  onTraitToggle: (trait: string) => void;
}

export function ChampionFilters({
  cost,
  roles,
  traits,
  allRoles,
  allTraits,
  onCostChange,
  onRoleToggle,
  onTraitToggle,
}: ChampionFiltersProps) {
  const costOptions = [1, 2, 3, 4, 5];

  const base =
    'px-2 py-1 rounded-md text-xs border transition select-none cursor-pointer';

  return (
    <section className='mb-6 space-y-4 text-slate-200'>
      {/* Cost */}
      <div>
        <h3 className='mb-1 text-[11px] text-slate-400'>Cost</h3>
        <div className='flex flex-wrap gap-2'>
          {/* ALL */}
          <button
            onClick={() => onCostChange('all')}
            className={
              cost === 'all'
                ? `${base} bg-sky-600 border-sky-400`
                : `${base} bg-slate-800 border-slate-700`
            }
          >
            All
          </button>

          {costOptions.map((c) => (
            <button
              key={c}
              onClick={() => onCostChange(c)}
              className={
                cost === c
                  ? `${base} bg-sky-600 border-sky-400`
                  : `${base} bg-slate-800 border-slate-700`
              }
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Roles */}
      <div>
        <h3 className='mb-1 text-[11px] text-slate-400'>Role</h3>
        <div className='flex flex-wrap gap-2'>
          {allRoles.map((role) => {
            const active = roles.includes(role);
            return (
              <button
                key={role}
                onClick={() => onRoleToggle(role)}
                className={
                  active
                    ? `${base} bg-purple-600 border-purple-400`
                    : `${base} bg-slate-800 border-slate-700`
                }
              >
                {role}
              </button>
            );
          })}
        </div>
      </div>

      {/* Traits */}
      <div>
        <h3 className='mb-1 text-[11px] text-slate-400'>Traits</h3>
        <div className='flex flex-wrap gap-2'>
          {allTraits.map((trait) => {
            const active = traits.includes(trait);
            return (
              <button
                key={trait}
                onClick={() => onTraitToggle(trait)}
                className={
                  active
                    ? `${base} bg-emerald-600 border-emerald-400`
                    : `${base} bg-slate-800 border-slate-700`
                }
              >
                {trait}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
