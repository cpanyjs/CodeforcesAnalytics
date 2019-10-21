import assert from 'assert';

import marked from 'marked';

import { OutputUser } from '../type';
import { rating2color } from '../util';
import { TITLE } from '../config';

let data: OutputUser[] = [];

type Header = {
  name: string;
  value: string | ((item: OutputUser) => string | number);
};

type cmpFn = (a: OutputUser, b: OutputUser) => number;

function generateMarkdownTable(headers: Header[], cmp: cmpFn) {
  assert(headers.length > 0);
  let ans = '|';
  for (let i = 0; i < headers.length; i++) {
    ans += headers[i].name + '|';
  }
  ans += '\n|';
  for (let i = 0; i < headers.length; i++) {
    ans += ':-:|';
  }
  ans += '\n';
  data.sort(cmp);
  return (
    ans +
    data
      .map(item => {
        let row = '|';
        for (let i = 0; i < headers.length; i++) {
          const { value } = headers[i];
          if (typeof value === 'string') {
            assert(value in item);
            row += item[value];
          } else if (typeof value === 'function') {
            row += value(item);
          } else {
            throw new Error(`typeof value: ${typeof value}`);
          }
          row += '|';
        }
        return row;
      })
      .join('\n')
  );
}

const tables = [
  () =>
    '## Rating\n\n' +
    generateMarkdownTable(
      [
        { name: '姓名', value: 'name' },
        {
          name: 'Rating',
          value: item =>
            `<span style="color: ${rating2color(item.rating)}">${
              item.rating
            }</span>`
        },
        {
          name: '场次',
          value: item => item.contest.length
        }
      ],
      (a, b) => {
        if (a.rating > b.rating) return -1;
        else if (a.rating == b.rating) return 0;
        else return 1;
      }
    ),
  () =>
    '## 参赛场次\n\n' +
    generateMarkdownTable(
      [
        { name: '姓名', value: 'name' },
        {
          name: 'Rating',
          value: item =>
            `<span style="color: ${rating2color(item.rating)}">${
              item.rating
            }</span>`
        },
        {
          name: '场次',
          value: item => item.contest.length
        }
      ],
      (a, b) => {
        const la = a.contest.length,
          lb = b.contest.length;
        if (la > lb) return -1;
        else if (la == lb) return 0;
        else return 1;
      }
    ) +
    '\n',
  () =>
    '## 总题数\n\n' +
    generateMarkdownTable(
      [
        { name: '姓名', value: 'name' },
        { name: '题数', value: item => item.solved.length }
      ],
      (a, b) => {
        const la = a.solved.length,
          lb = b.solved.length;
        if (la > lb) return -1;
        else if (la == lb) return 0;
        else return 1;
      }
    ),
  () =>
    '## VP 场数\n\n' + 
    generateMarkdownTable(
      [
        { name: '姓名', value: 'name' },
        {
          name: 'VP 场数',
          value: item => item.vp.length
        }
      ],
      (a, b) => {
        const la = a.vp.length,
          lb = b.vp.length;
        if (la > lb) return -1;
        else if (la == lb) return 0;
        else return 1;
      }
    ),
];

export default function generate(info: OutputUser[]) {
  data = info;
  const md =
    `# ${TITLE} Codeforces 统计\n\n` + tables.map(fn => fn() + '\n').join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/3.0.1/github-markdown.min.css" integrity="sha256-HbgiGHMLxHZ3kkAiixyvnaaZFNjNWLYKD/QG6PWaQPc=" crossorigin="anonymous" />
  <style>
  table { display: table !important; }
  </style>
  <title>${TITLE} Codeforces 统计</title>
</head>
<body style="padding: 0 30px;">
  <div style="padding: 30px 30px 100px; margin: 0 auto; width: 80%; max-width: 860px;" class="markdown-body">${marked(md)}</div>
</body>
</html>`;
}
