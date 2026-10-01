import jsQR from 'jsqr';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import './trail.css';

/** What the page says about a scanned code. `done` closes the scanner. */
export interface ScanFeedback {
  done: boolean;
  message?: string;
}

interface QrScannerProps {
  /** Short reminder of what to scan, e.g. the active spot's title. */
  target: string;
  /** Checks a code from the camera or the typed-code box. Both use this same function. */
  onCode: (code: string) => ScanFeedback;
  onClose: () => void;
}

type CameraProblem = 'unsupported' | 'denied' | 'no-camera' | 'busy' | 'other';

const PROBLEM_TEXT: Record<CameraProblem, { title: string; help: string }> = {
  unsupported: {
    title: 'The camera is not available on this page.',
    help: 'Browsers only allow the camera on secure (https) pages. You can still type the code printed under the QR code below.',
  },
  denied: {
    title: 'Camera permission is turned off.',
    help: 'To turn it on: tap the lock or camera icon beside the web address, set Camera to “Allow”, then press “Try again”. Or type the code printed under the QR code below.',
  },
  'no-camera': {
    title: 'No camera was found on this device.',
    help: 'Type the code printed under the QR code below.',
  },
  busy: {
    title: 'The camera is being used by another app.',
    help: 'Close other apps or tabs that use the camera, then press “Try again”.',
  },
  other: {
    title: 'The camera could not start.',
    help: 'Press “Try again”, or type the code printed under the QR code below.',
  },
};

function problemFrom(error: unknown): CameraProblem {
  const name = error instanceof DOMException ? error.name : '';
  if (name === 'NotAllowedError' || name === 'SecurityError') return 'denied';
  if (name === 'NotFoundError' || name === 'OverconstrainedError') return 'no-camera';
  if (name === 'NotReadableError' || name === 'AbortError') return 'busy';
  return 'other';
}

/** How often a frame is checked, and how long the same wrong code is ignored after a message. */
const SCAN_INTERVAL_MS = 180;
const REPEAT_QUIET_MS = 3000;
/** Frames are shrunk to this width before decoding, which keeps scanning fast on phones. */
const DECODE_WIDTH = 480;

/**
 * Full-screen QR scanner with a typed-code fallback.
 * The camera is stopped whenever the scanner closes or the page hides it.
 */
export function QrScanner({ target, onCode, onClose }: QrScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCodeRef = useRef(onCode);
  onCodeRef.current = onCode;

  const [attempt, setAttempt] = useState(0);
  const [problem, setProblem] = useState<CameraProblem>();
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState('');
  const [typed, setTyped] = useState('');

  /** Runs a code through the page's check and shows its message. */
  const submit = (code: string) => {
    const feedback = onCodeRef.current(code);
    setMessage(feedback.done ? '' : (feedback.message ?? ''));
    return feedback.done;
  };
  const submitRef = useRef(submit);
  submitRef.current = submit;

  useEffect(() => {
    let cancelled = false;
    let stream: MediaStream | undefined;
    let timer: number | undefined;
    let lastCode = '';
    let lastCodeAt = 0;
    const canvas = document.createElement('canvas');

    const stop = () => {
      window.clearInterval(timer);
      stream?.getTracks().forEach((track) => track.stop());
      stream = undefined;
    };

    const start = async () => {
      setProblem(undefined);
      setReady(false);
      if (!navigator.mediaDevices?.getUserMedia) {
        setProblem('unsupported');
        return;
      }
      try {
        const media = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        });
        if (cancelled) {
          media.getTracks().forEach((track) => track.stop());
          return;
        }
        stream = media;
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = media;
        await video.play();
        if (cancelled) return;
        setReady(true);

        timer = window.setInterval(() => {
          if (video.readyState < video.HAVE_CURRENT_DATA || !video.videoWidth) return;
          const scale = Math.min(1, DECODE_WIDTH / video.videoWidth);
          canvas.width = Math.round(video.videoWidth * scale);
          canvas.height = Math.round(video.videoHeight * scale);
          const context = canvas.getContext('2d', { willReadFrequently: true });
          if (!context) return;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const image = context.getImageData(0, 0, canvas.width, canvas.height);
          const found = jsQR(image.data, image.width, image.height, { inversionAttempts: 'dontInvert' });
          if (!found?.data) return;

          // Ignore the same code for a moment so its message can be read.
          const now = Date.now();
          if (found.data === lastCode && now - lastCodeAt < REPEAT_QUIET_MS) return;
          lastCode = found.data;
          lastCodeAt = now;
          if (submitRef.current(found.data)) stop();
        }, SCAN_INTERVAL_MS);
      } catch (error) {
        if (!cancelled) setProblem(problemFrom(error));
        stop();
      }
    };

    void start();
    return () => {
      cancelled = true;
      stop();
    };
  }, [attempt]);

  // Close with Escape, and start with the focus inside the dialog.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const submitTyped = (event: FormEvent) => {
    event.preventDefault();
    if (typed.trim()) submit(typed);
  };

  return (
    <div className="dt-scanner" role="dialog" aria-modal="true" aria-labelledby="dt-scanner-title">
      <div className="dt-scanner__panel">
        <header className="dt-scanner__header">
          <h2 id="dt-scanner-title">Scan the QR code</h2>
          <button ref={closeRef} type="button" className="dt-scanner__close" onClick={onClose} aria-label="Close scanner">
            ×
          </button>
        </header>
        <p className="dt-scanner__target">
          Looking for: <strong>{target}</strong>
        </p>

        <div className="dt-scanner__camera">
          <video ref={videoRef} className="dt-scanner__video" playsInline muted aria-label="Camera view" />
          {!problem && <div className="dt-scanner__frame" aria-hidden="true" />}
          {!problem && !ready && <p className="dt-scanner__status">Starting the camera…</p>}
          {problem && (
            <div className="dt-scanner__problem" role="alert">
              <strong>{PROBLEM_TEXT[problem].title}</strong>
              <p>{PROBLEM_TEXT[problem].help}</p>
              {problem !== 'unsupported' && problem !== 'no-camera' && (
                <button type="button" className="dt-btn dt-btn--light" onClick={() => setAttempt((count) => count + 1)}>
                  Try again
                </button>
              )}
            </div>
          )}
        </div>

        <p className="dt-scanner__message" role="status" aria-live="polite">
          {message || (ready ? 'Hold the QR code inside the square.' : '')}
        </p>

        <form className="dt-scanner__manual" onSubmit={submitTyped}>
          <label htmlFor="dt-manual-code">Camera not working? Type the code printed under the QR code:</label>
          <div className="dt-scanner__manual-row">
            <input
              id="dt-manual-code"
              type="text"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              placeholder="MINT-…"
              value={typed}
              onChange={(event) => setTyped(event.target.value)}
            />
            <button type="submit" className="dt-btn" disabled={!typed.trim()}>
              Check code
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
