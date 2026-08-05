// app/(auth)/login/page.tsx

import { LoginContainer } from "./components";

type LoginPageProps = {
  searchParams: Promise<{
    message?: string | string[];
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const message = Array.isArray(params.message) ? params.message[0] : params.message || "";

  return (
    <div className="min-h-screen bg-linear-to-br from-navy via-navy/95 to-navy/90 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-linear-to-r from-gold/20 via-transparent to-gold/20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_25%,rgba(212,175,55,0.1)_0%,transparent_50%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_25%_25%,rgba(212,175,55,0.1)_0%,transparent_50%)]"></div>
      </div>

      <LoginContainer message={message} />
    </div>
  );
}
