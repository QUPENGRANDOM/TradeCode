/**
 * Created by Yipin on 2016/6/20.
 */
function createHTML(element, element_class, element_attr, element_css) {
    if (element === undefined)
        return;

    var $element = $(document.createElement(element));

    if (element_class !== undefined && element_class !== null)
        $element.addClass(element_class);

    if (element_attr !== undefined && element_attr !== null)
        $element.attr(element_attr);

    if (element_css !== undefined && element_css !== null)
        $element.css(element_css);

    return $element;
}

//字节
function setMaxLength(str, maxLen, id) {
    var w = 0;
    var time = 0;
    var lengthEnd = Math.floor(maxLen / 2);
    var lengthStart = 1;
    var _id = "#" + id;
    //length 获取字数数，不区分汉子和英文
    for (var i = 0; i < str.value.length; i++) {
        //charCodeAt()获取字符串中某一个字符的编码
        var c = str.value.charCodeAt(i);
        //单字节加1
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
            w++;
            if (typeof(id) === 'string') {
                time++;
                if (time % 2 == 0) {
                    if (maxLen < 200) {
                        $(_id).text(--lengthEnd);
                    } else {
                        $(_id).text(lengthStart++);
                    }

                }
            }
        }
        else {
            w += 2;
            if (typeof(id) === 'string') {
                if (maxLen < 200) {
                    $(_id).text(--lengthEnd);
                } else {
                    $(_id).text(lengthStart++);
                }

            }
        }
        if (w > maxLen) {
            str.value = str.value.substr(0, i);
            if (typeof(id) === 'string') {
                $(_id).text(Math.floor(maxLen / 2));
            }
            break;
        }
    }
}

function maxLen(data, num) {
    if (data.value.length > num) {
        data.value = data.value.substr(0, num);
    }
}


function timeFormat(data) {
    var date = new Date(data);
    var y = date.getFullYear();
    var m = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1);
    var d = date.getDate() >= 10 ? date.getDate() : "0" + date.getDate();
    var h = date.getHours() >= 10 ? date.getHours() : "0" + date.getHours();
    var min = date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes();
    return y + '-' + m + '-' + d + 'T' + h + ':' + min;
}

function dialog(title, text, callback) {

    var $dialog = $("<div class='boyue-dialog-confirm'><div class='boyue-mask'></div><div class='boyue-dialog'><div class='boyue-dialog-title'>" + title + "</div>" +
        "<div class='boyue-dialog-bd'>" + text + "</div><div class='boyue-dialog-ft'></div></div></div>");

    $('body').append($dialog);

    for (var key in callback) {
        if (key == "确定") {
            $('.boyue-dialog-ft').append($('<a class="boyue-btn-dialog" style="color:#00B7FF">' + key + '</a>'));
        } else {
            $('.boyue-dialog-ft').append($('<a class="boyue-btn-dialog">' + key + '</a>'));
        }
    }

    $('.boyue-btn-dialog').click(function () {
        $('.boyue-dialog-confirm').remove();
        if (typeof callback[$(this).text()] === 'function') {
            callback[$(this).text()]();
        }
    });
}

function getCookie(key) {
    return $.cookie(key);
}

function verifyStr(str) {
    if (str == "" || str == "undefined" || str == null || str == " undefined" || typeof str == "undefined") {
        return false;
    } else {
        return true;
    }
}

function BYLoadingToast(message, callback) {
    var $loadingToast = $("<div></div>").addClass("by-loading-toast").append("<div class='by-mask-transparent'></div>");

    var $toast = $("<div></div>").addClass("by-toast");
    var $loading = $("<div></div>").addClass("by-loading");
    for (var i = 0; i < 12; i++) {
        var classStr = "by-loading-leaf-" + i;
        $loading.append($("<div></div>").addClass("by-loading-leaf ").addClass(classStr))
    }
    $toast.append($loading).append("<p class='by-toast-content' style='font-size: 14px'>" + message + "</p>");
    $loadingToast.append($toast);
    $(document.body).append($loadingToast);
    if (callback) {
        var dtd = $.Deferred();
        callback(dtd);
        dtd.done(function () {
            $('.by-loading-toast').hide().remove();
        });
    }
}

var city_code, city_name, city_adcode;

function setLocationInfo(data) {
    city_code = data.addressComponent.citycode;
    city_adcode = data.addressComponent.adcode;
    if (data.addressComponent.city == "") {
        city_name = data.addressComponent.province;
    } else {
        city_name = data.addressComponent.city;
    }

    setCookie("cityCode", city_code, {expires: 1});
    setCookie("cityName", city_name, {expires: 1});
    setCookie("cityAdcode", city_adcode, {expires: 1})
}

/*定位*/
function getLocationInfo(callback) {
    AMap.plugin('AMap.Geolocation', function () {
        var geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 10000,          //超过10秒后停止定位，默认：无穷大
            buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            buttonPosition: 'RB'
        });
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, 'complete', function (data) {
            callback("complete", data, geolocation);
            //regeocoder([data.position.getLng(), data.position.getLat()], callback);
        });//返回定位信息
        AMap.event.addListener(geolocation, 'error', function (data) {
            callback("error", data, geolocation);
        });
    })
}

/*根据电脑IP定位*/
function getLocationByIp(callback) {
    AMap.plugin('AMap.CitySearch', function () {
        var citysearch = new AMap.CitySearch();
        //自动获取用户IP，返回当前城市
        citysearch.getLocalCity(function (status, result) {
            if (status == "complete" && result.info == "OK") {
                geocoder(result.city, result.city, callback)
            } else {
                callback(status, result);
            }
        });
    });
}

function setCookie(key, value, expires) {
    if (expires == undefined || expires == null || expires == "") {
        $.cookie(key, value);
    } else {
        $.cookie(key, value, expires);
    }
}

function getCookie(key) {
    return $.cookie(key);
}

//逆地理编码
function regeocoder(lnglatXY, callback) {
    console.log("regeocoder start...");
    AMap.plugin('AMap.Geocoder', function () {
        var geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all"
        });
        geocoder.getAddress(lnglatXY, function (status, result) {
            if (callback != undefined && callback != null) {
                callback(status, result)
            }
        });
    })
}

function uploadFiles(files, successBlock) {
    uploadFilesInternal(files, 0, files.length, [], successBlock);
}

function uploadFilesInternal(files, start, end, completedImages, successBlock) {
    if (files == undefined || files == null || files.length == 0 || files.length <= start || start >= end) {
        successBlock(completedImages);
        return;
    }

    var imageData = $(files.children()[start]).attr("src").split("base64,")[1];

    $.ajax({
        type: 'POST',
        url: '/api/v1/image/upload',
        contentType: 'application/json',
        data: JSON.stringify({
            imageData: imageData
        }),
        success: function (data) {
            if (data.code == 200) {
                completedImages.push(data.result);
            }
            uploadFilesInternal(files, start + 1, end, completedImages, successBlock);
        }
    });
}


function previewImages(files, start, end, target, inputSign) {
    if (files == undefined || files == null || files.length == 0 || files.length <= start || start >= end) {
        inputSign.val('');
        return;
    }

    var reader = new FileReader();
    reader.onload = function () {

        target.append($('<li></li>').append('<img class="by-uploader-file" src="' + this.result + '" onclick="showImage(this)">'));
        previewImages(files, start + 1, end, target, inputSign);
    };
    reader.readAsDataURL(files[start]);
}


function showImage(data) {
    var pinId;
    var $self = $(data).parents('ul');
    var $clone = $(data).parents('ul').clone();
    $clone.children().children('img').removeAttr('onclick');
    var begin = $(data).parent().index();
    $('#slider').showBigImage({
        "head": {
            "back": {
                "name": "返回", "action": ""
            }, "del": {
                "name": "images/shanchu.png", "action": function (index) {
                    var $li = $('li:eq(' + index + ')');

                    if ($li.children('img').attr('data-name') != undefined) {
                        pinId = $li.parent('ul').data('id');
                        $.post('/api/v1/deleteImg', {
                            pinId: pinId,
                            img: $li.children('img').data("name")
                        }, function (data) {
                            if (data.code !== 200) {
                                console.log(data.message);
                            }
                        })
                    }
                    $li.remove();
                    if($self.children('li').length < 9){
                        $self.next().removeClass('hide');
                    }
                }
            }
        }, "content": $clone, "startImg": begin
    });
}


function timeStamp(dateStr) {
    var date = new Date(dateStr);
    return date.getTime() + (date.getTimezoneOffset() * 60 * 1000);
}

//提示框
function showTips(content, time) {
    var $prompt = $('<div class="prompt"></div>');

    $('.prompt').remove();

    $('body').append($prompt);

    $('.prompt').text(content);

    $('.prompt').css({'top': '2.2rem', 'left': ($(window).width() - $prompt.width()-20) / 2 + 'px'}).show();

    setTimeout(function () {
        $('.prompt').fadeOut();
        $('.prompt').remove();
    }, ( time * 1000 ));
}
