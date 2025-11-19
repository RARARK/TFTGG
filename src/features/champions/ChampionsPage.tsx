// src/features/champions/ChampionsPage.tsx
import { Link } from 'react-router-dom'
import { useGetChampionsQuery } from './championsApi'

export default function ChampionsPage() {
  const { data, isLoading, isError } = useGetChampionsQuery()

  if (isLoading)
    return <p className="text-gray-400 animate-pulse">로딩 중...</p>
  if (isError) return <p className="text-red-500">데이터를 불러오지 못했습니다.</p>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        챔피언 목록 ({data?.length ?? 0})
      </h2>

      {/* 챔피언 카드 그리드 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {data?.map((champ) => (
          <Link
            key={champ.id}
            to={`/champions/${champ.id}`}
            className="border rounded-lg p-2 shadow hover:shadow-md transition"
          >
            <img
              src={champ.icon}
              alt={champ.name}
              className="w-full h-24 object-contain bg-gray-900/20 rounded"
            />
            <div className="mt-2">
              <h3 className="font-semibold text-sm">{champ.name}</h3>
              <p className="text-xs text-gray-500">
                Cost: {champ.cost} / {champ.traits.join(', ')}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
