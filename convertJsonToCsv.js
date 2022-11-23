const fs = require('fs');
const ObjectsToCsv = require('objects-to-csv');
const getDate = new Date().toISOString().slice(0, 10);

const FolderPath = './data/';
let outputData = [];

(async () => {
    try {
        let files = await fs.promises.readdir(FolderPath);
        files = files.filter(file => file.includes('json'));
        console.log(files);
        // console.log(files);
        outputData = files.map((file) => {
            const jsonObj = require(`${FolderPath}${file}`);
            const { results: { country, statistics } } = jsonObj;

            const { iso_code, name } = country;
            const { total_ghg_2030 } = statistics;
            const outputObj = { name, iso_code, total_ghg_2030 };
            return outputObj;
        })
        console.log(outputData);
        const csv = new ObjectsToCsv(outputData);

        // Save to file:\
        await csv.toDisk(`./${getDate}.csv`);

    } catch (error) {
        console.log(error);
    }
})();
