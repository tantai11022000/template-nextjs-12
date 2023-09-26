import { createContext, useContext, useState, ReactNode } from 'react';

interface IBreadcrumb {
  label: string | number,
  url: string
}

interface BreadcrumbContextType {
  breadcrumb: IBreadcrumb[];
  setBreadcrumb: React.Dispatch<React.SetStateAction<IBreadcrumb[]>>;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

interface BreadcrumbProviderProps {
  children: ReactNode;
}

export function BreadcrumbProvider({ children }: BreadcrumbProviderProps) {
  const [breadcrumb, setBreadcrumb] = useState<IBreadcrumb[]>([]);

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
