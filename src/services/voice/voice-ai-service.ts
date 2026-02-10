/**
 * Voice AI Service
 * Handles browser-based speech recognition (STT) and text-to-speech (TTS)
 */

export interface VoiceState {
    isListening: boolean;
    isSpeaking: boolean;
    transcript: string;
    error: string | null;
}

// Browser API Type Definitions
interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    abort(): void;
    onresult: (event: any) => void;
    onerror: (event: any) => void;
    onend: () => void;
}

interface SpeechRecognitionConstructor {
    new(): SpeechRecognition;
}

declare global {
    interface Window {
        SpeechRecognition: SpeechRecognitionConstructor;
        webkitSpeechRecognition: SpeechRecognitionConstructor;
    }
}

class VoiceAIService {
    private recognition: SpeechRecognition | null = null;
    private synthesis: SpeechSynthesis | null = null;
    private voices: SpeechSynthesisVoice[] = [];

    constructor() {
        if (typeof window !== 'undefined') {
            this.initSpeechRecognition();
            this.initSpeechSynthesis();
        }
    }

    private initSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = true;
        } else {
            console.warn('Speech Recognition API not supported in this browser');
        }
    }

    private initSpeechSynthesis() {
        if ('speechSynthesis' in window) {
            this.synthesis = window.speechSynthesis;
            // Load voices
            const loadVoices = () => {
                this.voices = this.synthesis!.getVoices();
            };

            if (this.synthesis.onvoiceschanged !== undefined) {
                this.synthesis.onvoiceschanged = loadVoices;
            }
            loadVoices();
        } else {
            console.warn('Speech Synthesis API not supported in this browser');
        }
    }

    /**
     * Start listening for speech
     */
    startListening(
        onResult: (text: string, isFinal: boolean) => void,
        onError: (error: string) => void,
        onEnd: () => void,
        language: 'en' | 'ar' = 'en'
    ) {
        if (!this.recognition) {
            onError('Speech recognition not supported');
            return;
        }

        // Set language
        this.recognition.lang = language === 'ar' ? 'ar-SA' : 'en-US';

        this.recognition.onresult = (event: any) => {
            let transcript = '';
            let isFinal = false;

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    transcript += event.results[i][0].transcript;
                    isFinal = true;
                } else {
                    transcript += event.results[i][0].transcript;
                }
            }
            onResult(transcript, isFinal);
        };

        this.recognition.onerror = (event: any) => {
            onError(event.error);
        };

        this.recognition.onend = () => {
            onEnd();
        };

        try {
            this.recognition.start();
        } catch (e) {
            console.error('Error starting recognition:', e);
        }
    }

    /**
     * Stop listening
     */
    stopListening() {
        if (this.recognition) {
            this.recognition.stop();
        }
    }

    /**
     * Speak text
     */
    speak(text: string, language: 'en' | 'ar' = 'en', onEnd?: () => void) {
        if (!this.synthesis) {
            console.warn('Speech synthesis not supported');
            if (onEnd) onEnd();
            return;
        }

        // Cancel any current speech
        this.synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Select high-quality voice based on language
        const langCode = language === 'ar' ? 'ar' : 'en';

        // Ensure voices are loaded
        if (this.voices.length === 0 && this.synthesis) {
            this.voices = this.synthesis.getVoices();
        }

        // Priority for voices: "Google", "Natural", "Enhanced"
        const preferredTerms = ['Google', 'Natural', 'Enhanced', 'Aria', 'Jenny', 'Guy'];

        const voice = this.voices
            .filter(v => v.lang.startsWith(langCode))
            .sort((a, b) => {
                const aScore = preferredTerms.reduce((acc, term) => acc + (a.name.includes(term) ? 1 : 0), 0);
                const bScore = preferredTerms.reduce((acc, term) => acc + (b.name.includes(term) ? 1 : 0), 0);
                return bScore - aScore;
            })[0];

        if (voice) {
            utterance.voice = voice;
            console.log(`Selected voice: ${voice.name} (${voice.lang})`);
        }

        utterance.lang = language === 'ar' ? 'ar-SA' : 'en-US';

        // Human-like prosody adjustments
        utterance.rate = 1.05; // Slightly faster for natural energy
        utterance.pitch = 1.05; // Slightly higher for warmth
        utterance.volume = 1.0;

        utterance.onend = () => {
            if (onEnd) onEnd();
        };

        utterance.onerror = (e: any) => {
            // "interrupted" and "canceled" are normal when stopping/switching speech, don't log as errors
            if (e.error === 'interrupted' || e.error === 'canceled' || e.error === 'not-allowed') {
                console.debug(`Speech synthesis status: ${e.error}`);
            } else {
                console.error(`Speech synthesis error details: [Code: ${e.error}]`, e);
            }
            if (onEnd) onEnd();
        };

        this.synthesis.speak(utterance);
    }

    /**
     * Stop speaking
     */
    stopSpeaking() {
        if (this.synthesis) {
            this.synthesis.cancel();
        }
    }

    /**
     * Check if browser supports voice features
     */
    isSupported() {
        return {
            stt: !!(typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)),
            tts: !!(typeof window !== 'undefined' && 'speechSynthesis' in window),
        };
    }
}

export const voiceAIService = new VoiceAIService();
export default voiceAIService;
