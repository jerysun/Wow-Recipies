import { Fraction } from 'fractional';

Number.prototype.countDecimals = function() {
    if(Math.floor(this.valueOf()) === this.valueOf()) {
        return 0;
    }

    return this.toString().split('.')[1].length || 0;
};

// A decimal with one-place infinite. e.g. 1.3333... = 1 1/3
export const oneDecimalInfiniteToFraction = dec => {
    let decCpy = dec;
    let decTen = dec * 10;

    decTen = parseInt(decTen.toString().split('.')[0], 10);
    decCpy = parseInt(decCpy.toString().split('.')[0], 10);
	const diff = decTen - decCpy;
	const res = new Fraction(diff, 9).toString();
	return res;
};

// A decimal with two-place infinite. e.g. 0.0343434 = 34/990 = 17/495
export const twoDecimalInfiniteToFraction = dec => {
	let decCpy = dec; // 0.0343434
	let decCen = dec * 100;// 3.43434

	decCpy = parseFloat(decCpy.toString().substring(0, 3));
	decCen = parseFloat(decCen.toString().substring(0, 3));
	const diff = decCen - decCpy;
	const res = new Fraction(diff, 99).toString();
	return res;
};
