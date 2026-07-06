// __tests__/wateringCalculator.test.js

// Conversion constants — same as WateringCalculatorScreen.js
const ML_TO_FLOZ = 0.033814;
const FLOZ_TO_ML = 29.5735;

// Pure conversion functions extracted for testing
const mlToFloz = (ml) => parseFloat((ml * ML_TO_FLOZ).toFixed(1));
const flozToMl = (floz) => parseFloat((floz * FLOZ_TO_ML).toFixed(1));

describe('Watering Calculator - ml to fl oz', () => {

  test('934 ml converts to 31.6 fl oz (scenario example)', () => {
    expect(mlToFloz(934)).toBe(31.6);
  });

  test('0 ml converts to 0.0 fl oz (zero boundary)', () => {
    expect(mlToFloz(0)).toBe(0);
  });

  test('250 ml converts to 8.5 fl oz', () => {
    expect(mlToFloz(250)).toBe(8.5);
  });

  test('1000 ml converts to 33.8 fl oz', () => {
    expect(mlToFloz(1000)).toBe(33.8);
  });

});

describe('Watering Calculator - fl oz to ml', () => {

  test('31.6 fl oz converts back to approximately 934 ml', () => {
    expect(flozToMl(31.6)).toBe(934.5); 
  });

  test('0 fl oz converts to 0.0 ml (zero boundary)', () => {
    expect(flozToMl(0)).toBe(0);
  });

  test('8 fl oz converts to 236.6 ml', () => {
    expect(flozToMl(8)).toBe(236.6);
  });

});