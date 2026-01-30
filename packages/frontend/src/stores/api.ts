import { writable } from 'svelte/store';

interface APIState {
  token: string | null;
  user: any | null;
  loading: boolean;
  error: string | null;
}

function createAPIStore() {
  const { subscribe, set, update } = writable<APIState>({
    token: localStorage.getItem('token'),
    user: null,
    loading: false,
    error: null,
  });

  return {
    subscribe,
    
    async login(email: string, password: string) {
      update(s => ({ ...s, loading: true, error: null }));
      try {
        const res = await fetch('/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error);
        
        localStorage.setItem('token', data.token);
        update(s => ({ ...s, token: data.token, user: data.user }));
      } catch (error: any) {
        update(s => ({ ...s, error: error.message }));
      } finally {
        update(s => ({ ...s, loading: false }));
      }
    },

    async logout() {
      localStorage.removeItem('token');
      update(s => ({ ...s, token: null, user: null }));
    },

    setError(error: string) {
      update(s => ({ ...s, error }));
    },

    clearError() {
      update(s => ({ ...s, error: null }));
    },
  };
}

export const apiStore = createAPIStore();
