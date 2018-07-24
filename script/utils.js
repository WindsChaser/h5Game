import { DoublyLinkedList } from './lib/doubly-linked-list';
class Utils {
    constructor() {
    }
    static toRGBA() {
        if (arguments.length == 1)
            return 'rgba(' + arguments[0].r + ',' + arguments[0].g + ',' + arguments[0].b + ',' + arguments[0].a + ')';
        else if (arguments.length == 4)
            return 'rgba(' + arguments[0] + ',' + arguments[1] + ',' + arguments[2] + ',' + arguments[3] + ')';
        else
            return null;
    }
    static toRad(degree) {
        return degree / 180 * Math.PI;
    }
    static toDegree(Rad) {
        return Rad / Math.PI * 180;
    }
}
class Vector {
    get x() {
        return this._x;
    }
    set x(value) {
        this._x = value;
    }
    get y() {
        return this._y;
    }
    set y(value) {
        this._y = value;
    }
    get value() {
        return Math.sqrt(Math.pow(this._x, 2) + Math.pow(this._y, 2));
    }
    set value(value) {
        let value_old = this.value;
        if (value_old != 0) {
            this._x *= value / value_old;
            this._y *= value / value_old;
        }
    }
    constructor(x, y) {
        this._x = x;
        this._y = y;
    }
    reverse() {
        this._x *= -1;
        this._y *= -1;
        return this;
    }
    reverseX() {
        this._x *= -1;
        return this;
    }
    reverseY() {
        this._y *= -1;
        return this;
    }
    add(vector) {
        this._x += vector._x;
        this._y += vector._y;
        return this;
    }
    clone() {
        return new Vector(this._x, this._y);
    }
}
class StateMachine {
    set stateTransitionTable(value) {
        this._stateTransitionTable = value;
    }
    set state(value) {
        this._state = value;
    }
    get state() {
        return this._state;
    }
    get stateTransitionTable() {
        return this._stateTransitionTable;
    }
    constructor() {
        this._state = null;
        this._stateTransitionTable = {};
    }
    addStateMapping(stateName, mapping) {
        this._stateTransitionTable[stateName] = mapping;
        return this;
    }
    calculateState(states) {
        let stateNow = this._state;
        states.forEach((input) => {
            let mapping = this._stateTransitionTable[stateNow];
            if (!mapping)
                throw new Error('状态机中不存在状态' + stateNow);
            else {
                let targetState = mapping[input];
                if (targetState)
                    stateNow = targetState;
            }
        });
        this._state = stateNow;
        return stateNow;
    }
    clone() {
        let object = new StateMachine();
        object.state = this._state;
        object.stateTransitionTable = JSON.parse(JSON.stringify(this._stateTransitionTable));
        return object;
    }
}
class ObjectPool {
    constructor(create, release, init) {
        this._linkedList = new DoublyLinkedList();
        this._create = create;
        this._release = release;
        this._init = init;
    }
    get(...args) {
        if (this._linkedList.size() > 0) {
            let node = this._linkedList.head();
            let object = node.data;
            this._init(object, ...args);
            node.remove();
            return object;
        }
        else {
            let object = this._create();
            this._init(object, ...args);
            object.release = () => {
                this._release(object);
                this._linkedList.append(object);
            };
            return object;
        }
    }
    size() {
        return this._linkedList.size();
    }
}
export { Utils, Vector, StateMachine, ObjectPool };
//# sourceMappingURL=utils.js.map