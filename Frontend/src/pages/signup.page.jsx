import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ValidationChat from "../components/ValidationChat";
import { MessageCircleIcon, LockIcon, MailIcon, UserIcon, LoaderIcon, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router";

function SignUpPage() {
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [submitCount, setSubmitCount] = useState(0);
    const [validationErrors, setValidationErrors] = useState({});
    const [apiError, setApiError] = useState(null);
    const { signup, isSigningUp } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError(null); // Clear previous errors
        setSubmitCount(prev => prev + 1); // Increment to trigger validation
        
        // Wait for validation to complete, then check API
        setTimeout(async () => {
            const result = await signup(formData);
            // Check if signup failed
            if (result && result.error) {
                const errorMessage = result.error?.response?.data?.message || "Something went wrong. Please try again.";
                setApiError(errorMessage);
                // Highlight relevant fields based on error
                if (errorMessage.toLowerCase().includes('email')) {
                    setValidationErrors(prev => ({ ...prev, email: true }));
                } else if (errorMessage.toLowerCase().includes('username')) {
                    setValidationErrors(prev => ({ ...prev, username: true }));
                } else {
                    setValidationErrors(prev => ({ ...prev, email: true, username: true }));
                }
            } else if (result && result.data) {
                navigate('/');
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
                                    <h2 className="text-2xl font-bold text-slate-200 mb-2">Create Account</h2>
                                    <p className="text-slate-400">Sign up for a new account</p>
                                </div>

                                {/* FORM */}
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* USERNAME */}
                                    <div>
                                        <label className="auth-input-label">Username</label>
                                        <div className="relative">
                                            <UserIcon className={`auth-input-icon ${validationErrors.username ? "auth-input-icon-error" : ""}`} />

                                            <input
                                                type="text"
                                                value={formData.username}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, username: e.target.value });
                                                    // Clear error when user starts typing
                                                    if (validationErrors.username) {
                                                        setValidationErrors(prev => ({ ...prev, username: false }));
                                                    }
                                                }}
                                                className={`input ${validationErrors.username ? "input-error" : ""}`}
                                                placeholder="johndoe"
                                            />
                                        </div>
                                    </div>

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
                                                type={showPassword ? "text" : "password"}
                                                value={formData.password}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, password: e.target.value });
                                                    // Clear error when user starts typing
                                                    if (validationErrors.password) {
                                                        setValidationErrors(prev => ({ ...prev, password: false }));
                                                    }
                                                }}
                                                className={`input pr-10 ${validationErrors.password ? "input-error" : ""}`}
                                                placeholder="Enter your password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* SUBMIT BUTTON */}
                                    <button className="auth-btn" type="submit" disabled={isSigningUp}>
                                        {isSigningUp ? (
                                            <LoaderIcon className="w-full h-5 animate-spin text-center" />
                                        ) : (
                                            "Create Account"
                                        )}
                                    </button>
                                </form>

                                <div className="mt-6 text-center">
                                    <Link to="/login" className="auth-link">
                                        Already have an account? Login
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* VALIDATION CHAT - RIGHT SIDE */}
                        <div className="hidden md:w-1/2 md:flex items-center justify-center p-6">
                            <ValidationChat
                                formData={formData}
                                mode="signup"
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
export default SignUpPage;