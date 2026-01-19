import { TemplateRef } from '@angular/core';

export interface TableColumn<T = unknown> {
  field: keyof T | string;
  header: string;
  template?: TemplateRef<{ $implicit: T; column: TableColumn<T> }>;
  cellClass?: string;
  headerClass?: string;
}

export interface LazyLoadEvent {
  first: number;
  rows: number;
}

export interface PageChangeEvent {
  page: number;
  rows: number;
  first: number;
}
