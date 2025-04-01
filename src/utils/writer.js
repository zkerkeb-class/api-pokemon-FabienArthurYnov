import fs from 'fs';

// transform to json and write to any file any object
export function saveToFile(fileLink, objectToWrite) {
    var jsonString = JSON.stringify(objectToWrite, null, 2);

    fs.writeFile(fileLink, jsonString, (err) => {
        if (err) {
            console.error('Error writing file ' + fileLink +  ' : ', err);
        } else {
            console.log('File ' + fileLink + ' saved');
        }
    });
}