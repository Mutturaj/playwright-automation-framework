class LocatorsDetails {
    type: string;
    value: string;
    name: string;

    constructor(type: string, value: string, name: string) {
        this.type = type;
        this.value = value;
        this.name = name;
    }

    getType(): string {
        return this.type;
    }

    getValue(): string {
        return this.value;
    }

    getName(): string {
        return this.name;
    }
}

export default LocatorsDetails;
