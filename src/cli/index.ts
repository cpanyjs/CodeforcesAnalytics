import { writeFile } from 'fs';

import yargs from 'yargs';
import { checkDaemon, insert, query, clear } from './api';

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
            },
            print: {
              type: 'boolean',
              describe: '输出查询结果',
              default: false
            }
          });
        },
        argv => {
          insert(argv.name, argv.cfid, argv.print);
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
            console.log(JSON.stringify(res, null, 2));
          } else {
            writeFile(argv.file, JSON.stringify(res), () => {});
          }
        }
      )
      .command(
        'clear [name]',
        '清除姓名为 [name] 的用户信息',
        yargs =>
          yargs.options({
            name: {
              type: 'string',
              describe: '删除对象姓名',
              demandOption: true
            }
          }),
        argv => {
          clear(argv.name);
        }
      )
      .help().argv;
  }
})();
