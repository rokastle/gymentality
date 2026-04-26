export function buildTouchedFields(fieldNames) {
  return fieldNames.reduce((accumulator, fieldName) => {
    accumulator[fieldName] = true;
    return accumulator;
  }, {});
}