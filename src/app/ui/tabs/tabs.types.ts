export interface Tab {
  name: string;
  label: string;
  disabled?: boolean;
}

export type TabSize = 'sm' | 'md' | 'lg';
export type TabVariant = 'default' | 'bordered' | 'lifted';
