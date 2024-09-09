module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '../',
    testEnvironment: 'node',
    testRegex: '.e2e-spec.ts$',
    transform: {
        '^.+\\.(t|j)s$': '@swc/jest'
    },
    testTimeout: 120000
}