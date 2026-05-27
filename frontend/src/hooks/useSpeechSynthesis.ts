import { useEffect, useRef, useState, useCallback } from "react";

export interface UseSpeechSynthesisState {
  isSupported: boolean;
  isSpeaking: boolean;
  isPaused: boolean;
  isLoading: boolean;
  error: string | null;
  playbackRate: number;
  availableVoices: SpeechSynthesisVoice[];
  selectedVoiceIndex: number;
}

interface UseSpeechSynthesisReturn extends UseSpeechSynthesisState {
  play: (text: string) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  setPlaybackRate: (rate: number) => void;
  setSelectedVoice: (index: number) => void;
}

const useSpeechSynthesis = (): UseSpeechSynthesisReturn => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playbackRate, setPlaybackRateState] = useState(1);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(0);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const synth = useRef<SpeechSynthesis | null>(null);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synth.current = window.speechSynthesis;
      setIsSupported(true);

      // Load available voices
      const loadVoices = () => {
        if (synth.current) {
          const voices = synth.current.getVoices();
          setAvailableVoices(voices);
          if (voices.length > 0) {
            setSelectedVoiceIndex(0);
          }
        }
      };

      loadVoices();

      // Some browsers load voices asynchronously
      if (synth.current.onvoiceschanged !== undefined) {
        synth.current.onvoiceschanged = loadVoices;
      }

      return () => {
        if (synth.current && synth.current.onvoiceschanged !== undefined) {
          synth.current.onvoiceschanged = null;
        }
      };
    } else {
      setIsSupported(false);
      setError("Text-to-speech is not supported in this browser.");
    }
  }, []);

  // Stop speech on component unmount or route change
  useEffect(() => {
    return () => {
      if (synth.current) {
        synth.current.cancel();
      }
    };
  }, []);

  const play = useCallback(
    (text: string) => {
      if (!synth.current || !isSupported) {
        setError("Text-to-speech is not supported in this browser.");
        return;
      }

      if (!text || text.trim().length === 0) {
        setError("No text to speak.");
        return;
      }

      // Cancel any previous utterance
      synth.current.cancel();
      setError(null);
      setIsPaused(false);

      try {
        setIsLoading(true);

        utteranceRef.current = new SpeechSynthesisUtterance(text);

        // Set voice
        if (availableVoices.length > 0 && selectedVoiceIndex < availableVoices.length) {
          utteranceRef.current.voice = availableVoices[selectedVoiceIndex];
        }

        utteranceRef.current.rate = playbackRate;
        utteranceRef.current.pitch = 1;
        utteranceRef.current.volume = 1;

        // Event handlers
        utteranceRef.current.onstart = () => {
          setIsSpeaking(true);
          setIsLoading(false);
        };

        utteranceRef.current.onend = () => {
          setIsSpeaking(false);
          setIsPaused(false);
        };

        utteranceRef.current.onerror = (event) => {
          setIsSpeaking(false);
          setIsLoading(false);
          setError(`Speech synthesis error: ${event.error}`);
        };

        utteranceRef.current.onpause = () => {
          setIsPaused(true);
        };

        utteranceRef.current.onresume = () => {
          setIsPaused(false);
        };

        synth.current.speak(utteranceRef.current);
      } catch (err) {
        setIsLoading(false);
        setError("Failed to start speech synthesis.");
        console.error("Speech synthesis error:", err);
      }
    },
    [isSupported, playbackRate, selectedVoiceIndex, availableVoices],
  );

  const pause = useCallback(() => {
    if (synth.current && isSpeaking && !isPaused) {
      synth.current.pause();
    }
  }, [isSpeaking, isPaused]);

  const resume = useCallback(() => {
    if (synth.current && isPaused) {
      synth.current.resume();
    }
  }, [isPaused]);

  const stop = useCallback(() => {
    if (synth.current) {
      synth.current.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      setIsLoading(false);
    }
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    const clampedRate = Math.max(0.5, Math.min(2, rate));
    setPlaybackRateState(clampedRate);
  }, []);

  const setSelectedVoice = useCallback((index: number) => {
    if (index >= 0 && index < availableVoices.length) {
      setSelectedVoiceIndex(index);
    }
  }, [availableVoices.length]);

  return {
    isSupported,
    isSpeaking,
    isPaused,
    isLoading,
    error,
    playbackRate,
    availableVoices,
    selectedVoiceIndex,
    play,
    pause,
    resume,
    stop,
    setPlaybackRate,
    setSelectedVoice,
  };
};

export default useSpeechSynthesis;
