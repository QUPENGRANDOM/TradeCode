/**
 * Created by bozhil on 2017/11/7.
 */
!(function () {
    var vsanHost = {};
    var maintenanceModeList = [];

    vsanHost.init = function () {
        maintenanceModeList = [];
        $("#hostList").DataTable({
            paging: true,
            processing: false,
            lengthChange: false,
            ordering: true,
            autoWidth: false,
            info: true,
            serverSide: false,
            fixedHeader: true,
            searching: true,
            order: [[1, "asc"]],
            aLengthMenu: [10],
            ajax: {
                url: "/api/v1/vsan/host?powerState=" + $("#powerState").text(),
                dataSrc: 'data'
            },
            columns: [
                {
                    data: 'unitType'
                },
                {
                    data: 'hostname',
                    render: function (data, type, full, meta) {
                        return '<a href="/vsan/host/overview?hostname=' + data + '&higherTitle=主机列表">' + data + '</a>';
                    }
                },
                {
                    data: 'powerState',
                    render: function (data, type, full, meta) {
                        if (full.maintenanceMode === true  && data === "poweredon"){
                            maintenanceModeList.push(full.maintenanceMode + "");
                            return '<div class="label label-warning">维护</div>';
                        } else if (data === "poweredoff") {
                            return '<div class="label label-inverse">关机</div>';
                        } else if (data === "poweredon") {
                            return '<div class="label label-success">运行中</div>';
                        } else if (data === "unknown") {
                            return '<div class="label label-danger">未知</div>';
                        } else if (data === "standby") {
                            return '<div class="label label-megna">待定</div>';
                        } else {
                            return data;
                        }
                        // switch (data) {
                        //     case "poweredon":
                        //         return '<div class="label label-success">运行中</div>';
                        //     case "poweredoff":
                        //         return '<div class="label label-danger">关机</div>';
                        //     case "standby":
                        //         return '<div class="label label-warning">待定</div>';
                        //     case "unknown":
                        //         return '<div class="label label-info">未知</div>';
                        //     case "maintenance":
                        //         return '<div class="label label-default">维护</div>';
                        //     default:
                        //         return data;
                        // }
                    }
                },
                {
                    data: 'cpuUsage',
                    render: function (data, type, full, meta) {
                        return data.toFixed(2);
                    }
                },
                {
                    data: 'memoryUsage',
                    render: function (data, type, full, meta) {
                        return data.toFixed(2);
                    }
                },
                {
                    data: 'actions',
                    render: function (data, type, full, meta) {
                        var $div = $('<div></div>');
                        if(full.taskName != "" && full.taskProgress != 0 ){
                            $progressBar = $('<div class="progressBar"></div>').append(
                                $('<div class="progress-bar progress-bar-striped active"></div>').attr("role", "progressbar").attr("aria-valuenow", "45").attr("aria-valuemin", "0")
                                    .attr("style", "width: 60%;").attr("aria-valuemax", "100").attr("style","width :"+full.taskProgress+"%").append(
                                    $('<span class="sr-only"></span>').text( full.taskProgress+"% Complete")
                                ));
                            $cancle = $('<span></span>').addClass("no").attr("onclick","vsanHost.cancelMaintenanceTask('"+full.hostname+"','"+full.taskName+"')");
                            $div.append($progressBar);
                            $div.append($cancle);
                            return $div.html();
                        }
                        return moriarty.actionToast("操作", data, {
                            "hostname": full.hostname,
                            "maintenanceMode": full.maintenanceMode
                        }, "vsanHost.chooseWay(this)");
                    }
                }
            ],
            language: {url: '/lang/datatable.chs.json'}
        });
    };

    vsanHost.chooseWay = function (_this) {
        var value = $(_this).data("id");
        var hostname = $(_this).data("params")["hostname"];
        var maintenanceMode = $(_this).data("params")["maintenanceMode"];
        var text = $(_this).find("span").text();
        if (value === 1) {
            if(maintenanceModeList.indexOf("true") != -1){
                setTimeout(" swal({title: \"只有一个主机可以进入维护模式\"}) ",1000);
                return;
            }
            moriarty.doGet("/api/v1/host/enterMaintenanceModebefore",{hostname:hostname},function (data) {
                //下面是对放回来的数据进行处理显示在页面上
                swal({
                    title: "",
                    text: "是否确认进入维护模式,并关闭该主机的下列虚拟机:" + data.data + "",
                    showCancelButton: true,
                    showConfirmButton: true,
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    animation: "slide-from-top",
                    closeOnConfirm:false
                }, function (datae) {//
                    if (!datae) {
                        return;
                    }
                    swal({
                        title: "确定要" + text + "?",
                        text: "维护模式：<select id='model'><option value='0'>临时停机维护</option><option value='1'>设备更换</option></select>",
                        html: true,
                        showCancelButton: true,
                        showConfirmButton: true,
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        animation: "slide-from-top"
                    }, function (data) {
                        if(!data) {
                            return
                        }
                        maintenanceMode = $("#model option:selected").val();
                        enterMaintenanceMode(hostname,maintenanceMode);
                    },true)
                })
            })
        } else {
            swal({
                title: "确定要执行" + text + "操作",
                text: "",
                showCancelButton: true,
                showConfirmButton: true,
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                animation: "slide-from-top"
            }, function (state) {
                if (!state) {
                    return;
                }
                if (value === 2) {
                    if (maintenanceMode === "false" || maintenanceMode === false) {
                        showErrorMessage("请先进入维护模式...");
                        return;
                    }
                    moriarty.doPost("/api/v1/host/powerOnHostTask", JSON.stringify({hostname: hostname}), function (res) {
                        if (res.result === "SUCCESS") {
                            showSuccessMessage("开启主机成功");
                            $('#hostList').DataTable().ajax.reload();
                        } else {
                            showErrorMessage(res.message);
                        }
                    }, true);
                } else if (value === 3) {
                    if (maintenanceMode === "false" || maintenanceMode === false) {
                        showErrorMessage("请先进入维护模式...");
                        return;
                    }
                    moriarty.doPost("/api/v1/host/rebootHostTask", JSON.stringify({hostname: hostname}), function (res) {
                        if (res.result === "SUCCESS") {
                            showSuccessMessage("重启主机成功");
                            $('#hostList').DataTable().ajax.reload();
                        } else {
                            showErrorMessage(res.message);
                        }
                    }, true);
                } else if (value === 4) {
                    if (maintenanceMode === "false" || maintenanceMode === false) {
                        showErrorMessage("请先进入维护模式...");
                        return;
                    }
                    moriarty.doPost("/api/v1/host/shutdownHostTask", JSON.stringify({hostname: hostname}), function (res) {
                        if (res.result === "SUCCESS") {
                            showSuccessMessage("停止主机成功");
                            $('#hostList').DataTable().ajax.reload();
                        } else {
                            showErrorMessage(res.message);
                        }
                    }, true);
                } else if (value === 5) {
                    moriarty.doPost("/api/v1/host/logout-maintenance-mode", JSON.stringify({hostname: hostname}), function (res) {
                        if (res.result === "SUCCESS") {
                            showSuccessMessage("退出维护模式成功");
                            $('#hostList').DataTable().ajax.reload();
                        } else {
                            showErrorMessage(res.message);
                        }
                    }, true);
                }
            })
        }

    };

    vsanHost.shutdownCluster = function () {
        swal({
            title: "确定要关闭集群？",
            text: "",
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            animation: "slide-from-top"
        }, function (state) {
            if (!state) {
                return;
            }
            moriarty.doPost("/api/v1/vsan/shutdownCluster", null, function (res) {
                if (res.result === "SUCCESS") {
                    showSuccessMessage("处理成功");
                } else {
                    $("#shutdownClusterProgress").modal("hide");
                    showErrorMessage("处理失败");
                }
            });

            $("#shutdownClusterProgress").modal("show");
            var int = setInterval(function (args) {
                moriarty.doGet("/api/v1/cluster/shutdown/progress",null,function (res) {
                    var progress = res.data;
                    if (progress !== undefined && progress !== null){
                        $("#shutdownClusterProgress .progress-bar").css("width",progress);
                        $("#shutdownClusterProgress .progress-percent").text(progress);
                    }
                    if (progress === "99%"){
                        clearInterval(int);
                    }
                })
            },1000);
        });

    };

    var enterMaintenanceMode = function(hostname,maintenanceMode){
        showInfoMessage("开始关闭虚拟机");
        moriarty.doPost("/api/v1/host/shutDownVMachine", JSON.stringify({hostname: hostname}), function (datatwo) {
            if (datatwo) {
                showInfoMessage("虚拟机关闭成功,等待进入维护模式");
                moriarty.doPost("/api/v1/host/enterMaintenanceMode", JSON.stringify({//关闭虚拟机并关闭主机
                    hostname: hostname,
                    maintenanceType: maintenanceMode
                }), function (rese) {
                    if (rese.result === "SUCCESS") {
                        var info = rese.data;
                        judgeState(rese.data['taskState'], "进入维护模式");
                    } else {
                        showErrorMessage(rese.message);
                    }
                    $('#hostList').DataTable().ajax.reload();
                })
            }
        },true)
    };
    vsanHost.cancelMaintenanceTask = function (hostname,taskName) {
        moriarty.doPost("/api/v1/host/cancelMaintenanceTask",JSON.stringify({hostname: hostname,taskName:taskName}),function (data) {
            if(data){
                showInfoMessage("取消维护模式成功");
            }else{
                showInfoMessage("取消维护模式失败");
            }
            $('#hostList').DataTable().ajax.reload();
        })

    };
    var judgeState = function (state, info) {
        if (state === "running") {
            showInfoMessage("正在" + info);
        } else if (state === "error") {
            showErrorMessage(info + "失败");
        } else if (state === "queued") {
            showInfoMessage("等待" + info);
        } else if (state === "success") {
            showSuccessMessage(info + "成功");
        }
    };
    window.vsanHost = vsanHost;
})();