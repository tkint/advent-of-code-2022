import os from 'os';
import { getInput } from '../../utils/files';

it('Day00', () => {
  const input = getInput();
  const lines = input.split(os.EOL);
  const [cell1, cell2] = lines[0].split(';');

  console.log(cell1, cell2);
});
