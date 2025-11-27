import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { refreshAuthToken } from "../utils/auth";

type FormState = {
  email: string;
  password: string;
  remember: boolean;
};

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    remember: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const next: { email?: string; password?: string } = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Enter a valid email";
    }
    if (form.password.length < 6) {
      next.password = "Password must be at least 6 characters";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        setErrors({ email: error.message || "Login failed" });
        return;
      }

      const data = await response.json();
      // Store the token in localStorage
      localStorage.setItem("accessToken", data.tokens.access.token);
      localStorage.setItem("refreshToken", data.tokens.refresh.token);

      navigate("/");
    } catch (error) {
      setErrors({ email: "Network error. Please try again." });
      console.log("Login error", error);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      if (token) {
        navigate("/");
      } else if (refreshToken) {
        await refreshAuthToken(refreshToken);
        navigate("/");
      } else {
        return;
      }
    }
    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-slate-50 via-white to-slate-100 text-left">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-2">
        {/* Left: Illustration / Brand */}
        <div className="hidden lg:flex flex-col justify-between p-10 bg-white/60 backdrop-blur border-r border-slate-200">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-600" />
            <span className="text-xl font-semibold text-slate-900">
              DigiAccel
            </span>
          </div>

          <div className="flex-1 flex items-center">
            <div className="max-w-md">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Accelerate your growth
              </h2>
              <p className="mt-3 text-slate-600">
                Sign in to continue your journey. Your data stays private and
                secure.
              </p>
              <div className="mt-10 grid grid-cols-3 gap-4 text-center">
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="text-2xl font-semibold text-slate-900">
                    99.9%
                  </div>
                  <div className="text-xs text-slate-600">Uptime</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="text-2xl font-semibold text-slate-900">
                    24/7
                  </div>
                  <div className="text-xs text-slate-600">Support</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="text-2xl font-semibold text-slate-900">
                    GDPR
                  </div>
                  <div className="text-xs text-slate-600">Compliant</div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} DigiAccel
          </p>
        </div>

        {/* Right: Form */}
        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:text-left">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                Welcome back
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Sign in to your account
              </p>
            </div>

            <div className="mb-4">
              <button
                type="button"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onClick={() => alert("Google login (demo)")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  className="h-5 w-5"
                >
                  <path
                    fill="#FFC107"
                    d="M43.6 20.5H42V20H24v8h11.3C33.7 31.4 29.3 34 24 34c-7 0-12.9-5.8-12.9-13S17 8 24 8c3.3 0 6.3 1.2 8.6 3.3l5.7-5.7C34.7 2.7 29.6 1 24 1 11.8 1 2 10.8 2 23s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.1-2.2-.4-3.5z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.3 14.7l6.6 4.8C14.7 16.4 18.9 14 24 14c3.3 0 6.3 1.2 8.6 3.3l5.7-5.7C34.7 2.7 29.6 1 24 1 15 1 7.1 6.1 3.7 13.4l2.6 1.3z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24 45c5.2 0 10-1.7 13.8-4.7l-6.4-5.2C29 36.3 26.6 37 24 37c-5.3 0-9.7-3.6-11.4-8.5l-6.5 5C7 40.6 14.9 45 24 45z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.6 20.5H42V20H24v8h11.3c-1.2 3.4-4.4 6-8.3 6-5.3 0-9.7-3.6-11.4-8.5l-6.5 5C11 40.6 18.9 45 24 45c11 0 21-8 21-22 0-1.3-.1-2.2-.4-3.5z"
                  />
                </svg>
                Continue with Google
              </button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-transparent px-2 text-slate-500">or</span>
              </div>
            </div>

            <form onSubmit={onSubmit} noValidate className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  className={`mt-1 w-full rounded-lg border bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.email ? "border-red-400" : "border-slate-300"
                  }`}
                  placeholder="you@example.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="mt-1 text-sm text-red-600">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                    aria-pressed={showPassword}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  className={`mt-1 w-full rounded-lg border bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.password ? "border-red-400" : "border-slate-300"
                  }`}
                  placeholder="••••••••"
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                />
                {errors.password && (
                  <p id="password-error" className="mt-1 text-sm text-red-600">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.remember}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, remember: e.target.checked }))
                    }
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  Remember me
                </label>
                <Link
                  to="#"
                  className="text-sm text-indigo-600 hover:text-indigo-700"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
              >
                {submitting && (
                  <svg
                    className="h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                )}
                Sign in
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-indigo-600 hover:text-indigo-700"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
