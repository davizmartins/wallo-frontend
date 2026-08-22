import { createContext, useContext } from "react";

// O contexto (o "canal") fica isolado aqui
export const ToastContext = createContext();

// O hook que as telas usam
export function useToast() {
  return useContext(ToastContext);
}