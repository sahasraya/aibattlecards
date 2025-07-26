'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function useCheckLogin() {
  const router = useRouter();

  useEffect(() => {
    const userId = Cookies.get('adminuserid');
    if (!userId) {
      router.push('/auth/not-authorized');
    }
  }, []);
}
