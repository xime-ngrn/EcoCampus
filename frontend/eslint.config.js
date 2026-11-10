import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

export default [
  { ignores: ['dist/**', 'coverage/**'] },

  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],

  {
    files: ['**/*.{js,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser },
    },
    rules: {
      // Las vistas se llaman "LoginView", "NotFoundView"... no hace falta forzar nombres compuestos
      'vue/multi-word-component-names': 'off',
    },
  },

  {
    files: ['*.config.js'],
    languageOptions: { globals: { ...globals.node } },
  },

  // Va al final: desactiva reglas de formato que Prettier ya controla
  prettier,
]
