import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HighlightOverdueDirective } from "./highlight-overdue.directive";

@Component({
  template: `<span [appHighlightOverdue]="dueDate"></span>`,
})
class HostComponent {
  dueDate?: string;
}

describe("HighlightOverdueDirective", () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HighlightOverdueDirective],

      declarations: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
  });

  function getSpan(): HTMLElement {
    return fixture.nativeElement.querySelector("span");
  }

  it('adds class "overdue" when dueDate is in the past', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    host.dueDate = yesterday.toISOString();

    fixture.detectChanges();

    const span = getSpan();

    expect(span.classList.contains("overdue")).toBeTrue();
    expect(span.classList.contains("due-soon")).toBeFalse();
  });

  it('adds class "due-soon" when dueDate is today or within 24 hours', () => {
    const today = new Date();
    host.dueDate = today.toISOString();

    fixture.detectChanges();

    const span = getSpan();
    expect(span.classList.contains("due-soon")).toBeTrue();
    expect(span.classList.contains("overdue")).toBeFalse();
  });

  it("does not add class if dueDate is more than 1 day in the future", () => {
    const future = new Date();
    future.setDate(future.getDate() + 3);
    host.dueDate = future.toISOString();

    fixture.detectChanges();

    const span = getSpan();
    expect(span.classList.contains("overdue")).toBeFalse();
    expect(span.classList.contains("due-soon")).toBeFalse();
  });
});
