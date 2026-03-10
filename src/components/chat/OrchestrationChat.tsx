import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, RotateCcw, Settings2, ChevronDown } from "lucide-react";
import { Message, Phase, ModelConfig } from "@/types/chat";
import { ChatMessage } from "./ChatMessage";
import { PhaseIndicator } from "./PhaseIndicator";
import { ThinkingIndicator } from "./ThinkingIndicator";
import { ModelSelector } from "./ModelSelector";

// Simulated orchestration flow
const simulateOrchestration = (
  userMessage: string,
  onMessage: (msg: Message) => void,
  onPhase: (phase: Phase) => void
) => {
  const id = () => crypto.randomUUID();

  const steps = [
    {
      delay: 800,
      phase: "solving" as Phase,
      msg: {
        id: id(),
        role: "model-a" as const,
        content: `**Analysis of your question:**\n\nLet me break this down step by step.\n\n1. First, I'll identify the core problem\n2. Then explore potential solutions\n3. Finally, propose the optimal approach\n\nBased on the input: *"${userMessage}"*\n\nThe most likely solution involves a systematic approach where we decompose the problem into smaller sub-tasks and tackle each one independently. This reduces complexity and increases our confidence in the final answer.`,
        phase: "solving" as Phase,
        timestamp: new Date(),
      },
    },
    {
      delay: 2200,
      phase: "verifying" as Phase,
      msg: {
        id: id(),
        role: "model-b" as const,
        content: `**Verification Report:**\n\n✅ Logic structure is sound\n⚠️ One potential edge case identified in step 2\n✅ The decomposition approach is valid\n\nHowever, I'd suggest considering an alternative path for sub-task #2 — the current approach may underperform with large inputs. I recommend a \`divide-and-conquer\` strategy instead.`,
        phase: "verifying" as Phase,
        timestamp: new Date(),
      },
    },
    {
      delay: 3800,
      phase: "debating" as Phase,
      msg: {
        id: id(),
        role: "model-a" as const,
        content: `Good point on the edge case. I agree that \`divide-and-conquer\` handles scaling better. Let me revise step 2 to incorporate that pattern. The rest of my analysis holds — the decomposition strategy remains the core framework.`,
        phase: "debating" as Phase,
        timestamp: new Date(),
      },
    },
    {
      delay: 5000,
      phase: "debating" as Phase,
      msg: {
        id: id(),
        role: "model-b" as const,
        content: `Agreed. With that revision, the solution is robust. I'm confident in the approach now. The time complexity improves from O(n²) to O(n log n) with the updated step 2.`,
        phase: "debating" as Phase,
        timestamp: new Date(),
      },
    },
    {
      delay: 6200,
      phase: "consensus" as Phase,
      msg: {
        id: id(),
        role: "orchestrator" as const,
        content: `**Final Answer — Consensus Reached ✓**\n\nBoth models agree on the solution after one round of debate.\n\n**Key revisions:**\n- Step 2 updated to use divide-and-conquer\n- Performance improved to O(n log n)\n- All edge cases addressed\n\n**Confidence: 94%** — Both models converged on the same approach with minor refinements.`,
        phase: "consensus" as Phase,
        timestamp: new Date(),
      },
    },
  ];

  steps.forEach(({ delay, phase, msg }) => {
    setTimeout(() => {
      onPhase(phase);
      setTimeout(() => onMessage(msg), 400);
    }, delay);
  });

  setTimeout(() => onPhase("idle"), 7000);
};

export function OrchestrationChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [showSettings, setShowSettings] = useState(false);
  const [modelA, setModelA] = useState<ModelConfig>({ id: "gemini-flash", name: "Gemini 3 Flash", description: "Fast reasoning" });
  const [modelB, setModelB] = useState<ModelConfig>({ id: "gpt-5", name: "GPT-5", description: "Deep analysis" });
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, phase]);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || phase !== "idle") return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      phase: "idle",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    simulateOrchestration(
      trimmed,
      (msg) => setMessages((prev) => [...prev, msg]),
      setPhase
    );
  }, [input, phase]);

  const handleReset = () => {
    setMessages([]);
    setPhase("idle");
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-model-a" />
            <span className="w-2 h-2 rounded-full bg-model-b" />
          </div>
          <h1 className="text-sm font-semibold text-foreground">Dual-Model Orchestration</h1>
        </div>
        <div className="flex items-center gap-2">
          <PhaseIndicator currentPhase={phase} />
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <Settings2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-border"
          >
            <div className="p-4">
              <ModelSelector
                modelA={modelA}
                modelB={modelB}
                onModelAChange={setModelA}
                onModelBChange={setModelB}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 rounded-full bg-model-a animate-pulse-dot" />
              <span className="text-muted-foreground/30 text-lg">⇄</span>
              <span className="w-3 h-3 rounded-full bg-model-b animate-pulse-dot" style={{ animationDelay: "0.5s" }} />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Ask anything</p>
            <p className="text-xs text-muted-foreground/60 max-w-sm">
              Two models will solve, verify, and debate to reach a consensus answer.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            <AnimatePresence>
              {phase !== "idle" && <ThinkingIndicator phase={phase} />}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border p-4">
        <div className="relative bg-card border border-border rounded-xl focus-within:ring-1 focus-within:ring-ring transition-shadow">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question…"
            rows={1}
            className="w-full bg-transparent px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none font-mono"
            disabled={phase !== "idle"}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || phase !== "idle"}
            className="absolute right-2 bottom-2 p-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-30 hover:bg-primary/90 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center justify-between mt-2 px-1">
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground/50">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-model-a" />
              {modelA.name}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-model-b" />
              {modelB.name}
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground/40 font-mono">
            Orchestrated · Local
          </span>
        </div>
      </div>
    </div>
  );
}
