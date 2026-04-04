import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, X, Loader2, Paperclip } from "lucide-react";

interface AIMessageBarProps {
    title?: string;
    description?: string;
}

const AIMessageBar = ({
    title = "A.L.M.A",
    description = "Asistente en Línea de Médicina Avanzada"
}: AIMessageBarProps) => {
    const [input, setInput] = useState<string>("");
    const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState<boolean>(false);

    // Simulate AI typing effect
    const simulateResponse = (userMessage: string) => {
        setIsTyping(true);

        // Simulate different responses based on input
        let response = "¡Hola! Soy A.L.M.A, tu asistente virtual de Medigo. Estoy aquí para ayudarte con cualquier consulta que tengas sobre tus citas, recetas, o información general de la clínica. ¿En qué puedo asistirte hoy?";

        if (userMessage.toLowerCase().includes("hello") || userMessage.toLowerCase().includes("hi")) {
            response = "¡Hola! Soy A.L.M.A, tu asistente virtual de Medigo. Estoy aquí para ayudarte con cualquier consulta que tengas sobre tus citas, recetas, o información general de la clínica. ¿En qué puedo asistirte hoy?";
        } else if (userMessage.toLowerCase().includes("help")) {
            response = "¡Hola! Soy A.L.M.A, tu asistente virtual de Medigo. Estoy aquí para ayudarte con cualquier consulta que tengas sobre tus citas, recetas, o información general de la clínica. ¿En qué puedo asistirte hoy?";
        } else if (userMessage.toLowerCase().includes("thank")) {
            response = "¡De nada! Estoy aquí para ayudarte con cualquier consulta que tengas sobre tus citas, recetas, o información general de la clínica. ¿En qué puedo asistirte hoy?";
        } else if (userMessage.toLowerCase().includes("who are you")) {
            response = "¡Hola! Soy A.L.M.A, tu asistente virtual de Medigo. Estoy aquí para ayudarte con cualquier consulta que tengas sobre tus citas, recetas, o información general de la clínica. ¿En qué puedo asistirte hoy?";
        }

        setTimeout(() => {
            setIsTyping(false);
            setMessages((prev) => [...prev, { text: response, isUser: false }]);
        }, 1500); // Delay for typing effect
    };

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();

        if (input.trim() === "") return;

        const userMessage = input;
        setMessages((prev) => [...prev, { text: userMessage, isUser: true }]);
        setInput("");

        simulateResponse(userMessage);
    };

    const clearChat = () => {
        setMessages([]);
    };

    // Scroll to bottom when messages change
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                top: scrollContainerRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    }, [messages, isTyping]);

    return (
        <div className="w-full max-w-5xl mx-auto h-[600px] bg-white rounded-xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-slate-200 flex flex-col">
            {/* Header */}
            <div className="bg-white px-6 py-4 border-b border-slate-100 flex justify-between items-center shrink-0">
                <div className="flex items-center space-x-3">
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>
                    <div className="flex items-baseline space-x-2">
                        <h2 className="text-slate-900 font-bold text-[15px]">{title}</h2>
                        <span className="text-slate-400 text-sm font-medium">Online</span>
                    </div>
                </div>
                <button
                    onClick={clearChat}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Messages container */}
            <div ref={scrollContainerRef} className="px-6 py-8 flex-1 overflow-y-auto bg-white">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-12 h-12 rounded-full bg-[#f0f4f8] flex items-center justify-center mb-4">
                            <Bot className="h-6 w-6 text-blue-500" />
                        </div>
                        <h3 className="text-slate-800 text-xl font-semibold mb-2">{title}</h3>
                        <p className="text-slate-500 text-sm max-w-xs">
                            {description}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
                            >
                                {!msg.isUser && (
                                    <div className="w-9 h-9 rounded-xl bg-[#f0f4f8] border border-blue-100/50 flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
                                        <Bot className="w-5 h-5 text-blue-600" />
                                    </div>
                                )}
                                <div
                                    className={`max-w-[85%] px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed ${msg.isUser
                                        ? "bg-slate-800 text-white rounded-tr-md"
                                        : "bg-[#eef2f6] text-slate-800 rounded-tl-md"
                                        } animate-fade-in`}
                                >
                                    <p className="whitespace-pre-wrap">{msg.text}</p>
                                    {!msg.isUser && (
                                        <div className="text-[11px] text-slate-500 mt-2.5 font-medium">09:48 PM</div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="w-9 h-9 rounded-xl bg-[#f0f4f8] border border-blue-100/50 flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
                                    <Bot className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="px-5 py-4 rounded-2xl bg-[#eef2f6] rounded-tl-md flex items-center">
                                    <div className="flex items-center space-x-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse"></div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse delay-75"></div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse delay-150"></div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                )}
            </div>

            {/* Input form */}
            <div className="px-6 py-5 bg-white border-t border-slate-100 flex flex-col shrink-0">
                <form
                    onSubmit={handleSubmit}
                    className="flex items-center space-x-3 mb-3.5"
                >
                    <button
                        type="button"
                        className="w-11 h-11 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors flex-shrink-0 shadow-sm"
                    >
                        <Paperclip className="h-5 w-5" />
                    </button>
                    <div className="relative flex-1 flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder="Type your message..."
                            className={`w-full bg-[#f4f4f5] border ${isFocused ? 'border-slate-300 ring-4 ring-slate-100' : 'border-transparent'} rounded-[12px] py-3 pl-4 pr-12 text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all duration-200`}
                        />
                        <button
                            type="submit"
                            disabled={input.trim() === ""}
                            className={`absolute right-1.5 w-9 h-9 flex items-center justify-center rounded-lg ${input.trim() === ""
                                ? "text-slate-400 cursor-not-allowed"
                                : "text-white bg-[#64748b] hover:bg-[#475569] shadow-sm"
                                } transition-colors`}
                        >
                            {isTyping ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4 ml-0.5" />
                            )}
                        </button>
                    </div>
                </form>
                <div className="flex items-center space-x-2.5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
                    {["Cuentame sobre mi diagnostico", "¿Mi receta tiene efectos secundarios?", "¿Qué otros horarios disponibles tiene el doctor?"].map((pill) => (
                        <button key={pill} type="button" className="px-3.5 py-1.5 rounded-full border border-slate-200 text-[13px] text-slate-600 bg-white hover:bg-slate-50 transition-colors font-medium whitespace-nowrap">
                            {pill}
                        </button>
                    ))}
                </div>
            </div>

            <style>
                {`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        
        .delay-75 {
          animation-delay: 0.2s;
        }
        
        .delay-150 {
          animation-delay: 0.4s;
        }
        `}
            </style>
        </div>
    );
};

export default AIMessageBar;
