import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
} from "@angular/core";

@Directive({
  selector: "[appPriorityStyle]",
  standalone: true,
})
export class PriorityStyleDirective implements OnChanges {
  @Input() appPriorityStyle: number | null | undefined;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!("appPriorityStyle" in changes)) return;
    this.applyStyles();
  }

  private applyStyles(): void {
    const host = this.el.nativeElement;
    // Clear previous priority classes
    this.renderer.removeClass(host, "priority-low");
    this.renderer.removeClass(host, "priority-medium");
    this.renderer.removeClass(host, "priority-high");

    switch (this.appPriorityStyle) {
      case 1:
        this.renderer.addClass(host, "priority-low");
        break;
      case 2:
        this.renderer.addClass(host, "priority-medium");
        break;
      case 3:
        this.renderer.addClass(host, "priority-high");

        break;
    }
  }
}
