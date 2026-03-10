import { useState, useCallback } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ChatSidebar, ChatSession } from "@/components/chat/ChatSidebar";
import { OrchestrationChat } from "@/components/chat/OrchestrationChat";
import { Message } from "@/types/chat";

const Index = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([
    { id: "demo-1", title: "Sign up funnel analysis", timestamp: new Date() },
    { id: "demo-2", title: "How to optimize DB queries", timestamp: new Date(Date.now() - 86400000) },
  ]);
  const [activeSession, setActiveSession] = useState<string | null>("demo-1");
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>({
    "demo-1": [],
    "demo-2": [],
  });

  const handleNewChat = useCallback(() => {
    const id = crypto.randomUUID();
    const session: ChatSession = { id, title: "New Chat", timestamp: new Date() };
    setSessions((prev) => [session, ...prev]);
    setMessagesMap((prev) => ({ ...prev, [id]: [] }));
    setActiveSession(id);
  }, []);

  const handleDeleteSession = useCallback((id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    setMessagesMap((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    if (activeSession === id) {
      setActiveSession(null);
    }
  }, [activeSession]);

  const handleFirstMessage = useCallback((title: string) => {
    if (!activeSession) return;
    setSessions((prev) =>
      prev.map((s) => (s.id === activeSession ? { ...s, title } : s))
    );
  }, [activeSession]);

  const currentMessages = activeSession ? (messagesMap[activeSession] ?? []) : [];

  const setCurrentMessages = useCallback(
    (updater: React.SetStateAction<Message[]>) => {
      if (!activeSession) return;
      setMessagesMap((prev) => ({
        ...prev,
        [activeSession]: typeof updater === "function" ? updater(prev[activeSession] ?? []) : updater,
      }));
    },
    [activeSession]
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <ChatSidebar
          sessions={sessions}
          activeSession={activeSession}
          onSelectSession={setActiveSession}
          onNewChat={handleNewChat}
          onDeleteSession={handleDeleteSession}
        />
        <div className="flex-1 flex flex-col min-w-0">
          {activeSession ? (
            <OrchestrationChat
              key={activeSession}
              messages={currentMessages}
              setMessages={setCurrentMessages}
              onFirstMessage={handleFirstMessage}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
              Select or start a new chat
            </div>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
