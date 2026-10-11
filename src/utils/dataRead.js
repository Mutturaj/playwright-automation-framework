const fs = require('fs');
const path = require('path');

class DataRead {
    static getTestData() {
        try {
            const filePath = path.join(process.cwd(), 'dataset.json');
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const jsonData = JSON.parse(fileContent);

            const testDataArray = [];

            for (const dataset of jsonData.datasets) {
                const data = dataset.data;
                const testData = [
                    data['EmailID'],
                    data['Password'],
                    data['LinkedInJobTitle'],
                    data['NaukriJobTitle'],
                    data['JobLocation'],
                    data['Experience'],
                    data['Hiring Manager Message']
                ];
                testDataArray.push({ name: dataset.name, data: testData });
            }

            return testDataArray;
        } catch (error) {
            console.error(`Error reading test data: ${error.message}`);
            return [];
        }
    }
}

module.exports = DataRead;
