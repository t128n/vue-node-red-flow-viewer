// Mock canvas for jsdom — getContext throws rather than returning null
// Use a simple char-width approximation so label/size tests are predictable.
HTMLCanvasElement.prototype.getContext = () => ({
  font: '',
  measureText: (text) => ({ width: (text?.length ?? 0) * 7.5 }),
})
