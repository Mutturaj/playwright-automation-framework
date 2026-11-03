class DataConfig {
    private static instance: DataConfig | null = null;
    private datasetName: string | null = null;

    private constructor() {}

    static getInstance(): DataConfig {
        if (!DataConfig.instance) {
            DataConfig.instance = new DataConfig();
        }
        return DataConfig.instance;
    }

    setDatasetName(name: string): void {
        this.datasetName = name;
    }

    getDatasetName(): string | null {
        return this.datasetName;
    }
}

export default DataConfig;
