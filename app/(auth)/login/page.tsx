// app/(auth)/login/page.tsx

import { LoginContainer } from "./components";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy/95 to-navy/90 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-gold/20 via-transparent to-gold/20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_25%,_rgba(212,175,55,0.1)_0%,_transparent_50%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_75%_75%,_rgba(192,192,192,0.1)_0%,_transparent_50%)]"></div>
      </div>

      <LoginContainer />
    </div>
  );
}