import * as fs from 'fs';
import * as path from 'path';

interface Dataset {
    name: string;
    data: Record<string, string>;
}

interface DatasetFile {
    datasets: Dataset[];
}

class QuestionAnswerHandler {
    private questionAnswerMap: Map<string, string>;
    private datasetName: string;

    constructor(datasetName: string) {
        this.questionAnswerMap = new Map();
        this.datasetName = datasetName;
        this.initializeQuestionAnswerMap(datasetName);
    }

    private initializeQuestionAnswerMap(datasetName: string): void {
        try {
            const filePath = path.join(process.cwd(), 'dataset.json');
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const jsonData: DatasetFile = JSON.parse(fileContent);
            const datasets = jsonData.datasets;

            for (const dataset of datasets) {
                if (dataset.name.toLowerCase() === datasetName.toLowerCase()) {
                    const data = dataset.data;
                    for (const [key, value] of Object.entries(data)) {
                        this.questionAnswerMap.set(this.normalizeText(key), value);
                    }
                    break;
                }
            }
            console.log(`Initialized ${this.questionAnswerMap.size} question-answer mappings for ${datasetName}`);
        } catch (error) {
            console.error(`Error loading dataset: ${(error as Error).message}`);
        }
    }

    getAnswer(question: string): string {
        const normalizedQuestion = this.normalizeText(question);
        let bestMatch = "3"; // Default answer

        console.log(`Normalized Question: ${normalizedQuestion}`);

        for (const [key, answer] of this.questionAnswerMap.entries()) {
            const regex = new RegExp(this.escapeRegex(key), 'i');
            if (regex.test(normalizedQuestion)) {
                bestMatch = answer;
                console.log(`Match Found: ${key} -> ${answer}`);
                break;
            }
        }

        console.log(`Best Match: ${bestMatch}`);
        return bestMatch;
    }

    private normalizeText(text: string): string {
        return text.toLowerCase()
            .replace(/[^a-zA-Z0-9 ]/g, ' ')
            .trim();
    }

    private escapeRegex(text: string): string {
        return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    getQuestionAnswerMap(): Map<string, string> {
        return this.questionAnswerMap;
    }
}

export default QuestionAnswerHandler;
