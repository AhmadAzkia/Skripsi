"use client";

import PrivacyPolicyHero from "./PrivacyPolicyHero";
import PrivacyPolicyContent from "./PrivacyPolicyContent";

export default function PrivacyPolicyContainer() {
  return (
    <div className="min-h-screen">
      <PrivacyPolicyHero />
      <PrivacyPolicyContent />
    </div>
  );
}
