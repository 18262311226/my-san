/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 读取一元表达式
 */
import { ExprType } from './expr-type.js';
import {readString } from './read-string.js';
import { readCall } from './read-call.js';
import { readParenthesizedExpr } from './read-parenthesized-expr.js';
import { readTertiaryExpr } from './read-tertiary-expr.js';

function postUnaryExpr(expr, operator) {
    switch (operator) {
        case 33:
            var value;
            switch (expr.type) {
                case ExprType.NUMBER:
                case ExprType.STRING:
                case ExprType.BOOL:
                    value = !expr.value;
                    break;
                case ExprType.ARRAY:
                case ExprType.OBJECT:
                    value = false;
                    break;
                case ExprType.NULL:
                    value = true;
                    break;
            }

            if (value != null) {
                return {
                    type: ExprType.BOOL,
                    value: value
                };
            }
            break;

        case 43:
            switch (expr.type) {
                case ExprType.NUMBER:
                case ExprType.STRING:
                case ExprType.BOOL:
                    return {
                        type: ExprType.NUMBER,
                        value: +expr.value
                    };
            }
            break;

        case 45:
            switch (expr.type) {
                case ExprType.NUMBER:
                case ExprType.STRING:
                case ExprType.BOOL:
                    return {
                        type: ExprType.NUMBER,
                        value: -expr.value
                    };
            }
            break;
    }

    return {
        type: ExprType.UNARY,
        expr: expr,
        operator: operator
    };
}

/**
 * 读取一元表达式
 *
 * @param {Walker} walker 源码读取对象
 * @return {Object}
 */
export function readUnaryExpr(walker) {
    walker.goUntil();

    var currentCode = walker.source.charCodeAt(walker.index);
    switch (currentCode) {
        case 33: // !
        case 43: // +
        case 45: // -
            walker.index++;
            return postUnaryExpr(readUnaryExpr(walker), currentCode);

        case 34: // "
        case 39: // '
            return readString(walker);

        case 48: // number
        case 49:
        case 50:
        case 51:
        case 52:
        case 53:
        case 54:
        case 55:
        case 56:
        case 57:
            return {
                type: ExprType.NUMBER,
                value: +(walker.match(/[0-9]+(\.[0-9]+)?/g, 1)[0])
            };

        case 40: // (
            return readParenthesizedExpr(walker);

        // array literal
        case 91: // [
            walker.index++;
            var arrItems = [];
            while (!walker.goUntil(93)) { // ]
                var item = {};
                arrItems.push(item);

                if (walker.source.charCodeAt(walker.index) === 46 && walker.match(/\.\.\.\s*/g)) {
                    item.spread = true;
                }

                item.expr = readTertiaryExpr(walker);
                walker.goUntil(44); // ,
            }

            return {
                type: ExprType.ARRAY,
                items: arrItems
            };

        // object literal
        case 123: // {
            walker.index++;
            var objItems = [];

            while (!walker.goUntil(125)) { // }
                var item = {};
                objItems.push(item);

                if (walker.source.charCodeAt(walker.index) === 46 && walker.match(/\.\.\.\s*/g)) {
                    item.spread = true;
                    item.expr = readTertiaryExpr(walker);
                }
                else {
                    // #[begin] error
                    var walkerIndexBeforeName = walker.index;
                    // #[end]

                    item.name = readUnaryExpr(walker);

                    // #[begin] error
                    if (item.name.type > 4) {
                        throw new Error(
                            '[SAN FATAL] unexpect object name: '
                            + walker.source.slice(walkerIndexBeforeName, walker.index)
                        );
                    }
                    // #[end]

                    if (walker.goUntil(58)) { // :
                        item.expr = readTertiaryExpr(walker);
                    }
                    else {
                        item.expr = item.name;
                    }

                    if (item.name.type === ExprType.ACCESSOR) {
                        item.name = item.name.paths[0];
                    }
                }

                walker.goUntil(44); // ,
            }

            return {
                type: ExprType.OBJECT,
                items: objItems
            };
    }

    return readCall(walker);
}