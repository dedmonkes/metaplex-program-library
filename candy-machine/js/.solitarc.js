// @ts-check
const path = require('path');
const programDir = path.join(__dirname, '..', 'program');
const idlDir = path.join(__dirname, 'idl');
const sdkDir = path.join(__dirname, 'src', 'generated');
const binaryInstallDir = path.join(__dirname, '.crates');

module.exports = {
    idlGenerator: 'anchor',
    programName: 'candy_machine',
    programId: 'eERFprSmhDX7an71Kqg5ZjG3JoeMqLAZN4DGkvmqr3M',
    idlDir,
    sdkDir,
    binaryInstallDir,
    programDir,
};
