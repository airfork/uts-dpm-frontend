export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';
export type ModalHeaderStyle = 'default' | 'gradient';

export interface ModalConfig {
  size?: ModalSize;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
}
