import { ColorByIdPipe } from './color-by-id.pipe';
import { GetDpmColors } from '../../models/get-dpm-colors';

describe('ColorByIdPipe', () => {
  let pipe: ColorByIdPipe;
  let mockColors: GetDpmColors[];

  beforeEach(() => {
    pipe = new ColorByIdPipe();
    mockColors = [
      { colorId: 1, hexCode: '#FF0000', colorName: 'Red' },
      { colorId: 2, hexCode: '#00FF00', colorName: 'Green' },
      { colorId: 3, hexCode: '#0000FF', colorName: 'Blue' },
    ];
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return null for null colorId', () => {
    expect(pipe.transform(mockColors, null)).toBeNull();
  });

  it('should return null for undefined colorId', () => {
    expect(pipe.transform(mockColors, undefined)).toBeNull();
  });

  it('should return null for colorId 0', () => {
    expect(pipe.transform(mockColors, 0)).toBeNull();
  });

  it('should find color by id', () => {
    const result = pipe.transform(mockColors, 1);
    expect(result).toBeTruthy();
    expect(result?.colorId).toBe(1);
    expect(result?.hexCode).toBe('#FF0000');
  });

  it('should find different colors', () => {
    expect(pipe.transform(mockColors, 2)?.hexCode).toBe('#00FF00');
    expect(pipe.transform(mockColors, 3)?.hexCode).toBe('#0000FF');
  });

  it('should return null for non-existent colorId', () => {
    expect(pipe.transform(mockColors, 99)).toBeNull();
  });

  it('should return null for empty colors array', () => {
    expect(pipe.transform([], 1)).toBeNull();
  });
});
