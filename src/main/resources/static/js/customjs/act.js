/**
 * Created by mayanru on 9/30/2017.
 */
!(function () {
    var act = {};
    act.saveAdd = function () {
        var name = $("#name").val();
        if (name === null || name === undefined || name === "") {
            showInfoMessage("名称不能为空！");
            return;
        }
        var key = $("#key").val();
        if (key === null || key === undefined || key === "") {
            showInfoMessage("key不能为空！");
            return;
        }
        var description = $("#description").val();
        if (description === null || description === undefined || description === "") {
            showInfoMessage("描述不能为空！");
            return;
        }

        $('#addModal').modal('hide');
        window.location.href = "/api/v1/act/define/create?name="+name+"&key="+key+"&description="+description;
       /* $.get("/api/v1/act/define/create",params);*/
      /*  moriarty.doPost("/api/v1/act/define/create", params, function (res) {
            if (res.result === "SUCCESS") {
                showSuccessMessage("创建成功！");
            } else {
                showErrorMessage("创建失败！");
            }
        })*/
    };
    act.initDeployed = function () {
        var loginUser = $("#loginUser").text();
        var dataColumns = [];
        // if (loginUser === "admin") {
        dataColumns = [{"id": 4, "name": "启动"}]
        // }

        $("#deployedTable").DataTable({
            paging: true,
            processing: false,
            lengthChange: false,
            ordering: false,
            autoWidth: false,
            info: true,
            serverSide: false,
            fixedHeader: true,
            searching: true,
            aLengthMenu: [10],
            ajax: {
                url: "/api/v1/act/deployed/list",
                dataSrc: 'data'
            },
            columns: [
                {
                    data: "id"
                },
                {
                    data: "name"
                },
                {
                    data: "key"
                },
                {
                    data: "",
                    render: function (data, type, full, meta) {
                        // if (loginUser === "admin") {
                        dataColumns = [{"id": 4, "name": "启动"}]
                        // }
                        return moriarty.actionToast("操作", dataColumns,
                            {
                                "id": full.id,
                                "name": full.name,
                                "key": full.key,
                                "loginUser": loginUser
                            }, "act.action.chooseAction(this)");
                    }
                }
            ],
            language: {url: '/lang/datatable.chs.json'}
        });
    };
    act.initExecution = function () {
        var loginUser = $("#loginUser").text();
        var dataColumns = [];
        // if (loginUser === "admin") {
        dataColumns = [{"id": 4, "name": "启动"}]
        // }

        $("#executionTable").DataTable({
            paging: true,
            processing: false,
            lengthChange: false,
            ordering: false,
            autoWidth: false,
            info: true,
            serverSide: false,
            fixedHeader: true,
            searching: true,
            aLengthMenu: [10],
            ajax: {
                url: "/api/v1/act/execution/list",
                dataSrc: 'data'
            },
            columns: [
                {
                    data: "instanceId"
                },
                {
                    data: "businessKey"
                },
                {
                    data: "defineId"
                },
                {
                    data: "activeId"
                },
                {
                    data: "activeName"
                }
            ],
            language: {url: '/lang/datatable.chs.json'}
        });
    };
    act.initTask = function () {
        var loginUser = $("#loginUser").text();
        var dataColumns = [];
        // if (loginUser === "admin") {
        dataColumns = [{"id": 5, "name": "提交"}]
        // }

        $("#taskTable").DataTable({
            paging: true,
            processing: false,
            lengthChange: false,
            ordering: false,
            autoWidth: false,
            info: true,
            serverSide: false,
            fixedHeader: true,
            searching: true,
            aLengthMenu: [10],
            ajax: {
                url: "/api/v1/act/task/list",
                dataSrc: 'data'
            },
            columns: [
                {
                    data: "instanceId"
                },
                {
                    data: "taskId"
                },
                {
                    data: "nodeId"
                },
                {
                    data: "nodeName"
                },
                {
                    data: "",
                    render: function (data, type, full, meta) {
                        // if (loginUser === "admin") {
                        dataColumns = [{"id": 5, "name": "提交"}]
                        // }
                        return moriarty.actionToast("操作", dataColumns,
                            {
                                "taskId": full.taskId,
                                "loginUser": loginUser
                            }, "act.action.chooseAction(this)");
                    }
                }
            ],
            language: {url: '/lang/datatable.chs.json'}
        });
    };
    act.init =function () {
        var loginUser = $("#loginUser").text();
        var dataColumns = [];
        // if (loginUser === "admin") {
            dataColumns = [{"id": 1, "name": "编辑"}, {"id": 2, "name": "删除"}, {"id":3, "name": "部署"}]
        // }

        $("#defineTable").DataTable({
            paging: true,
            processing: false,
            lengthChange: false,
            ordering: false,
            autoWidth: false,
            info: true,
            serverSide: false,
            fixedHeader: true,
            searching: true,
            aLengthMenu: [10],
            ajax: {
                url: "/api/v1/act/define/list1",
                dataSrc: 'data'
            },
            columns: [
                {
                    data: "id"
                },
                {
                    data: "name"
                },
                {
                    data: "key"
                },
                {
                    data: "",
                    render: function (data, type, full, meta) {
                        // if (loginUser === "admin") {
                                dataColumns = [{"id": 1, "name": "编辑"}, {"id": 2, "name": "删除"}, {"id": 3, "name": "部署"}]
                        // }
                        return moriarty.actionToast("操作", dataColumns,
                            {
                                "id": full.id,
                                "name": full.name,
                                "loginUser": loginUser
                            }, "act.action.chooseAction(this)");
                    }
                }
            ],
            language: {url: '/lang/datatable.chs.json'}
        });
    };
    act.action= {
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
                    actionDeploy(params);
                    break;
                case 4:
                    actionStart(params);
                    break;
                case 5:
                    actionSubmit(params);
                    break;
                default:
                    break;
            }
        }
    };
    var actionEdit = function (params) {
        alert("该方法未添加");
    };
    var actionDelete = function (params) {
        swal({
            title: '',
            text: '确定删除此模型？',
            type: "warning",
            showCancelButton: "true",
            showConfirmButton: "true",
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            animation: "slide-from-top"
        }, function () {
            moriarty.doPost("/api/v1/act/define/delete", params, function (res) {
                if (res.result === "SUCCESS") {
                    showSuccessMessage("删除成功!");
                    $("#defineTable").DataTable().ajax.reload();
                } else {
                    console.log(res);
                    showErrorMessage("删除失败！");
                }
            });
        });
    };
    var actionDeploy = function (params) {
        swal({
            title: '',
            text: '确定部署此模型？',
            type: "warning",
            showCancelButton: "true",
            showConfirmButton: "true",
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            animation: "slide-from-top"
        }, function () {
            moriarty.doPost("/api/v1/act/define/deploy", params, function (res) {
                if (res.result === "SUCCESS") {
                    showSuccessMessage("部署成功!");
                } else {
                    console.log(res);
                    showErrorMessage("部署失败！");
                }
            });
        });
    };

    var actionStart = function (params) {
        swal({
            title: '',
            text: '确定启动流程？',
            type: "warning",
            showCancelButton: "true",
            showConfirmButton: "true",
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            animation: "slide-from-top"
        }, function () {
            moriarty.doPost("/api/v1/act/deployed/start", params, function (res) {
                if (res.result === "SUCCESS") {
                    showSuccessMessage("启动成功!");
                } else {
                    console.log(res);
                    showErrorMessage("启动失败！");
                }
            });
        });
    };
    var actionSubmit = function (params) {
        swal({
            title: '',
            text: '确定提交任务？',
            type: "warning",
            showCancelButton: "true",
            showConfirmButton: "true",
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            animation: "slide-from-top"
        }, function () {
            moriarty.doPost("/api/v1/act/task/submit", params, function (res) {
                if (res.result === "SUCCESS") {
                    showSuccessMessage("提交成功!");
                } else {
                    console.log(res);
                    showErrorMessage("提交失败！");
                }
            });
        });
    };
    window.act = act;
})();