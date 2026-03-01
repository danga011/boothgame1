import { useState, useRef, useEffect } from 'react';
import Layout from '../../ui/Layout';
import Button from '../../ui/Button';
import { colors, sizes } from '../../ui/theme';
import { BRANCHES, type Branch } from '../../types';
import { validateName, validatePhoneLast4 } from './validators';
import { sha256 } from '../../lib/crypto';
import { checkLocalDuplicate } from '../../lib/storage';
import { supabase } from '../../lib/supabase';

interface OnboardingPageProps {
  onSubmit: (branch: Branch, name: string, phoneHash: string) => void;
  onBack: () => void;
}

export default function OnboardingPage({ onSubmit, onBack }: OnboardingPageProps) {
  const [branch, setBranch] = useState<Branch>(BRANCHES[0]);
  const [name, setName] = useState('');
  const [phoneLast4, setPhoneLast4] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const phoneRef = useRef<HTMLInputElement>(null);

  // 전화번호 4자리 입력 시 자동 포커스 이동
  useEffect(() => {
    if (phoneLast4.length === 4) {
      phoneRef.current?.blur();
    }
  }, [phoneLast4]);

  const handleSubmit = async () => {
    setError(null);

    const nameErr = validateName(name);
    if (nameErr) { setError(nameErr); return; }

    const phoneErr = validatePhoneLast4(phoneLast4);
    if (phoneErr) { setError(phoneErr); return; }

    setLoading(true);
    try {
      const phoneHash = await sha256(phoneLast4);

      // 1) 로컬 중복 체크
      const localDup = await checkLocalDuplicate(branch, name, phoneHash);
      if (localDup) {
        setError('이미 참여 기록이 있습니다.');
        setLoading(false);
        return;
      }

      // 2) 온라인이면 서버 중복 체크
      if (navigator.onLine && supabase) {
        const { data } = await supabase
          .from('plays')
          .select('id')
          .eq('branch', branch)
          .eq('name', name)
          .eq('phone_hash', phoneHash)
          .limit(1);

        if (data && data.length > 0) {
          setError('이미 참여 기록이 있습니다.');
          setLoading(false);
          return;
        }
      }

      onSubmit(branch, name, phoneHash);
    } catch (err) {
      console.warn('Onboarding check error:', err);
      // 에러 시에도 게임 진행 허용 (오프라인 허용)
      const phoneHash = await sha256(phoneLast4);
      onSubmit(branch, name, phoneHash);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: sizes.buttonHeight,
    borderRadius: sizes.buttonRadius,
    border: `2px solid ${colors.border}`,
    background: colors.bgSurface,
    color: colors.textPrimary,
    padding: '0 20px',
    fontSize: sizes.fontMd,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: sizes.fontBase,
    color: colors.textSecondary,
    marginBottom: '8px',
    fontWeight: 600,
  };

  return (
    <Layout centered={false}>
      <div
        className="animate-fade-in"
        style={{
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '480px',
          width: '100%',
          margin: '0 auto',
          paddingTop: '40px',
          gap: '24px',
        }}
      >
        <h1 style={{ fontSize: '2rem', fontWeight: 800, textAlign: 'center' }}>
          참여자 정보
        </h1>

        {/* 계열 */}
        <div>
          <div style={labelStyle}>계열</div>
          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value as Branch)}
            style={{
              ...inputStyle,
              appearance: 'none',
              cursor: 'pointer',
            }}
          >
            {BRANCHES.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* 이름 */}
        <div>
          <div style={labelStyle}>이름</div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="한글 또는 영문 (1~10자)"
            maxLength={10}
            autoComplete="off"
            style={inputStyle}
          />
        </div>

        {/* 전화번호 뒷 4자리 */}
        <div>
          <div style={labelStyle}>전화번호 뒷 4자리</div>
          <input
            ref={phoneRef}
            type="tel"
            inputMode="numeric"
            value={phoneLast4}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, '').slice(0, 4);
              setPhoneLast4(v);
            }}
            placeholder="●●●●"
            maxLength={4}
            autoComplete="off"
            style={{ ...inputStyle, letterSpacing: '8px', textAlign: 'center' }}
          />
          <div style={{ fontSize: '0.85rem', color: colors.textMuted, marginTop: '6px' }}>
            중복 확인용으로만 사용되며, 저장되지 않습니다.
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div
            className="animate-scale-in"
            style={{
              background: `${colors.error}22`,
              border: `1px solid ${colors.error}`,
              borderRadius: '12px',
              padding: '14px 18px',
              color: colors.error,
              fontWeight: 600,
              fontSize: sizes.fontBase,
              textAlign: 'center',
            }}
          >
            {error}
          </div>
        )}

        {/* 버튼 그룹 */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <Button variant="ghost" onClick={onBack} style={{ flex: '0 0 auto' }}>
            돌아가기
          </Button>
          <Button
            fullWidth
            onClick={handleSubmit}
            disabled={loading}
            style={{ flex: 1, opacity: loading ? 0.6 : 1 }}
          >
            {loading ? '확인 중...' : '시작하기'}
          </Button>
        </div>
      </div>
    </Layout>
  );
}
