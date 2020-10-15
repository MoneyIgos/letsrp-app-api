import mongoose from 'mongoose';
import assert from 'assert';
import User from './model/user';
import app from './app';

const { mongoURI } = require('./config/keysDev');

const port = 8080;

['MONGO_URI'].forEach(variable => {
  assert([variable], `${variable} is undefined!`);
});
mongoose.set('useFindAndModify', false);

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Mongoose is connected');
    User.insertMany([
      {
        name: 'Jack',
        pass: 'zaq1@WSX',
        perms: 'admin'
      }
    ]);
    app.listen(port, () => {
      console.log(`Listening on ${port}`);
    });
  });
