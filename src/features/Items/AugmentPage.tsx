// src/features/items/AugmentsPage.tsx
import { useEffect, useState, useMemo } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { useGetAugmentsQuery } from './ItemsApi';
import type { Item } from './types';

export function AugmentsPage() {
  const { data, isLoading, isError } = useGetAugmentsQuery();
  const [searchText, setSearchText] = useState('');
  const [openAug, setOpenAug] = useState<Item | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const augments: Item[] = data ?? [];

  const filteredAugments = useMemo(() => {
    const keyword = searchText.toLowerCase().trim();
    if (!keyword) return augments;

    return augments.filter((aug) => {
      const name = aug.name.toLowerCase();
      const desc = (aug.desc ?? '').toLowerCase();
      return name.includes(keyword) || desc.includes(keyword);
    });
  }, [augments, searchText]);

  useEffect(() => {
    if (openAug) {
      setIsModalVisible(true);
      return;
    }
    // openAug가 null로 바뀌면 애니메이션 후 언마운트
    const t = window.setTimeout(() => setIsModalVisible(false), 150);
    return () => window.clearTimeout(t);
  }, [openAug]);

  // ESC로 닫기
  useEffect(() => {
    if (!openAug) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenAug(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [openAug]);

  // body 스크롤 잠금
  useEffect(() => {
    if (!openAug) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [openAug]);

  if (isLoading) {
    return <p className='text-gray-400 animate-pulse'>증강체 불러오는 중...</p>;
  }

  if (isError) {
    return <p className='text-red-500'>증강체 데이터를 불러오지 못했습니다.</p>;
  }

  return (
    <div>
      {/* 상단 제목 + 검색바 */}
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-2xl font-bold'>
          증강체 목록 ({filteredAugments.length})
        </h2>

        <div className='flex items-center gap-2 pr-8'>
          <MagnifyingGlassIcon className='w-4 h-4 text-slate-400' />
          <input
            type='text'
            placeholder='증강체 검색'
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className='rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-1 text-sm text-slate-100 w-[200px]'
          />
        </div>
      </div>

      {/* 증강체 카드 그리드 */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {filteredAugments.map((aug) => (
          <article
            key={aug.apiName}
            onClick={() => setOpenAug(aug)}
            className='flex gap-3 rounded-lg border border-slate-700 bg-slate-900/70 p-4 hover:border-sky-500/70 hover:bg-slate-900 transition'
          >
            <img
              src={aug.icon}
              alt={aug.name}
              className='h-12 w-12 flex-none rounded-md bg-slate-800 object-contain'
            />
            <div className='flex-1 min-w-0'>
              <h3 className='text-sm font-semibold text-slate-50'>
                {aug.name}
              </h3>
              <p
                className='mt-1 text-[11px] leading-snug text-slate-300
              break-all line-clamp-3'
              >
                {aug.desc}
              </p>
              {aug.composition?.length > 0 && (
                <p className='mt-2 text-[10px] text-slate-400'>
                  조합: {aug.composition.join(' + ')}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
      {/* 모달 */}
      {isModalVisible && (
        <div className='fixed inset-0 z-50' onClick={() => setOpenAug(null)}>
          {/* backdrop */}
          <div
            className={[
              'absolute inset-0 bg-black/60 transition-opacity duration-150',
              openAug ? 'opacity-100' : 'opacity-0',
            ].join(' ')}
            onClick={() => setOpenAug(null)}
          />

          {/* dialog */}
          <div className='absolute inset-0 flex items-start justify-center p-4'>
            <div
              className={[
                'mt-16 w-[min(760px,95vw)] rounded-xl border border-slate-700 bg-slate-950/95 p-5 shadow-2xl',
                'transition duration-150 ease-out',
                openAug
                  ? 'opacity-100 translate-y-0 scale-100'
                  : 'opacity-0 translate-y-2 scale-[0.98]',
              ].join(' ')}
              role='dialog'
              aria-modal='true'
              // backdrop 클릭으로 닫히는 건 위 div에서 처리. 여기 클릭은 버블 방지.
              onClick={(e) => e.stopPropagation()}
            >
              {openAug && (
                <>
                  <div className='flex items-start gap-4'>
                    <img
                      src={openAug.icon}
                      alt={openAug.name}
                      className='h-16 w-16 flex-none rounded-lg bg-slate-800 object-contain'
                    />

                    <div className='min-w-0 flex-1'>
                      <div className='flex items-start justify-between gap-3'>
                        <h2 className='text-lg font-bold text-slate-50'>
                          {openAug.name}
                        </h2>

                        <button
                          onClick={() => setOpenAug(null)}
                          className='rounded-md border border-slate-700 bg-slate-900/60 px-2 py-1 text-xs text-slate-200 hover:bg-slate-900'
                        >
                          닫기 (ESC)
                        </button>
                      </div>

                      <p className='mt-3 text-sm leading-relaxed text-slate-200 break-all'>
                        {openAug.desc}
                      </p>

                      {openAug.composition?.length > 0 && (
                        <p className='mt-3 text-xs text-slate-300'>
                          조합: {openAug.composition.join(' + ')}
                        </p>
                      )}

                      <p className='mt-2 text-xs text-slate-400'>
                        Tier: {openAug.tier}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {/* 모달 */}
    </div>
  );
}
