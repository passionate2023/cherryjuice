import { calculateNumberOfFrames } from '::store/ducks/cache/document-cache/helpers/timeline/timeline';

describe('calculate number of frames', function() {
  it('case 1', () => {
    const nof = calculateNumberOfFrames([0], 0);
    expect(nof).toEqual({ redo: 0, undo: 1 });
  });
  it('case 2', () => {
    const nof = calculateNumberOfFrames([0, 1, 2, 3, 4], 1);
    expect(nof).toEqual({
      redo: 3,
      undo: 2,
    });
  });

  it('case 3', () => {
    const nof = calculateNumberOfFrames([0, 1, 2, 3, 4], 4);
    expect(nof).toEqual({
      redo: 0,
      undo: 5,
    });
  });

  it('case 4', () => {
    const nof = calculateNumberOfFrames([1, 2, 3, 4, 5], 1);
    expect(nof).toEqual({
      redo: 4,
      undo: 0,
    });
  });

  it('case 5', () => {
    const nof = calculateNumberOfFrames([1, 2, 3, 4, 5], 5);
    expect(nof).toEqual({
      redo: 0,
      undo: 4,
    });
  });

  it('case 6', () => {
    const nof = calculateNumberOfFrames([1, 2, 3, 4], 1);
    expect(nof).toEqual({
      redo: 3,
      undo: 0,
    });
  });

  it('case 7', () => {
    const nof = calculateNumberOfFrames([2, 3, 4, 5], 2);
    expect(nof).toEqual({
      redo: 3,
      undo: 0,
    });
  });

  it('case 8', () => {
    const nof = calculateNumberOfFrames([], -1);
    expect(nof).toEqual({
      redo: 0,
      undo: 0,
    });
  });
});
