// import {jest} from '@jest/globals';
//
// jest.useFakeTimers();
//
// import getStatus from "../install-utils/check-status.js";
//
// const dirName = 'ccminer'
// const fileName = 'run.sh'
// const processName = 'ccminer'
//
// const ssh = {
//   execCommand: (command) => {
//     const stderr = null
//     if (command.indexOf(`ls | grep ${dirName}`) >= 0) {
//       return {
//         stderr,
//         stdout: dirName
//       }
//     }
//     if (command.indexOf(`ls ${dirName}/ && grep "${fileName}"`) >= 0) {
//       return {
//         stderr,
//         stdout: fileName
//       }
//     }
//     if (command.indexOf(`pgrep ${processName}`) >= 0) {
//       return {
//         stderr,
//         stdout: "asdasd"
//       }
//     }
//     return {
//       stderr: 'error',
//       stdout: null
//     }
//   }
// }
//
// describe("testing get-status utils", () => {
//   test('test not installed', async () => {
//     const dirName = 'ccminer1'
//     const fileName = 'running.sh'
//     const processName = 'ccminer-running'
//
//     expect.assertions(1);
//
//     const result = await getStatus(ssh, dirName, fileName, processName)
//     expect(result).toEqual('NOT INSTALLED')
//   })
//   test('test not running', () => {
//     const dirName = 'ccminer'
//     const fileName = 'run.sh'
//     const processName = 'ccminer-running'
//
//     expect.assertions(1);
//     return expect(getStatus(ssh, dirName, fileName, processName)).resolves.toEqual('NOT RUNNING')
//   })
//   test('test running', () => {
//     const dirName = 'ccminer'
//     const fileName = 'run.sh'
//     const processName = 'ccminer'
//
//     expect.assertions(1);
//     return expect(getStatus(ssh, dirName, fileName, processName)).resolves.toEqual("RUNNING")
//   })
// })