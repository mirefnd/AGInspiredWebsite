"use client";

import { createContext, useContext, useRef, useCallback, ReactNode } from "react";

interface FileMenuActions {
  // Notes actions
  onNewNote?: () => void;
  onPinNote?: () => void;
  onDeleteNote?: () => void;
  noteIsPinned?: boolean;
}

interface FileMenuContextValue {
  getActions: () => FileMenuActions;
  registerNotesActions: (actions: {
    onNewNote: () => void;
    onPinNote: () => void;
    onDeleteNote: () => void;
  }) => void;
  unregisterNotesActions: () => void;
  updateNotesState: (state: { noteIsPinned: boolean }) => void;
}

const FileMenuContext = createContext<FileMenuContextValue | null>(null);

export function FileMenuProvider({ children }: { children: ReactNode }) {
  const actionsRef = useRef<FileMenuActions>({});

  const getActions = useCallback(() => actionsRef.current, []);

  const registerNotesActions = useCallback((notesActions: {
    onNewNote: () => void;
    onPinNote: () => void;
    onDeleteNote: () => void;
  }) => {
    actionsRef.current = {
      ...actionsRef.current,
      onNewNote: notesActions.onNewNote,
      onPinNote: notesActions.onPinNote,
      onDeleteNote: notesActions.onDeleteNote,
    };
  }, []);

  const unregisterNotesActions = useCallback(() => {
    actionsRef.current = {
      ...actionsRef.current,
      onNewNote: undefined,
      onPinNote: undefined,
      onDeleteNote: undefined,
    };
  }, []);

  const updateNotesState = useCallback((state: { noteIsPinned: boolean }) => {
    actionsRef.current = {
      ...actionsRef.current,
      noteIsPinned: state.noteIsPinned,
    };
  }, []);

  return (
    <FileMenuContext.Provider
      value={{
        getActions,
        registerNotesActions,
        unregisterNotesActions,
        updateNotesState,
      }}
    >
      {children}
    </FileMenuContext.Provider>
  );
}

export function useFileMenu() {
  const context = useContext(FileMenuContext);
  return context;
}

export function useFileMenuActions() {
  const context = useContext(FileMenuContext);
  return context?.getActions() || {};
}
