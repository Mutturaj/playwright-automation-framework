const fs = require('fs');
const path = require('path');

class QuestionAnswerHandler {
    constructor(datasetName) {
        this.questionAnswerMap = new Map();
        this.datasetName = datasetName;
        this.initializeQuestionAnswerMap(datasetName);
    }

    initializeQuestionAnswerMap(datasetName) {
        try {
            const filePath = path.join(process.cwd(), 'dataset.json');
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const jsonData = JSON.parse(fileContent);
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
            console.error(`Error loading dataset: ${error.message}`);
        }
    }

    getAnswer(question) {
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

    normalizeText(text) {
        return text.toLowerCase()
            .replace(/[^a-zA-Z0-9 ]/g, ' ')
            .trim();
    }

    escapeRegex(text) {
        return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    getQuestionAnswerMap() {
        return this.questionAnswerMap;
    }
}

module.exports = QuestionAnswerHandler;
