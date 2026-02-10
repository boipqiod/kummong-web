Project Kummong (꾸몽) 기획 및 설계서

작성일: 2026년 2월 5일
최종 수정일: 2026년 2월 5일 (v3.1 - 최종 확정안)
목표: 한국적 전통 해몽의 지혜를 현대적 기술로 재해석하여 글로벌 사용자에게 제공하는 AI 서비스

1. 프로젝트 개요 (Overview)

1.1 서비스명

Kummong (꾸몽)

어원: 꿈(Kkum) + 몽(夢, Mong). 한국어와 한자어의 결합으로 직관적인 '꿈 해몽' 서비스를 표방.

1.2 서비스 정의

한국 고유의 민속 신앙과 해몽 비결(동의보감, 토정비결 등)에 기반한 대화형 AI 꿈 해몽 서비스. 복잡한 절차 없이 누구나 무료로 대화하고, 광고 시청(로딩 대기)을 통해 결과를 확인하는 직관적인 웹 서비스.

1.3 핵심 가치 (Core Value)

Deep Interaction: 단답형 결과 제시가 아닌, '문진(Deep Interview)'을 통해 꿈의 디테일을 파악하는 10턴 이상의 심층 대화.

Korean Wisdom: 한국적 상징(돼지, 조상, 이빨 등)에 대한 독자적인 해석 알고리즘.

Frictionless Experience: 회원가입, 결제, 앱 설치가 필요 없는 완전 무장벽 사용자 경험 제공.

2. 서비스 아키텍처 및 페르소나 (Service Architecture)

2.1 AI 페르소나: '현대의 지관(地官)'

아이덴티티: 60대 이상의 점잖은 한학자이자, 현대 문물을 이해하는 지혜로운 노인.

톤앤매너 (Tone & Manner):

국내: "하게나", "하는가" 식의 하대나 가벼움을 지양. "~합니까?", "~보입니다", "~뜻하지요" 등 격조 있는 합쇼체/해요체 혼용.

해외: 'The Master from the East'. 고풍스럽고 신비로운 영문체(Archaic English) 사용.

대화 로직: 정보 스캔 → 결핍 정보 질문(문진) → 상황 확정 → 해몽 및 조언 제시.

2.2 사용자 진입 및 흐름 (User Flow)

Step 1 (진입): '지관의 당부(면책 조항)' 확인 및 동의 후 입장 (Guest Mode, 비로그인).

Step 2 (대화): 지관과 10턴 내외의 대화를 통해 꿈의 정황 파악.

Step 3 (생성): "무료로 결과 확인하기" 버튼 클릭 → "천기누설 중..." (광고/로딩 화면) 노출 (3~5초).

Step 4 (결과): 3가지 탭(Tab)으로 구성된 상세 결과 카드 제시.

분석(Analysis): 텍스트 중심의 상세 풀이 및 조언.

부적(Talisman): 시각적 만족감을 주는 디지털 부적 이미지.

공유(Social): SNS 공유에 최적화된 요약 카드.

3. 수익 모델 (Business Model)

PG 연동 등의 복잡한 과금 모델을 배제하고, 트래픽 기반의 광고 수익 및 제휴 마케팅에 집중.

3.1 전면 광고 (Interstitial Simulation)

매체: 구글 애드센스 (Google AdSense) - 전면 광고(Vignette).

전략: 결과 확인 버튼 클릭 시 페이지 전환을 트리거하여 구글 전면 광고 노출 유도.

UX: "결과 생성 중"이라는 로딩 UI를 통해 광고 노출 시간에 대한 심리적 저항감 완화.

3.2 제휴 마케팅 (Affiliate - 보조)

전략: 결과 카드 하단이나 조언(Action Item) 부분에 쿠팡 파트너스/알리익스프레스 제휴 링크를 '행운의 아이템'으로 추천.

4. 법적 고지 및 윤리 규정 (Legal & Compliance)

사용자 보호 및 법적 분쟁 예방을 위한 필수 안전장치 마련 (UI에 자연스럽게 녹여냄).

4.1 진입 단계 (Onboarding Disclaimer)

컨셉: "지관의 당부 (Geomancer's Request)"

필수 동의: "해몽은 삶의 지혜일 뿐, 현실의 선택과 책임은 본인에게 있음을 명심하겠습니다" 체크박스 강제.

4.2 상시 고지 (Transparency)

Sticky Banner: 채팅창 상단에 "본 서비스는 전통 해몽을 AI로 재해석한 오락용 콘텐츠입니다" 문구 상시 노출.

결과 카드 경고: 최종 해몽 결과 하단에 "AI-Generated Content: 실제와 다를 수 있으니 맹신하지 마십시오" 명시.

5. 기술 스택 (Tech Stack)

비용 효율성과 1인 개발 생산성을 극대화한 2026년형 스택.

5.1 Frontend (Mobile Web)

Framework: Next.js 15+ (App Router).

UI/UX: Tailwind CSS + Shadcn/ui (한지 질감, 서신 스타일, 먹색 톤 등 한국적 테마 적용).

Features:

Web Speech API: 무료 음성 인식(STT) 마이크 버튼.

html2canvas: 결과 카드 이미지 저장 기능.

5.2 Backend & Data

Platform: Supabase (PostgreSQL).

Role: 대화 로그 저장(History) 용도로만 사용. (인증 로직 제거)

5.3 AI Engine

Model: Google Gemini 2.0 Flash (API) - Context Caching 적용으로 비용 절감.

5.4 지식 관리 (Knowledge Management)

소스 데이터: 동의보감, 민속 신앙 등 해몽 데이터를 텍스트 파일(knowledge_base.md)로 관리.

주입 방식: 시스템 프롬프트에 지식 전체를 포함(In-Context Learning)하여 전송.

6. 개발 로드맵 (Milestones)

Phase 1: MVP 런칭 (1주 - Fast Track)

UI 구현 (한옥 컨셉, 탭 기반 결과 화면, 반응형).

Gemini 연동 및 '지관' 페르소나/지식 주입.

구글 애드센스 연동 및 전면 광고(로딩 시뮬레이션) 테스트.

법적 고지(Disclaimer) 모달 및 이미지 저장 기능 구현.

Vercel 배포.

Phase 2: 기능 고도화 (TBD)

대화 내역 저장 기능 (LocalStorage 활용).

다국어 지원 (KO/EN) 고도화.