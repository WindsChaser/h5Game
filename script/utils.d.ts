declare class Utils {
    constructor();
    /**
     * 接收两种类型的参数，一个对象，包含了rgba四个值；或者四个参数，分别为rgba值
     * @returns {string|null}
     */
    static toRGBA(): string;
    /**
     *
     * @param degree
     * @return {number}
     */
    static toRad(degree: number): number;
    /**
     *
     * @param {number} Rad
     * @return {number}
     */
    static toDegree(Rad: number): number;
}
/**
 * 向量类
 */
declare class Vector {
    x: number;
    y: number;
    value: number;
    private _x;
    private _y;
    /**
     * @param x 向量在X方向的值
     * @param y 向量在y方向的值
     */
    constructor(x: number, y: number);
    /**
     * 翻转向量
     * @return {Vector}
     */
    reverse(): Vector;
    /**
     * 左右翻转向量
     * @return {Vector}
     */
    reverseX(): Vector;
    /**
     * 上下翻转向量
     * @return {Vector}
     */
    reverseY(): Vector;
    /**
     * 向量叠加   123
     * @param {Vector} vector
     * @return {Vector}
     */
    add(vector: Vector): Vector;
    /**
     * 复制向量
     * @return {Vector}
     */
    clone(): Vector;
}
/**
 * 状态机
 */
declare class StateMachine {
    stateTransitionTable: any;
    state: any;
    private _state;
    private _stateTransitionTable;
    constructor();
    /**
     * 增加状态映射，如果已存在映射则覆盖现有映射
     * @param stateName {String} 状态名称，要求为字符串
     * @param mapping {Object} 一个对象，包含对不同输入的状态转移映射
     * @return {StateMachine} 返回状态机本身以便于链式调用
     */
    addStateMapping(stateName: any, mapping: any): this;
    /**
     * 根据输入序列计算最终状态
     * @param states {Array} 一个表示输入序列的数组，要求为字符串
     */
    calculateState(states: any): any;
    /**
     * 拷贝状态机
     */
    clone(): StateMachine;
}
/**
 * 对象池
 */
declare class ObjectPool {
    private _linkedList;
    private _create;
    private _release;
    private _init;
    constructor(create: any, release: any, init: any);
    /**
     * 取出一个对象，使用对象上的release方法归还对象
     * @returns {any}
     */
    get(...args: any[]): any;
    size(): any;
}
export { Utils, Vector, StateMachine, ObjectPool };
