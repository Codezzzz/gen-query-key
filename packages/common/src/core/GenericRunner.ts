import { Programmer } from './Programmer';

class GenericRunner<T> {
    constructor(
        protected programmer: Programmer,
        protected config: Required<T>
    ) {}

    protected async process() {
        console.log('🔧 Base process logic');
    }

    execute() {
        this.process();
    }
}

export { GenericRunner };
