import { motion } from "framer-motion";
import { Phase } from "@/types/chat";

const phaseLabels: Record<Phase, string> = {
  idle: "",
  solving: "Solver is thinking…",
  verifying: "Verifier is reviewing…",
  debating: "Models are debating…",
  consensus: "Reaching consensus…",
};

export function ThinkingIndicator({ phase }: { phase: Phase }) {
  if (phase === "idle") return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center gap-3 px-4 py-2"
    >
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">{phaseLabels[phase]}</span>
    </motion.div>
  );
}
