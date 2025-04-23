// Mock for next/font
const fontMock = {
  className: 'mock-font',
  style: { fontFamily: 'mock-font' },
  variable: '--mock-font',
};

// Mock exports that match the structure of assets/fonts/index.ts
export const fontSans = fontMock;
export const fontUrban = fontMock;
export const fontHeading = fontMock;
export const fontGeist = fontMock;

export default () => fontMock; 