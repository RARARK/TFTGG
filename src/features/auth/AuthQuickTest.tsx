import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';

export function AuthQuickTest() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [session, setSession] = useState<Session | null>(null);
  const user = session?.user;

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) =>
      setSession(s)
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  const signUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password: pw });
    if (error) alert(error.message);
    else alert('가입 요청 완료! (이메일 인증 설정에 따라 메일 확인)');
  };

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: pw,
    });
    if (error) alert(error.message);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className='space-y-3'>
      <div className='space-x-2'>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='email'
          className='border px-2 py-1'
        />
        <input
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder='password'
          type='password'
          className='border px-2 py-1'
        />
      </div>

      <div className='space-x-2'>
        <button onClick={signUp} className='border px-2 py-1'>
          회원가입
        </button>
        <button onClick={signIn} className='border px-2 py-1'>
          로그인
        </button>
        <button onClick={signOut} className='border px-2 py-1'>
          로그아웃
        </button>
      </div>

      <div className='text-sm'>
        {user ? (
          <>
            <div>로그인됨: {user.email}</div>
            <div>user id: {user.id}</div>
          </>
        ) : (
          <div>로그아웃 상태</div>
        )}
      </div>
    </div>
  );
}
