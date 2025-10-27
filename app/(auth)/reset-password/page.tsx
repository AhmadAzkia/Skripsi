// app/(auth)/reset-password/page.tsx

import { ResetPasswordContainer } from "./components";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-navy via-navy/95 to-navy/90 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border border-gold rounded-full animate-bounce-gentle"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 border border-silver rounded-full animate-bounce-gentle" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-gold rounded-full animate-bounce-gentle" style={{ animationDelay: "2s" }}></div>
        <div className="absolute inset-0 bg-linear-to-r from-gold/20 via-transparent to-gold/20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_25%,rgba(212,175,55,0.1)_0%,transparent_50%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_75%_75%,rgba(192,192,192,0.1)_0%,transparent_50%)]"></div>
      </div>

      <ResetPasswordContainer />
    </div>
  );
}
