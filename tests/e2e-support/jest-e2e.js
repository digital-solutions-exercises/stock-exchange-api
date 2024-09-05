module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '../',
    testEnvironment: 'node',
    testRegex: process.env.APP_ENV === 'production' ? 'tests/production/.*|(\\.|/).e2e-spec.ts$' : '.e2e-spec.ts$',
    transform: {
        '^.+\\.(t|j)s$': '@swc/jest'
    },
    testTimeout: 120000
}