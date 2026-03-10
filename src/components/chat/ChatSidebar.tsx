import { useState } from "react";
import { Plus, MessageSquare, Clock, MoreHorizontal, Trash2 } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

export interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
}

interface ChatSidebarProps {
  sessions: ChatSession[];
  activeSession: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
}

export function ChatSidebar({ sessions, activeSession, onSelectSession, onNewChat, onDeleteSession }: ChatSidebarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const today = new Date();
  const todaySessions = sessions.filter(
    (s) => s.timestamp.toDateString() === today.toDateString()
  );
  const olderSessions = sessions.filter(
    (s) => s.timestamp.toDateString() !== today.toDateString()
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-card">
      <SidebarHeader className="p-3">
        <button
          onClick={onNewChat}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-secondary transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="group-data-[collapsible=icon]:hidden">New Chat</span>
        </button>
      </SidebarHeader>

      <SidebarContent>
        {todaySessions.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] uppercase tracking-wider text-muted-foreground/60 px-3">
              Today
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {todaySessions.map((session) => (
                  <SidebarMenuItem
                    key={session.id}
                    onMouseEnter={() => setHoveredId(session.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <SidebarMenuButton
                      onClick={() => onSelectSession(session.id)}
                      className={`relative group/item ${
                        activeSession === session.id ? "bg-secondary text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate text-xs group-data-[collapsible=icon]:hidden">
                        {session.title}
                      </span>
                      {hoveredId === session.id && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onDeleteSession(session.id); }}
                          className="absolute right-2 p-0.5 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors group-data-[collapsible=icon]:hidden"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {olderSessions.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] uppercase tracking-wider text-muted-foreground/60 px-3">
              Previous
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {olderSessions.map((session) => (
                  <SidebarMenuItem
                    key={session.id}
                    onMouseEnter={() => setHoveredId(session.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <SidebarMenuButton
                      onClick={() => onSelectSession(session.id)}
                      className={`relative ${
                        activeSession === session.id ? "bg-secondary text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate text-xs group-data-[collapsible=icon]:hidden">
                        {session.title}
                      </span>
                      {hoveredId === session.id && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onDeleteSession(session.id); }}
                          className="absolute right-2 p-0.5 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors group-data-[collapsible=icon]:hidden"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-3 group-data-[collapsible=icon]:hidden">
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground/40">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          Orchestration Engine
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
