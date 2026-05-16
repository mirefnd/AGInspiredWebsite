"use client";

import { useRef } from "react";
import { useClickOutside } from "@/lib/hooks/use-click-outside";

interface FileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  appId: string;
  onNewNote?: () => void;
  onPinNote?: () => void;
  onDeleteNote?: () => void;
  noteIsPinned?: boolean;
}

export function FileMenu({
  isOpen,
  onClose,
  appId,
  onNewNote,
  onPinNote,
  onDeleteNote,
  noteIsPinned,
}: FileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, onClose, isOpen);

  if (!isOpen) return null;

  const isNotes = appId === "notes";

  return (
    <div
      ref={menuRef}
      className="absolute top-7 left-[120px] w-56 rounded-lg bg-white/95 dark:bg-zinc-800/95 backdrop-blur-xl shadow-2xl border border-black/10 dark:border-white/10 py-1 z-[70] overflow-hidden"
    >
      {isNotes && (
        <>
          <MenuItem
            label="New Note"
            shortcut="N"
            onClick={() => {
              onNewNote?.();
              onClose();
            }}
          />
          <MenuItem
            label={noteIsPinned ? "Unpin Note" : "Pin Note"}
            shortcut="P"
            onClick={() => {
              onPinNote?.();
              onClose();
            }}
          />
          <MenuItem
            label="Delete Note"
            shortcut="D"
            onClick={() => {
              onDeleteNote?.();
              onClose();
            }}
          />
        </>
      )}

    </div>
  );
}

function MenuItem({
  label,
  shortcut,
  onClick,
}: {
  label: string;
  shortcut?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-left hover:bg-blue-500 hover:text-white transition-colors group"
    >
      <span>{label}</span>
      {shortcut && (
        <span className="text-xs text-muted-foreground group-hover:text-white/70">
          {shortcut}
        </span>
      )}
    </button>
  );
}
