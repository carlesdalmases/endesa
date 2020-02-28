// Conversor de CSV d'ENDESA a InlfuxDB

const csv = require('csv');
const fs = require('fs');

const filepath = './dades.csv';
const opt = {delimiter: ';',
  cast: true,
  from: 2}; //  salto la primera línia amb la capçalera

const parser = csv.parse(opt);

fs.createReadStream(filepath)
    .pipe(parser)
    .on('data', (row) => {
      console.log(row);
    })

    .on('end', () => {
      console.log('CSV file successfully processed');
    })
    .on('error', () => {
      console.log('error');
    })
;
