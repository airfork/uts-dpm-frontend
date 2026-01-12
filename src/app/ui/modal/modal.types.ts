export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ModalConfig {
  size?: ModalSize;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
}
