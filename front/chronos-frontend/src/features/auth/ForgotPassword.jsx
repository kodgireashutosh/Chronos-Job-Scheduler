import { useState } from "react";
import { Clock, ArrowLeft } from "lucide-react";

import Card from "../../components/Card";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { forgotPassword } from "@/features/auth/auth.api";

const ForgotPasswordScreen = ({ onNavigate }) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await forgotPassword(email); // 🔐 real API call
      setSubmitted(true);
    } catch (err) {
      // still show success UX (security best practice)
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center gap-3 mb-8">
          <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Clock className="text-white w-6 h-6" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Chronos
          </h2>
        </div>

        <h2 className="text-center text-2xl font-bold text-slate-900 mb-2">
          Reset Password
        </h2>
        <p className="text-center text-slate-500 text-sm mb-8">
          Enter your email and we'll send you a reset link
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 sm:px-10 border-slate-200 shadow-lg">
          {!submitted ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <Input
                label="Email address"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {error && (
                <p className="text-sm text-red-600 font-medium">{error}</p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 py-2.5 text-base"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-sm font-medium text-emerald-600">
                ✅ If an account exists, a reset link has been sent.
              </p>
              <Button
                onClick={() => onNavigate("login")}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Return to Sign in
              </Button>
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => onNavigate("login")}
              className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-700"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Sign in
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;
