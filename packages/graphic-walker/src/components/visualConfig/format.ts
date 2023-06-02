export enum D3FormatAlign {
    /** Forces the field to be right-aligned within the available space. (Default behavior). */
    Right = '>',
    /** Forces the field to be left-aligned within the available space. */
    Left = '<',
    /** Forces the field to be centered within the available space. */
    Center = '^',
    /** like >, but with any sign and symbol to the left of any padding. */
    Between = '=',
}

export enum D3FormatSign {
    /** nothing for zero or positive and a minus sign for negative. */
    Minus = '-',
    /** a plus sign for zero or positive and a minus sign for negative. */
    Plus = '+',
    /** nothing for zero or positive and parentheses for negative. */
    Parentheses = '(',
    /** a space for zero or positive and a minus sign for negative. */
    Space = ' ',
}

export enum D3FormatSymbol {
    /** apply currency symbols per the locale definition. */
    Currency = '$',
    /** for binary, octal, or hexadecimal notation, prefix by 0b, 0o, or 0x, respectively. */
    Binary = '#b',
}

export enum D3FormatTypeDecimal {
    /** fixed point notation. */
    FixedPoint = 'f',
    /** multiply by 100, and then decimal notation with a percent sign. */
    Percent = '%',
}

export enum D3FormatTypeSignificant {
    /** exponent notation. */
    Exponent = 'e',
    /** either decimal or exponent notation, rounded to significant digits. */
    DecimalOrExponent = 'g',
    /** decimal notation, rounded to significant digits. */
    Decimal = 'r',
    /** decimal notation with an SI prefix, rounded to significant digits. */
    DecimalWithSIPrefix = 's',
    /** multiply by 100, round to significant digits, and then decimal notation with a percent sign. */
    PercentWithSignificantDigits = 'p',
}

/**
 * {@link D3FormatTypeDecimal}
 * {@link D3FormatTypeSignificant}
 */
export enum D3FormatType {
    /** shorthand for ~g (with a default precision of 12 instead of 6). */
    None = '',
    /** shorthand for ,g. */
    Nice = 'n',
    /** exponent notation. */
    Exponent = D3FormatTypeSignificant.Exponent,
    /** fixed point notation. */
    FixedPoint = D3FormatTypeDecimal.FixedPoint,
    /** either decimal or exponent notation, rounded to significant digits. */
    DecimalOrExponent = D3FormatTypeSignificant.DecimalOrExponent,
    /** decimal notation, rounded to significant digits. */
    Decimal = D3FormatTypeSignificant.Decimal,
    /** decimal notation with an SI prefix, rounded to significant digits. */
    DecimalWithSIPrefix = D3FormatTypeSignificant.DecimalWithSIPrefix,
    /** multiply by 100, and then decimal notation with a percent sign. */
    Percent = D3FormatTypeDecimal.Percent,
    /** multiply by 100, round to significant digits, and then decimal notation with a percent sign. */
    PercentWithSignificantDigits = D3FormatTypeSignificant.PercentWithSignificantDigits,
    /** binary notation, rounded to integer. */
    Binary = 'b',
    /** octal notation, rounded to integer. */
    Octal = 'o',
    /** decimal notation, rounded to integer. */
    Decimal2 = 'd',
    /** hexadecimal notation, using lower-case letters, rounded to integer. */
    Hexadecimal = 'x',
    /** hexadecimal notation, using upper-case letters, rounded to integer. */
    Hexadecimal2 = 'X',
    /** character data, for a string of text. */
    Character = 'c',
}

/**
 * [​[fill]align][sign][symbol][0][width][,][.precision][~][type]
 * @see https://github.com/d3/d3-format#locale_format
 */
export type D3FormatOptions<T extends D3FormatType = D3FormatType> = {
    fill?: undefined | {
        fillString?: string;
        align: D3FormatAlign;
    };
    sign?: undefined | D3FormatSign;
    symbol?: undefined | D3FormatSymbol;
    groupSeparator?: (
        T extends D3FormatType.Nice ? (undefined | true) : (undefined | boolean)
    );
    trimTrailingZero?: (
        T extends D3FormatType.None ? (undefined | true) : (undefined | boolean)
    );
    type: T;
} & (
    T extends D3FormatTypeDecimal ? {
        /**
         * the number of digits that follow the decimal point
         * @default 6
         */
        precision?: undefined | number;
    } : T extends D3FormatTypeSignificant ? {
        /**
         * the number of significant digits
         * @default 6
         */
        precision?: undefined | number;
    } : T extends D3FormatType.None ? {
        /**
         * the number of digits that follow the decimal point
         * @default 12
         */
        precision?: undefined | number;
    } : {
        precision?: undefined;
    }
);

export const compileD3Format = (raw: string): D3FormatOptions => {
    try {
        const groups = raw.match(/(?<fill>[\s\S]*?)(?<align>[<>^=])?(?<sign>[-+ ])?(?<symbol>[$#])?(?<zero>0)?(?<width>\d+)?(?<groupSeparator>,)?(?<precision>\.\d+)?(?<trimTrailingZero>~)?(?<type>[a-z%])?/i)?.groups;
        if (!groups) {
            throw new Error('Invalid format string');
        }
        const type = groups.type ?? D3FormatType.None;
        return {
            fill: groups.align ? {
                fillString: groups.fill,
                align: groups.align as D3FormatAlign,
            } : undefined,
            sign: groups.sign as D3FormatSign,
            symbol: groups.symbol as D3FormatSymbol,
            precision: groups.precision ? Number(groups.precision.slice(1)) : undefined,
            groupSeparator: groups.groupSeparator === ',',
            trimTrailingZero: groups.trimTrailingZero === '~',
            type: type as D3FormatType,
        };
    } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
            console.error(error);
        }
        return {
            type: D3FormatType.None,
        };
    }
};

export const stringifyD3Format = (options: D3FormatOptions): string => {
    const {
        fill,
        sign,
        symbol,
        precision,
        groupSeparator,
        trimTrailingZero,
        type,
    } = options;
    const fillString = fill?.fillString ?? '';
    const alignString = fill?.align ?? '';
    const signString = sign ?? '';
    const symbolString = symbol ?? '';
    const zeroString = '';
    const widthString = '';
    const groupSeparatorString = groupSeparator ? ',' : '';
    const precisionString = precision !== undefined ? `.${precision}` : '';
    const trimTrailingZeroString = trimTrailingZero ? '~' : '';
    const typeString = type ?? '';
    return `${fillString}${alignString}${signString}${symbolString}${zeroString}${widthString}${groupSeparatorString}${precisionString}${trimTrailingZeroString}${typeString}`;
};
