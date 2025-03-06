'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export function WelcomeToast({ username }: { username?: string | null }) {
  const toastShown = useRef(false);

  useEffect(() => {
    if (!toastShown.current) {
      toast.success(
        username ? `Welcome, ${username}!` : "Welcome!"
      );
      toastShown.current = true;
    }
  }, [username]);

  return null;
} 