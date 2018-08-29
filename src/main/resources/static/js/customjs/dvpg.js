/**
 * Created by pengq on 2017/5/22.
 */
!(function () {
    window.dvpg = {
        init: function () {
            $("#DVPGList").DataTable({
                paging: true,
                processing: false,
                lengthChange: false,
                ordering: true,
                autoWidth: false,
                info: true,
                serverSide: true,
                fixedHeader: true,
                searching: true,
                aLengthMenu: [10],
                ajax: {
                    url: '/api/v1/dvpg/list',
                    dataSrc: 'data'
                },
                columns: [
                    {
                        data: 'name'
                    },
                    {
                        data: 'vlanId'
                    },
                    {
                        data: 'allowActions',
                        render: function (data, type, full, meta) {
                            return moriarty.actionToast("操作", [{"id": 1, "name": "编辑"}, {"id": 2, "name": "删除"}],
                                {"name": full.name, "vlanId": full.vlanId}, "dvpg.action.chooseAction(this)");
                        }
                    }
                ],
                language: {url: '/lang/datatable.chs.json'}
            });

            $("#createDVPortSubmit").click(function () {
                createVlan();
            });

            $("#upDVPortSubmit").click(function () {
                updateVlan();
            });

            $("#createDVPGModal").on('shown.bs.modal', function () {
                moriarty.doGet("/api/v1/dc/names", null, function (result) {
                    if (result !== null) {
                        // $("#dcName").append($("<option></option>").attr("value", 0).text("--请选择--"));
                        var dcNames = result.data;
                        if (dcNames !== null || dcNames !== '') {
                            $("#dcName").val(dcNames[0]);
                            // $.each(dcNames, function (index, dcName) {
                            //     $("#dcName").append($("<option></option>").attr("value", dcName).text(dcName));
                            // })
                        }
                    } else {
                        // $("#dcName").append($("<option></option>").attr("value", 0).text("--请选择--"));
                        $("#dcName").val("无数据中心");
                    }
                });
            }).on('hidden.bs.modal', function () {
                $("#dcName").empty();
                $("#netName").val("");
                $("#createNetName").val("");
                $("#vlanId").val("");
                $("#zabbixIp").val("");
                $("#zabbixNetmask").val("");
                $("#zabbixGateway").val("");
                $("#zabbixDns").val("");
            });
        },
        action: {
            chooseAction: function (_this) {
                var params = $(_this).data("params");
                var index = $(_this).data("id");

                switch (index) {
                    case 1:
                        actionEdit(params);
                        break;
                    case 2:
                        actionDelete(params);
                        break;
                    default:
                        break;
                }
            },
            loadGroupByDcName: function (value) {
                if (parseInt(value) === 0) {
                    $("#groupLoading").removeClass("load");
                    $("#group").empty();
                    return;
                }
                $("#groupLoading").addClass("load");
                moriarty.doGet("/api/v1/dvpg/groups", {"dcName": value}, function (res) {
                    $("#group").empty();
                    $("#groupLoading").removeClass("load");
                    $("#group").append($("<option></option>").attr("value", 0).text("--请选择--"));
                    if (res.result === "SUCCESS") {
                        var groups = res.data;
                        $.each(groups, function (index, group) {
                            $("#group").append($("<option></option>").attr("value", group).text(groups));
                        })
                    }
                })
            }

        }
    };

    var actionEdit = function (params) {
        $("#upDVPortSubmit").attr("disabled", false);
        $('#updateDVPGModal').modal('show');
        $('#upNetName').val(params.name);
        $('#upVlanId').val(params.vlanId);
        $('#oldName').val(params.name);
    };

    var actionDelete = function (params) {
        swal({
            title: '',
            text: '确定删除此网络',
            type: "warning",
            showCancelButton: "true",
            showConfirmButton: "true",
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            animation: "slide-from-top"
        }, function () {
            $.ajax({
                type: "post",
                url: "/api/v1/dvpg/delete",
                data: params,
                success: function (data) {
                    if (data.result === "SUCCESS") {
                        swal("", "删除成功", "success");
                        var table = $('#DVPGList').DataTable();
                        table.ajax.reload();
                    } else {
                        swal("Error!", "", "error");
                    }
                },
                error: function (e) {
                    console.log(e);
                    swal("Error!", "", "error");
                }
            });
        });
    };

    var createVlan = function () {
        var ipReg = /^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}$/;

        $("#createNetNameError").addClass("hidden");
        $("#createVlanIdError").addClass("hidden");
        $("#zabbixIpError").addClass("hidden");
        $("#zabbixIpFormatError").addClass("hidden");
        $("#zabbixNetmaskError").addClass("hidden");
        $("#zabbixNetmaskFormatError").addClass("hidden");
        $("#zabbixGatewayError").addClass("hidden");
        $("#zabbixGatewayFormatError").addClass("hidden");
        $("#zabbixDnsError").addClass("hidden");
        $("#zabbixDnsFormatError").addClass("hidden");

        var name = $("#netName").val();
        var vlanId = $("#vlanId").val();
        var zabbixIp = $("#zabbixIp").val();
        var zabbixNetmask = $("#zabbixNetmask").val();
        var zabbixGateway = $("#zabbixGateway").val();
        var zabbixDns = $("#zabbixDns").val();
        // var dcName = $("#dcName option:selected").val();
        // var dcName = $("#dcName").val();
        // var dvpg = $("#group option:selected").val();
        if(name === null || name === undefined){
            $("#createNetNameError").removeClass("hidden");
            return;
        }
        if(vlanId === null || vlanId === undefined || vlanId <1 ||vlanId > 4094){
            $("#createVlanIdError").removeClass("hidden");
            return;
        }
        if(zabbixIp === null || zabbixIp === undefined || zabbixIp.trim() === ""){
            $("#zabbixIpError").removeClass("hidden");
            return;
        }
        if (zabbixNetmask === null || zabbixNetmask === undefined || zabbixNetmask.trim() === ""){
            $("#zabbixNetmaskError").removeClass("hidden");
            return;
        }
        if (zabbixGateway === null || zabbixGateway === undefined || zabbixGateway.trim() === ""){
            $("#zabbixGatewayError").removeClass("hidden");
            return;
        }
        if (zabbixDns === null || zabbixDns === undefined || zabbixDns.trim() === ""){
            $("#zabbixDnsError").removeClass("hidden");
            return;
        }

        var dnsArr = zabbixDns.split(",");
        if(!ipReg.test(zabbixIp)){
            $("#zabbixIpFormatError").removeClass("hidden");
            return;
        }
        if(!ipReg.test(zabbixNetmask)){
            $("#zabbixNetmaskFormatError").removeClass("hidden");
            return;
        }
        if (!ipReg.test(zabbixGateway)){
            $("#zabbixGatewayFormatError").removeClass("hidden");
            return;
        }
        for (var i=0;i<dnsArr.length;i++){
            if (!ipReg.test(dnsArr[i])){
                $("#zabbixDnsFormatError").removeClass("hidden");
                return;
            }
        }

        var param = {"name": name, "vlanId": vlanId, "zabbixIp": zabbixIp,"netmask":zabbixNetmask, "gateway":zabbixGateway,"dnsServers":zabbixDns};
        moriarty.doPost("/api/v1/dvpg/createNetwork", param, function (res) {
            if(res!==null && res.result==="SUCCESS"){
                swal("网络创建成功！","","success");
                $("#DVPGList").DataTable().ajax.reload();
                $("#createDVPGModal").modal("hide");
            }else{
                swal("网络创建失败！","","error");
                $("#createDVPGModal").modal("hide");
            }
        },true)
    };

    var updateVlan = function () {
        //todo 判断数据规则
        // todo 提示 是否继续
        var currentName = $("input[name='upNetName']").val();
        var originalName = $('#oldName').val();
        var vlanId = $("input[name='upVlanId']").val();
        var param = {"originalName": originalName, "vlanId": vlanId, "currentName": currentName};
        if(vlanId === null || vlanId === undefined || vlanId <1 ||vlanId > 4094){
            $("#vpVlanIdError").removeClass("hidden");
            return;
        }
        $("#vpVlanIdError").addClass("hidden");
        moriarty.doPost("/api/v1/dvpg/update", param, function (res) {
            //todo 提示
            if(res!==null && res.result==="SUCCESS"){
                swal("网络更新成功！","","success");
                $("#DVPGList").DataTable().ajax.reload();
            }else if(res.result === "ERROR_DVPG_UPDATE"){
                swal("网络信息未修改","网络信息未改变，网络未进行修改","warning");
            }else{
                swal("网络更新失败！","","error");
            }
            $("#updateDVPGModal").modal("hide");
        })
    };
})();