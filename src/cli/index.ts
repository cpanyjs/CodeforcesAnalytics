import { writeFile, readFile } from 'fs';

import yargs from 'yargs';
import axios from 'axios';

import { checkServer, insert, query, clear } from './api';
import generate from './report';

(async function() {
  if (!(await checkServer())) {
    console.log('未检测到服务器进程的运行');
    process.exit(1);
  } else {
    yargs
      .command(
        ['add <name> <cfid>', '$0'],
        '添加一条 Codeforces ID',
        yargs =>
          yargs.options({
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
              alias: 'p',
              type: 'boolean',
              describe: '打印查询结果',
              default: false
            }
          }),
        argv => {
          insert(argv.name, argv.cfid, argv.print);
        }
      )
      .command(
        ['csv <input> [output]'],
        `读取 <input> 文件, 批量添加 Codeforces ID. 文件一行一条记录, 每行格式为(不含括号): <姓名>,<ID>`,
        yargs =>
          yargs.options({
            input: {
              type: 'string',
              describe: '输入文件',
              demandOption: true
            },
            output: {
              type: 'string',
              describe: '输出文件',
              default: 'out.json'
            }
          }),
        argv => {
          readFile(argv.input, 'utf8', async (err, data) => {
            if (err) throw err;
            const body = data
              .split('\r\n')
              .map(s => s.split(',').map(s => s.trim()));
            const tasks: Promise<number>[] = [];
            let count: number = 0;
            let fail: string[][] = [];
            for (let row of body) {
              tasks.push(
                insert(row[0], row[1], false).then(flag =>
                  flag ? (count += 1) : fail.push(row)
                )
              );
            }
            await axios.all(tasks);
            while (fail.length !== 0) {
              tasks.splice(0, tasks.length);
              let tmp: string[][] = [];
              for (const row of fail) {
                tasks.push(
                  insert(row[0], row[1], false).then(flag =>
                    flag ? (count += 1) : tmp.push(row)
                  )
                );
              }
              await axios.all(tasks);
              fail = tmp;
            }
            console.log(`"${argv.input}" 插入成功 (${count}/${body.length})`);
            const res = await query();
            console.log(`${res.length} 条数据输出到 "${argv.output}"`);
            writeFile(argv.output, JSON.stringify(res), () => {});
          });
        }
      )
      .command(
        ['query [file]', 'q [file]'],
        '查询所有用户信息',
        yargs =>
          yargs.options({
            name: {
              alias: 'n',
              type: 'string',
              describe: '查询姓名为 [name] 的用户信息'
            },
            file: {
              type: 'string',
              describe: '输出文件名'
            }
          }),
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
        ['clear <name>', 'c <name>'],
        '清除姓名为 <name> 的用户信息',
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
      .command(
        ['report <file>', 'r <file>'],
        '输出报告到 <file> 文件内',
        yargs =>
          yargs.options({
            file: {
              type: 'string',
              describe: '输出文件名',
              demandOption: true
            }
          }),
        async argv => {
          const res = await query();
          const report = generate(res);
          writeFile(argv.file, report, () => {});
        }
      )
      .help().argv;
  }
})();
