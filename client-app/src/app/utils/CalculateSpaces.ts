export const calculateSpaces = (targetLength: number, currentLength: number) => {
    const spaceCount = targetLength - currentLength;
    return '\u00A0'.repeat(spaceCount); // '\u00A0' is a non-breaking space character
};