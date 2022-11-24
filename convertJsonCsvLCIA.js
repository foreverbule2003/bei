const fs = require('fs');
const ObjectsToCsv = require('objects-to-csv');
const _ = require('lodash');

const { get } = _;
const getDate = new Date().toISOString().slice(0, 10);
const flatArr = (arr) => [].concat(...arr);


const FolderPath = './data/';
let outputData = [];

(async () => {
  try {
    const files = await fs.promises.readdir(FolderPath);
    // console.log(files);
    const jsonFiles = files.filter(file => file.includes('json'));

    // console.log(files);
    const outputData = jsonFiles.map(file => {
      const jsonObj = require(`${FolderPath}${file}`);
      // jsonObj.results.country
      // jsonObj.results.statistics
      // console.log(jsonObj);
      const { category, impactCategories } = jsonObj;
      // console.log(impactCategories);
      const categoryName = get(category, 'name', '');

      // const { name, refUnit } = impactCategories;
      let outputObj = {};
      const isMultiimpactCategories = impactCategories.length > 1

      // console.log({ refUnit });
      // console.log(isMultiimpactCategories); 
      if (isMultiimpactCategories) {
        outputObj = impactCategories
          .map(ele => ({ name: ele.name, refUnit: ele.refUnit, categoryName, file }));
        // console.log(outputObj);
        // outputObj = { name, refUnit, categoryName };
      } else {
        const { name, refUnit } = impactCategories[0];
        outputObj = { name, refUnit, categoryName, file }
      }
      // console.log({ name }, { refUnit }, { categoryName });
      // const { results: { country, statistics } } = jsonObj;

      // const { iso_code, name } = country;
      // const { total_ghg_2030 } = statistics;
      // const outputObj = { name, iso_code, total_ghg_2030 };
      // console.log({ outputObj });
      return outputObj;
    })
    // console.log(outputData);
    // console.log(outputData);
    const isArray = Array.isArray(outputData);
    // console.log(isArray);
    // console.log(outputData[0]);

    let argData = outputData;
    if (isArray) argData = flatArr(outputData);

    const csv = new ObjectsToCsv(argData);
    // console.log(argData);
    // Save to file: \
    await csv.toDisk(`./${getDate}.csv`);

  } catch (error) {
    // console.log(error);
  }
})();
