class Astrologer {
    constructor(id, name, baseMaxFlow) {
        this.id = id;
        this.name = name;
        this.currentFlow = 0;
        this.baseMaxFlow = baseMaxFlow;
        this.maxFlow = baseMaxFlow;
        this.isTopPerformer = false;
    }

    toggleTopPerformer() {
        this.isTopPerformer = !this.isTopPerformer;
        this.updateMaxFlow();
    }

    updateMaxFlow() {
        this.maxFlow = this.isTopPerformer ? this.baseMaxFlow * 1.5 : this.baseMaxFlow;
    }

    canTakeMoreUsers() {
        return this.currentFlow < this.maxFlow;
    }

    addUser() {
        if (this.canTakeMoreUsers()) {
            this.currentFlow++;
            return true;
        }
        return false;
    }

    toggleMaxFlow() {
        if (this.isTopPerformer) {
            this.maxFlow -= 2;
        } else {
            this.maxFlow += 2;
        }
        this.isTopPerformer = !this.isTopPerformer;
    }

    resetFlow() {
        this.currentFlow = 0;
    }
}
module.exports = Astrologer;