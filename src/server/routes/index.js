import _ from 'lodash';
import fs from 'fs';

const excluded = ["index.js"];

export default function(app) {
  fs.readdirSync(__dirname).forEach(file  => {
    var basename = file.split('.')[0];

    if(!fs.lstatSync(__dirname + "/" + file).isDirectory() && !_.includes(excluded, file)) {
      app.use('/api/' + basename, require('./' + file));
    }
  });
};
