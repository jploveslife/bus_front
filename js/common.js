var CONSTANTS = {
    DEBUG : true,
    BASE_URL : "http://localhost:8081",
    SEARCH_LINE_URL : "/wechat/bus/line/",
    LINE_INFO_URL : "/wechat/bus/lineInfo/",
    SEARCH_STATION_URL : "/wechat/bus/station/",
    STATION_LIST_URL : "/wechat/bus/stationlist/",
    line_STATUS_URL : "/wechat/bus/lineStatus/",
}



var callAjax = {
    /**
     * ajax请求
     * @param url 请求地址
     * @param cb 请求成功的回调函数
     * @param req_type  请求类型  GET ,POST
     * @param data    请求提交的参数（POST才需要）
     * @param completeCallback   请求执行失败，需要执行的函数
     */
    request: function (url, cb, req_type, data, completeCallback) {
        if (url.indexOf(CONSTANTS.BASE_URL) != 0) {
            url = CONSTANTS.BASE_URL + url;
        }

        var httpReq;
        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            httpReq = new XMLHttpRequest();
        } else {// code for IE6, IE5
            httpReq = new ActiveXObject("Microsoft.XMLHTTP");
        }

        if (req_type === undefined || req_type.toLowerCase() == "get") {
            httpReq.open("GET", url, true);
        } else {
            httpReq.open("POST", url, true);
        }

        httpReq.onreadystatechange = function () {
            // if(CONSTANTS.hideLoagingIcon)
            //     $("#loadingIcon").hide();

            if (httpReq.readyState == 4 && httpReq.status == 200) {
                cb(JSON.parse(httpReq.responseText));
            } else {
                //TODO 整个ajax完成之后需要执行一些操作，使用completeCallback回调处理
                if (isNotEmpty(completeCallback))
                    completeCallback();
            }
        }
        if (req_type == "Get") {
            httpReq.send(null);
        } else {
            httpReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            var strParam = '';
            for (var idx in data) {
                strParam += ['&', idx, '=', data[idx]].join('');
            }
            httpReq.send(strParam);
        }
    }
}

/**
 * 判断对象是否为空
 * @param object
 * @returns {boolean}
 */
function isEmpty(object) {
    if (object == undefined || object == null ||  object == 'null')
        return true;
    return false;
}
/**
 * 判断对象不为空
 * @param object
 * @returns {boolean}
 */
function isNotEmpty(object) {
    return !isEmpty(object);
}

/**
 * 判断类型是否为数字
 * @param num
 * @returns {boolean}
 */
function isNumber(num) {
    if (typeof num === 'number')
        return true;
    return false;
}

/**
 * 判断字符串是否为空
 * @param context
 * @returns {boolean}
 */
function hasTest(context) {
    if (isEmpty(context) || trim(context).length == 0) {
        return false;
    }
    return true;
}

/**
 * 清楚字符串中的空格
 * @param str
 * @returns {void|XML|string}
 * @constructor
 */
function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

/*---------------缓存工具 开始---------------------*/
var cache_storage = {
    /**
     * 保存到本地缓存
     * @param key
     * @param value
     * @returns {*}
     */
    cacheToLocal: function (key, value) {
        if (window.localStorage) {
            localStorage.setItem(key, value);
        }
        return value
    },
    /**
     * 通过key获取本地缓存数据
     * @param key
     * @returns {null}
     */
    getLocalCache: function (key) {
        if (window.localStorage) {
            return localStorage.getItem(key);
        }
        return null;
    },
    /**
     * 通过key清空本地缓存数据
     * @param key
     * @returns {null}
     */
    cleanLocalCache: function (key) {
        if (window.localStorage) {
            return localStorage.removeItem(key);
        }
        return null;
    },
    /**
     * 保存到session缓存
     * @param name
     * @param value
     */
    saveLocal: function (name, value) {
        if (window.sessionStorage) {
            sessionStorage.setItem(name, value);
        } else {
            jQuery.cookie(name, value, {
                path: "/weixinweb"
            });
        } 
    },
    /**
     * 获取session缓存的数据
     * @param name
     * @returns {*}
     */
    getLocal: function (name) {
        if (window.sessionStorage) {
            return sessionStorage.getItem(name);
        } else {
            return jQuery.cookie(name);
        }
    }
}
/*---------------缓存工具 结束---------------------*/

/**
 * 根据key获取请求地址中的参数
 * @param name
 * @returns {*}
 */
function getURIParam(name) {
    var search = window.location.search;
    search = search.substring(1);
    if (search.length < 1) {
        return null;
    }
    var pars = search.split("&");
    for (var idx in pars) {
        var par = pars[idx];
        var keyval = par.split("=");
        if (keyval.length < 2) {
            continue;
        }
        if (keyval[0].toLowerCase() == name.toLowerCase()) {
            if (keyval.length == 2) {
                return keyval[1];
            }
            var res = "";
            for (var i = 1; i < keyval.length; i++) {
                res += keyval[i] + "=";
            }
            return res.substring(0, res.length - 1);
        }
    }
    return null;
}


/*---------JS集合的比较和查询   开始-----------------*/
/**
 *  通过传入的key比较集合中对象中是否有满足条件的对象
 *  如果compareIndex不为null,则判断集合对象中compareIndex属性的值是否和key相等，并返回第一匹配的下标
 *  如果compareIndex 为null ，key变成value，查询集合中是否包含该值，并返回第一个匹配的下标
 * @param array
 * @param key
 * @param compareIndex
 * @returns {*}
 */
var arrayContains = function (array, key, compareIndex) {
    if (compareIndex == null) {
        for (var idx in array) {
            if (array[idx] == key) {
                return idx;
            }
        }
    } else {
        for (var idx in array) {
            if (array[idx][compareIndex] == key) {
                return idx;
            }
        }
    }
    return -1;
};
var arrayFind = function (array, key, compareIndex) {
    for (var idx in array) {
        if (array[idx][compareIndex] == key) {
            return array[idx];
        }
    }
    return null;
};
/*---------JS集合的比较和查询   结束-----------------*/
