import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// ── 학과 상수 (프론트엔드와 동일) ──

const MAJOR_INFO: Record<string, { short: string; color: string; description: string }> = {
  '컴퓨터학부': {
    short: '컴퓨터',
    color: '#3b82f6',
    description: '컴퓨터의 핵심 원리를 이해하고 견고한 소프트웨어 시스템을 설계하는 개발자',
  },
  'ICT융합학부': {
    short: 'ICT융합',
    color: '#8b5cf6',
    description: '기술과 인문학, 디자인을 융합하여 새로운 가치를 창조하는 융합 전문가',
  },
  '인공지능학과': {
    short: 'AI',
    color: '#06b6d4',
    description: 'AI 기술로 미래를 설계하고 혁신을 이끄는 인공지능 전문가',
  },
  '수리데이터사이언스학과': {
    short: '수리DS',
    color: '#10b981',
    description: '수학적 사고와 데이터 분석으로 세상의 패턴을 발견하는 전문가',
  },
}

// ── 타입 ──

interface SendReportRequest {
  email: string
  playerName: string
  branch: string
  phoneHash: string
  recommendedMajor: string
  typeName: string
  majorPercents: Record<string, number>
}

// ── CORS 헤더 ──

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// ── HTML 이메일 템플릿 ──

function buildEmailHtml(data: SendReportRequest): string {
  const primaryColor = MAJOR_INFO[data.recommendedMajor]?.color ?? '#f59e0b'

  // 학과별 퍼센트를 내림차순 정렬
  const sortedMajors = Object.entries(data.majorPercents)
    .sort(([, a], [, b]) => b - a)

  const majorBarsHtml = sortedMajors
    .map(([major, pct]) => {
      const info = MAJOR_INFO[major]
      if (!info) return ''
      const barWidth = Math.min(pct * 2, 100)
      return `
        <div style="margin-bottom:12px">
          <div style="display:flex;justify-content:space-between;margin-bottom:4px">
            <span style="font-size:14px;font-weight:600;color:#f8fafc">${major}</span>
            <span style="font-size:14px;font-weight:700;color:${info.color}">${pct}%</span>
          </div>
          <div style="width:100%;height:8px;border-radius:4px;background:#334155">
            <div style="width:${barWidth}%;height:8px;border-radius:4px;background:${info.color}"></div>
          </div>
        </div>`
    })
    .join('')

  // 4개 학과 간략 목록
  const majorListHtml = Object.entries(MAJOR_INFO)
    .map(([major, info]) => {
      const pct = data.majorPercents[major] ?? 0
      const isTop = major === sortedMajors[0]?.[0]
      const bgStyle = isTop
        ? `background:${info.color}15;border:1px solid ${info.color}40`
        : 'background:transparent;border:1px solid transparent'
      return `
        <div style="display:flex;align-items:center;gap:12px;${bgStyle};border-radius:10px;padding:10px 12px;margin-bottom:8px">
          <div style="width:4px;height:36px;border-radius:2px;background:${info.color};flex-shrink:0"></div>
          <div style="flex:1">
            <div style="font-size:14px;font-weight:700;color:#f8fafc">${info.short}</div>
            <div style="font-size:12px;color:#64748b">${info.description}</div>
          </div>
          <div style="font-size:15px;font-weight:700;color:${info.color}">${pct}%</div>
        </div>`
    })
    .join('')

  return `<!DOCTYPE html>
<html lang="ko">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:'Apple SD Gothic Neo','Pretendard',sans-serif;color:#f8fafc">
  <div style="max-width:520px;margin:0 auto;padding:32px 20px">

    <!-- 헤더 -->
    <div style="text-align:center;margin-bottom:24px">
      <div style="font-size:13px;color:#64748b;letter-spacing:1px">LINK와 함께하는 소프트웨어융합대학 검사</div>
      <div style="font-size:20px;font-weight:700;color:#f8fafc;margin-top:8px">${data.playerName}님의 검사 결과</div>
    </div>

    <!-- 유형 뱃지 -->
    <div style="background:linear-gradient(135deg,${primaryColor}15,${primaryColor}30);border:2px solid ${primaryColor}60;border-radius:16px;padding:24px 20px;text-align:center;margin-bottom:16px">
      <div style="font-size:13px;color:#64748b">당신의 유형</div>
      <div style="font-size:28px;font-weight:800;color:${primaryColor};margin:8px 0">${data.typeName}</div>
      <div style="font-size:16px;font-weight:600;color:#94a3b8">${data.recommendedMajor}</div>
    </div>

    <!-- 학과별 적합도 바 -->
    <div style="background:#1e293b;border-radius:16px;padding:20px;margin-bottom:16px">
      <div style="font-size:13px;color:#64748b;margin-bottom:14px;font-weight:600">학과별 적합도</div>
      ${majorBarsHtml}
    </div>

    <!-- 전체 학과 목록 -->
    <div style="background:#1e293b;border-radius:16px;padding:20px;margin-bottom:24px">
      <div style="font-size:13px;color:#64748b;margin-bottom:14px;font-weight:600">소프트웨어융합대학 4개 학과</div>
      ${majorListHtml}
    </div>

    <!-- 푸터 -->
    <div style="text-align:center;font-size:12px;color:#64748b;line-height:1.6">
      제10대 소프트웨어융합대학 학생회 LINK<br>
      한양대학교 ERICA 소프트웨어융합대학
    </div>
  </div>
</body>
</html>`
}

// ── 메인 핸들러 ──

serve(async (req: Request) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body: SendReportRequest = await req.json()

    // 검증
    if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      throw new Error('유효하지 않은 이메일 주소입니다.')
    }
    if (!body.playerName || !body.recommendedMajor || !body.majorPercents) {
      throw new Error('필수 데이터가 누락되었습니다.')
    }

    // HTML 이메일 생성
    const html = buildEmailHtml(body)

    // Resend API 호출
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY가 설정되지 않았습니다.')
    }

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'LINK 학생회 <onboarding@resend.dev>',
        to: [body.email],
        subject: `[LINK] ${body.playerName}님의 학과 적성 검사 결과`,
        html,
      }),
    })

    if (!resendRes.ok) {
      const errText = await resendRes.text()
      throw new Error(`이메일 발송 실패: ${errText}`)
    }

    // DB에 email 업데이트
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    await supabase
      .from('plays')
      .update({ email: body.email })
      .eq('name', body.playerName)
      .eq('branch', body.branch)
      .eq('phone_hash', body.phoneHash)

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } },
    )
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류'
    return new Response(
      JSON.stringify({ success: false, error: message }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      },
    )
  }
})
