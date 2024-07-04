import globals from 'globals';
import pluginJs from '@eslint/js';
import standard from 'eslint-config-standard';
import pluginN from 'eslint-plugin-n';
import pluginPromise from 'eslint-plugin-promise';
import pluginImport from 'eslint-plugin-import';

const config = [
  {
    files: ['*.{js,mjs,cjs}', '**/*.js', '**/*.mjs', '**/*.cjs'],
    languageOptions: {
      globals: {
        ...globals.node,
        globalThis: 'readonly'
      }
    }
  },
  pluginJs.configs.recommended,
  {
    plugins: {
      n: pluginN,
      import: pluginImport,
      promise: pluginPromise
    },
    rules: {
      ...standard.rules,
      semi: ['error', 'always'], // Requires semicolon
      curly: ['error', 'all'], // Requires braces for all blocks
      'brace-style': ['error', '1tbs', { allowSingleLine: false }]
    }
  },
  {
    ignores: ['coverage/', 'dist/', 'lib/']
  }
];

export default config;
