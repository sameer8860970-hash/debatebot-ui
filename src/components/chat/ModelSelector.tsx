import { ModelConfig } from "@/types/chat";
import { Brain, ShieldCheck } from "lucide-react";

interface ModelSelectorProps {
  modelA: ModelConfig;
  modelB: ModelConfig;
  onModelAChange: (model: ModelConfig) => void;
  onModelBChange: (model: ModelConfig) => void;
}

const availableModels: ModelConfig[] = [
  { id: "gemini-flash", name: "Gemini 3 Flash", description: "Fast reasoning" },
  { id: "gpt-5", name: "GPT-5", description: "Deep analysis" },
  { id: "gemini-pro", name: "Gemini 2.5 Pro", description: "Complex tasks" },
  { id: "codex", name: "Codex 5.3", description: "Code specialist" },
];

export function ModelSelector({ modelA, modelB, onModelAChange, onModelBChange }: ModelSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-model-a" />
          <Brain className="w-3 h-3" />
          Solver
        </div>
        <select
          value={modelA.id}
          onChange={(e) => {
            const m = availableModels.find((x) => x.id === e.target.value);
            if (m) onModelAChange(m);
          }}
          className="w-full bg-secondary border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          {availableModels.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-model-b" />
          <ShieldCheck className="w-3 h-3" />
          Verifier
        </div>
        <select
          value={modelB.id}
          onChange={(e) => {
            const m = availableModels.find((x) => x.id === e.target.value);
            if (m) onModelBChange(m);
          }}
          className="w-full bg-secondary border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          {availableModels.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
