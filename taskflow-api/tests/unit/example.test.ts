describe('Example Test', () => {
    it('should pass', () => {
        expect(true).toBe(true);
    });

    it('should handle async', async () => {
        const result = await Promise.resolve('success');
        expect(result).toBe('success');
    });
}); describe('Example Test Suite', () => {
    it('should pass basic test', () => {
        expect(true).toBe(true);
    });

    it('should handle async operations', async () => {
        const result = await Promise.resolve('success');
        expect(result).toBe('success');
    });

    it('should work with numbers', () => {
        const sum = (a: number, b: number) => a + b;
        expect(sum(2, 3)).toBe(5);
    });
});