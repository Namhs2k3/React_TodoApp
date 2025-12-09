import { TestBed } from '@angular/core/testing';
import { ConfirmDialogRequest, ConfirmDialogService } from './confirm-dialog.service';

describe('ConfirmDialogService', () => {
  let service: ConfirmDialogService;
  let receivedRequest: ConfirmDialogRequest | null;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmDialogService);
    receivedRequest = null;

    service.request$.subscribe(req => {
      receivedRequest = req;
    });
  });

  it('open() phát sự kiện và resolve Promise với giá trị true', async () => {
    const promise = service.open('Delete item?');

    // Đảm bảo request được phát ra
    expect(receivedRequest).toBeTruthy();
    expect(receivedRequest?.message).toBe('Delete item?');

    // Gọi resolve thủ công như ConfirmDialogComponent sẽ làm
    receivedRequest?.resolve(true);

    await expectAsync(promise).toBeResolvedTo(true);
  });

  it('open() có thể resolve false', async () => {
    const promise = service.open('Cancel action?');
    receivedRequest?.resolve(false);
    await expectAsync(promise).toBeResolvedTo(false);
  });
});


