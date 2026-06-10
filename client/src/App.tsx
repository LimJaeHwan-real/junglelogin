// useState는 화면에서 바뀌는 값을 저장할 때 사용합니다.
// useEffect는 화면이 처음 열렸을 때 특정 코드를 실행할 때 사용합니다.
import { useEffect, useState } from 'react';

// NestJS 서버로 요청을 보내기 위해 만든 axios 설정입니다.
import { api } from './api';

// 화면 스타일 파일입니다.
import './style.css';

// 서버에서 받아오는 사용자 정보의 TypeScript 타입입니다.
type User = {
  id: string;
  name: string;
  email: string;
};

export default function App() {
  // 현재 화면이 로그인인지 회원가입인지 저장합니다.
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // 로그인한 사용자 정보입니다. null이면 로그인하지 않은 상태입니다.
  const [user, setUser] = useState<User | null>(null);

  // input에 입력한 값들을 저장합니다.
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 에러 메시지를 저장합니다.
  const [message, setMessage] = useState('');

  // 현재 로그인한 사용자를 서버에 물어보는 함수입니다.
  const loadMe = async () => {
    try {
      // 쿠키가 유효하면 서버가 사용자 정보를 반환합니다.
      const res = await api.get<User>('/auth/me');
      setUser(res.data);
    } catch {
      // 로그인하지 않았거나 쿠키가 없으면 user를 null로 둡니다.
      setUser(null);
    }
  };

  // 화면이 처음 열릴 때 로그인 상태를 확인합니다.
  useEffect(() => {
    void loadMe();
  }, []);

  // 로그인 또는 회원가입 버튼을 눌렀을 때 실행됩니다.
  const submit = async () => {
    setMessage('');

    try {
      if (mode === 'register') {
        // 회원가입 모드이면 이름, 이메일, 비밀번호를 보냅니다.
        await api.post('/auth/register', { name, email, password });
      } else {
        // 로그인 모드이면 이메일, 비밀번호만 보냅니다.
        await api.post('/auth/login', { email, password });
      }

      // 성공하면 내 정보를 다시 불러와 로그인 성공 화면을 보여줍니다.
      await loadMe();
    } catch {
      setMessage('입력값을 확인해주세요.');
    }
  };

  // 로그아웃 버튼을 눌렀을 때 실행됩니다.
  const logout = async () => {
    // 서버에 쿠키 삭제를 요청합니다.
    await api.post('/auth/logout');

    // React 상태도 비워서 로그인 화면으로 돌아갑니다.
    setUser(null);
  };

  // user가 있으면 로그인 성공 화면을 보여줍니다.
  if (user) {
    return (
      <main className="page">
        <section className="card">
          <h1>로그인 성공</h1>
          <p>이름: {user.name}</p>
          <p>이메일: {user.email}</p>
          <button onClick={logout}>로그아웃</button>
        </section>
      </main>
    );
  }

  // user가 없으면 로그인/회원가입 화면을 보여줍니다.
  return (
    <main className="page">
      <section className="card">
        <h1>{mode === 'login' ? '로그인' : '회원가입'}</h1>

        {/* 회원가입 모드일 때만 이름 입력창을 보여줍니다. */}
        {mode === 'register' && (
          <input
            placeholder="이름"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        )}

        <input
          placeholder="이메일"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <input
          placeholder="비밀번호"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        {/* message가 있을 때만 에러 메시지를 보여줍니다. */}
        {message && <p className="error">{message}</p>}

        <button onClick={submit}>{mode === 'login' ? '로그인' : '회원가입'}</button>

        <button
          className="link"
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
        >
          {mode === 'login' ? '회원가입 화면으로' : '로그인 화면으로'}
        </button>
      </section>
    </main>
  );
}