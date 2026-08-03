"use client";

import { useEffect, useState } from "react";
import { exchangeCode, setRecoverySession, verifyRecoverySession } from "../actions";
import ResetPasswordHero from "./ResetPasswordHero";
import ResetPasswordForm from "./ResetPasswordForm";
import { ScrollReveal } from "@/components/ui";

type ResetPasswordContainerProps = {
  code?: string;
  linkError?: string;
};

function getRecoveryTokensFromHash() {
  const hash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : window.location.hash;
  const params = new URLSearchParams(hash);

  return {
    accessToken: params.get("access_token") || undefined,
    refreshToken: params.get("refresh_token") || undefined,
    error: params.get("error_description") || params.get("error") || undefined,
  };
}

export default function ResetPasswordContainer({ code, linkError }: ResetPasswordContainerProps) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let ignore = false;

    async function prepareResetSession() {
      if (linkError) {
        setStatus("error");
        setErrorMsg(linkError);
        return;
      }

      const recoveryTokens = getRecoveryTokensFromHash();
      if (!code && recoveryTokens.error) {
        setStatus("error");
        setErrorMsg(recoveryTokens.error);
        return;
      }

      const hasHashTokens = Boolean(recoveryTokens.accessToken && recoveryTokens.refreshToken);
      const result = code
        ? await exchangeCode(code)
        : hasHashTokens
          ? await setRecoverySession(recoveryTokens)
          : await verifyRecoverySession();

      if (ignore) return;

      if (result.error) {
        setStatus("error");
        setErrorMsg("Link reset password tidak valid atau sudah kedaluwarsa.");
        return;
      }

      window.history.replaceState({}, "", window.location.pathname);
      setStatus("ready");
    }

    prepareResetSession();

    return () => {
      ignore = true;
    };
  }, [code, linkError]);

  if (status === "loading") {
    return (
      <div className="relative w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 text-center">
          <div className="animate-spin h-8 w-8 border-2 border-gold border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white-text text-sm">Memproses link reset password...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="relative w-full max-w-md">
        <ScrollReveal>
          <ResetPasswordHero />
        </ScrollReveal>
        <ScrollReveal delay={200}>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">{errorMsg}</div>
            <a href="/login" className="block w-full text-center py-3 px-4 border border-gold/30 rounded-lg text-gold hover:bg-gold/10 transition-all duration-300 font-semibold">
              Kembali ke Login
            </a>
          </div>
        </ScrollReveal>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md">
      <ScrollReveal>
        <ResetPasswordHero />
      </ScrollReveal>
      <ScrollReveal delay={200}>
        <ResetPasswordForm />
      </ScrollReveal>
    </div>
  );
}
