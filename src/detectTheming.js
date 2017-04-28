export default function detectTheming(value) {
  return typeof value === 'string' && value[0] === '@';
}
