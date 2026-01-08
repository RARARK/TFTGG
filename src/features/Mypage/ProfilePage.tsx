import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabaseClient';
import { withTimeout } from '../../lib/withTimeout';
import { useRef } from 'react';

type ProfileRow = {
  user_id: string;
  nickname: string;
  avatar_url: string | null;
  bio: string | null;
  tos_accepted_at: string | null;
  created_at: string;
  updated_at: string;
};

export default function ProfilePage() {
  console.log('[ProfilePage] render', Date.now());
  console.log('*** LOADED ProfilePage module ***');

  const [session, setSession] = useState<Session | null>(null);
  const user = session?.user ?? null;

  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastLoadedUidRef = useRef<string | null>(null);

  // 폼 입력 상태
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');

  // 프로필 사진 업로드
  const [uploading, setUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // 업로드 함수
  const uploadAvatar = async (file: File) => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    // 가벼운 안전장치 (원하면 수치 조절)
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있어요.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('2MB 이하 이미지만 업로드할 수 있어요.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const path = `${user.id}/avatar.png`;

      // 1) 업로드 (덮어쓰기)
      const { error: uploadErr } = await withTimeout(
        supabase.storage.from('avatars').upload(path, file, {
          upsert: true,
          contentType: file.type,
        }),
        8000
      );
      if (uploadErr) throw uploadErr;

      // 2) public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(path);
      const publicUrl = data.publicUrl;

      // 3) 캐시 깨기용 버전 파라미터
      const avatarUrl = `${publicUrl}?v=${Date.now()}`;

      // 4) profiles.avatar_url 업데이트
      const { data: updated, error: updateErr } = await withTimeout(
        supabase
          .from('profiles')
          .update({ avatar_url: avatarUrl })
          .eq('user_id', user.id)
          .select('*')
          .single(),
        15000
      );
      if (updateErr) throw updateErr;

      setProfile(updated as ProfileRow);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setUploading(false);
    }
  };

  // 프로필 로드/생성 함수
  const loadOrCreateProfile = async (uid: string, email?: string | null) => {
    setError(null);

    try {
      console.log('[ProfilePage] loadOrCreateProfile start', uid);
      console.log('[ProfilePage] before profile select');
      const { data: existing, error: selectErr } = await withTimeout(
        supabase.from('profiles').select('*').eq('user_id', uid).maybeSingle(),
        8000
      );

      console.log('[ProfilePage] after profile select', {
        existing,
        selectErr,
      });
      console.log('[ProfilePage] profile select done', {
        hasExisting: !!existing,
        selectErr,
      });

      if (selectErr) throw selectErr;

      if (!existing) {
        const baseNick =
          (email?.split('@')?.[0] ?? 'user').slice(0, 20) || 'user';

        const { data: created, error: insertErr } = await withTimeout(
          supabase
            .from('profiles')
            .insert({ user_id: uid, nickname: baseNick })
            .select('*')
            .single(),
          8000
        );

        if (insertErr) throw insertErr;

        setProfile(created as ProfileRow);
        setNickname(created.nickname ?? '');
        setBio(created.bio ?? '');
        return;
      }

      setProfile(existing as ProfileRow);
      setNickname(existing.nickname ?? '');
      setBio(existing.bio ?? '');
    } catch (e) {
      console.log('[ProfilePage] loadOrCreateProfile catch', e);
      setError(e instanceof Error ? e.message : String(e));
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  // 세션 세팅 + auth 변화 구독
  useEffect(() => {
    let alive = true;
    setLoading(true);

    const { data: sub } = supabase.auth.onAuthStateChange(async (event, s) => {
      console.log('[ProfilePage] onAuthStateChange', event, !!s?.user);
      if (!alive) return;
      if (!alive) return;

      try {
        setError(null);
        setSession(s);

        const uid = s?.user?.id ?? null;

        if (!uid) {
          lastLoadedUidRef.current = null;
          setProfile(null);
          setNickname('');
          setBio('');
          return;
        }

        // ✅ 같은 유저면 프로필 재로딩 안 함 (TOKEN_REFRESHED 포함)
        if (lastLoadedUidRef.current === uid) return;

        lastLoadedUidRef.current = uid;
        await loadOrCreateProfile(uid, s?.user.email);
        setError(null);
      } catch (e) {
        console.log('[ProfilePage] onAuthStateChange catch', e);
        if (!alive) return;
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const saveProfile = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (!nickname.trim()) {
      alert('닉네임을 입력해 주세요.');
      return;
    }

    setSaving(true);
    setError(null);

    const { data, error: updateErr } = await withTimeout(
      supabase
        .from('profiles')
        .update({ nickname: nickname.trim(), bio: bio.trim() || null })
        .eq('user_id', user.id)
        .select('*')
        .single(),
      8000
    );

    setSaving(false);

    if (updateErr) {
      setError(updateErr.message);
      return;
    }

    setProfile(data as ProfileRow);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // ---- UI ----

  if (loading) {
    return (
      <p className='text-slate-400 animate-pulse'>프로필 불러오는 중...</p>
    );
  }

  if (!user) {
    return (
      <div className='space-y-2'>
        <h2 className='text-2xl font-bold'>마이페이지</h2>
        <p className='text-slate-300'>로그인 상태가 아닙니다.</p>
        <p className='text-slate-500 text-sm'>
          로그인 UI는 나중에 예쁘게 만들고, 지금은 AuthQuickTest로 로그인해도
          됩니다.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-start justify-between gap-3'>
        <div>
          <h2 className='text-2xl font-bold'>마이페이지</h2>
          <p className='text-slate-400 text-sm'>{user.email}</p>
        </div>

        <button
          onClick={signOut}
          className='rounded-md border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 hover:bg-slate-900'
        >
          로그아웃
        </button>
      </div>

      {error && (
        <div className='rounded-lg border border-red-800/50 bg-red-950/30 p-3 text-sm text-red-200'>
          {error}
        </div>
      )}

      <div className='rounded-xl border border-slate-700 bg-slate-950/60 p-4 space-y-3'>
        <div className='flex items-center justify-between'>
          <h3 className='font-semibold text-slate-100'>프로필</h3>
          {profile && (
            <p className='text-xs text-slate-500'>
              updated_at: {profile.updated_at}
            </p>
          )}
        </div>

        <label className='block space-y-1'>
          <span className='text-xs text-slate-400'>닉네임</span>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className='w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100'
            placeholder='닉네임'
          />
        </label>

        <label className='block space-y-1'>
          <span className='text-xs text-slate-400'>소개</span>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className='w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100'
            placeholder='한 줄 소개'
            rows={3}
          />
        </label>

        <div className='flex items-center gap-4'>
          <img
            src={
              avatarPreview ??
              profile?.avatar_url ??
              'https://placehold.co/80x80'
            }
            alt='avatar'
            className='h-20 w-20 rounded-full border border-slate-700 object-cover'
          />

          <div className='space-y-2'>
            <input
              type='file'
              accept='image/*'
              disabled={uploading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;

                // 프리뷰 (선택)
                const url = URL.createObjectURL(f);
                setAvatarPreview(url);

                uploadAvatar(f).finally(() => {
                  // 프리뷰 URL 메모리 해제 (선택)
                  URL.revokeObjectURL(url);
                  setAvatarPreview(null);
                });
              }}
              className='block w-full text-sm text-slate-300 file:mr-3 file:rounded-md file:border file:border-slate-700 file:bg-slate-900/60 file:px-3 file:py-2 file:text-sm file:text-slate-100 hover:file:bg-slate-900'
            />

            <p className='text-xs text-slate-500'>
              {uploading ? '업로드 중...' : 'PNG/JPG, 2MB 이하 추천'}
            </p>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <button
            onClick={saveProfile}
            disabled={saving}
            className='rounded-md border border-slate-700 bg-sky-900/40 px-3 py-2 text-sm text-slate-100 hover:bg-sky-900/60 disabled:opacity-60'
          >
            {saving ? '저장 중...' : '저장'}
          </button>

          <span className='text-xs text-slate-500'>
            (RLS로 본인만 수정 가능)
          </span>
        </div>
      </div>

      <div className='rounded-xl border border-slate-700 bg-slate-950/40 p-4'>
        <h3 className='font-semibold text-slate-100 mb-2'>다음 단계</h3>
        <ul className='list-disc pl-5 text-sm text-slate-300 space-y-1'>
          <li>프로필 사진 업로드(Supabase Storage) + avatar_url 저장</li>
          <li>Favorites(챔피언/증강체) 목록을 여기서 보여주기</li>
          <li>약관 동의(tos_accepted_at) UI</li>
        </ul>
      </div>
    </div>
  );
}
