const app = require('./public/js/app');
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Application listening on localhost:${port}`);
});