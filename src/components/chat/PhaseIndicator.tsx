import { motion } from "framer-motion";
import { Phase } from "@/types/chat";
import { Brain, CheckCircle, MessageSquare, Sparkles, Circle } from "lucide-react";

const phaseConfig: Record<Phase, { label: string; icon: React.ReactNode; color: string }> = {
  idle: { label: "Ready", icon: <Circle className="w-3.5 h-3.5" />, color: "text-muted-foreground" },
  solving: { label: "Solving", icon: <Brain className="w-3.5 h-3.5" />, color: "text-model-a" },
  verifying: { label: "Verifying", icon: <CheckCircle className="w-3.5 h-3.5" />, color: "text-model-b" },
  debating: { label: "Debating", icon: <MessageSquare className="w-3.5 h-3.5" />, color: "text-debate" },
  consensus: { label: "Consensus", icon: <Sparkles className="w-3.5 h-3.5" />, color: "text-orchestrator" },
};

const phases: Phase[] = ["solving", "verifying", "debating", "consensus"];

export function PhaseIndicator({ currentPhase }: { currentPhase: Phase }) {
  const currentIndex = phases.indexOf(currentPhase);

  return (
    <div className="flex items-center gap-1 px-4 py-2.5 bg-card border border-border">
      {phases.map((phase, i) => {
        const config = phaseConfig[phase];
        const isActive = phase === currentPhase;
        const isDone = currentIndex > i;

        return (
          <div key={phase} className="flex items-center gap-1">
            <motion.div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                isActive
                  ? `${config.color} bg-secondary`
                  : isDone
                  ? "text-muted-foreground"
                  : "text-muted-foreground/40"
              }`}
              animate={isActive ? { scale: [1, 1.02, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {config.icon}
              <span className="hidden sm:inline">{config.label}</span>
            </motion.div>
            {i < phases.length - 1 && (
              <div className={`w-4 h-px ${isDone || isActive ? "bg-muted-foreground/40" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
