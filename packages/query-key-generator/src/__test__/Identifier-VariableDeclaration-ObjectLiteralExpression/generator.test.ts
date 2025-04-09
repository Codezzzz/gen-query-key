import { join } from 'node:path';
import { runFixtureTests } from '../../utils/test.js';

runFixtureTests({
    fixturesDir: join(__dirname, '.', '__testfixtures__')
});
