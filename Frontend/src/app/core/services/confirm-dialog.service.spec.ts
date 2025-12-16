import { TestBed } from "@angular/core/testing";
import {
  ConfirmDialogRequest,
  ConfirmDialogService,
} from "./confirm-dialog.service";

describe("ConfirmDialogService", () => {
  let service: ConfirmDialogService;
  let receivedRequest: ConfirmDialogRequest | null;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmDialogService);
    receivedRequest = null;

    service.request$.subscribe((req) => {
      receivedRequest = req;
    });
  });

  it("open() emits event and resolves Promise with value true", async () => {
    const promise = service.open("Are you sure you want to delete this item?");

    // Ensure request is emitted
    expect(receivedRequest).toBeTruthy();
    expect(receivedRequest?.message).toBe(
      "Are you sure you want to delete this item?",
    );

    // Manually call resolve as ConfirmDialogComponent will do
    receivedRequest?.resolve(true);

    await expectAsync(promise).toBeResolvedTo(true);
  });

  it("open() can resolve false", async () => {
    const promise = service.open(
      "Are you sure you want to cancel this action?",
    );

    // Ensure request is emitted
    expect(receivedRequest).toBeTruthy();
    expect(receivedRequest?.message).toBe(
      "Are you sure you want to cancel this action?",
    );

    receivedRequest?.resolve(false);

    await expectAsync(promise).toBeResolvedTo(false);
  });
});
