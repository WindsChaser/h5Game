declare class Utils {
    constructor();
    static toRGBA(): string;
    static toRad(degree: number): number;
    static toDegree(Rad: number): number;
}
declare class Vector {
    x: number;
    y: number;
    value: number;
    private _x;
    private _y;
    constructor(x: number, y: number);
    reverse(): Vector;
    reverseX(): Vector;
    reverseY(): Vector;
    add(vector: Vector): Vector;
    clone(): Vector;
}
declare class StateMachine {
    stateTransitionTable: any;
    state: any;
    private _state;
    private _stateTransitionTable;
    constructor();
    addStateMapping(stateName: any, mapping: any): this;
    calculateState(states: any): any;
    clone(): StateMachine;
}
declare class ObjectPool {
    private _linkedList;
    private _create;
    private _release;
    private _init;
    constructor(create: any, release: any, init: any);
    get(...args: any[]): any;
    size(): any;
}
export { Utils, Vector, StateMachine, ObjectPool };
