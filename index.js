// Conversor de CSV d'ENDESA a InlfuxDB
const parse = require('date-fns/parse');
// const format = require('date-fns/format');
// const formatISO = require('date-fns/formatISO');
const {es} = require('date-fns/locale');
const addDays = require('date-fns/addDays');
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
      let d;
      d = parse(row[1]+' '+row[2], 'dd/MM/yyyy k', new Date(), {locale: es});

      // Amb PARSE la única opció que admet l'hora 24 és k.
      // El problema és que interpreta el dia 1 24:00 com el dia 1 00:00
      // quan hauria d'interpretar dia 2 00:00
      // En els CSV d'ENDESA, el consum és a hora passada, així la dada de
      // consum de dia 1 24:00 correspon al consum de les 23:00 a 24:00.
      // Quan la hora és 24:00, sumo un dia (i ell ja posa les 00:00h).

      if (row[2] == 24) {
        d = addDays(d, 1);
      }

      // console.log('Original: '+row[1]+' '+row[2]);
      // console.log('AMB locale: '+
      // format(d, 'dd/MM/yyyy, HH:mm:ss', {locale: es}));
      // console.log('SENSE locale: '+
      // format(d, 'dd/MM/yyyy, HH:mm:ss'));
      // console.log('formatISO: '+formatISO(d));
      // // console.log(row);
    })

    .on('end', () => {
      console.log('CSV file successfully processed');
    })
    .on('error', () => {
      console.log('error');
    })
;
