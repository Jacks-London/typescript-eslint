import rule from '../../src/rules/no-unsafe-call';
import {
  RuleTester,
  batchedSingleLineTests,
  getFixturesRootDir,
} from '../RuleTester';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: getFixturesRootDir(),
  },
});

ruleTester.run('no-unsafe-call', rule, {
  valid: [
    'function foo(x: () => void) { x() }',
    'function foo(x?: { a: () => void }) { x?.a() }',
    'function foo(x: { a?: () => void }) { x.a?.() }',
    'new Map()',
  ],
  invalid: [
    ...batchedSingleLineTests({
      code: `
function foo(x: any) { x() }
function foo(x: any) { x?.() }
function foo(x: any) { x.a.b.c.d.e.f.g() }
function foo(x: any) { x.a.b.c.d.e.f.g?.() }
      `,
      errors: [
        {
          messageId: 'unsafeCall',
          line: 2,
          column: 24,
          endColumn: 25,
        },
        {
          messageId: 'unsafeCall',
          line: 3,
          column: 24,
          endColumn: 25,
        },
        {
          messageId: 'unsafeCall',
          line: 4,
          column: 24,
          endColumn: 39,
        },
        {
          messageId: 'unsafeCall',
          line: 5,
          column: 24,
          endColumn: 39,
        },
      ],
    }),
    ...batchedSingleLineTests({
      code: `
function foo(x: { a: any }) { x.a() }
function foo(x: { a: any }) { x?.a() }
function foo(x: { a: any }) { x.a?.() }
      `,
      errors: [
        {
          messageId: 'unsafeCall',
          line: 2,
          column: 31,
          endColumn: 34,
        },
        {
          messageId: 'unsafeCall',
          line: 3,
          column: 31,
          endColumn: 35,
        },
        {
          messageId: 'unsafeCall',
          line: 4,
          column: 31,
          endColumn: 34,
        },
      ],
    }),
    ...batchedSingleLineTests({
      code: `
function foo(x: any) { new x() }
function foo(x: { a: any }) { new x.a() }
      `,
      errors: [
        {
          messageId: 'unsafeNew',
          line: 2,
          column: 24,
          endColumn: 31,
        },
        {
          messageId: 'unsafeNew',
          line: 3,
          column: 31,
          endColumn: 40,
        },
      ],
    }),
  ],
});
