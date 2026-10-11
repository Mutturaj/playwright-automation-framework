class DataConfig {
    static instance = null;
    datasetName = null;

    static getInstance() {
        if (!DataConfig.instance) {
            DataConfig.instance = new DataConfig();
        }
        return DataConfig.instance;
    }

    setDatasetName(name) {
        this.datasetName = name;
    }

    getDatasetName() {
        return this.datasetName;
    }
}

module.exports = DataConfig;
