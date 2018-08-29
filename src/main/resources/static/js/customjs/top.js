/**
 * Created by bozhil on 2017/7/12.
 */
!(function () {
    var topReset = {};
    topReset.init = function () {
        $("#modifyPassword").click(function () {
            $("#modifyPwdModal").modal("show");
        });

        $("#modifyPwdModal").on("hidden.bs.modal",function () {
            $("#currentPassword").val("");
            $("#newPassword").val("");
            $("#confirmPwd").val("");
        })
        var params = {};
        moriarty.doPost('/api/v1/service/listQuery',JSON.stringify(params),function (res) {
            if (res.result === "SUCCESS") {
                if(res.data !== null && res.data.length>0){
                    res.data.forEach(function (x) {
                        if (!moriarty.getEmployeeType()) {
                            //admin
                            if ('0' === x.read_status && x.status === '1') {
                                if ($('.envelope').hasClass('hidden')) {
                                    $('.envelope').removeClass('hidden');
                                    return;
                                }
                            }
                        }else{
                            if ('0' === x.read_status && x.status !== '1') {
                                if ($('.envelope').hasClass('hidden')) {
                                    $('.envelope').removeClass('hidden');
                                    return;
                                }
                            }
                        }
                    })
                }
            }
        })
    };

    topReset.modifyPwd = function () {
        var currentPassword = $("#currentPassword").val();
        var newPassword = $("#newPassword").val();
        var checkPwd = $("#confirmPwd").val();
        if (currentPassword === "" || currentPassword === null || checkPwd === undefined) {
            showInfoMessage("原密码不能为空！");
            return;
        }
        if (!moriarty.regPass.test(newPassword) || newPassword.length < 12) {
            showInfoMessage("密码不能小于12位，必须由大写字母、小写字母、数字和特殊符号组成！");
            return;
        }
        if (newPassword === "" || newPassword === null || newPassword === undefined) {
            showInfoMessage("新密码不能为空！");
            return;
        }
        if (checkPwd === "" || checkPwd === null || checkPwd === undefined) {
            showInfoMessage("确认密码不能为空！");
            return;
        }
        if (checkPwd !== newPassword) {
            showInfoMessage("输入密码不一致！");
            return;
        }

        var params = {};
        params["currentPassword"] = currentPassword;
        params["newPassword"] = newPassword;
        moriarty.doPost("/api/v1/user/modifyPassword", JSON.stringify(params).toString(), function (res) {
            if (res !== null) {
                if (res.result === "SUCCESS") {
                    swal({
                        title: '',
                        text: '修改密码成功,请重新登录！',
                        type: "success",
                        showConfirmButton: "true",
                        confirmButtonText: '确定',
                        animation: "slide-from-top"
                    }, function () {
                        window.location.href = "/logout"
                    });
                    return;
                }
                if (res.result === "ERROR_PASSWORD") {
                    showInfoMessage("原密码错误！");
                } else {
                    showErrorMessage("修改密码失败！");
                }
            } else {
                showErrorMessage("修改密码失败！");
            }

        })
    };
    topReset.licenseValidate = function(){
        var license = $('#license').val();
        if(license === null || license ===""){
            moriarty.doGet("/api/v1/license/validate",null, function (res) {
                if(res !==null){
                    if("ERROR_LICENSE_NULL" === res.result){
                        $("#licenseConfirm").on('show.bs.modal',function () {
                            var $this = $(this);
                            var $modal_dialog = $this.find('.modal-dialog');
                            $this.css('display', 'block');
                            $modal_dialog.css({'margin-top': Math.max(0, ($(window).height() - $modal_dialog.height()) / 2) });
                        });
                        $("#licenseConfirm").modal("show");
                    }else if("ERROR_LICENSE_INVALID" === res.result){
                        $("#licenseConfirm").on('show.bs.modal',function () {
                            var $this = $(this);
                            var $modal_dialog = $this.find('.modal-dialog');
                            $this.css('display', 'block');
                            $modal_dialog.css({'margin-top': Math.max(0, ($(window).height() - $modal_dialog.height()) / 2) });
                        });
                        $("#licenseConfirm").modal("show");
                        $(".errorInfo").removeClass("hidden");
                    }else if("SUCCESS" === res.result){
                        topReset.init();
                    }else {
                        console.warn("unknown")
                    }
                }
            });
        }else{
            topReset.licenseConfirm();
        }
    };
    topReset.licenseConfirm = function(){
        var license = $('#license').val();
        if(!$(".errorInfo").hasClass("hidden")){
            $(".errorInfo").addClass("hidden");
        }
        if(license === null || license === ""){
            showErrorMessage("license不能为空");
            return;
        }
        moriarty.doGet("/api/v1/license/validation?license="+license,null, function (res) {
            if(res !== null ){
                if(res.result === "SUCCESS"){
                    $("#licenseConfirm").modal("hide");
                    topReset.init();
                }else {
                    $(".errorInfo").removeClass("hidden");
                }
            }
        })
    };
    window.topReset = topReset;
})();