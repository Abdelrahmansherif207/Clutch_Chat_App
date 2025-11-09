import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

function ValidationChat({ formData, mode = "login", trigger = 0, onValidationChange, apiError = null }) {
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const chatEndRef = useRef(null);
    const lastTriggerRef = useRef(0);
    const lastApiErrorRef = useRef(null);
    const finalMessageShownRef = useRef(false);

    // Validation functions matching backend express-validator rules
    const validateEmail = (email) => {
        if (!email || typeof email !== "string") return false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    };

    const validatePassword = (password) => {
        if (!password || typeof password !== "string") return false;
        return password.length >= 6;
    };

    const validateUsername = (username) => {
        if (!username || typeof username !== "string") return false;
        const trimmed = username.trim();
        return trimmed.length >= 3 && trimmed.length <= 20;
    };

    // Scroll to bottom of chat
    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Add message with typing delay
    const addMessage = (text, isBot = true, delay = 0) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                setIsTyping(false);
                setMessages((prev) => [
                    ...prev,
                    { text, isBot, id: Date.now() + Math.random() },
                ]);
                setTimeout(() => {
                    scrollToBottom();
                    resolve();
                }, 100);
            }, delay);
        });
    };

    // Show typing indicator
    const showTyping = (duration = 800) => {
        setIsTyping(true);
        return new Promise((resolve) => {
            setTimeout(() => {
                setIsTyping(false);
                resolve();
            }, duration);
        });
    };

    // Main validation flow
    const runValidation = async () => {
        if (trigger === lastTriggerRef.current) return;
        lastTriggerRef.current = trigger;
        setHasStarted(true);
        finalMessageShownRef.current = false; // Reset final message flag
        // Clear messages only when starting a new validation session
        setMessages([]);

        // Initial bot greeting
        await addMessage(
            mode === "login"
                ? "Hey! Let's see if your credentials pass my vibe check 😎"
                : "Welcome! Let me validate your info step by step 🚀",
            true,
            300
        );

        const fields = mode === "signup"
            ? ["username", "email", "password"]
            : ["email", "password"];

        let allValid = true;
        const validationErrors = {};

        for (const field of fields) {
            const value = formData[field] || "";

            // User message showing their input
            const fieldLabel = field === "username" ? "Username" : field === "email" ? "Email" : "Password";
            const displayValue = field === "password"
                ? "•".repeat(Math.min(value.length, 10))
                : value || "(empty)";

            await addMessage(`${fieldLabel}: ${displayValue}`, false, 500);
            await showTyping(600);

            // Validate and respond
            let isValid = false;
            let response = "";

            if (field === "username") {
                const trimmedValue = (value || "").trim();
                isValid = validateUsername(value);
                if (!isValid) {
                    if (!value || trimmedValue.length === 0) {
                        response = "Username is required! Can't be empty 😅";
                    } else if (trimmedValue.length < 3) {
                        response = `Username's too short! Need at least 3 characters (you have ${trimmedValue.length}) 😬`;
                    } else if (trimmedValue.length > 20) {
                        response = `Whoa, that's too long! Max 20 characters please (you have ${trimmedValue.length}) 🎯`;
                    } else {
                        response = "Username doesn't meet the requirements 😅";
                    }
                    allValid = false;
                    validationErrors.username = true;
                } else {
                    response = `Nice username! "${trimmedValue}" has good vibes ✅`;
                    validationErrors.username = false;
                }
            } else if (field === "email") {
                isValid = validateEmail(value);
                if (!isValid) {
                    if (!value || value.trim().length === 0) {
                        response = "Email is required! Can't leave this blank 📧";
                    } else {
                        response = "Hmm... that email looks off 👀 Must be a valid email address";
                    }
                    allValid = false;
                    validationErrors.email = true;
                } else {
                    response = "Perfect! That's a valid email ✅";
                    validationErrors.email = false;
                }
            } else if (field === "password") {
                isValid = validatePassword(value);
                if (!isValid) {
                    if (!value || value.length === 0) {
                        response = "Password is required! Can't be empty 🔒";
                    } else {
                        response = "Password's too short! Need at least 6 characters 😅";
                    }
                    allValid = false;
                    validationErrors.password = true;
                } else {
                    response = "Strong password! I like your style 💪✅";
                    validationErrors.password = false;
                }
            }

            // Ensure we always have a response before adding message
            if (response) {
                await addMessage(response, true, 300);
            }
        }

        // Report validation errors to parent component
        if (onValidationChange) {
            onValidationChange(validationErrors);
        }

        // Show toast for validation errors
        if (!allValid) {
            const errorFields = Object.entries(validationErrors)
                .filter(([_, hasError]) => hasError)
                .map(([field, _]) => field);

            if (errorFields.length > 0) {
                const fieldNames = errorFields.map(field => {
                    if (field === "username") return "Username";
                    if (field === "email") return "Email";
                    if (field === "password") return "Password";
                    return field;
                }).join(", ");

                // toast.error(`Validation failed: Please fix ${fieldNames}`);
            }
        }

        // Final summary
        await showTyping(800);
        if (allValid) {
            // Don't show success message immediately - wait for API result
            // The success message will be shown only if there's no API error
            // (handled in the apiError useEffect)
        } else {
            await addMessage(
                "Fix these issues and we'll be golden! 🟢",
                true,
                300
            );
        }

    };

    // Watch for trigger changes
    useEffect(() => {
        if (trigger > 0 && trigger !== lastTriggerRef.current) {
            runValidation();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trigger]);

    // Handle API errors (invalid credentials) and success messages
    useEffect(() => {
        if (!hasStarted || finalMessageShownRef.current) return;

        // Check if format validation passed (all fields validated successfully)
        const fields = mode === "signup" ? ["username", "email", "password"] : ["email", "password"];
        const allFieldsValid = fields.every(field => {
            if (field === "username") {
                return messages.some(msg => msg.isBot && msg.text.includes("good vibes ✅"));
            } else if (field === "email") {
                return messages.some(msg => msg.isBot && msg.text.includes("valid email ✅"));
            } else if (field === "password") {
                return messages.some(msg => msg.isBot && msg.text.includes("Strong password"));
            }
            return false;
        });

        // Only proceed if all format validations passed
        if (allFieldsValid && messages.length > 0) {
            // Wait for API call to complete (give it time)
            const checkApiResult = async () => {
                await new Promise(resolve => setTimeout(resolve, 2500)); // Wait for API

                if (finalMessageShownRef.current) return; // Already shown

                if (apiError && apiError !== lastApiErrorRef.current) {
                    // Show error instead of success
                    finalMessageShownRef.current = true;
                    lastApiErrorRef.current = apiError;
                    // Show toast for API error
                    toast.error(apiError);
                    await showTyping(800);
                    await addMessage(
                        `Oops! ${apiError} ❌\n\nLet me help you out - double-check your credentials and try again! 🔍`,
                        true,
                        300
                    );
                } else if (!apiError) {
                    // Show success message only if no error
                    finalMessageShownRef.current = true;
                    await showTyping(800);
                    await addMessage(
                        mode === "login"
                            ? "All clear! Let's beam you up to the dashboard 🚀"
                            : "Everything looks great! Your account is ready to go 🎉",
                        true,
                        300
                    );
                }
            };
            checkApiResult();
        }

        // Reset refs when trigger changes (new validation session)
        if (trigger !== lastTriggerRef.current) {
            lastApiErrorRef.current = null;
            finalMessageShownRef.current = false;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiError, hasStarted, trigger, messages]);

    // Don't auto-clear messages - keep chat history visible

    return (
        <div className="w-full h-full flex flex-col bg-gradient-to-bl from-slate-800/40 to-transparent rounded-lg overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-700/50 bg-slate-800/30">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                        <span className="text-xl">🤖</span>
                    </div>
                    <div>
                        <h3 className="text-slate-200 font-semibold">Validator Bot</h3>
                        <p className="text-xs text-slate-400">Real-time validation assistant</p>
                    </div>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth hide-scrollbar">
                {messages.length === 0 && !hasStarted && (
                    <div className="flex flex-col items-center justify-center h-full text-center py-8">
                        <div className="mb-6">
                            <svg
                                width="200"
                                height="200"
                                viewBox="0 0 200 200"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="mx-auto"
                            >
                                {/* Robot Head */}
                                <rect
                                    x="50"
                                    y="40"
                                    width="100"
                                    height="80"
                                    rx="12"
                                    fill="url(#gradient1)"
                                    opacity="0.3"
                                />
                                <rect
                                    x="50"
                                    y="40"
                                    width="100"
                                    height="80"
                                    rx="12"
                                    stroke="url(#gradient2)"
                                    strokeWidth="2"
                                />

                                {/* Eyes */}
                                <circle cx="75" cy="70" r="8" fill="#06b6d4" opacity="0.8">
                                    <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
                                </circle>
                                <circle cx="125" cy="70" r="8" fill="#06b6d4" opacity="0.8">
                                    <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
                                </circle>

                                {/* Mouth/Speaker */}
                                <rect x="85" y="90" width="30" height="4" rx="2" fill="#06b6d4" opacity="0.6" />
                                <rect x="90" y="98" width="20" height="3" rx="1.5" fill="#06b6d4" opacity="0.4" />

                                {/* Validation Checkmarks */}
                                <g opacity="0.6">
                                    <path
                                        d="M 30 130 L 35 135 L 45 125"
                                        stroke="#10b981"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        fill="none"
                                    >
                                        <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite" />
                                    </path>
                                    <path
                                        d="M 30 150 L 35 155 L 45 145"
                                        stroke="#10b981"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        fill="none"
                                    >
                                        <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" begin="0.3s" repeatCount="indefinite" />
                                    </path>
                                </g>

                                {/* Form Elements */}
                                <rect x="155" y="130" width="35" height="8" rx="2" fill="#475569" opacity="0.4" />
                                <rect x="155" y="145" width="35" height="8" rx="2" fill="#475569" opacity="0.4" />
                                <rect x="155" y="160" width="25" height="8" rx="2" fill="#475569" opacity="0.4" />

                                {/* Chat Bubbles */}
                                <ellipse cx="100" cy="160" rx="15" ry="12" fill="#06b6d4" opacity="0.2">
                                    <animate attributeName="opacity" values="0.2;0.4;0.2" dur="2.5s" repeatCount="indefinite" />
                                </ellipse>
                                <ellipse cx="100" cy="175" rx="20" ry="10" fill="#06b6d4" opacity="0.15">
                                    <animate attributeName="opacity" values="0.15;0.3;0.15" dur="2.5s" begin="0.5s" repeatCount="indefinite" />
                                </ellipse>

                                {/* Gradients */}
                                <defs>
                                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.1" />
                                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
                                    </linearGradient>
                                    <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
                                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.6" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <p className="text-slate-400 text-sm max-w-xs">
                            Fill out the form and click submit to start validation
                        </p>
                    </div>
                )}

                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.isBot ? "justify-start" : "justify-end"} animate-fade-in`}
                    >
                        <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.isBot
                                ? "bg-slate-700 text-slate-100"
                                : "bg-cyan-600/30 text-cyan-100"
                                }`}
                        >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                {msg.isBot && "🤖 "}
                                {msg.text}
                            </p>
                        </div>
                    </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                    <div className="flex justify-start animate-fade-in">
                        <div className="bg-slate-700 text-slate-100 rounded-2xl px-4 py-3">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={chatEndRef} />
            </div>
        </div>
    );
}

export default ValidationChat;

