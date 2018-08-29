/**
 * Created by Yipin on 2017/6/14.
 */
!(function () {
    window.user = {
        init: function () {
            var loginUser = $("#loginUser").text();
            var dataColumns = [{"id": 1, "name": "编辑"}];
            if (loginUser === "admin") {
                dataColumns = [{"id": 1, "name": "编辑"}, {"id": 2, "name": "删除"}, {"id": 3, "name": "重置密码"}]
            }

            $(".table").DataTable({
                paging: true,
                processing: false,
                lengthChange: false,
                ordering: true,
                autoWidth: false,
                info: true,
                serverSide: false,
                fixedHeader: true,
                searching: true,
                aLengthMenu: [10],
                ajax: {
                    url: "/api/v1/user/list",
                    dataSrc: 'data'
                },
                columns: [
                    {
                        data: "commonName"
                    },
                    {
                        data: "username"
                    },
                    {
                        data: "mail"
                    },
                    {
                        data: "mobile"
                    },
                    {
                        data: "",
                        render: function (data, type, full, meta) {
                            if (loginUser === "admin") {
                                if (full.username === "admin") {
                                    dataColumns = [{"id": 1, "name": "编辑"}];
                                } else {
                                    dataColumns = [{"id": 1, "name": "编辑"}, {"id": 2, "name": "删除"}, {
                                        "id": 3,
                                        "name": "重置密码"
                                    }]
                                }
                            }
                            return moriarty.actionToast("操作", dataColumns,
                                {
                                    "uid": full.uid,
                                    "username": full.username,
                                    "nickname": full.commonName,
                                    "mail": full.mail,
                                    "mobile": full.mobile,
                                    "loginUser": loginUser
                                }, "user.action.chooseAction(this)");
                        }
                    }
                ],
                language: {url: '/lang/datatable.chs.json'}
            });

            // $("#addModal").on("show.bs.modal", function () {
            //     receiveStatus($("#username").val());
            // });

            $("#editModal").on("show.bs.modal", function () {
                receiveStatus($("#edit-username").val());
            });

            if (moriarty.getEmployeeType()){
                $("#addUser").remove();
            }
        },
        action: {
            chooseAction: function (_this) {
                var value = $(_this).data("id");
                var params = $(_this).data("params");

                switch (value) {
                    case 1:
                        actionEdit(params);
                        break;
                    case 2:
                        actionDelete(params);
                        break;
                    case 3:
                        actionResetPwd(params);
                    default:
                        break;
                }
            }
        }
    };

    user.saveAdd = function () {
        var username = $("#add-username").val();
        if (username === null || username === undefined || username === "") {
            showInfoMessage("用户名不能为空！");
            return;
        }
        var nickname = $("#add-nickname").val();
        if (nickname === null || nickname === undefined || nickname === "") {
            showInfoMessage("昵称不能为空！");
            return;
        }
        var password = $("#add-password").val();
        if (password === null || password === undefined || password === "") {
            showInfoMessage("密码不能为空！");
            return;
        }

        // if (!moriarty.regPass.test(password) || password.length < 12) {
        //     showInfoMessage("密码不能小于12位，必须由大写字母、小写字母、数字和特殊符号组成！");
        //     return;
        // }

        var checkPwd = $("#add-checkPwd").val();
        if (checkPwd === null || checkPwd === undefined) {
            showInfoMessage("确认密码不能为空！");
            return;
        }

        if (checkPwd !== password) {
            showInfoMessage("两次输入密码不一致！");
            return;
        }

        var mail = $("#email").val();
        if (mail === null || mail === undefined || mail === "") {
            showInfoMessage("邮箱不能为空！");
            return;
        }

        if (!moriarty.mailVerify.test(mail)) {
            showInfoMessage("请输入正确的邮箱格式！");
            return;
        }

        var mobile = $("#mobile").val();
        if (mobile === null || mobile === undefined || mobile === "") {
            showInfoMessage("电话不能为空！");
            return;
        }

        if (!moriarty.mobileVerify.test(mobile)) {
            showInfoMessage("请输入正确的电话格式！");
            return;
        }

        var params = JSON.stringify({
            "username": username,
            "commonName": nickname,
            "password": password,
            "mail": mail,
            "mobile": mobile
        });
        moriarty.doPost("/api/v1/user/create", params.toString(), function (res) {
            if (res.result === "SUCCESS") {
                user.clearAdd();
                showSuccessMessage("创建成功！");
                $(".table").DataTable().ajax.reload();
                var type = $("input[name='warning-mail']:checked").val();
                warningEmail(username, mail, type);
            } else {
                showErrorMessage("创建失败！");
            }
        })
    };

    var actionEdit = function (params) {
        $("#edit-username").val(params.username);
        $("#edit-nickname").val(params.nickname);
        $("#edit-email").val(params.mail);
        $("#edit-mobile").val(params.mobile);
        $("#editModal").modal('show');
    };

    user.saveEdit = function () {
        var username = $("#edit-username").val();
        var nickname = $("#edit-nickname").val();
        var mail = $("#edit-email").val();
        var mobile = $("#edit-mobile").val();
        if (nickname === null || nickname === undefined || nickname === "") {
            showInfoMessage("昵称不能为空！");
            return;
        }
        if (mail === null || mail === undefined || mail === "") {
            showInfoMessage("邮箱不能为空！");
            return;
        }
        if (!moriarty.mailVerify.test(mail)) {
            showInfoMessage("请输入正确的邮箱格式！");
            return;
        }
        if (mobile === null || mobile === undefined || mobile === "") {
            showInfoMessage("电话不能为空！");
            return;
        }
        if (!moriarty.mobileVerify.test(mobile)) {
            showInfoMessage("请输入正确的电话格式！");
            return;
        }
        var params = JSON.stringify({
            "username": username,
            "commonName": nickname,
            "mail": mail,
            "mobile": mobile
        });
        moriarty.doPost("/api/v1/user/edit", params.toString(), function (res) {
            if (res !== null) {
                if (res.result === "SUCCESS") {
                    $("#editModal").modal('hide');
                    showSuccessMessage("编辑成功!");
                    $(".table").DataTable().ajax.reload();
                    var type = $("input[name='edit-warning-mail']:checked").val();
                    warningEmail(username,mail,type);
                } else {
                    showErrorMessage("编辑失败!");
                }
            } else {
                showErrorMessage("编辑失败!");
            }
        })
    };

    var actionDelete = function (params) {
        swal({
            title: '',
            text: '确定删除此用户？',
            type: "warning",
            showCancelButton: "true",
            showConfirmButton: "true",
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            animation: "slide-from-top"
        }, function () {
            moriarty.doPost("/api/v1/user/delete", JSON.stringify(params), function (res) {
                if (res !== null) {
                    if (res.result === "SUCCESS") {
                        showSuccessMessage("删除成功!");
                        $(".table").DataTable().ajax.reload();
                    } else {
                        console.log(res);
                        showErrorMessage("删除失败！");
                    }
                } else {
                    showErrorMessage("删除失败！");
                }

            });
        });
    };

    var actionResetPwd = function (params) {
        $("#resetPwdModal").modal("show");
        $("#resetPwd-uid").text(params["uid"]);
        $("#resetPwd-loginUser").text(params["loginUser"]);
    };

    user.resetPwd = function () {
        var newPwd = $("#reset-newPwd").val();
        var checkNewPwd = $("#reset-checkNewPwd").val();
        if (newPwd === "" || newPwd === null || newPwd === undefined) {
            showInfoMessage("新密码不能为空！");
            return;
        }

        if (!moriarty.regPass.test(newPwd) || newPwd.length < 12) {
            showInfoMessage("密码不能小于12位，必须由大写字母、小写字母、数字和特殊符号组成！");
            return;
        }
        if (checkNewPwd === "" || checkNewPwd === null || checkNewPwd === undefined) {
            showInfoMessage("确认密码不能为空！");
            return;
        }
        if (checkNewPwd !== newPwd) {
            showErrorMessage("输入密码不一致！");
            return;
        }
        var uid = $("#resetPwd-uid").text();
        var loginUser = $("#resetPwd-loginUser").text();
        var params = {};
        params["uid"] = uid;
        params["loginUser"] = loginUser;
        params["resetPassword"] = newPwd;
        moriarty.doPost("/api/v1/user/resetPassword", JSON.stringify(params), function (res) {
            if (res !== null) {
                if (res.result === "SUCCESS") {
                    showSuccessMessage("重置密码成功！");
                    $("#resetPwdModal").modal("hide");
                } else {
                    showErrorMessage("重置密码失败！");
                }
            } else {
                showErrorMessage("重置密码失败！");
            }

        })
    };

    $("#resetPwdModal").on("hidden.bs.modal", function () {
        $("#reset-newPwd").val("");
        $("#reset-checkNewPwd").val("");
    });

    user.clearAdd = function () {
        $("#add-username").val("");
        $("#add-nickname").val("");
        $("#add-password").val("");
        $("#add-checkPwd").val("");
        $("#addModal").modal('hide');
    };

    var warningEmail = function (username, emailPath, type) {
        var params =JSON.stringify({
            userName: username,
            emailPath: emailPath,
            type: type
        });
        moriarty.doPost("/api/v1/monitor/user", params.toString(), function (res) {
            if (res !== null) {
                if (res.result === "SUCCESS") {
                    console.log("邮件发送成功！");
                } else {
                    console.log("邮件发送失败！");
                }
            } else {
                console.log("邮件发送失败！");
            }

        })
    };

    var receiveStatus = function (username) {
        moriarty.doGet("/api/v1/monitor/hasSendMailAction", {userName: username}, function (res) {
            if (res !== null) {
                if (res.result === "SUCCESS") {
                    if (res.data) {
                        $("input[value='1']").prop("checked", true);
                    }else {
                        $("input[value='0']").prop("checked", true);
                    }
                } else {
                    console.log("ERROR：获取状态失败！")
                }
            } else {
                console.log("ERROR：获取状态失败！")
            }
        })
    }
})();
