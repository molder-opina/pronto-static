/**
 * Barrel Export - TypeScript types compartidos
 * @module types
 */

// Tipos API compartidos
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

// Tipos de órdenes
export interface OrderStatus {
  code: string;
  label: string;
  color: string;
}

// Tipos de mesas
export interface TableArea {
  code: string;
  label: string;
}

// Más tipos se agregarán aquí...
