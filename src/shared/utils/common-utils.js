export function EQUAL (a, b) {
  let _a = a
  let _b = b
  if (typeof _a === 'undefined') _a = null
  if (typeof _b === 'undefined') _b = null

  return (_a === _b)
}
