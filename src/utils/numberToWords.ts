/**
 * Convert number to Indian Currency Words Format.
 * Example: 27195 -> "Rupees Twenty Seven Thousand One Hundred Ninety Five Only"
 * Example: 27194.99 -> "Rupees Twenty Seven Thousand One Hundred Ninety Four and Ninety Nine Paise Only"
 */

const units = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'
];

const tens = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

function convertLessThanThousand(num: number): string {
  let str = '';

  if (num >= 100) {
    str += units[Math.floor(num / 100)] + ' Hundred ';
    num %= 100;
  }

  if (num >= 20) {
    str += tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + units[num % 10] : '');
  } else if (num > 0) {
    str += units[num];
  }

  return str.trim();
}

export function numberToIndianWords(amount: number): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return 'Rupees Zero Only';
  }

  // Handle rounding to 2 decimal places to avoid floating precision bugs
  const roundedAmount = Math.round(amount * 100) / 100;
  const rupees = Math.floor(roundedAmount);
  const paise = Math.round((roundedAmount - rupees) * 100);

  if (rupees === 0 && paise === 0) {
    return 'Rupees Zero Only';
  }

  let result = '';

  if (rupees > 0) {
    let tempRupees = rupees;

    const crore = Math.floor(tempRupees / 10000000);
    tempRupees %= 10000000;

    const lakh = Math.floor(tempRupees / 100000);
    tempRupees %= 100000;

    const thousand = Math.floor(tempRupees / 1000);
    tempRupees %= 1000;

    const remaining = tempRupees;

    if (crore > 0) {
      result += convertLessThanThousand(crore) + ' Crore ';
    }
    if (lakh > 0) {
      result += convertLessThanThousand(lakh) + ' Lakh ';
    }
    if (thousand > 0) {
      result += convertLessThanThousand(thousand) + ' Thousand ';
    }
    if (remaining > 0) {
      result += convertLessThanThousand(remaining) + ' ';
    }

    result = 'Rupees ' + result.trim();
  } else {
    result = 'Rupees Zero';
  }

  if (paise > 0) {
    const paiseText = convertLessThanThousand(paise);
    result += ` and ${paiseText} Paise`;
  }

  result += ' Only';

  return result.replace(/\s+/g, ' ');
}
