import app from './app';

const server = app.listen(app.get('port'), app.get('host'), () => {
  console.log(
    `\n  Server starts on http://${app.get('host')}:${app.get('port')}\n`
  );
});

export default server;
