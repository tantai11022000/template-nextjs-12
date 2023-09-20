import { createContext, useContext, useState, ReactNode } from 'react';

interface BreadcrumbContextType {
  breadcrumb: { label: string; url: string }[];
  setBreadcrumb: React.Dispatch<React.SetStateAction<{ label: string; url: string }[]>>;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

interface BreadcrumbProviderProps {
  children: ReactNode;
}

export function BreadcrumbProvider({ children }: BreadcrumbProviderProps) {
  const [breadcrumb, setBreadcrumb] = useState<{ label: string; url: string }[]>([]);

  return (
    <BreadcrumbContext.Provider value={{ breadcrumb, setBreadcrumb }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumb(): BreadcrumbContextType {
    const context = useContext(BreadcrumbContext);
    if (context === undefined) {
      throw new Error('useBreadcrumb must be used within a BreadcrumbProvider');
    }
    return context;
  }
