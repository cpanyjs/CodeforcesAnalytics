import { writeFile } from 'fs';

import yargs from 'yargs';
import { checkDaemon, insert, query } from './api';

(async function() {
  if (!(await checkDaemon())) {
    console.log('未检测到守护进程的运行');
    process.exit(1);
  } else {
    yargs
      .command(
        ['add <name> <cfid>', '$0'],
        '添加一条 Codeforces ID',
        yargs => {
          return yargs.options({
            name: {
              type: 'string',
              describe: '你的姓名',
              demandOption: true
            },
            cfid: {
              type: 'string',
              describe: '你的 Codeforces ID',
              demandOption: true
            }
          });
        },
        argv => {
          insert(argv.name, argv.cfid);
        }
      )
      .command(
        'query [file]',
        '查询所有用户信息 / 姓名为 name 的用户信息',
        yargs => {
          return yargs.options({
            name: {
              type: 'string',
              describe: '查询对象姓名'
            },
            file: {
              type: 'string',
              describe: '输出文件名'
            }
          });
        },
        async argv => {
          const res =
            typeof argv.name === 'undefined'
              ? await query()
              : await query(argv.name as string);
          if (typeof argv.file === 'undefined') {
            console.log(res);
          } else {
            writeFile(argv.file, JSON.stringify(res), () => {});
          }
        }
      )
      .help().argv;
  }
})();
