module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },

  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'prettier',
  ],
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'jsx-expressions',
  ],

  rules: {
    // JSXのコンポーネントで使っているものがunusedにならないように
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',

    // eslint:recommendedの中で、Typescriptで動かないものはoff
    'camelcase': 'off',
    'no-array-constructor': 'off',
    'no-empty-function': 'off',
    'no-unused-vars': 'off',

    // eslintのルール
    'no-irregular-whitespace': 'off', // JSX内でホワイトスペースできていい
    'no-useless-escape': 'off', // styled-jsxの中でエスケープ文字使うこともある
    'arrow-parens': ['off', 'as-needed'],
    'eqeqeq': ['error', 'smart'],
    'id-match': 'error',
    'no-eval': 'error',
    'no-redeclare': 'error',
    'no-unsafe-finally': 'error',
    'no-var': 'error',
    'spaced-comment': ['error', 'always', { markers: ['/'] }],
    'no-console': 'error',

    // TypeScriptのルール
    '@typescript-eslint/no-explicit-any': 'off',
    // defaultとしてempty arrow functionを使うこともあるため
    '@typescript-eslint/no-empty-function': ['error', { allow: ['arrowFunctions'] }],
    // parameterは自明だとしても型を明示したい
    '@typescript-eslint/no-inferrable-types': ['error', { ignoreParameters: true }],
    // !.は使いたい
    '@typescript-eslint/no-non-null-assertion': 'off',

    '@typescript-eslint/no-unused-vars': [
      'warn',
      { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/no-floating-promises': 'warn',

    // TypeScriptなのでprop-typesは使わない
    'react/prop-types': 'off',
    // _blankでもnoreferrerは必要ない
    'react/jsx-no-target-blank': ['error', { allowReferrer: true }],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    // button の type 指定がなければ警告を出す。誤ってデフォルトの submit 動作になるのを防ぐ
    'react/button-has-type': 'warn',
    // 無駄に props を中括弧で囲うのを抑制する。i.e. `foo={"bar"}` を禁止して `foo="bar"` に統一する
    'react/jsx-curly-brace-presence': ['error', 'never'],
    // jsxでfalsyな値がrenderされるのを防ぐ
    'jsx-expressions/strict-logical-expressions': 'error',
  },
};

