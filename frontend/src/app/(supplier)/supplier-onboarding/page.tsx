'use client';

import { useRouter } from 'next/navigation';
import { SupplierOnboardingWizard } from '@/components/supplier';

export default function SupplierOnboardingPage() {
  const router = useRouter();

  const handleComplete = () => {
    router.push('/supplier-dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <SupplierOnboardingWizard onComplete={handleComplete} />
    </div>
  );
}
