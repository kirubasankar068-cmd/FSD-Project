try {
  require('mammoth');
  console.log('mammoth found');
} catch (e) {
  console.log('mammoth NOT found:', e.message);
}
try {
  require('pdf-parse');
  console.log('pdf-parse found');
} catch (e) {
  console.log('pdf-parse NOT found:', e.message);
}
