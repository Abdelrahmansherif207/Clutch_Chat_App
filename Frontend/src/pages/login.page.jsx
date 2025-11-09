import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ValidationChat from "../components/ValidationChat";
import { MessageCircleIcon, MailIcon, LoaderIcon, LockIcon } from "lucide-react";
import { Link } from "react-router";

function LoginPage() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [submitCount, setSubmitCount] = useState(0);
    const [validationErrors, setValidationErrors] = useState({});
    const [apiError, setApiError] = useState(null);
    const { login, isLoggingIn } = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError(null); // Clear previous errors
        setSubmitCount(prev => prev + 1); // Increment to trigger validation
        
        // Wait for validation to complete, then check API
        setTimeout(async () => {
            const result = await login(formData);
            // Check if login failed
            if (result && result.error) {
                const errorMessage = result.error?.response?.data?.message || "Invalid credentials. Please check your email and password.";
                setApiError(errorMessage);
                // Highlight both fields on API error
                setValidationErrors(prev => ({ ...prev, email: true, password: true }));
            }
        }, 3000); // Wait for validation chat to complete
    };

    return (
        <div className="w-full flex items-center justify-center p-4 bg-slate-900">
            <div className="relative w-full max-w-6xl md:h-[800px] h-[650px]">
                <BorderAnimatedContainer>
                    <div className="w-full flex flex-col md:flex-row">
                        {/* FORM CLOUMN - LEFT SIDE */}
                        <div className="md:w-1/2 p-8 flex items-center justify-center md:border-r border-slate-600/30">
                            <div className="w-full max-w-md">
                                {/* HEADING TEXT */}
                                <div className="text-center mb-8">
                                    <MessageCircleIcon className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                                    <h2 className="text-2xl font-bold text-slate-200 mb-2">Welcome Back</h2>
                                    <p className="text-slate-400">Login to access to your account</p>
                                </div>

                                {/* FORM */}
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* EMAIL INPUT */}
                                    <div>
                                        <label className="auth-input-label">Email</label>
                                        <div className="relative">
                                            <MailIcon className={`auth-input-icon ${validationErrors.email ? "auth-input-icon-error" : ""}`} />

                                            <input
                                                type="text"
                                                value={formData.email}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, email: e.target.value });
                                                    // Clear error when user starts typing
                                                    if (validationErrors.email) {
                                                        setValidationErrors(prev => ({ ...prev, email: false }));
                                                    }
                                                }}
                                                className={`input ${validationErrors.email ? "input-error" : ""}`}
                                                placeholder="johndoe@gmail.com"
                                            />
                                        </div>
                                    </div>

                                    {/* PASSWORD INPUT */}
                                    <div>
                                        <label className="auth-input-label">Password</label>
                                        <div className="relative">
                                            <LockIcon className={`auth-input-icon ${validationErrors.password ? "auth-input-icon-error" : ""}`} />

                                            <input
                                                type="password"
                                                value={formData.password}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, password: e.target.value });
                                                    // Clear error when user starts typing
                                                    if (validationErrors.password) {
                                                        setValidationErrors(prev => ({ ...prev, password: false }));
                                                    }
                                                }}
                                                className={`input ${validationErrors.password ? "input-error" : ""}`}
                                                placeholder="Enter your password"
                                            />
                                        </div>
                                    </div>

                                    {/* SUBMIT BUTTON */}
                                    <button className="auth-btn" type="submit" disabled={isLoggingIn}>
                                        {isLoggingIn ? (
                                            <LoaderIcon className="w-full h-5 animate-spin text-center" />
                                        ) : (
                                            "Sign In"
                                        )}
                                    </button>
                                </form>

                                <div className="mt-6 text-center">
                                    <Link to="/signup" className="auth-link">
                                        Don't have an account? Sign Up
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* VALIDATION CHAT - RIGHT SIDE */}
                        <div className="hidden md:w-1/2 md:flex items-center justify-center p-6">
                            <ValidationChat
                                formData={formData}
                                mode="login"
                                trigger={submitCount}
                                onValidationChange={setValidationErrors}
                                apiError={apiError}
                            />
                        </div>
                    </div>
                </BorderAnimatedContainer>
            </div>
        </div>
    );
}
export default LoginPage;