const express = require('express');
const path = require('path');

const port = process.env.PORT || 3000;

const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Define a route for the root URL
const indexRouter = require('./routes/index');
app.use('/', indexRouter);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
