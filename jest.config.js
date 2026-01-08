module.exports = {
  testEnvironment: 'node',
  // Force Jest à chercher à la racine du projet
  rootDir: '.',
  // Indique où trouver les fichiers de test
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  // Configuration pour lire le TypeScript (server.ts) depuis les tests JS
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: {
        module: 'commonjs',
        target: 'ES2020',
        esModuleInterop: true
      },
      // Ignore l'erreur potentielle sur import.meta lors des tests
      diagnostics: {
        ignoreCodes: [1343] 
      }
    }]
  },
  moduleFileExtensions: ['ts', 'js', 'json']
};