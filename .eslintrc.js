module.exports = {
    extends: [
        'airbnb',
        // "plugin:prettier/recommended"
    ],
    rules: {

        //syntax
        'semi': 0,
        'comma-dangle': [ 1, 'only-multiline'],
        'no-underscore-dangle': 0,
        'camelcase': 0,

        //best practice
        'no-param-reassign': 0,

        //whitespace and spacing
        'padded-blocks': 0,
        'padding-line-between-statements': [ 1,
            { 'blankLine': 'always', 'prev': 'cjs-import', 'next': '*' },
            { 'blankLine': 'always', 'prev': ['const', 'let'], 'next': ['if', 'class', 'block', 'block-like'] },
            { 'blankLine': 'always', 'prev': '*', 'next': ['cjs-export', 'return'] },
            { 'blankLine': 'always', 'prev': 'for', 'next': '*' },
            { 'blankLine': 'always', 'prev': 'block', 'next': '*' },
            { 'blankLine': 'always', 'prev': 'block-like', 'next': '*' },
            //add more later
        ],
        'no-trailing-spaces': [ 1, {
            'skipBlankLines': true
        }],
        'indent': [ 1, 'tab', {
            'ignoreComments': true
        }],
        'no-tabs': 0,

        //etc
        'no-console': 0,

        // "prettier/prettier": [",warn", {
        //     "singleQuote": true,
        //     "semi": false,
        //     "tabs": true
        // }]

    }
};