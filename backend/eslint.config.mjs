// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked, // Cette ligne active la vérification stricte des types
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'module', // Changé de commonjs à module car NestJS utilise l'ESM/TypeScript
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      // Désactive les erreurs de type "any" qui bloquent le développement rapide
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',

      // Garde les promesses en "warn" pour éviter d'oublier des "await"
      '@typescript-eslint/no-floating-promises': 'warn',

      // Gestion Prettier pour éviter les conflits de retours à la ligne (Windows vs Linux)
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
);
