import { PointsDisplayPipe } from './points-display.pipe';

describe('PointsDisplayPipe', () => {
  let pipe: PointsDisplayPipe;

  beforeEach(() => {
    pipe = new PointsDisplayPipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty string for null', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('should return empty string for undefined', () => {
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should add + prefix for positive numbers', () => {
    expect(pipe.transform(5)).toBe('+5');
    expect(pipe.transform(100)).toBe('+100');
    expect(pipe.transform(1)).toBe('+1');
  });

  it('should not add prefix for zero', () => {
    expect(pipe.transform(0)).toBe('0');
  });

  it('should keep negative sign for negative numbers', () => {
    expect(pipe.transform(-5)).toBe('-5');
    expect(pipe.transform(-100)).toBe('-100');
    expect(pipe.transform(-1)).toBe('-1');
  });
});
