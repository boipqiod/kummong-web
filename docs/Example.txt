import {
  Bot,
  CheckSquare,
  ChevronRight,
  Download,
  Feather,
  Globe,
  Info,
  LayoutTemplate,
  Menu,
  Mic,
  MicOff,
  ScrollText,
  Share2,
  Shield,
  Sparkles,
  Square,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// --- Types ---
type Message = {
  id: number;
  role: "user" | "assistant";
  text: string;
  type?: "text" | "action";
  actionLabel?: string;
};

type ResultType = "ANALYSIS" | "TALISMAN" | "SOCIAL";

export default function KummongApp() {
  // --- States ---
  const [input, setInput] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [isAdLoading, setIsAdLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [resultTab, setResultTab] = useState<ResultType>("ANALYSIS");

  // Disclaimer
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      text: "어서 오시게. 간밤에 무슨 꿈을 꾸었는가?\n내 기력이 닿는 데까지 풀어줌세.",
      type: "text",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // --- Effects ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isListening]);

  // Web Speech API Initialization
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = "ko-KR";

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result) => result.transcript)
            .join("");
          setInput(transcript);
        };

        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => setIsListening(false);
        recognitionRef.current = recognition;
      }
    }
  }, []);

  // --- Handlers ---
  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      setInput("");
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const newUserMsg: Message = {
      id: Date.now(),
      role: "user",
      text: input,
      type: "text",
    };
    setMessages((prev) => [...prev, newUserMsg]);
    setInput("");

    setTimeout(() => {
      const newAiMsg: Message = {
        id: Date.now() + 1,
        role: "assistant",
        text: "흐음... 범상치 않은 기운이 느껴지는군. 재물이 제 발로 걸어 들어오는 형국이야.\n이제 그 결론을 내어줄 준비가 되었어.",
        type: "text",
      };
      setMessages((prev) => [...prev, newAiMsg]);

      setTimeout(() => {
        const actionMsg: Message = {
          id: Date.now() + 2,
          role: "assistant",
          text: "해몽 결과를 확인할 준비가 되었는가?",
          type: "action",
          actionLabel: "무료로 결과 확인하기",
        };
        setMessages((prev) => [...prev, actionMsg]);
      }, 800);
    }, 1000);
  };

  const handleShowResult = () => {
    setIsAdLoading(true);
    // Simulate Ad Delay
    setTimeout(() => {
      setIsAdLoading(false);
      setShowResultModal(true);
    }, 2500);
  };

  const handleSaveImage = () => {
    // In a real app, use html2canvas here
    alert("이미지가 앨범에 저장되었습니다. (시뮬레이션)");
  };

  // --- Components ---

  // 1. Analysis Card (Text Heavy)
  const AnalysisCard = () => (
    <div className="bg-[#fffefc] border border-[#eaddcf] p-6 rounded-sm shadow-sm relative overflow-hidden h-full flex flex-col">
      <div className="absolute top-2 bottom-2 left-2 right-2 border border-[#f5efe6] pointer-events-none rounded-sm"></div>

      <div className="relative z-10 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4 border-b border-[#eaddcf] pb-3">
          <span className="font-serif font-bold text-lg text-[#333]">
            해몽 풀이
          </span>
          <span className="text-xs text-[#8d8d8d] font-serif">2026.02.05</span>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto pr-1 custom-scrollbar">
          <div>
            <h4 className="text-xs font-bold text-[#8b5a2b] mb-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> 꿈의 의미
            </h4>
            <p className="text-sm text-[#4a3b2a] leading-relaxed font-serif text-justify">
              "검은 돼지가 집안으로 들어와 품에 안기는 꿈은 대길(大吉) 중의
              대길이라. 이는 재물과 행운이 그대를 찾아왔음을 뜻하며, 피하지 않고
              안았으니 그 복을 온전히 내 것으로 만들었다는 징조라."
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#8b5a2b] mb-1 flex items-center gap-1">
              <Feather className="w-3 h-3" /> 지관의 조언
            </h4>
            <p className="text-sm text-[#4a3b2a] leading-relaxed font-serif text-justify">
              "망설이던 투자가 있다면 지금이 적기요, 복권을 사보는 것도 좋겠소.
              다만 들어온 복을 자랑하면 달아날 수 있으니 입을 무겁게 하시오."
            </p>
          </div>
        </div>

        {/* Stamp */}
        <div className="absolute bottom-4 right-4 w-16 h-16 border-2 border-red-800 rounded-sm flex items-center justify-center opacity-40 rotate-[-12deg] pointer-events-none">
          <span className="font-serif text-red-900 text-xs font-bold">
            地官
            <br />印
          </span>
        </div>
      </div>
    </div>
  );

  // 2. Talisman Card (Visual Heavy)
  const TalismanCard = () => (
    <div className="bg-[#e8b646] p-4 rounded-sm shadow-inner relative h-full flex flex-col items-center justify-center overflow-hidden border-4 border-[#d4a024]">
      {/* Paper Texture */}
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')]"></div>

      {/* Mystic Patterns */}
      <div className="absolute top-2 left-2 text-[#b02e0c] font-serif text-xs opacity-60">
        勅
      </div>
      <div className="absolute top-2 right-2 text-[#b02e0c] font-serif text-xs opacity-60">
        令
      </div>
      <div className="absolute bottom-2 left-2 text-[#b02e0c] font-serif text-xs opacity-60">
        禁
      </div>
      <div className="absolute bottom-2 right-2 text-[#b02e0c] font-serif text-xs opacity-60">
        急
      </div>

      <div className="relative z-10 text-center w-full border-2 border-[#b02e0c] h-full flex flex-col items-center justify-center p-2 bg-[#f2c75c]/30">
        <div
          className="text-[#b02e0c] text-6xl font-serif font-extrabold mb-4 tracking-widest animate-pulse"
          style={{ writingMode: "vertical-rl" }}>
          萬事亨通
        </div>
        <div className="text-[#b02e0c] font-serif font-bold text-lg mb-2">
          재물대박부
        </div>
        <p className="text-[#5d4037] text-[10px] font-medium opacity-80 leading-tight">
          이 부적을 지니면
          <br />
          들어온 복이 나가지 않습니다.
        </p>

        <div className="mt-4 w-12 h-12 rounded-full border-2 border-[#b02e0c] flex items-center justify-center text-[#b02e0c] text-xs font-bold opacity-80">
          꾸몽
        </div>
      </div>
    </div>
  );

  // 3. Social Card (Shareable)
  const SocialCard = () => (
    <div className="bg-gradient-to-br from-[#2b2b2b] to-[#1a1a1a] p-6 rounded-xl shadow-xl h-full flex flex-col relative overflow-hidden text-white">
      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl"></div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
          <Sparkles className="w-6 h-6 text-yellow-400" />
        </div>

        <div>
          <div className="text-yellow-400 text-xs font-bold tracking-[0.2em] mb-2 uppercase">
            Dream Interpretation
          </div>
          <h2 className="text-3xl font-serif font-bold mb-1">천운 (天運)</h2>
          <p className="text-white/60 text-xs">상위 1% 길몽입니다.</p>
        </div>

        <div className="w-full h-[1px] bg-white/20 my-2"></div>

        <p className="text-sm font-light leading-relaxed text-white/90">
          "흑돼지를 품에 안았으니
          <br />
          거대한 부가 당신을 선택했습니다."
        </p>
      </div>

      <div className="relative z-10 mt-auto pt-4 flex justify-between items-end">
        <span className="text-[10px] text-white/40 font-serif">Kummong AI</span>
        <div className="w-8 h-8 rounded bg-white text-black flex items-center justify-center font-serif font-bold text-xs">
          夢
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex justify-center min-h-screen bg-[#e8e4d9] font-sans text-stone-800 overflow-hidden">
      {/* Main Container */}
      <div className="w-full max-w-md h-screen flex flex-col shadow-2xl relative overflow-hidden border-x border-[#cbbba9] bg-[#f7f5ef]">
        {/* --- Header --- */}
        <header className="relative z-30 bg-[#2b2b2b] text-[#f7f5ef] shadow-lg shrink-0">
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#8b5a2b] opacity-80"></div>
          <div className="flex items-center justify-between px-5 pt-5 pb-5 relative">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-90">
                <Menu className="w-6 h-6 text-[#f7f5ef]" />
              </button>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-xl tracking-[0.1em] text-[#f7f5ef]">
                    꾸몽
                  </span>
                  <div className="w-2 h-2 rounded-full bg-[#c0392b] shadow-[0_0_8px_rgba(192,57,43,0.8)]"></div>
                </div>
                <span className="text-[10px] text-stone-400 font-serif tracking-widest opacity-80 flex items-center gap-1">
                  <Bot className="w-3 h-3" /> 조선 AI 지관
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1 text-[10px] font-medium text-stone-400 hover:text-white border border-stone-600 px-2 py-1 rounded">
                <Globe className="w-3 h-3" /> KO
              </button>
            </div>
          </div>
        </header>

        {/* --- Sticky Disclaimer --- */}
        <div className="bg-[#f5f0e6] border-b border-[#d6c4b0] px-4 py-2 flex items-start gap-2 relative z-20 shrink-0">
          <Info className="w-3.5 h-3.5 text-[#8b5a2b] mt-0.5 shrink-0" />
          <p className="text-[10px] text-[#5d4037] leading-tight font-medium">
            본 서비스는 재미로 보는 AI 해몽이며, 결과에 대한 책임은 본인에게
            있습니다.
          </p>
        </div>

        {/* --- Chat Area --- */}
        <main className="flex-1 overflow-y-auto p-0 relative bg-[#f7f5ef] scroll-smooth">
          <div className="fixed inset-0 pointer-events-none opacity-[0.08] bg-[url('https://www.transparenttextures.com/patterns/rice-paper-3.png')] z-0"></div>

          <div className="relative z-10 min-h-full pb-6 px-4 pt-6 flex flex-col gap-8">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex w-full animate-in fade-in slide-in-from-bottom-4 duration-700 ${msg.role === "user" ? "justify-end" : "justify-center"}`}>
                {msg.role === "assistant" ? (
                  <div className="w-full max-w-[95%] relative group">
                    <div className="absolute -left-1 -top-3 w-8 h-8 rounded-full bg-[#2b2b2b] border-2 border-[#8b5a2b] flex items-center justify-center z-20 shadow-md">
                      <span className="font-serif text-[#f7f5ef] text-xs font-bold">
                        夢
                      </span>
                    </div>
                    <div className="bg-[#fffefc] border border-[#eaddcf] p-6 rounded-sm shadow-sm relative overflow-hidden ml-2">
                      <div className="absolute top-2 bottom-2 left-2 right-2 border border-[#f5efe6] pointer-events-none rounded-sm"></div>
                      <p className="font-serif text-[#4a3b2a] text-[17px] leading-relaxed whitespace-pre-wrap relative z-10">
                        {msg.text}
                      </p>

                      {msg.type === "action" && (
                        <div className="mt-6 relative z-10">
                          <button
                            onClick={handleShowResult}
                            className="w-full bg-[#8b5a2b] text-[#f7f5ef] py-3.5 rounded shadow-lg hover:bg-[#6d4521] transition-all flex items-center justify-center gap-2 group/btn border border-[#5d3a1a]">
                            <Sparkles className="w-4 h-4 text-[#ffd700]" />
                            <span className="font-serif font-bold tracking-wide">
                              {msg.actionLabel}
                            </span>
                            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                          </button>
                          <p className="text-center text-[10px] text-[#a8a29e] mt-2 font-serif flex items-center justify-center gap-1">
                            <Info className="w-3 h-3" /> 잠시 기다리시면 결과가
                            공개됩니다.
                          </p>
                        </div>
                      )}
                      <div className="absolute -bottom-2 -right-2 w-16 h-16 opacity-10 rotate-[-15deg] border-2 border-red-800 rounded-sm flex items-center justify-center pointer-events-none">
                        <span className="font-serif text-red-800 text-xs">
                          地官
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-[80%] bg-[#3d3d3d] text-[#f7f5ef] px-5 py-3 rounded-2xl rounded-tr-sm shadow-md text-[15px] font-medium leading-relaxed border border-[#2b2b2b]">
                    {msg.text}
                  </div>
                )}
              </div>
            ))}
            {isListening && (
              <div className="flex justify-center py-4">
                <div className="bg-[#8b5a2b]/90 backdrop-blur-sm text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3 animate-pulse border border-[#6d4521]">
                  <Mic className="w-5 h-5" />
                  <span className="text-sm font-medium font-serif tracking-wide">
                    듣고 있습니다...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </main>

        {/* --- Input Area --- */}
        <footer className="bg-[#e6dfd1] px-4 py-4 relative z-20 shrink-0 border-t border-[#d6c4b0] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="absolute inset-0 opacity-[0.15] bg-[linear-gradient(90deg,#8b5a2b_1px,transparent_1px)] bg-[size:40px_100%] pointer-events-none"></div>
          <div
            className={`flex items-center gap-2 rounded-xl px-2 py-2 transition-all relative z-10 shadow-inner ${isListening ? "bg-[#8b5a2b]/10 border border-[#8b5a2b]" : "bg-[#fdfbf7] border border-[#d6c4b0] focus-within:border-[#8b5a2b]"}`}>
            <button
              onClick={toggleListening}
              className={`p-2.5 rounded-lg transition-all flex-shrink-0 ${isListening ? "text-red-600 bg-red-50 animate-pulse" : "text-[#8b5a2b] hover:bg-[#8b5a2b]/10"}`}>
              {isListening ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder={isListening ? "..." : "꿈 내용을 적어주십시오..."}
              disabled={isListening}
              className="flex-1 bg-transparent border-none focus:ring-0 text-[#333] placeholder-[#9ca3af] px-2 text-[15px] font-medium font-sans h-10"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isListening}
              className={`p-2.5 rounded-lg transition-all flex-shrink-0 ${input.trim() && !isListening ? "bg-[#2b2b2b] text-[#f7f5ef] shadow-md hover:bg-[#404040]" : "bg-[#eaddcf] text-[#cbbba9] cursor-not-allowed"}`}>
              <Feather className="w-5 h-5" />
            </button>
          </div>
        </footer>

        {/* --- Entry Disclaimer Modal --- */}
        {showDisclaimer && (
          <div className="absolute inset-0 z-[100] bg-black/80 flex items-center justify-center p-6 backdrop-blur-[2px]">
            <div className="w-full max-w-sm bg-[#fdfbf7] rounded-sm overflow-hidden shadow-2xl relative border-2 border-[#8b5a2b] animate-in zoom-in-95">
              <div className="bg-[#f5f0e6] p-6 pb-4 text-center border-b border-[#eaddcf]">
                <ScrollText className="w-8 h-8 text-[#8b5a2b] mx-auto mb-2 opacity-80" />
                <h2 className="text-xl font-serif font-bold text-[#4a3b2a] tracking-widest">
                  지관의 당부
                </h2>
              </div>
              <div className="p-6 pt-4 space-y-5">
                <p className="text-sm text-[#5d4037] leading-relaxed font-serif text-center font-bold">
                  "해몽은 삶의 지혜일 뿐, 현실의 선택은 그대의 몫임을
                  명심하시게."
                </p>
                <button
                  onClick={() => setAgreedToTerms(!agreedToTerms)}
                  className="flex items-center gap-3 w-full p-2 hover:bg-[#8b5a2b]/5 rounded cursor-pointer group">
                  {agreedToTerms ? (
                    <CheckSquare className="w-5 h-5 text-[#8b5a2b]" />
                  ) : (
                    <Square className="w-5 h-5 text-[#a8a29e]" />
                  )}
                  <span
                    className={`text-xs font-serif ${agreedToTerms ? "text-[#8b5a2b] font-bold" : "text-[#8d8d8d]"}`}>
                    결과에 대한 책임은 본인에게 있음을 동의합니다.
                  </span>
                </button>
                <button
                  onClick={() => agreedToTerms && setShowDisclaimer(false)}
                  disabled={!agreedToTerms}
                  className={`w-full py-3.5 rounded-sm font-serif font-bold tracking-[0.2em] transition-all border ${agreedToTerms ? "bg-[#2b2b2b] text-[#f7f5ef] hover:bg-[#404040]" : "bg-[#eaddcf] text-[#f7f5ef] cursor-not-allowed"}`}>
                  입장하기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- Ad Loading Overlay --- */}
        {isAdLoading && (
          <div className="absolute inset-0 z-[60] bg-[#2b2b2b] flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
            <div className="relative mb-8">
              <div className="w-24 h-24 rounded-full border-4 border-[#8b5a2b] flex items-center justify-center animate-[spin_10s_linear_infinite]">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#eaddcf] animate-[spin_5s_linear_infinite_reverse]"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-3xl font-bold text-[#f7f5ef] animate-pulse">
                  夢
                </span>
              </div>
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#f7f5ef] mb-2 tracking-widest">
              천기누설 중...
            </h3>
            <div className="mt-8 bg-white/10 px-4 py-2 rounded text-xs text-[#8d8d8d]">
              AD Area (Google AdSense)
            </div>
          </div>
        )}

        {/* --- Result Modal (Multi-View) --- */}
        {showResultModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in zoom-in-95">
            <div className="w-full max-w-sm bg-[#fdfbf7] rounded-sm shadow-2xl relative border-2 border-[#d6c4b0] h-[600px] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="bg-[#2b2b2b] p-4 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#fdfbf7] flex items-center justify-center text-[#2b2b2b] font-serif font-bold">
                    夢
                  </div>
                  <h2 className="text-[#f7f5ef] font-serif font-bold text-lg tracking-widest">
                    해몽 결과
                  </h2>
                </div>
                <button
                  onClick={() => setShowResultModal(false)}
                  className="text-[#f7f5ef] hover:opacity-70">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-[#d6c4b0] bg-[#f5f0e6] shrink-0">
                <button
                  onClick={() => setResultTab("ANALYSIS")}
                  className={`flex-1 py-3 text-xs font-bold font-serif flex items-center justify-center gap-1 transition-colors ${resultTab === "ANALYSIS" ? "bg-[#fdfbf7] text-[#8b5a2b] border-b-2 border-[#8b5a2b]" : "text-[#8d8d8d] hover:bg-[#eaddcf]"}`}>
                  <ScrollText className="w-3 h-3" /> 정석 풀이
                </button>
                <button
                  onClick={() => setResultTab("TALISMAN")}
                  className={`flex-1 py-3 text-xs font-bold font-serif flex items-center justify-center gap-1 transition-colors ${resultTab === "TALISMAN" ? "bg-[#fdfbf7] text-[#8b5a2b] border-b-2 border-[#8b5a2b]" : "text-[#8d8d8d] hover:bg-[#eaddcf]"}`}>
                  <Shield className="w-3 h-3" /> 디지털 부적
                </button>
                <button
                  onClick={() => setResultTab("SOCIAL")}
                  className={`flex-1 py-3 text-xs font-bold font-serif flex items-center justify-center gap-1 transition-colors ${resultTab === "SOCIAL" ? "bg-[#fdfbf7] text-[#8b5a2b] border-b-2 border-[#8b5a2b]" : "text-[#8d8d8d] hover:bg-[#eaddcf]"}`}>
                  <LayoutTemplate className="w-3 h-3" /> 공유용 카드
                </button>
              </div>

              {/* Content Area */}
              <div className="flex-1 p-4 bg-[#fdfbf7] overflow-hidden relative">
                <div className="h-full w-full transition-all duration-300">
                  {resultTab === "ANALYSIS" && <AnalysisCard />}
                  {resultTab === "TALISMAN" && <TalismanCard />}
                  {resultTab === "SOCIAL" && <SocialCard />}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-4 bg-[#f5f0e6] border-t border-[#d6c4b0] shrink-0 space-y-3">
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveImage}
                    className="flex-1 bg-[#2b2b2b] text-[#f7f5ef] py-3 rounded-sm text-sm font-bold shadow-md hover:bg-[#404040] flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" /> 이미지 저장
                  </button>
                  <button className="flex-1 bg-white text-[#333] py-3 rounded-sm text-sm font-bold border border-[#d6c4b0] hover:bg-[#fffefc] flex items-center justify-center gap-2">
                    <Share2 className="w-4 h-4" /> 공유하기
                  </button>
                </div>
                <div className="text-[9px] text-[#a8a29e] text-center leading-tight">
                  AI-Generated Content: 실제와 다를 수 있으니 맹신하지 마십시오.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- Side Menu --- */}
        {isMenuOpen && (
          <div className="absolute inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
              onClick={() => setIsMenuOpen(false)}></div>
            <div className="absolute left-0 top-0 bottom-0 w-[80%] max-w-[300px] bg-[#fdfbf7] shadow-2xl animate-in slide-in-from-left duration-300 border-r border-[#d6c4b0] flex flex-col">
              <div className="h-16 bg-[#2b2b2b] flex items-center justify-center relative overflow-hidden shrink-0">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')]"></div>
                <h2 className="text-xl font-serif font-bold text-[#fdfbf7] relative z-10 flex items-center gap-2">
                  <span className="text-[#8b5a2b]">夢</span>
                  {language === "KO" ? "꾸몽 메뉴" : "Menu"}
                </h2>
              </div>

              <div className="flex-1 p-6 space-y-2 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-3.png')]">
                {["지난 해몽 기록", "오늘의 운세", "설정", "문의하기"].map(
                  (item, idx) => (
                    <button
                      key={idx}
                      className="w-full p-4 hover:bg-[#f5f0e6] rounded cursor-pointer flex items-center gap-4 group transition-colors border-b border-[#eaddcf] text-left">
                      <div className="w-8 h-8 rounded-full bg-[#eaddcf] group-hover:bg-[#d6c4b0] flex items-center justify-center text-[#5d4037] transition-colors">
                        <ScrollText className="w-4 h-4" />
                      </div>
                      <span className="font-serif text-[#4a3b2a] font-medium text-lg">
                        {item}
                      </span>
                    </button>
                  ),
                )}
              </div>

              <div className="p-6 bg-[#f5f0e6] border-t border-[#d6c4b0] text-center shrink-0">
                <p className="text-xs text-[#8d8d8d] font-serif leading-relaxed">
                  Kummong v1.0
                  <br />
                  &copy; 2026 Joseon AI Lab
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
