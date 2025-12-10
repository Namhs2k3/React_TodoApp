import { PriorityPipe } from './priority.pipe';

describe('PriorityPipe', () => {
  let pipe: PriorityPipe;
  beforeEach(() => {
    pipe = new PriorityPipe();
  });

  it('transforms 1 to "Low"', () => {
    expect(pipe.transform(1)).toBe('Low');
  });

  it('transforms 2 to "Medium"', () => {
    expect(pipe.transform(2)).toBe('Medium');
  });
  
  it('transforms 3 to "High"', () => {
    expect(pipe.transform(3)).toBe('High');
  });

  it('transforms null to "Unknown"', () => {
    expect(pipe.transform(null)).toBe('Unknown');
  });
  
  it('transforms undefined to "Unknown"', () => {
    expect(pipe.transform(undefined)).toBe('Unknown');
  });

  it('transforms other values to "Unknown"', () => {
    expect(pipe.transform(4)).toBe('Unknown');
  });
});