function defaultStyleFilter (source) {
    if (typeof source === 'object') {
        var result = '';
        for (var key in source) {
            /* istanbul ignore else  */
            if (source.hasOwnProperty(key)) {
                result += key + ':' + source[key] + ';';
            }
        }

        return result;
    }

    return source;
}

/**
 * 默认filter
 *
 * @const
 * @type {Object}
 */
export let DEFAULT_FILTERS = {
/**
     * URL编码filter
     *
     * @param {string} source 源串
     * @return {string} 替换结果串
     */

    url: encodeURIComponent,

    _class: function (source) {
        if (source instanceof Array) {
            return source.join(' ');
        }

        return source;
    },

    _style: defaultStyleFilter,

    _xclass: function (outer, inner) {
        if (outer instanceof Array) {
            outer = outer.join(' ');
        }

        if (outer) {
            if (inner) {
                return inner + ' ' + outer;
            }

            return outer;
        }

        return inner;
    },

    _xstyle: function (outer, inner) {
        outer = outer && defaultStyleFilter(outer);
        if (outer) {
            if (inner) {
                return inner + ';' + outer;
            }

            return outer;
        }

        return inner;
    }
}