"use client";

import { useState } from "react";
import type { KeyboardEvent } from "react";
import {
  Send,
  Paperclip,
  CaseSensitive,
  Smile,
  Image,
  ChevronDown,
  ChevronLeft,
} from "lucide-react";
import { WindowNavShell, WindowNavSpacer } from "@/components/window-nav-shell";
import { WindowControls } from "@/components/window-controls";
import { useWindowNavBehavior } from "@/lib/use-window-nav-behavior";
import { cn } from "@/lib/utils";

const RECIPIENT_EMAIL = "amirahaffendii@gmail.com";
const SENDER_DISPLAY = "Amirah Affendi";
const SENDER_EMAIL = "amirahaffendi@icloud.com";

interface MailAppProps {
  isMobile?: boolean;
  inShell?: boolean;
}

export function MailApp({ isMobile = false, inShell = false }: MailAppProps) {
  const [cc, setCc] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sentFlash, setSentFlash] = useState(false);

  const nav = useWindowNavBehavior({ isDesktop: !isMobile, isMobile });

  const canSend = subject.trim().length > 0 || body.trim().length > 0;

  const handleSend = () => {
    if (!canSend) return;
    const parts: string[] = [];
    if (subject) parts.push(`subject=${encodeURIComponent(subject)}`);
    if (cc) parts.push(`cc=${encodeURIComponent(cc)}`);
    if (body) parts.push(`body=${encodeURIComponent(body)}`);
    const query = parts.length > 0 ? `?${parts.join("&")}` : "";
    window.open(`mailto:${RECIPIENT_EMAIL}${query}`, "_blank");
    setSentFlash(true);
    setTimeout(() => setSentFlash(false), 1800);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      (document.activeElement as HTMLElement)?.blur();
    }
  };

  return (
    <div
      className="flex flex-col h-full bg-background"
      onKeyDown={handleKeyDown}
    >
      {/* Nav / toolbar */}
      <WindowNavShell
        isMobile={isMobile}
        onMouseDown={nav.onDragStart}
        left={
          isMobile ? (
            <button
              className="flex items-center gap-1 text-[#0A7CFF]"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <ChevronLeft size={20} />
              <span className="text-sm">Inbox</span>
            </button>
          ) : (
            <WindowControls
              inShell={nav.inShell}
              onClose={nav.onClose}
              onMinimize={nav.onMinimize}
              onToggleMaximize={nav.onToggleMaximize}
              isMaximized={nav.isMaximized}
              closeLabel={nav.closeLabel}
            />
          )
        }
        right={
          <div
            className="flex items-center gap-0.5"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <ToolbarBtn
              title="Send"
              onClick={handleSend}
              disabled={!canSend}
              active={sentFlash}
            >
              <Send size={15} />
            </ToolbarBtn>
            <ToolbarBtn title="Attach File">
              <Paperclip size={15} />
            </ToolbarBtn>
            <ToolbarBtn title="Format Text">
              <CaseSensitive size={16} />
            </ToolbarBtn>
            <ToolbarBtn title="Emoji &amp; Symbols">
              <Smile size={15} />
            </ToolbarBtn>
            <ToolbarBtn title="Add Photo or Video">
              <Image size={15} />
            </ToolbarBtn>
            <ToolbarBtn title="More Options">
              <ChevronDown size={14} />
            </ToolbarBtn>
          </div>
        }
      />

      {/* Header fields */}
      <div className="border-b border-muted-foreground/20 select-none">
        {/* To – read-only, pre-filled */}
        <div className="flex items-center px-4 h-9 gap-2 border-b border-muted-foreground/20">
          <FieldLabel>To</FieldLabel>
          <span className="flex-1 text-sm text-foreground truncate">
            {RECIPIENT_EMAIL}
          </span>
          <button className="shrink-0 text-[#0A7CFF] text-xs font-medium">
            +
          </button>
        </div>

        {/* Cc */}
        <div className="flex items-center px-4 h-9 gap-2 border-b border-muted-foreground/20">
          <FieldLabel>Cc</FieldLabel>
          <input
            type="email"
            value={cc}
            onChange={(e) => setCc(e.target.value)}
            placeholder=""
            className="flex-1 bg-transparent text-sm text-foreground focus:outline-none caret-[#0A7CFF] select-auto"
          />
        </div>

        {/* Subject */}
        <div className="flex items-center px-4 h-9 gap-2 border-b border-muted-foreground/20">
          <FieldLabel>Subject</FieldLabel>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder=""
            className="flex-1 bg-transparent text-sm text-foreground focus:outline-none caret-[#0A7CFF] select-auto"
          />
        </div>

        {/* From – static display */}
        <div className="flex items-center px-4 h-9 gap-2">
          <FieldLabel>From</FieldLabel>
          <span className="text-sm text-foreground">
            {SENDER_DISPLAY}{" "}
            <span className="text-muted-foreground">– {SENDER_EMAIL}</span>
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 min-h-0">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder=""
          className="w-full h-full resize-none bg-background text-foreground text-sm px-4 py-3 focus:outline-none caret-[#0A7CFF]"
        />
      </div>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="w-14 shrink-0 text-sm text-muted-foreground text-right">
      {children}:
    </span>
  );
}

function ToolbarBtn({
  children,
  onClick,
  title,
  disabled,
  active,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  title?: string;
  disabled?: boolean;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={cn(
        "p-1.5 rounded text-muted-foreground transition-colors",
        "can-hover:hover:text-foreground can-hover:hover:bg-muted-foreground/10",
        "active:scale-95",
        disabled && "opacity-35 cursor-not-allowed",
        active && "text-[#0A7CFF]"
      )}
    >
      {children}
    </button>
  );
}
