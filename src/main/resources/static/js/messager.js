/*
 showType：显示类型，分4种，支持：0|’info’(提示),1|’success’(成功), 2|’ warning’ (警告),3|’error’ (错误)
 dest：显示位置，共七种：0|’total-center’(居中),1|’toast-top-left’(上左),2|’toast-top-center’(上中) ,3|’toast-top-right’(上右) ,4|’toast-bottom-left’(下左) ,5|’toast-bottom-center’(下中) ,6|’toast-bottom-left’(下右)
 msg:提示内容
 title：提示框标题，非必输
 showColseBtn：是否显示关闭按钮，非必输， 值：1|true，默认显示
 timeout：超时时间，以毫秒为单位，默认5000毫秒

 */

var showInfoMessage = function(message){
    messager(0, 0, message, '提示',2,3000);
};

var showErrorMessage = function(message){
    messager(3, 0, message, '错误',2,3000);
};

var showWarningMessage = function(message){
    messager(2, 0, message, '错误',2,3000);
};

var showSuccessMessage = function(message){
    messager(1, 0, message, '提示',2,3000);
};

var messager = function(showType, dest, msg, title, showColseBtn, timeout){

    var t_dest = "toast-top-right";
    var t_msg = "";
    var t_title = "";
    var t_timeOut = 5000;
    var t_close = true;
    if (dest == 0 || dest == "toast-center")
        t_dest = "toast-center";
    else
    if (dest == 1 || dest == "toast-top-left")
        t_dest = "toast-top-left";
    else
    if (dest == 2 || dest == "toast-top-center")
        t_dest = "toast-top-center";
    else
    if (dest == 3 || dest == "toast-top-right")
        t_dest = "toast-top-right";
    else
    if (dest == 4 || dest == "toast-bottom-left")
        t_dest = "toast-bottom-left";
    else
    if (dest == 5 || dest == "toast-bottom-center")
        t_dest = "toast-bottom-center";
    else
    if (dest == 6 || dest == "toast-bottom-right")
        t_dest = "toast-bottom-right";

    if (msg != "")
        t_msg = msg;

    if (title != "")
        t_title = title;

    if (!isNaN(timeout) && timeout != "")
        t_timeOut = timeout;
    if (showColseBtn == true || showColseBtn ==1)
        t_close = true;
    toastr.options = {
        "closeButton": t_close,
        "debug": false,
        "positionClass": t_dest,
        "onclick": null,
        "showDuration": "1000",
        "hideDuration": "1000",
        "timeOut": t_timeOut,
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };
    if (showType == 3 || showType == "error")
        toastr.error(msg, title);//错误
    else
    if (showType == 2 || showType == "warning") //警告
        toastr.warning(msg, title);
    else
    if (showType == 1 || showType == "success")
        toastr.success(msg, title);
    else
        toastr.info(msg, title);//提示
};
