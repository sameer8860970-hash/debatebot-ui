import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Message } from "@/types/chat";
import { Brain, ShieldCheck, Zap, User } from "lucide-react";

const roleConfig: Record<string, { label: string; icon: React.ReactNode; borderColor: string; dotColor: string }> = {
  user: {
    label: "You",
    icon: <User className="w-3.5 h-3.5" />,
    borderColor: "border-border",
    dotColor: "bg-foreground",
  },
  "model-a": {
    label: "Solver",
    icon: <Brain className="w-3.5 h-3.5" />,
    borderColor: "border-model-a/30",
    dotColor: "bg-model-a",
  },
  "model-b": {
    label: "Verifier",
    icon: <ShieldCheck className="w-3.5 h-3.5" />,
    borderColor: "border-model-b/30",
    dotColor: "bg-model-b",
  },
  orchestrator: {
    label: "Orchestrator",
    icon: <Zap className="w-3.5 h-3.5" />,
    borderColor: "border-orchestrator/30",
    dotColor: "bg-orchestrator",
  },
};

export function ChatMessage({ message }: { message: Message }) {
  const config = roleConfig[message.role];
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div className={`max-w-[85%] ${isUser ? "order-1" : ""}`}>
        {!isUser && (
          <div className="flex items-center gap-2 mb-1.5 ml-1">
            <span className={`w-2 h-2 rounded-full ${config.dotColor}`} />
            <span className="text-xs font-medium text-muted-foreground">{config.label}</span>
            <span className="text-[10px] text-muted-foreground/50 font-mono">
              {message.phase !== "idle" && message.phase}
            </span>
          </div>
        )}
        <div
          className={`px-4 py-3 rounded-xl border ${
            isUser
              ? "bg-secondary border-border text-foreground"
              : `bg-card ${config.borderColor}`
          }`}
        >
          <div className="prose prose-sm prose-invert max-w-none text-sm leading-relaxed [&_p]:text-foreground [&_code]:text-primary [&_code]:bg-secondary [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
