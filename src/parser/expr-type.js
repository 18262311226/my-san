/**
 * 表达式类型
 *
 * @const
 * @type {Object}
 */
 export let ExprType = {
    STRING: 1, //字符串，其中不会包含变量
    NUMBER: 2, // 数，其中不会包含变量
    BOOL: 3, //布尔值，其中不会包含变量
    ACCESSOR: 4, // 对变量的访问，需要重点处理
    INTERP: 5, // 插值，在ACCESSOR基础上，可能增加了filter
    CALL: 6, // 函数调用
    TEXT: 7, // 文本值，字符串的拼接，可能是字符串与其他类型的组合
    BINARY: 8, //二元表达式 类如 || && 
    UNARY: 9, // 一元表达式
    TERTIARY: 10, // 三元表达式
    OBJECT: 11, // 对象字面量
    ARRAY: 12, // 数组字面量
    NULL: 13 // null值
};