'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type AdminTheme = 'dark' | 'light' | 'blue' | 'black';

interface AdminThemeContextType {
  theme: AdminTheme;
  setTheme: (theme: AdminTheme) => void;
}

const AdminThemeContext = createContext<AdminThemeContextType>({
  theme: 'dark',
  setTheme: () => {},
});

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<AdminTheme>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('admin_theme') as AdminTheme;
    if (savedTheme && ['dark', 'light', 'blue', 'black'].includes(savedTheme)) {
      setThemeState(savedTheme);
    }
  }, []);

  const setTheme = (newTheme: AdminTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('admin_theme', newTheme);
  };

  return (
    <AdminThemeContext.Provider value={{ theme, setTheme }}>
      <div data-admin-theme={theme} className={`theme-${theme} min-h-screen transition-colors duration-200`}>
        {children}
      </div>
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  return useContext(AdminThemeContext);
}
