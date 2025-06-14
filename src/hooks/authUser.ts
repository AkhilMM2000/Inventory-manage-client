import { useState, useEffect } from "react";
import { getCurrentUser } from "../api/auth";
import type { TokenPayload } from "../types/user"; 
import axios from "axios";

interface UseAuthUserResult {
  user: TokenPayload | null;
  loading: boolean;
  error: string | null;
}

export const useAuthUser = (): UseAuthUserResult => {
  const [user, setUser] = useState<TokenPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      try {
        const fetched = await getCurrentUser();
        if (isMounted) setUser(fetched);
      } catch (error: unknown) {
          let msg = "Something went wrong";
    
    if (axios.isAxiosError(error) && error.response) {
      msg = error.response.data?.error || msg;
    }
        if (isMounted) setError(msg);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
fetchUser()

    return () => {
      isMounted = false;
    };
  }, []);

  return { user, loading, error };
};
