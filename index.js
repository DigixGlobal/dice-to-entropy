const prompt = require('prompt-promise');
const BigNumber = require('bignumber.js');

const charMap = [null, '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

(async () => {
  const entropy = await prompt('Bits of entropy [128 default] : ') || 128;
  const base = await prompt('Sides on dice [16 default] : ') || 16;
  const n = base;
  let i = 0;
  let data = '';
  const rolls = Math.ceil(entropy / Math.log2(base)) + 1; // 1 extra for initial XOR
  // console.log(`${base} sided dice required ${rolls} rolls for ${entropy} bits of entropy`);
  while (i < rolls) {
    const input = parseInt(await prompt(`Roll: `), 10);
    const char = input <= base && charMap[input];
    if (char) {
      data += char;
      i += 1;
    }
  }
  const xored = data.split('').slice(0, data.length - 1).map((char, i) => {
    const a = new BigNumber(char, 16).toString(2);
    const b = new BigNumber(data[i+1], 16).toString(2);
    const aBinary = `${new Array(4 - a.length).fill(0).join('')}${a}`;
    const bBinary = `${new Array(4 - b.length).fill(0).join('')}${b}`;
    const xorBinary = aBinary.split('').map((ba, i) => ba !== bBinary[i] ? '1' : '0').join('');
    console.log(aBinary, bBinary, xorBinary);
    return new BigNumber(xorBinary, 2).toString(16);
  }).join('');

  console.log('--->', xored);
  process.exit();
})();
