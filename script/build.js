/* 
=====
Download the js file containing the data :)
=====
*/

const http = require('https');
const fs = require('fs');

// Stackoverflow go BRRR
function download(url, dest, callback) {
    var file = fs.createWriteStream(dest);
    var request = http.get(url, function (response) {
        response.pipe(file);
        file.on('finish', function () {
            file.close(callback); // close() is async, call callback after close completes.
        });
        file.on('error', function (err) {
            fs.unlink(dest); // Delete the file async. (But we don't check the result)
            if (callback)
                callback(err.message);
        });
    });
}

download('https://raw.githubusercontent.com/js-org/js.org/master/cnames_active.js', 'tmp_data.js', () => {
    fs.appendFileSync('tmp_data.js', '\nexports.cnames_active = cnames_active;');
    const data = require('../tmp_data.js')
    fs.writeFileSync('output/cnames_active.json', JSON.stringify(data.cnames_active, null, 2));
    fs.writeFileSync('output/subdomains_registered.json', JSON.stringify(Object.keys(data.cnames_active).map(value => `${value}.js.org`), null, 2));
})
