import { Directive, ElementRef, HostListener, input, OnInit } from '@angular/core';

@Directive({
  selector: 'textarea[appAutoResize]',
  standalone: true,
})
export class AutoResizeDirective implements OnInit {
  minRows = input<number>(1);

  constructor(private elementRef: ElementRef<HTMLTextAreaElement>) {}

  ngOnInit(): void {
    this.resize();
  }

  @HostListener('input')
  onInput(): void {
    this.resize();
  }

  private resize(): void {
    const textarea = this.elementRef.nativeElement;
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight, 10) || 20;
    const minHeight = lineHeight * this.minRows();

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto';

    // Set height to scrollHeight, but at least minHeight
    const newHeight = Math.max(textarea.scrollHeight, minHeight);
    textarea.style.height = `${newHeight}px`;

    // Remove the default overflow
    textarea.style.overflow = 'hidden';
  }
}
