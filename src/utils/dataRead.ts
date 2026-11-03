import * as fs from 'fs';
import * as path from 'path';

interface DatasetData {
    EmailID: string;
    Password: string;
    LinkedInJobTitle: string;
    NaukriJobTitle: string;
    JobLocation: string;
    Experience: string;
    'Hiring Manager Message': string;
    [key: string]: string;
}

interface Dataset {
    name: string;
    data: DatasetData;
}

interface DatasetFile {
    datasets: Dataset[];
}

interface TestData {
    name: string;
    data: string[];
}

class DataRead {
    static getTestData(): TestData[] {
        try {
            const filePath = path.join(process.cwd(), 'dataset.json');
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const jsonData: DatasetFile = JSON.parse(fileContent);

            const testDataArray: TestData[] = [];

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
            console.error(`Error reading test data: ${(error as Error).message}`);
            return [];
        }
    }
}

export default DataRead;
