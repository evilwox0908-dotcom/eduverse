import { useEffect, useRef, useState, useCallback } from 'react';
import { IntegrityEventType } from '../types';
import { logIntegrityEvent } from '../services/examService';

interface UseExamIntegrityOptions {
  sessionId: string;
  studentId: string;
  competitionId: string;
  isActive: boolean;
  onFullscreenExitAlert?: () => void;
}

export function useExamIntegrity({
  sessionId,
  studentId,
  competitionId,
  isActive,
  onFullscreenExitAlert,
}: UseExamIntegrityOptions) {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(Boolean(document.fullscreenElement));
  const [integrityWarningCount, setIntegrityWarningCount] = useState<number>(0);
  const [lastWarningReason, setLastWarningReason] = useState<string | null>(null);
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false);

  const sessionIdRef = useRef(sessionId);
  sessionIdRef.current = sessionId;

  const logEvent = useCallback(
    (type: IntegrityEventType, metadata?: any) => {
      if (!sessionIdRef.current || !studentId || !isActive) return;
      logIntegrityEvent(competitionId, {
        sessionId: sessionIdRef.current,
        studentId,
        type,
        metadata: typeof metadata === 'string' ? metadata : JSON.stringify(metadata || {}),
      });
    },
    [competitionId, studentId, isActive]
  );

  const enterFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
        logEvent('FULLSCREEN_ENTER');
      }
    } catch (err) {
      console.warn('Fullscreen request failed or was dismissed by browser permission:', err);
    }
  }, [logEvent]);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.warn('Exit fullscreen failed:', err);
    }
  }, []);

  useEffect(() => {
    if (!isActive) return;

    // 1. Fullscreen change listener
    const handleFullscreenChange = () => {
      const active = Boolean(document.fullscreenElement);
      setIsFullscreen(active);

      if (!active) {
        logEvent('FULLSCREEN_EXIT');
        setIntegrityWarningCount((prev) => prev + 1);
        setLastWarningReason('You exited full-screen competition mode.');
        setShowWarningModal(true);
        if (onFullscreenExitAlert) onFullscreenExitAlert();
      } else {
        logEvent('FULLSCREEN_ENTER');
      }
    };

    // 2. Tab visibility change (switching tabs)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logEvent('TAB_HIDDEN');
        setIntegrityWarningCount((prev) => prev + 1);
        setLastWarningReason('Tab switch or browser window minimization detected.');
        setShowWarningModal(true);
      } else {
        logEvent('TAB_VISIBLE');
      }
    };

    // 3. Window blur / focus
    const handleWindowBlur = () => {
      logEvent('WINDOW_BLUR');
    };

    const handleWindowFocus = () => {
      logEvent('WINDOW_FOCUS');
    };

    // 4. Block context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      logEvent('CONTEXT_MENU');
    };

    // 5. Block copy / paste
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      logEvent('COPY_ATTEMPT');
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      logEvent('PASTE_ATTEMPT');
    };

    // 6. Block inspect shortcuts (F12, Ctrl+Shift+I, Ctrl+U, etc.)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'C' || e.key === 'c' || e.key === 'J' || e.key === 'j')) ||
        ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U'))
      ) {
        e.preventDefault();
        logEvent('DEVTOOLS_SUSPECTED', { key: e.key });
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, logEvent, onFullscreenExitAlert]);

  const dismissWarningModal = () => {
    setShowWarningModal(false);
    if (!isFullscreen) {
      enterFullscreen();
    }
  };

  return {
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
    integrityWarningCount,
    lastWarningReason,
    showWarningModal,
    dismissWarningModal,
  };
}
