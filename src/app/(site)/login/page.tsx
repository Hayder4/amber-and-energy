"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useLocale } from "@/context/locale-context";
import { MagneticButton } from "@/components/motion/magnetic-button";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const { dict } = useLocale();
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (!res.ok) {
      setError(res.error ?? dict.common.error);
      return;
    }
    router.push(searchParams.get("next") || "/account");
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md rounded-3xl card-border bg-background-card p-8 md:p-10"
      >
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300">
            <LogIn size={22} />
          </span>
          <h1 className="font-display text-2xl text-foreground md:text-3xl">{dict.auth.loginTitle}</h1>
          <p className="mt-2 text-sm text-muted">{dict.auth.loginSub}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">{dict.auth.email}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-amber-400/60 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">{dict.auth.password}</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-amber-400/60 focus:outline-none"
            />
          </div>

          {error && <p className="text-sm text-cherry-500">{error}</p>}

          <MagneticButton
            type="submit"
            className="mt-2 w-full bg-amber-400 text-amber-950 hover:bg-amber-300 disabled:opacity-60"
          >
            {loading ? dict.common.loading : dict.auth.submitLogin}
          </MagneticButton>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          {dict.auth.noAccount}{" "}
          <Link href="/register" className="font-semibold text-amber-300 hover:text-amber-200">
            {dict.auth.createOne}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
