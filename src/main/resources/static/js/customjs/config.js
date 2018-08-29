/**
 * Created by bozhil on 2017/10/17.
 */
!(function () {
    var config = {};
    config.init = function () {
        $("#import").bind("click", function () {
            $("input[type=file]").click();
        });
    };

    config.importFileChange = function () {
        $("#importFileForm").ajaxSubmit({
            type: "POST",
            url: "/api/v1/config/import",
            contentType: 'application/json;charset=UTF-8',
            success: function (res) {
                console.log(JSON.stringify(res));
                if (res.result === "SUCCESS") {
                    toastr.success("导入成功", "恭喜");
                    $("#importFile").removeAttr("onChange").val("").attr("onchange", "config.importFileChange()");
                } else {
                    toastr.warning("导入失败", "注意");
                }
            },
            error: function () {
                toastr.warning("导入失败", "注意");
            }
        });
        return false;
    };

    config.updateSmtp = function () {
        var param = JSON.stringify({
            serverAddress: $("#mailHost").val(),
            serverPort: $("#mailPort").val(),
            serverUserName: $("#mailUsername").val(),
            serverPass: $("#mailPassword").val()
        });
        moriarty.doPost("/api/v1/insertSmtp", param.toString(), function (res) {
            if (res !== null) {
                if (res.result === "SUCCESS") {
                    window.location.reload();
                }
            }
        }, true)
    };

    config.zabbixSmtpInit = function () {
        moriarty.doGet("/api/v1/monitor/smtpInfo",null,function (res) {
            if(res !== null){
                if(res.result === "SUCCESS"){
                    if(null !== res.data){
                        $('#smtpServer').val(res.data.smtpServer);
                        $('.smtpSsl[value="'+res.data.smtpSsl.toLowerCase()+'"]').prop('checked',true);
                        $('#smtpPort').val(res.data.smtpPort);
                        $('#smtpUsername').val(res.data.smtpUsername);
                        $('#smtpPassword').val(res.data.smtpPassword);
                    }
                }
            }else{
                showErrorMessage("查询失败");
            }
        })
    };
    config.zibbixSmtpUpdate = function () {
        var smtpServer = $('#smtpServer').val() || "";
        var smtpSsl = $('.smtpSsl:checked').val();
        var smtpPort = $('#smtpPort').val() || "";
        var smtpUsername = $('#smtpUsername').val() || "";
        var smtpPassword = $('#smtpPassword').val() || "";

        var numberValidator = /^[0-9]*$/;

        if (smtpServer.length === 0) {
            showErrorMessage("邮件服务器地址不能为空");
            return;
        }
        if (smtpPort.length === 0) {
            showErrorMessage("邮件端口配置不能为空");
            return;
        }
        if (!numberValidator.test(smtpPort)) {
            showErrorMessage("邮件端口配置只能为数字");
            return;
        }
        if (smtpPort > 65535) {
            showErrorMessage("邮件端口配置不能大于65535");
            return;
        }
        if (smtpUsername.length === 0) {
            showErrorMessage("邮件用户配置不能为空");
            return;
        }
        if (smtpPassword.length === 0) {
            showErrorMessage("邮件密码配置不能为空");
            return;
        }

        var params = {"smtpServer":smtpServer,"smtpSsl":smtpSsl,"smtpPort":smtpPort,"smtpUsername":smtpUsername,"smtpPassword":smtpPassword};

        moriarty.doPost("/api/v1/monitor/smtpConfig",JSON.stringify(params),function (res) {
            if(null !== res){
                if(res.result === "SUCCESS"){
                    showSuccessMessage("配置成功")
                }else{
                    showErrorMessage("配置失敗")
                }
            }else{
                showErrorMessage("配置失敗")
            }
        })
    };
    window.config = config;
})();