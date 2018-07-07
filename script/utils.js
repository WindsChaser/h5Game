/**
 * Created by wind on 2017/8/28.
 */
/**
 * 自定义工具类
 */
import { LinkedList } from "./module_loader.js";
class Utils {
    constructor() {
    }
    /**
     * 接收两种类型的参数，一个对象，包含了rgba四个值；或者四个参数，分别为rgba值
     * @returns {string|null}
     */
    static toRGBA() {
        if (arguments.length == 1)
            return 'rgba(' + arguments[0].r + ',' + arguments[0].g + ',' + arguments[0].b + ',' + arguments[0].a + ')';
        else if (arguments.length == 4)
            return 'rgba(' + arguments[0] + ',' + arguments[1] + ',' + arguments[2] + ',' + arguments[3] + ')';
        else
            return null;
    }
    /**
     *
     * @param degree
     * @return {number}
     */
    static toRad(degree) {
        return degree / 180 * Math.PI;
    }
    /**
     *
     * @param {number} Rad
     * @return {number}
     */
    static toDegree(Rad) {
        return Rad / Math.PI * 180;
    }
}
/**
 * 向量类
 */
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
    /**
     * @param x 向量在X方向的值
     * @param y 向量在y方向的值
     */
    constructor(x, y) {
        //向量角度
        this._x = x;
        //向量的长度
        this._y = y;
    }
    /**
     * 翻转向量
     * @return {Vector}
     */
    reverse() {
        this._x *= -1;
        this._y *= -1;
        return this;
    }
    /**
     * 左右翻转向量
     * @return {Vector}
     */
    reverseX() {
        this._x *= -1;
        return this;
    }
    /**
     * 上下翻转向量
     * @return {Vector}
     */
    reverseY() {
        this._y *= -1;
        return this;
    }
    /**
     * 向量叠加   123
     * @param {Vector} vector
     * @return {Vector}
     */
    add(vector) {
        this._x += vector._x;
        this._y += vector._y;
        return this;
    }
    /**
     * 复制向量
     * @return {Vector}
     */
    clone() {
        return new Vector(this._x, this._y);
    }
}
/**
 * 状态机
 */
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
        //当前状态
        this._state = null;
        //状态转移表
        this._stateTransitionTable = {};
    }
    /**
     * 增加状态映射，如果已存在映射则覆盖现有映射
     * @param stateName {String} 状态名称，要求为字符串
     * @param mapping {Object} 一个对象，包含对不同输入的状态转移映射
     * @return {StateMachine} 返回状态机本身以便于链式调用
     */
    addStateMapping(stateName, mapping) {
        this._stateTransitionTable[stateName] = mapping;
        return this;
    }
    /**
     * 根据输入序列计算最终状态
     * @param states {Array} 一个表示输入序列的数组，要求为字符串
     */
    calculateState(states) {
        let stateNow = this._state;
        states.forEach((input) => {
            //获取当前状态的状态转移映射
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
    /**
     * 拷贝状态机
     */
    clone() {
        //新建状态机
        let object = new StateMachine();
        //拷贝当前状态
        object.state = this._state;
        //拷贝状态转移表
        object.stateTransitionTable = JSON.parse(JSON.stringify(this._stateTransitionTable));
        return object;
    }
}
/**
 * 对象池
 */
class ObjectPool {
    constructor(create, release, init) {
        this._linkedList = new LinkedList();
        this._create = create;
        this._release = release;
        this._init = init;
    }
    /**
     * 取出一个对象，使用对象上的release方法归还对象
     * @returns {any}
     */
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