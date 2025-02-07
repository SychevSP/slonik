import test from 'ava';
import type {
  ConnectionOptions,
} from '../../../src/types';
import {
  parseDsn,
  stringifyDsn,
} from '../../../src/utilities';

const testParse = test.macro((t, connectionOptions: ConnectionOptions) => {
  t.deepEqual(parseDsn(t.title), connectionOptions);
});

test('postgresql://', testParse, {});
test('postgresql://localhost', testParse, {
  host: 'localhost',
});
test('postgresql://localhost:5432', testParse, {
  host: 'localhost',
  port: 5432,
});
test('postgresql://localhost/foo', testParse, {
  databaseName: 'foo',
  host: 'localhost',
});
test('postgresql://foo@localhost', testParse, {
  host: 'localhost',
  username: 'foo',
});
test('postgresql://foo:bar@localhost', testParse, {
  host: 'localhost',
  password: 'bar',
  username: 'foo',
});
test('postgresql://localhost/?&application_name=baz', testParse, {
  applicationName: 'baz',
  host: 'localhost',
});
