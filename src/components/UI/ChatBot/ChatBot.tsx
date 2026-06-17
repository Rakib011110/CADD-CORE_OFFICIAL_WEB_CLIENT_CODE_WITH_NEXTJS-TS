"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const WELCOME: Message = {
  role: "assistant",
  content:
    "**আসসালামু আলাইকুম!** 👋\n\nআমি **CADD CORE**-এর AI Assistant। কোর্স, ভর্তি প্রক্রিয়া বা যেকোনো বিষয়ে জানতে চাইলে নিচে লিখুন।",
};

const SUGGESTIONS = [
  "কোন কোর্সগুলো আছে?",
  "ভর্তি কীভাবে হবো?",
  "কোর্স ফি কত?",
  "যোগাযোগ নম্বর?",
];

// Brand palette
const BLACK = "#0a0a0a";
const RED = "#dc2626";
const RED_DARK = "#b91c1c";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Smooth auto-scroll to bottom on new content
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 150);
  }, [isOpen]);

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || isLoading) return;

    setShowSuggestions(false);
    const userMsg: Message = { role: "user", content };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply ?? "দুঃখিত, উত্তর পাওয়া যাচ্ছে না।" },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "সংযোগে সমস্যা হচ্ছে। একটু পরে আবার চেষ্টা করুন।" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 9999 }}>
      {/* ===== Chat Window ===== */}
      {isOpen && (
        <div
          className="chat-slide-up"
          style={{
            width: "375px",
            maxWidth: "calc(100vw - 32px)",
            height: "560px",
            maxHeight: "calc(100vh - 120px)",
            background: "#ffffff",
            borderRadius: "20px",
            boxShadow: "0 24px 70px rgba(0,0,0,0.28)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            marginBottom: "14px",
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          {/* ===== Header ===== */}
          <div
            style={{
              background: BLACK,
              padding: "16px 18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: `2px solid ${RED}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "11px" }}>
              <div
                style={{
                  position: "relative",
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px",
                  background: `linear-gradient(135deg, ${RED}, ${RED_DARK})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 4px 14px rgba(220,38,38,0.45)`,
                }}
              >
                <Bot size={22} color="#fff" />
                <span
                  style={{
                    position: "absolute",
                    bottom: "-2px",
                    right: "-2px",
                    width: "12px",
                    height: "12px",
                    background: "#22c55e",
                    border: `2px solid ${BLACK}`,
                    borderRadius: "50%",
                  }}
                />
              </div>
              <div>
                <p style={{ color: "#fff", fontWeight: 700, fontSize: "14.5px", margin: 0, letterSpacing: "0.2px" }}>
                  CADD CORE AI
                </p>
                <p style={{ color: "#a3a3a3", fontSize: "11.5px", margin: "2px 0 0" }}>
                  <span style={{ color: "#22c55e" }}>● </span>
                  Online · বাংলা &amp; English
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "none",
                color: "#fff",
                width: "32px",
                height: "32px",
                borderRadius: "9px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = RED)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
            >
              <X size={18} />
            </button>
          </div>

          {/* ===== Messages ===== */}
          <div
            ref={scrollRef}
            className="chat-scroll"
            style={{
              flex: 1,
              padding: "16px 14px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              background: "#fafafa",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className="chat-bubble-in"
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "8px",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                {msg.role === "assistant" && (
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "9px",
                      background: BLACK,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Bot size={15} color="#fff" />
                  </div>
                )}

                <div
                  style={{
                    maxWidth: "80%",
                    padding: msg.role === "user" ? "10px 14px" : "11px 14px",
                    borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    background:
                      msg.role === "user"
                        ? `linear-gradient(135deg, ${RED}, ${RED_DARK})`
                        : "#ffffff",
                    color: msg.role === "user" ? "#fff" : "#1a1a1a",
                    boxShadow:
                      msg.role === "user"
                        ? "0 3px 12px rgba(220,38,38,0.28)"
                        : "0 1px 6px rgba(0,0,0,0.07)",
                    border: msg.role === "assistant" ? "1px solid #eee" : "none",
                  }}
                >
                  {msg.role === "user" ? (
                    <span style={{ fontSize: "13.5px", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                      {msg.content}
                    </span>
                  ) : (
                    <div className="chat-markdown">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>

                {msg.role === "user" && (
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "9px",
                      background: `linear-gradient(135deg, ${RED}, ${RED_DARK})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <User size={15} color="#fff" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}>
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "9px",
                    background: BLACK,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Bot size={15} color="#fff" />
                </div>
                <div
                  style={{
                    background: "#fff",
                    border: "1px solid #eee",
                    padding: "13px 16px",
                    borderRadius: "16px 16px 16px 4px",
                    display: "flex",
                    gap: "5px",
                    alignItems: "center",
                  }}
                >
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className="chat-typing-dot"
                      style={{
                        width: "7px",
                        height: "7px",
                        borderRadius: "50%",
                        background: RED,
                        animationDelay: `${d * 0.2}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quick suggestions */}
            {showSuggestions && messages.length === 1 && !isLoading && (
              <div style={{ marginTop: "4px" }}>
                <p style={{ fontSize: "11px", color: "#9ca3af", textAlign: "center", margin: "0 0 8px" }}>
                  দ্রুত প্রশ্ন
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", justifyContent: "center" }}>
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      style={{
                        fontSize: "12px",
                        padding: "7px 13px",
                        borderRadius: "999px",
                        border: `1px solid #e5e7eb`,
                        background: "#fff",
                        color: BLACK,
                        cursor: "pointer",
                        fontWeight: 500,
                        transition: "all 0.18s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = RED;
                        e.currentTarget.style.color = RED;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#e5e7eb";
                        e.currentTarget.style.color = BLACK;
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ===== Input ===== */}
          <div
            style={{
              padding: "12px 14px",
              background: "#fff",
              borderTop: "1px solid #f0f0f0",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "#f5f5f5",
                borderRadius: "14px",
                padding: "5px 5px 5px 14px",
                border: "1.5px solid transparent",
                transition: "border-color 0.2s",
              }}
              onFocusCapture={(e) => (e.currentTarget.style.borderColor = RED)}
              onBlurCapture={(e) => (e.currentTarget.style.borderColor = "transparent")}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="আপনার প্রশ্ন লিখুন..."
                disabled={isLoading}
                style={{
                  flex: 1,
                  border: "none",
                  background: "transparent",
                  fontSize: "13.5px",
                  color: "#1a1a1a",
                  outline: "none",
                  fontFamily: "inherit",
                }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                aria-label="Send"
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "11px",
                  border: "none",
                  background:
                    !input.trim() || isLoading
                      ? "#d4d4d4"
                      : `linear-gradient(135deg, ${RED}, ${RED_DARK})`,
                  color: "#fff",
                  cursor: !input.trim() || isLoading ? "default" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "background 0.2s",
                }}
              >
                <Send size={16} />
              </button>
            </div>
            <p style={{ textAlign: "center", fontSize: "10px", color: "#bbb", margin: "8px 0 0", letterSpacing: "0.3px" }}>
              Powered by AI · CADD CORE © 2025
            </p>
          </div>
        </div>
      )}

      {/* ===== Floating Toggle Button ===== */}
      <div style={{ display: "flex", justifyContent: "flex-end", position: "relative" }}>
        {!isOpen && (
          <span
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "16px",
              background: RED,
              opacity: 0.35,
              animation: "ping 1.8s cubic-bezier(0,0,0.2,1) infinite",
            }}
          />
        )}
        <button
          onClick={() => setIsOpen((p) => !p)}
          aria-label="AI Chat"
          style={{
            position: "relative",
            width: "58px",
            height: "58px",
            borderRadius: "16px",
            background: isOpen ? BLACK : `linear-gradient(135deg, ${RED}, ${RED_DARK})`,
            border: "none",
            color: "#fff",
            cursor: "pointer",
            boxShadow: isOpen
              ? "0 8px 24px rgba(0,0,0,0.35)"
              : "0 8px 28px rgba(220,38,38,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.2s, background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </button>
      </div>
    </div>
  );
}
