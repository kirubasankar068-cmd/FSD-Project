const calculateFee = (salary, feeType, feeValue) => {
  let brokerageAmount = 0;
  if (feeType === 'fixed') {
    brokerageAmount = feeValue;
  } else {
    // Regex to find numbers including decimals
    const matches = salary.match(/(\d+(\.\d+)?)/g);
    if (matches) {
      const numbers = matches.map(Number);
      // Average of the range
      const avg = numbers.reduce((a, b) => a + b, 0) / numbers.length;
      
      let multiplier = 1;
      const lower = salary.toLowerCase();
      if (lower.includes('l')) multiplier = 100000;
      else if (lower.includes('k')) multiplier = 1000;
      
      brokerageAmount = Math.round((avg * multiplier * feeValue) / 100);
      return { avg, multiplier, brokerageAmount };
    }
  }
  return { brokerageAmount };
};

const testCases = [
  { s: "₹18L - ₹25L", t: "percentage", v: 8 },
  { s: "₹20,00,000", t: "percentage", v: 10 },
  { s: "400000", t: "percentage", v: 5 },
  { s: "50k - 80k", t: "percentage", v: 8 },
  { s: "Fixed Fee Job", t: "fixed", v: 15000 }
];

testCases.forEach(tc => {
  console.log(`Input: ${tc.s} | Type: ${tc.t} | Val: ${tc.v}`);
  console.log('Result:', calculateFee(tc.s, tc.t, tc.v));
  console.log('-------------------');
});
