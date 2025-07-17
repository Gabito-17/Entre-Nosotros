// src/components/UserInfo.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient.ts';

export function UserInfo() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    fetchUser();
  }, []);

  if (!user) return <p>No estás logueado</p>;

  return (
    <div className="p-4">
      <p>Sesión iniciada como: {user.email}</p>
    </div>
  );
}
