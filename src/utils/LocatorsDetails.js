class LocatorsDetails {
    constructor(type, value, name) {
        this.type = type;
        this.value = value;
        this.name = name;
    }

    getType() {
        return this.type;
    }

    getValue() {
        return this.value;
    }

    getName() {
        return this.name;
    }
}

module.exports = LocatorsDetails;
