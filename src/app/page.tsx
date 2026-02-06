"use client";

import { useState, useEffect } from "react";
import { Menu, Info } from "lucide-react";
import { useChat } from "@/domains/chat/hooks/useChat";
import ChatInterface from "@/domains/chat/components/ChatInterface";
import DisclaimerModal from "@/domains/onboarding/components/DisclaimerModal";
import ResultModal from "@/domains/interpretation/components/ResultModal";
import { InterpretationResult } from "@/domains/interpretation/types";

export default function HomePage() {
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [interpretation, setInterpretation] = useState<InterpretationResult | null>(null);

  const { messages, isLoading, sendMessage, getConversationHistory } = useChat();

  // Check if disclaimer has been accepted before
  useEffect(() => {
    const accepted = localStorage.getItem("kummong-disclaimer-accepted");
    if (accepted === "true") {
      setShowDisclaimer(false);
    }
  }, []);

  const handleAcceptDisclaimer = () => {
    localStorage.setItem("kummong-disclaimer-accepted", "true");
    setShowDisclaimer(false);
  };

  const handleShowResult = async () => {
    setShowLoading(true);

    // Simulate ad viewing time (2.5 seconds)
    await new Promise((resolve) => setTimeout(resolve, 2500));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: getConversationHistory(),
          action: "interpret",
        }),
      });

      const data = await response.json();

      if (data.interpretation) {
        setInterpretation(data.interpretation);
        setShowLoading(false);
        setShowResult(true);
      }
    } catch (error) {
      console.error("Interpretation error:", error);
      setShowLoading(false);
      alert("해몽 결과를 생성하는 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col h-dvh bg-[#f7f5ef] safe-area-top">
      {/* Header */}
      <header className="bg-[#f7f5ef] px-4 py-3 flex items-center justify-between border-b border-[#e6dfd1] shadow-sm shrink-0">
        <button className="p-2 text-[#8b5a2b] hover:bg-[#8b5a2b]/10 rounded-lg transition-colors">
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#2b2b2b] flex items-center justify-center">
            <span className="text-[#f7f5ef] font-serif font-bold text-sm">夢</span>
          </div>
          <h1 className="font-serif font-bold text-[#333] text-lg tracking-wider">
            꾸몽
          </h1>
        </div>

        <button className="p-2 text-[#8b5a2b] hover:bg-[#8b5a2b]/10 rounded-lg transition-colors">
          <Info className="w-5 h-5" />
        </button>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden safe-area-bottom">
        <ChatInterface
          messages={messages}
          isLoading={isLoading}
          onSendMessage={sendMessage}
          onShowResult={handleShowResult}
        />
      </div>

      {/* Modals */}
      {showDisclaimer && <DisclaimerModal onAccept={handleAcceptDisclaimer} />}

      {showLoading && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center gap-6">
          <div className="w-16 h-16 border-4 border-[#8b5a2b] border-t-transparent rounded-full animate-spin" />
          <div className="text-center">
            <p className="text-[#f7f5ef] font-serif text-lg mb-2">
              해몽 결과를 준비 중입니다...
            </p>
            <p className="text-[#8d8d8d] text-xs">
              잠시만 기다려 주세요
            </p>
          </div>
        </div>
      )}

      {showResult && interpretation && (
        <ResultModal
          result={interpretation}
          onClose={() => setShowResult(false)}
        />
      )}
    </div>
  );
}
