import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, RotateCcw, Settings2, ChevronDown, Image as ImageIcon, ArrowUp } from "lucide-react";
import { Message, Phase, ModelConfig } from "@/types/chat";
import { ChatMessage } from "./ChatMessage";
import { PhaseIndicator } from "./PhaseIndicator";
import { ThinkingIndicator } from "./ThinkingIndicator";
import { ModelSelector } from "./ModelSelector";
import { SidebarTrigger } from "@/components/ui/sidebar";

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
        id: id(), role: "model-a" as const,
        content: `**Analysis of your question:**\n\nLet me break this down step by step.\n\n1. First, I'll identify the core problem\n2. Then explore potential solutions\n3. Finally, propose the optimal approach\n\nBased on the input: *"${userMessage}"*\n\nThe most likely solution involves a systematic approach where we decompose the problem into smaller sub-tasks and tackle each one independently.`,
        phase: "solving" as Phase, timestamp: new Date(),
      },
    },
    {
      delay: 2200,
      phase: "verifying" as Phase,
      msg: {
        id: id(), role: "model-b" as const,
        content: `**Verification Report:**\n\n✅ Logic structure is sound\n⚠️ One potential edge case identified in step 2\n✅ The decomposition approach is valid\n\nI'd suggest considering a \`divide-and-conquer\` strategy for sub-task #2.`,
        phase: "verifying" as Phase, timestamp: new Date(),
      },
    },
    {
      delay: 3800,
      phase: "debating" as Phase,
      msg: {
        id: id(), role: "model-a" as const,
        content: `Good point on the edge case. I agree that \`divide-and-conquer\` handles scaling better. Let me revise step 2 accordingly.`,
        phase: "debating" as Phase, timestamp: new Date(),
      },
    },
    {
      delay: 5000,
      phase: "debating" as Phase,
      msg: {
        id: id(), role: "model-b" as const,
        content: `Agreed. With that revision, complexity improves from O(n²) to O(n log n). The solution is now robust.`,
        phase: "debating" as Phase, timestamp: new Date(),
      },
    },
    {
      delay: 6200,
      phase: "consensus" as Phase,
      msg: {
        id: id(), role: "orchestrator" as const,
        content: `**Final Answer — Consensus Reached ✓**\n\nBoth models converged after one debate round.\n\n**Key revisions:**\n- Step 2 updated to divide-and-conquer\n- Performance: O(n log n)\n- All edge cases addressed\n\n**Confidence: 94%**`,
        phase: "consensus" as Phase, timestamp: new Date(),
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

interface OrchestrationChatProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onFirstMessage?: (title: string) => void;
}

export function OrchestrationChat({ messages, setMessages, onFirstMessage }: OrchestrationChatProps) {
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [showSettings, setShowSettings] = useState(false);
  const [modelA, setModelA] = useState<ModelConfig>({ id: "gemini-flash", name: "Gemini 3 Flash", description: "Fast reasoning" });
  const [modelB, setModelB] = useState<ModelConfig>({ id: "gpt-5", name: "GPT-5", description: "Deep analysis" });
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, phase]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [input]);

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

    if (messages.length === 0 && onFirstMessage) {
      onFirstMessage(trimmed.slice(0, 50) + (trimmed.length > 50 ? "…" : ""));
    }

    simulateOrchestration(
      trimmed,
      (msg) => setMessages((prev) => [...prev, msg]),
      setPhase
    );
  }, [input, phase, messages.length, onFirstMessage, setMessages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-screen w-full">
      {/* Top bar */}
      <header className="flex items-center justify-between px-3 py-2 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
          {!isEmpty && (
            <PhaseIndicator currentPhase={phase} />
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Settings */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-border"
          >
            <div className="p-4 max-w-2xl mx-auto w-full">
              <ModelSelector modelA={modelA} modelB={modelB} onModelAChange={setModelA} onModelBChange={setModelB} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {isEmpty ? (
          /* Empty state — centered input like reference */
          <div className="flex flex-col items-center justify-center h-full px-4">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-3 h-3 rounded-full bg-model-a animate-pulse-dot" />
              <span className="text-muted-foreground/20 text-xl">⇄</span>
              <span className="w-3 h-3 rounded-full bg-model-b animate-pulse-dot" style={{ animationDelay: "0.5s" }} />
            </div>
            <div className="w-full max-w-2xl">
              <div className="relative bg-card border border-border focus-within:ring-1 focus-within:ring-ring transition-shadow">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything…"
                  rows={2}
                  className="w-full bg-transparent px-4 pt-4 pb-12 text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none"
                />
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary text-xs text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-model-a" />
                      <span className="w-1.5 h-1.5 rounded-full bg-model-b" />
                      Agent
                      <ChevronDown className="w-3 h-3 ml-0.5" />
                    </div>
                    <span className="text-xs text-muted-foreground/60">{modelA.name}</span>
                    <span className="text-[10px] text-muted-foreground/30">⊙ High Fast</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded-md text-muted-foreground/40 hover:text-muted-foreground transition-colors">
                      <ImageIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleSend}
                      disabled={!input.trim()}
                      className="p-1.5 rounded-full bg-foreground text-background disabled:opacity-20 hover:opacity-80 transition-opacity"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex justify-start mt-2 px-1">
                <span className="text-[10px] text-muted-foreground/30 flex items-center gap-1.5">
                  <span className="inline-block w-3 h-3 border border-muted-foreground/20 rounded text-[8px] flex items-center justify-center">⊞</span>
                  Local
                  <ChevronDown className="w-2.5 h-2.5" />
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Messages */
          <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            <AnimatePresence>
              {phase !== "idle" && <ThinkingIndicator phase={phase} />}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Bottom input when messages exist */}
      {!isEmpty && (
        <div className="border-t border-border p-3 shrink-0">
          <div className="max-w-2xl mx-auto">
            <div className="relative bg-card border border-border rounded-xl focus-within:ring-1 focus-within:ring-ring transition-shadow">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a follow-up…"
                rows={1}
                className="w-full bg-transparent px-4 py-3 pr-24 text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none"
                disabled={phase !== "idle"}
              />
              <div className="absolute right-2 bottom-1.5 flex items-center gap-1.5">
                <button className="p-1.5 rounded-md text-muted-foreground/40 hover:text-muted-foreground transition-colors">
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 rounded-md text-muted-foreground/40 hover:text-muted-foreground transition-colors">
                  <ImageIcon className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || phase !== "idle"}
                  className="p-1.5 rounded-full bg-foreground text-background disabled:opacity-20 hover:opacity-80 transition-opacity"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between mt-1.5 px-1">
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground/40">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-model-a" />
                  <span className="w-1.5 h-1.5 rounded-full bg-model-b" />
                  Agent
                  <ChevronDown className="w-2.5 h-2.5" />
                </span>
                <span>{modelA.name}</span>
                <span className="text-muted-foreground/25">⊙ High Fast</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
