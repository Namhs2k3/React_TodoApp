import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlightOverdue]',
  standalone: true
})
export class HighlightOverdueDirective implements OnInit {
  @Input() appHighlightOverdue?: string; // dueDate

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    if (this.appHighlightOverdue) {
      const dueDate = new Date(this.appHighlightOverdue);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const diff = dueDate.getTime() - today.getTime();

      if (dueDate < today) {
        this.renderer.addClass(this.el.nativeElement, 'overdue');
      }else if (diff <= 24 * 60 * 60 * 1000) {
        this.renderer.addClass(this.el.nativeElement, 'due-soon');
      }
    }
  }
}

