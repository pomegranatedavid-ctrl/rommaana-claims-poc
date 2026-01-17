"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Search, Info, Loader2, Sparkles } from 'lucide-react';
import { VisionAgent } from '@/lib/agents';
import { cn } from '@/lib/utils';

interface ImageAnalysisModalProps {
    isOpen: boolean;
    onClose: () => void;
    imagePath: string;
    title: string;
}

export const ImageAnalysisModal: React.FC<ImageAnalysisModalProps> = ({ isOpen, onClose, imagePath, title }) => {
    const [analysis, setAnalysis] = useState<{ detection: string; relevance: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isThinking, setIsThinking] = useState(false);
    const chatEndRef = React.useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isThinking]);

    useEffect(() => {
        if (isOpen && imagePath) {
            setLoading(true);
            setMessages([]); // Reset chat for new image
            VisionAgent.analyzeDetail(imagePath).then(res => {
                setAnalysis(res);
                setLoading(false);
            });
        }
    }, [isOpen, imagePath]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isThinking) return;

        const userMessage = inputValue.trim();
        setInputValue("");
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsThinking(true);

        try {
            const response = await VisionAgent.answerQuestion(imagePath, userMessage);
            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: "Error communicating with Vision Mesh. Please try again." }]);
        } finally {
            setIsThinking(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-white w-full max-w-6xl h-[80vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
                >
                    {/* Image Section */}
                    <div className="flex-1 bg-slate-100 flex items-center justify-center relative p-8 group">
                        <img
                            src={imagePath}
                            alt={title}
                            className="max-h-full max-w-full object-contain rounded-lg shadow-lg border-2 border-white transition-transform duration-500 group-hover:scale-105"
                        />
                        <button
                            onClick={onClose}
                            className="absolute top-4 left-4 p-2 bg-white/80 hover:bg-white rounded-full shadow-md text-slate-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur text-white px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-2">
                            <Search className="w-3.5 h-3.5" /> Full Metadata Resolution (4K)
                        </div>
                    </div>

                    {/* Analysis Sidebar */}
                    <div className="w-full md:w-[400px] border-l border-slate-100 flex flex-col bg-slate-50">
                        <div className="p-6 border-b bg-white">
                            <h3 className="text-xl font-bold font-sans text-slate-800 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-[#be123c]" /> AI Agent Analysis
                            </h3>
                            <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest font-bold">Document Inspection v4.2</p>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {loading ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
                                    <Loader2 className="w-10 h-10 animate-spin text-[#be123c]" />
                                    <p className="text-sm animate-pulse">Running Neural Texture Analysis...</p>
                                </div>
                            ) : analysis && (
                                <>
                                    {/* Component 1: Detections */}
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="space-y-3"
                                    >
                                        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                                            <div className="w-2 h-2 rounded-full bg-[#be123c]"></div>
                                            Visual Detections
                                        </div>
                                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-sm text-slate-600 leading-relaxed italic">
                                            "{analysis.detection}"
                                        </div>
                                    </motion.div>

                                    {/* Component 2: Case Relevance */}
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="space-y-3"
                                    >
                                        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                            Case Relevance
                                        </div>
                                        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-sm text-slate-700 leading-relaxed">
                                            {analysis.relevance}
                                        </div>
                                    </motion.div>

                                    {/* Component 3: Interactive Chat Area */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="space-y-4 pt-6 border-t"
                                    >
                                        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                                            <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                                            Interactive Image Q&A
                                        </div>

                                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                            {messages.length === 0 && !isThinking && (
                                                <div className="text-xs text-slate-400 italic text-center py-4 bg-white/50 rounded-xl border border-dashed border-slate-200">
                                                    Ask about car brand, damage location, or specific features...
                                                </div>
                                            )}

                                            {messages.map((msg, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className={cn(
                                                        "p-3 rounded-2xl text-sm leading-relaxed",
                                                        msg.role === 'user'
                                                            ? "bg-slate-200/50 text-slate-700 ml-4 rounded-tr-none"
                                                            : "bg-rose-50 border border-rose-100 text-slate-800 mr-4 rounded-tl-none font-medium"
                                                    )}
                                                >
                                                    {msg.content}
                                                </motion.div>
                                            ))}

                                            {isThinking && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="bg-rose-50 border border-rose-100 p-3 rounded-2xl rounded-tl-none mr-4 flex items-center gap-2"
                                                >
                                                    <div className="flex gap-1">
                                                        <span className="w-1.5 h-1.5 bg-[#be123c] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                                        <span className="w-1.5 h-1.5 bg-[#be123c] rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></span>
                                                        <span className="w-1.5 h-1.5 bg-[#be123c] rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></span>
                                                    </div>
                                                    <span className="text-[10px] font-bold text-[#be123c] uppercase tracking-widest">Vision Mesh Thinking...</span>
                                                </motion.div>
                                            )}
                                            <div ref={chatEndRef} />
                                        </div>

                                        <form onSubmit={handleSendMessage} className="relative mt-2">
                                            <input
                                                type="text"
                                                value={inputValue}
                                                onChange={(e) => setInputValue(e.target.value)}
                                                placeholder="Type your question..."
                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#be123c]/20 focus:border-[#be123c] transition-all pr-12 shadow-sm"
                                            />
                                            <button
                                                type="submit"
                                                disabled={!inputValue.trim() || isThinking}
                                                className="absolute right-2 top-1.5 p-2 bg-[#be123c] text-white rounded-lg hover:bg-[#9f0f32] disabled:opacity-50 disabled:grayscale transition-all shadow-md active:scale-95"
                                            >
                                                <Search className="w-4 h-4" />
                                            </button>
                                        </form>
                                    </motion.div>
                                </>
                            )}
                        </div>

                        <div className="p-4 bg-white border-t mt-auto">
                            <button
                                onClick={onClose}
                                className="w-full bg-[#be123c] text-white py-3 rounded-xl font-bold hover:bg-[#9f0f32] transition-colors shadow-lg shadow-rose-200"
                            >
                                Close Analysis
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
