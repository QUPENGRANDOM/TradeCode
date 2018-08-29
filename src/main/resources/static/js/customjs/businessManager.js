/**
 * Created by Yipin on 2017/12/13.
 */
!(function () {
    var businessManager = {};

    /*
     * 0 关闭或开启 business zabbix trigger
     * 1 关闭或开启 host zabbix trigger
     * 2 关闭或开启 单个service trigger
     * */
    businessManager.businessOperation = function (status,businessName) {
        var state = "关闭";
        if(status === "stop"){
            state = "开启"
        }
        var type = status;
        if (status !== "stop"){
            type = "start";
        }
        showModal(state+"业务");
        $("#save").removeAttr("onclick").attr("onclick","businessManager.businessAction(\'"+businessName+"\',\'"+type+"\')");
    };

    businessManager.serviceOperation = function (_this,businessName) {
        var status = $(_this).data("params")["serviceStatus"];
        var serviceName = $(_this).data("params")["serviceName"];
        var hostName = $(_this).data("params")["hostName"];
        var state = "关闭";
        if(status === "1"){
            state = "开启";
        }
        showServiceModal(state);
        $("#save").removeAttr("onclick").attr("onclick","businessManager.serviceAction('"+hostName+"','"+status+"','"+serviceName+"','"+businessName+"')");
    };

    businessManager.init = function (poolName) {
        initDataTable(poolName);
    };

    businessManager.editVmOrder = function (vmName) {
        var order = $(".order").val();
        if(order === ""){
            showErrorMessage("请输入数字");
            return;
        }
        if(isNaN(order)){
            showErrorMessage("请输入数字");
            return;
        }
        businessManager.removeModal();
        showSuccessMessage("修改成功");
    };

    businessManager.businessAction = function (businessName,status) {
        businessManager.removeModal();
        var state = "stop";
        if (status === "stop"){
            state = "start";
        }
        moriarty.doGet("/api/v1/ansible/operation",{"businessName":businessName,"status":state},function (res) {
            var state = "开启";
            if (status === "start"){
                state = "关闭";
            }
            if (res.result === "SUCCESS"){
                var data = res.data;
                var failedResult = data["failedResult"];
                var ips = "";
                if(failedResult.length > 0){
                    $.each(failedResult,function (index,item) {
                        if (ips !== ""){
                            ips = ips + ";";
                        }
                        ips = ips + item;
                    });
                    showErrorMessage(ips+state+"业务失败");
                    return;
                }
                var successResult = data["successResult"];
                $.each(successResult,function (index,item) {
                    if (ips !== ""){
                        ips = ips + ";";
                    }
                    ips = ips + item;
                });
                showSuccessMessage(ips + state+"业务成功");
                /*getStatus(businessName);*/
                setTimeout(function () {
                    window.location.reload();
                },4000);
            }else {
                showErrorMessage(state+"业务失败");
            }
        },true);
    };

    businessManager.vmAction = function (_this) {
        var value = $(_this).data("id");
        var vmName = $(_this).data("params")["displayName"];
        var vmIp = $(_this).data("params")["ip"];
        if(parseInt(value) === 0){
            return;
        }
        switch (parseInt(value)){
            case 1:
                showModal("启动虚拟机?");
                $("#save").removeAttr("onclick").attr("onclick","businessManager.vmOperation('/api/v1/vm/poweron', \'"+vmName+"\',\'"+vmIp+"\','open')");
                break;
            case 2:
                showModal("关闭虚拟机?");
                $("#save").removeAttr("onclick").attr("onclick","businessManager.vmOperation('/api/v1/vm/shutdown', \'"+vmName+"\',\'"+vmIp+"\','down')");
                break;
            case 3:
                showModal("强制关闭虚拟机?");
                $("#save").removeAttr("onclick").attr("onclick","businessManager.vmOperation('/api/v1/vm/poweroff', \'"+vmName+"\',\'"+vmIp+"\','down')");
                break;
            case 9:
                showEditModal("修改虚拟机开机顺序");
                $("#save").removeAttr("onclick").attr("onclick","businessManager.editVmOrder(\'"+vmName+"\')");
                break;
            default:
                break;

        }
    };

    businessManager.serviceAction = function (hostName,status,serviceName,businessName) {
        businessManager.removeModal();
        var state = "stop";
        if(status === "1"){
            state = "start";
        }
        var params = {"businessName":businessName,"serviceName":serviceName,"status":state,"hostName":hostName};
        moriarty.doGet("/api/v1/service/ansible/operation", params, function (res) {
            if(res !== null){
                if(res.result === "SUCCESS"){
                    showSuccessMessage("操作成功");
                    setTimeout(function () {
                        window.location.reload();
                    },4000);
                }else{
                    showErrorMessage("操作失败");
                }
            }else {
                showErrorMessage("操作失败");
            }
        },true);
    };

    businessManager.removeModal = function () {
        $(".businessModal").remove();
        $(".modal-backdrop").remove();
    };

    var initDataTable = function (poolName) {
        getStatus(poolName);
        $("#VMList").DataTable({
            paging: true,
            processing: false,
            lengthChange: false,
            ordering: false,
            autoWidth: true,
            info: true,
            serverSide: false,
            fixedHeader: true,
            searching: false,
            aLengthMenu: [5],
            ajax: {
                url: "/api/v1/vm/getVmByResourcePool?poolName="+poolName,
                dataSrc: 'data'
            },
            columns: [
                {
                    data: 'displayName',
                    render: function (data, type, full, meta) {
                        return '<a href="/single/vm/overview?vmName=' + data + '&higherTitle=业务管理">' + data + '</a>'
                    }
                },
                {
                    data: 'hostName'
                },
                {
                    data: 'ipAddress'
                },
                {
                    data: 'cpu'
                },
                {
                    data: 'memory',
                    render: function (data, type, full, meta) {

                        return (data / 1024).toFixed(2);
                    }
                },
                {
                    data: 'status',
                    render: function (data, type, full, meta) {
                        if (data === "POWERED_OFF") {
                            return '<div class="label label-inverse">未运行</div>';
                        } else if (data === "POWERED_ON") {
                            return '<div class="label label-success">运行中</div>';
                        } else if (data === "SUSPENDED") {
                            return '<div class="label label-warning">已挂起</div>';
                        } else {
                            return data;
                        }
                    }
                },
                {
                    data: 'allowActions',
                    render: function (data, type, full, meta) {
                        return moriarty.actionToast("操作", data, {"displayName": full.displayName,"ip":full.ipAddress}, "businessManager.vmAction(this)");
                    }
                }
            ],
            language: {url: '/lang/datatable.chs.json'}
        });

        $("#serviceList").DataTable({
            paging: true,
            processing: false,
            lengthChange: false,
            ordering: false,
            autoWidth: true,
            info: true,
            serverSide: false,
            fixedHeader: true,
            searching: false,
            aLengthMenu: [5],
            ajax: {
                url: "/api/v1/monitor/businessServiceList?businessName="+poolName,
                dataSrc: 'data'
            },
            columns: [
                {
                    data: 'serviceName'
                },
                {
                    data: 'hostName',
                    render: function (data, type, full, meta) {
                        return '<a href="/monitor/vmInfo?businessName='+poolName+'&vmName='+data+'">' + data + '</a>'
                    }
                },
                {
                    data: 'serviceStatus',
                    render:function (data,type,full,meta) {
                        if(data === "1"){
                            return "已停止";
                        }
                        return "正常";
                    }
                },
                {
                    data: 'serviceStatus',
                    render: function (data, type, full, meta) {
                        var operation = [];
                        if(data === "0"){
                            operation.push({"id":1,"name":"关闭"});
                        }else{
                            operation.push({"id":1,"name":"启动"});
                        }
                        return moriarty.actionToast("操作", operation,full,"businessManager.serviceOperation(this,'"+poolName+"')");
                    }
                }
            ],
            language: {url: '/lang/datatable.chs.json'}
        });
    };

    var getStatus = function (businessName) {
        moriarty.doGet("/api/v1/monitor/serviceSumStatus", {businessName:businessName}, function (res) {
            if(res !== null){
                var result = res.result;
                if(result === "ERROR_NOT_MONITOR"){
                    $(".info-body").append($("<div style='margin: 0 10px 10px;'>该机器暂未被监控！</div>"));
                    return
                }
                if(result === "SUCCESS"){
                    var data = res.data;
                    var businessStatus = data.businessInfo.status;
                    var $businessStatus = $("<img style='width:20px;margin:0 10px'>");
                    var $businessStatusInfo = $("<span></span>");
                    $(".business-operation").children("scan").text("关闭业务");
                    if(businessStatus === "stop"){
                        $businessStatus.attr("src","/images/stop.png");
                        $businessStatusInfo.text("已停止");
                        $(".business-operation").children("scan").text("开启业务");
                    }else if(businessStatus === "normal"){
                        $businessStatus.attr("src","/images/normal.png");
                        $businessStatusInfo.text("正常");
                    }else if(businessStatus === "warning"){
                        $businessStatus.attr("src","/images/warning.png");
                        $businessStatusInfo.text("警告");
                    }else {
                        $businessStatus.attr("src","/images/error.png");
                        $businessStatusInfo.text("错误");
                    }
                    $(".business-operation").parent().css("display","block");
                    $(".business-operation").attr("onclick","businessManager.businessOperation(\'"+businessStatus+"\',\'"+businessName+"\')");
                    $(".info-body").append($("<div class='row' style='margin:0 10px 10px'><b>业务状态：</b></div>").append($businessStatus).append($businessStatusInfo));

                }else {
                    showErrorMessage("服务异常！");
                }
            }
        })
    };

    var showModal = function (state) {
        $("body").append($("#modal").html());
        $(".businessModal .modal-title").text(state);
      /*  $(".businessModal .modal-body").append("<div class='row' style='margin-bottom:5px;margin-left:1px'>" +
            "<b>请选择开启/关闭对应的监控触发器</b></div>" +
            "<div class='row'>" +
            "<div class='col-md-3' style='padding-top:8px'><label>监控触发器状态</label></div>" +
            "<div class='col-md-9'>" +
            "<select class='form-control trigger-status'>" +
            "<option value='0'>开启</option>" +
            "<option value='1'>关闭</option>" +
            "</select></div></div>");*/
        $(".businessModal .modal-body").append("确认要"+state);
        $("#cancel").attr("onclick","businessManager.removeModal()");
        $(".businessModal").modal("show");
    };

    var vmDownRequest = function (url, vmName) {
        moriarty.doPost(url, {vmName: vmName}, function (result) {
            if (result.result === "SUCCESS") {
                $("#VMList").DataTable().ajax.reload(null, false);
                $("#serviceList").DataTable().ajax.reload(null, false);
                swal({
                        title: "操作成功",
                        text: "",
                        type: "success",
                        showCancelButton: false,
                        confirmButtonText: "Ok!",
                        closeOnConfirm: false
                    },
                    function () {
                        swal.close();
                    });
            } else {
                swal("操作失败", "", "error");
            }
        }, true);
    };

    var vmOpenRequest = function (url,vmName,status) {
        moriarty.doPost(url, {vmName: vmName}, function (result) {
            if(result.result === "SUCCESS"){
                setTimeout(function () {
                    getVmSummary(vmName,status);
                },10000);
            }
        }, true);
    };

    var vmTriggerMaintenance = function (status,vmIp) {
        setTimeout(function () {
            $("#VMList").DataTable().ajax.reload(null, false);
            $("#serviceList").DataTable().ajax.reload(null, false);
        },10000);

        if(status === "0"){
            ////todo vm exit maintenance
        }else{
            ////todo vm join maintenance
        }
    };

    var getVmSummary = function (vmName,status) {
        moriarty.doGet("/api/v1/vm/summary",{vmName:vmName},function (res) {
            if(res.result === "SUCCESS"){
                var data = res.data;
                var vmIp = data.ipAddress;
                vmTriggerMaintenance(status,vmIp);
            }else{
                showErrorMessage("开机失败");
            }
        })
    };

    var showEditModal = function (vmName) {
        $("body").append($("#modal").html());
        $(".businessModal .modal-title").text("修改虚拟机开机顺序");
        $(".businessModal .modal-body")
            .append($("<div class='row'></div>")
                .append($("<div class='col-md-4'><label style='padding-top:8px'>请输入虚拟机开机顺序：</label></div>"))
                .append($("<div class='col-md-6'><input class='form-control order' type='text'></div>")).append($("<div></div>").addClass("col-md-12").css({"margin-top":"5px","font-size":"12px","color":"#afabab"}).text("虚拟机开机顺序是：该虚拟机在当前业务下所有虚拟机中的启动顺序。")));
        $("#cancel").attr("onclick","businessManager.removeModal()");
        $(".businessModal").modal("show");
    };

    var showServiceModal = function (state) {
        $("body").append($("#modal").html());
        $(".businessModal .modal-title").text(state+"服务");
        $(".businessModal .modal-body").text("确定要"+state+"服务?");
        $("#cancel").attr("onclick","businessManager.removeModal()");
        $(".businessModal").modal("show");
    };

    businessManager.vmOperation = function (url,vmName,vmIp,type) {
        var status = $(".trigger-status").val();
        businessManager.removeModal();
        if(type === "open"){
            vmOpenRequest(url, vmName);
        }else {
            vmTriggerMaintenance(status,vmIp);
            vmDownRequest(url, vmName);
        }
    };

    window.businessManager = businessManager;
})();