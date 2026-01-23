import {
  Directive,
  ElementRef,
  HostListener,
  input,
  OnInit,
  OnDestroy,
  NgZone,
} from '@angular/core';

@Directive({
  selector: 'textarea[appAutoResize]',
  standalone: true,
})
export class AutoResizeDirective implements OnInit, OnDestroy {
  minRows = input<number>(1);

  private intersectionObserver: IntersectionObserver | null = null;
  private hasResizedWhenVisible = false;

  constructor(
    private elementRef: ElementRef<HTMLTextAreaElement>,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.resize();
    this.setupVisibilityObserver();
  }

  ngOnDestroy(): void {
    this.intersectionObserver?.disconnect();
  }

  @HostListener('input')
  onInput(): void {
    this.resize();
  }

  private setupVisibilityObserver(): void {
    // Use IntersectionObserver to detect when textarea becomes visible
    // This handles cases where textarea is in a hidden tab during initial render
    this.ngZone.runOutsideAngular(() => {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry.isIntersecting && !this.hasResizedWhenVisible) {
            this.hasResizedWhenVisible = true;
            // Resize when element becomes visible
            this.ngZone.run(() => this.resize());
          }
        },
        { threshold: 0.1 }
      );
      this.intersectionObserver.observe(this.elementRef.nativeElement);
    });
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
