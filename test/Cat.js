const Animal = require('./Animal');

class Cat extends Animal  {
    constructor() {
        super();

        this.setup();
    }

    setup()  {
        console.log("Cat setup");
    }
}

let cat = new Cat();