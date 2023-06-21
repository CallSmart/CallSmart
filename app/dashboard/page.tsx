"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../supabase';
import Sidebar from '@/components/sidebar';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const session = supabase.auth.getSession();
    if (!session) {
      router.push('/signin'); // Redirect to sign-in if no session found
    }
  }, []);

  return (
    <Sidebar>
      <div className="text-blue-500">
        <h1>Dashboard</h1>
      </div>
    </Sidebar>
  );
}