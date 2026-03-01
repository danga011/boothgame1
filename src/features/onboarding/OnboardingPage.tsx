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
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: sizes.fontBase,
    color: colors.textSecondary,
    marginBottom: '10px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
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
          paddingTop: '36px',
          gap: '28px',
        }}
      >
        {/* 헤더 */}
        <div style={{ textAlign: 'center', marginBottom: '4px' }}>
          <img
            src="/link.png"
            alt="LINK"
            style={{
              width: '48px',
              height: '48px',
              objectFit: 'contain',
              marginBottom: '12px',
              filter: `drop-shadow(0 2px 8px ${colors.glowPrimary})`,
            }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              background: `linear-gradient(135deg, ${colors.textPrimary}, ${colors.textSecondary})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            참여자 정보
          </h1>
          <p style={{ fontSize: sizes.fontSm, color: colors.textMuted, marginTop: '8px' }}>
            검사를 시작하기 전에 간단한 정보를 입력해주세요
          </p>
        </div>

        {/* 계열 */}
        <div>
          <div style={labelStyle}>
            <span style={{ color: colors.primary }}>01</span>
            계열
          </div>
          <div style={{ position: 'relative' }}>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value as Branch)}
              style={{
                ...inputStyle,
                appearance: 'none',
                cursor: 'pointer',
                paddingRight: '48px',
              }}
            >
              {BRANCHES.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            {/* 셀렉트 화살표 아이콘 */}
            <div
              style={{
                position: 'absolute',
                right: '18px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: colors.textMuted,
                fontSize: '0.8rem',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
        </div>

        {/* 이름 */}
        <div>
          <div style={labelStyle}>
            <span style={{ color: colors.primary }}>02</span>
            이름
          </div>
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
          <div style={labelStyle}>
            <span style={{ color: colors.primary }}>03</span>
            전화번호 뒷 4자리
          </div>
          <input
            ref={phoneRef}
            type="tel"
            inputMode="numeric"
            value={phoneLast4}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, '').slice(0, 4);
              setPhoneLast4(v);
            }}
            placeholder="0000"
            maxLength={4}
            autoComplete="off"
            style={{ ...inputStyle, letterSpacing: '10px', textAlign: 'center', fontWeight: 700 }}
          />
          <div
            style={{
              fontSize: '0.82rem',
              color: colors.textMuted,
              marginTop: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            중복 확인용으로만 사용되며, 저장되지 않습니다.
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div
            className="animate-scale-in"
            style={{
              background: `${colors.error}15`,
              border: `1px solid ${colors.error}50`,
              borderRadius: '14px',
              padding: '16px 20px',
              color: colors.error,
              fontWeight: 600,
              fontSize: sizes.fontSm,
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            {error}
          </div>
        )}

        {/* 버튼 그룹 */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
          <Button variant="ghost" onClick={onBack} style={{ flex: '0 0 auto', minWidth: '90px' }}>
            돌아가기
          </Button>
          <Button
            fullWidth
            onClick={handleSubmit}
            disabled={loading}
            style={{
              flex: 1,
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? '확인 중...' : '검사 시작'}
          </Button>
        </div>
      </div>
    </Layout>
  );
}
