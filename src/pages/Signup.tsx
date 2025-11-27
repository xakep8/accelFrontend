import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type FormState = {
  name: string;
  email: string;
  password: string;
  confirm: string;
  terms: boolean;
};

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    confirm: "",
    terms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = "Enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Enter a valid email";
    if (form.password.length < 6) next.password = "At least 6 characters";
    if (form.confirm !== form.password) next.confirm = "Passwords do not match";
    if (!form.terms) next.terms = "You must accept the terms";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setErrors({});

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        setErrors({ email: error.message || "Signup failed" });
        return;
      }

      const data = await response.json();
      // Store the token in localStorage
      localStorage.setItem("accessToken", data.tokens.access.token);
      localStorage.setItem("refreshToken", data.tokens.refresh.token);

      navigate("/");
    } catch (error) {
      setErrors({ email: "Network error. Please try again." });
      console.log("Signup error", error);
    } finally {
      setSubmitting(false);
    }
  };
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
                Create your account
              </h2>
              <p className="mt-3 text-slate-600">
                Join DigiAccel to unlock personalized insights and tools.
              </p>
              <ul className="mt-6 space-y-3 text-slate-700">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />{" "}
                  Smart onboarding
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />{" "}
                  Privacy-first design
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />{" "}
                  Fast support
                </li>
              </ul>
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
                Get started free
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                No credit card required
              </p>
            </div>

            <div className="mb-4">
              <button
                type="button"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onClick={() => alert("Google signup (demo)")}
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
                Sign up with Google
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
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-700"
                >
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className={`mt-1 w-full rounded-lg border bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.name ? "border-red-400" : "border-slate-300"
                  }`}
                  placeholder="Jane Doe"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="mt-1 text-sm text-red-600">
                    {errors.name}
                  </p>
                )}
              </div>

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
                  autoComplete="new-password"
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

              <div>
                <label
                  htmlFor="confirm"
                  className="block text-sm font-medium text-slate-700"
                >
                  Confirm password
                </label>
                <input
                  id="confirm"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.confirm}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, confirm: e.target.value }))
                  }
                  className={`mt-1 w-full rounded-lg border bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.confirm ? "border-red-400" : "border-slate-300"
                  }`}
                  placeholder="••••••••"
                  aria-invalid={!!errors.confirm}
                  aria-describedby={
                    errors.confirm ? "confirm-error" : undefined
                  }
                />
                {errors.confirm && (
                  <p id="confirm-error" className="mt-1 text-sm text-red-600">
                    {errors.confirm}
                  </p>
                )}
              </div>

              <div className="flex items-start gap-3">
                <input
                  id="terms"
                  type="checkbox"
                  checked={form.terms}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, terms: e.target.checked }))
                  }
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="terms" className="text-sm text-slate-700">
                  I agree to the{" "}
                  <a className="text-indigo-600 hover:text-indigo-700" href="#">
                    Terms
                  </a>{" "}
                  and{" "}
                  <a className="text-indigo-600 hover:text-indigo-700" href="#">
                    Privacy Policy
                  </a>
                </label>
              </div>
              {errors.terms && (
                <p className="-mt-2 text-sm text-red-600">{errors.terms}</p>
              )}

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
                Create account
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-700"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
