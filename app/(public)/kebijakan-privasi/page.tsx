// app/(public)/kebijakan-privasi/page.tsx

import { PrivacyPolicyContainer } from "./components";

export const metadata = {
  title: "Kebijakan Privasi | PT. CertiGuardia Solusi",
  description: "Kebijakan privasi PT. CertiGuardia Solusi menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda.",
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyContainer />;
}
