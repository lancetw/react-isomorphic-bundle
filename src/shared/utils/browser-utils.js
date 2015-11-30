// detect IE: http://codepen.io/gapcode/pen/vEJNZN
/**
 * detect IE
 * returns version of IE or false, if browser is not Internet Explorer
 */
export function detectIE () {
  const ua = window.navigator.userAgent

  // test values
  // IE 10
  // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';
  // IE 11
  // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';
  // IE 12 / Spartan
  // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

  const msie = ua.indexOf('MSIE ')
  if (msie > 0) {
    // IE 10 or older => return version number
    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10)
  }

  const trident = ua.indexOf('Trident/')
  if (trident > 0) {
    // IE 11 => return version number
    const rv = ua.indexOf('rv:')
    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10)
  }

  const edge = ua.indexOf('Edge/')
  if (edge > 0) {
    // IE 12 => return version number
    return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10)
  }

  // other browser
  return false
}
