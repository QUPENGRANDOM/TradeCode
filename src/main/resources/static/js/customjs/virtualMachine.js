/**
 * Created by pengq on 2017/5/22.
 */
!(function () {
    window.virtualMachine = {
        cacheNetwork: null,
        cacheNetworkEdit: null,
        init: function (getVmListUrl) {
            $(".m-t-10 .input-group-btn a").click(function () {
                if ($(this).hasClass("selector"))
                    return;
                $(".m-t-10 .input-group-btn a").removeClass("selector");
                $(this).addClass("selector");
                $(this).parent().parent().prev().find("span:first").text($(this).text());
            });

            $("#VMList").DataTable({
                paging: true,
                processing: false,
                lengthChange: false,
                ordering: false,
                autoWidth: false,
                info: true,
                serverSide: true,
                fixedHeader: true,
                searching: true,
                aLengthMenu: [10],
                rowsGroup: [0],
                destroy: true,
                ajax: {
                    url: getVmListUrl,
                    dataSrc: 'data'
                },
                columns: [
                    {
                        data: 'resourcePoolName',
                        render: function (data, type, full, meta) {
                            if(data === 'Resources'){
                                return '未分组'
                            }else{
                                return data
                            }

                        }
                    },
                    {
                        data: 'displayName',
                        render: function (data, type, full, meta) {
                            return '<a href="/single/vm/overview?vmName=' + data + '&higherTitle=虚拟机管理">' + data + '</a>'
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
                            return moriarty.actionToast("操作", data, {"displayName": full.displayName}, "virtualMachine.action.chooseAction(this)");
                        }
                    }
                ],
                language: {url: '/lang/datatable.chs.json'}
            });

            $("#createVMModal").on('shown.bs.modal', function () {
                $('#treeview4').addClass("load");
                moriarty.doGet("/api/v1/vm/loadDCAndStorage", null, function (result) {
                    $('#treeview4').removeClass("load");
                    $("#storageStrategies").append($("<option></option>").attr("value", 0).text("--请选择--"));
                    var dcName = result.dcNames;
                    if (dcName !== null && dcName !== '' && dcName !== undefined) {
                        $("#dataCanter").val(dcName);
                    }

                    var clusterAndHostNames = result.clusterAndHostNames;

                    $('#treeview4').treeview({
                        color: "#428bca",
                        selectedBackColor: "#03a9f3",
                        onhoverColor: "rgba(0, 0, 0, 0.05)",
                        expandIcon: 'ti-plus',
                        collapseIcon: 'ti-minus',
                        nodeIcon: 'fa fa-folder',
                        data: clusterAndHostNames
                    });

                    var storageStrategies = result.storageStrategies;
                    if (storageStrategies !== null && storageStrategies !== '' && storageStrategies !== undefined) {
                        $.each(storageStrategies, function (index, storageStrategy) {
                            $("#storageStrategies").append($("<option></option>").attr("value", storageStrategy.uniqueId).text(storageStrategy.name));
                        })
                    }
                    var cpuMin = result.cpuMin, cpuMax = result.cpuMax;
                    for (var i = cpuMin; i < cpuMax + 1; i++) {
                        $("#cpu").append($("<option></option>").attr("value", i).text(i));
                    }
                });
            }).on('hidden.bs.modal', function () {
                $("#host").empty();
                $("#vmname").val("");
                $("#dataCanter").val("");
                $("#cluster").empty();
                $("#storageStrategies").empty();
                $("#storage").empty();
                $("#guestos").empty();
                $("#ISO").empty();
                $("#cpu").empty();
                $("#memory").val("");
                $("#createVMModal .m-t-10 .input-group-btn a").removeClass("selector");
                $("#createVMModal .m-t-10 .input-group-btn a:first").addClass("selector");
                $("#memoryUnits").text("MB");
                $("#exampleBasic .disk-group:first input").val("");
                $("#exampleBasic .network-group:first select").empty();
                $("#exampleBasic .disk-group").not(':first').remove();
                $("#exampleBasic .network-group").not(':first').remove();
                $("#treeview4").html("");
                $("#exampleBasic").wizard('goTo', 0);
                allowFinish = true;
            });

            $("#createVMFromTemplateModal").on('shown.bs.modal', function () {
                moriarty.doGet("/api/v1/vm/templates", null, function (result) {
                    if (result===null||result===undefined){
                        toastr.warning("请求超时","注意");
                        return;
                    }
                    $("#cloneDC").val(result.dcName);

                    $("#cloneTemplate").append($("<option></option>").attr("value","").text("--请选择--"));

                    var templates = result.data;

                    if (templates !== null && templates !== '' && templates !== undefined) {
                        $.each(templates, function (index, template) {
                            $("#cloneTemplate").append($("<option></option>").attr("value", template).text(template));
                        })
                    }
                });
            }).on('hidden.bs.modal', function () {
                $("#cloneVMName").val("");
                $("#cloneDC").val("");
                $("#cloneTemplate").empty();
            });


            $("#cloneVMSubmit").click(function () {
                var vmName =  $("#cloneVMName").val();
                if (vmName===null||vmName===undefined||vmName===""){
                    toastr.warning("请输入虚拟机名！","注意");
                    return;
                }

                var templateName = $("#cloneTemplate option:selected").val();

                if (templateName===null||templateName===undefined||templateName===""){
                    toastr.warning("请选择模板！","注意");
                    return;
                }

                moriarty.doPost("/api/v1/vm/clone",{vmName:vmName,templateName:templateName},function (res) {
                    if (res===null||res===undefined){
                        toastr.warning("请求超时","注意");
                        return;
                    }

                    var result = res.data;
                    if (result.result==="SUCCESS"){
                        toastr.success("创建成功！","恭喜");
                        $("#createVMFromTemplateModal").modal('hide');
                        $("#VMList").DataTable().ajax.reload();
                    }else {
                        toastr.warning(result.message ,"失败");
                    }
                },true)
            });

            $("#updateVMModal").on('hidden.bs.modal', function () {
                $("#editVMName").val("");
                $("#editOldIso").val("");
                $("#EditCPU").empty();
                $("#EditMem").val("");
                $("#EditMem").next().find("span:first").text("GB");
                $("#EditMem").next().find("ul a").removeClass("selector");
                $("#EditMem").next().find("ul a:last").addClass("selector");
                $("#hardDiskArea").remove();
                $("#networkArea").remove();
                $("#editIso").html("");
            });


            $('#createDVPGModal').on('hidden.bs.modal', function (e) {
                $("#createVMModal").removeClass("out");
                $("#createVMModal").addClass("in");
                $("body").addClass("modal-open");
                $("#netName").val("");
                $("#vlanId").val("");
            });

            var allowFinish;
            $('#exampleBasic').wizard({
                onInit: function () {
                    console.log('init');
                    allowFinish = true;
                },
                onNext: function (e) {
                    switch (e.index) {
                        case 0:
                            var dcName = $("#dataCanter").val();
                            var clusterName = getCurrentClusterOrHost().cluster;
                            if (dcName === "" || dcName === undefined) {
                                dcName = null;
                            }
                            if (clusterName === "" || clusterName === undefined) {
                                clusterName = null;
                            }
                            moriarty.doGet("/api/v1/vm/guestos", {
                                dcName: dcName,
                                clusterName: clusterName
                            }, function (res) {
                                $("#guestos").empty();
                                $("#guestos").append($("<option></option>").attr("value", 0).text("--请选择--"));
                                var guestOsList = res.data;
                                if (guestOsList !== null && guestOsList !== undefined) {
                                    $.each(guestOsList, function (index, guestOs) {
                                        $("#guestos").append($("<option></option>").attr("value", guestOs["id"]).text(guestOs["fullName"]));
                                    })
                                }
                            });

                            moriarty.doGet("/api/v1/iso/list", {
                                dcName: dcName
                            }, function (res) {
                                $("#ISO").empty();
                                if (res === null) {
                                    return;
                                }
                                $("#ISO").append($("<option></option>").attr("value", 0).text("--请选择--"));
                                var isoList = res.data;
                                if (isoList !== null && isoList !== undefined) {
                                    $.each(isoList, function (index, iso) {
                                        $("#ISO").append($("<option></option>").attr("value", iso.name).text(iso.name));
                                    })
                                }
                            });
                            break;
                        case 1:
                            if ($("#select_network option").length === 0) {
                                $("#networkLoading").addClass("load");
                                moriarty.doGet("/api/v1/dvpg/all", null, function (res) {
                                    if (res === null) {
                                        $("#networkLoading").removeClass("load");
                                        toastr.error("请求超时", "注意");
                                        return;
                                    }
                                    virtualMachine.cacheNetwork = res.data;
                                    $("#select_network").empty();
                                    $("#networkLoading").removeClass("load");
                                    $("#select_network").append($("<option></option>").attr("value", 0).text("--请选择--"));
                                    if (res.result === "SUCCESS") {
                                        var networks = res.data;
                                        $.each(networks, function (index, network) {
                                            $("#select_network").append($("<option></option>").attr("value", network.name).text(network.name));
                                        })
                                    } else {
                                        toastr.warning("参数错误", "注意");
                                    }
                                });
                            }
                            break;
                        case 2:
                            $("#mainTable").html("");
                            var name = {
                                displayName: "虚拟机名称",
                                dataCanterName: "数据中心",
                                clusterName: "集群",
                                hostName: "主机",
                                pbmProfileName: "存储策略",
                                dataStoreName: "存储",
                                guestOsId: "操作系统",
                                hardDiskSizes: "硬盘",
                                cpu: "CPU",
                                memory: "内存",
                                network: "网络",
                                iso: "ISO"
                            };
                            var vm = buildDataForCreate();
                            var $tbody = $("<tbody></tbody>");
                            for (var result in name) {
                                if (result === "hardDiskSizes") {
                                    $.each(vm[result], function (index, o) {
                                        $tbody.append($("<tr></tr>").append(
                                            $("<td></td>").text(name[result] + (index + 1))).append(
                                            $("<td></td>").text(o["size"] / 1024 + " GB")))
                                    })
                                } else if (result === "network") {
                                    $.each(vm[result], function (index, o) {
                                        $tbody.append($("<tr></tr>").append(
                                            $("<td></td>").text(name[result] + (index + 1))).append(
                                            $("<td></td>").text(o["name"])))
                                    })
                                } else {
                                    var $secondTd;
                                    var $tr = $("<tr></tr>").append($("<td></td>").text(name[result]));
                                    if (result === "memory") {
                                        $secondTd = $("<td></td>").text(vm[result] + " " + vm["memoryUnits"]);
                                    } else if (result === "pbmProfileName") {
                                        $secondTd = $("<td></td>").text(vm["pbmProfileDisName"]);
                                    } else if (result === "guestOsId") {
                                        $secondTd = $("<td></td>").text(vm["guestOsName"]);
                                    }
                                    else {
                                        $secondTd = $("<td></td>").text(vm[result] === null || vm[result] === undefined || vm[result].trim() === "" ? "无" : vm[result]);
                                    }

                                    $tbody.append($tr.append($secondTd));
                                }
                            }
                            $("#mainTable").append($tbody);
                            break;
                        default :
                            console.log(e.index);
                            break;
                    }
                },
                onBack: function () {
                    console.log('back');
                },
                onReset: function () {
                    console.log('reset');
                },
                validator: function (e) {
                    console.log('validator');
                    switch (e.index) {
                        case 0:
                            console.log(e.index);
                            var vmName = $("#vmname").val();
                            var reg = /^[a-zA-Z0-9_-]{1,16}$/;

                            if (vmName === null || vmName.trim() === "") {
                                toastr.warning("请输入名称", "注意");
                                $("#vmname").val("").focus();
                                return false;
                            }

                            if (!reg.test(vmName)) {
                                toastr.warning("名称只能包含字母，数字，下划线，减号", "注意");
                                $("#vmname").val("").focus();
                                return false;
                            }


                            var hostOrCluster = $("#treeview4 ul").find(".node-selected");
                            if (hostOrCluster === undefined || hostOrCluster.length === 0) {
                                toastr.warning("请选择集群或主机", "注意");
                                return false;
                            }
                            break;
                        case 1:
                            var storageStrategies = $("#storageStrategies option:selected").val();
                            if (storageStrategies === null || storageStrategies.trim() === "" || storageStrategies === 0 || storageStrategies === "0") {
                                toastr.warning("请选择存储策略", "注意");
                                return false;
                            }

                            var storage = $("#storage option:selected").val();
                            if (storage === null || storage.trim() === "" || storage === 0 || storage === "0") {
                                toastr.warning("请选择storage", "注意");
                                return false;
                            }

                            var guestos = $("#guestos option:selected").val();
                            if (guestos === null || guestos.trim() === "" || guestos === 0 || guestos === "0") {
                                toastr.warning("请选择Guest OS", "注意");
                                return false;
                            }
                            break;
                        case 2:
                            var memory = $("#memory").val();
                            if (memory === null || memory.trim() === "" || memory === undefined) {
                                toastr.warning("请填写内存大小", "注意");
                                return false;
                            }

                            if (isNaN(memory)) {
                                toastr.warning("请填写数字", "注意");
                                return false;
                            }

                            var disks = [];
                            var diskInputs = $(".disk-group input");
                            if (diskInputs.length>15){
                                toastr.warning("最多能添加15块硬盘", "注意");
                                return false;
                            }
                            $.each(diskInputs, function (index, diskInput) {
                                var oneOfDisk = $(diskInput).val();
                                if (oneOfDisk !== null && oneOfDisk.trim() !== "" && oneOfDisk !== undefined && !isNaN(oneOfDisk)) {
                                    disks.push(oneOfDisk);
                                }
                            });

                            if (disks.length === 0) {
                                toastr.warning("请填写正确的硬盘大小", "注意");
                                return false;
                            }
                            var dvps = [];
                            var netWorks = $(".network-group select");
                            $.each(netWorks, function (index, netWorksSelect) {
                                var oneOfNetwork = $(netWorksSelect).val();
                                if (oneOfNetwork !== null && oneOfNetwork.trim() !== "" && oneOfNetwork !== undefined && oneOfNetwork !== 0 && oneOfNetwork !== '0') {
                                    dvps.push(dvps);
                                }
                            });

                            if (dvps.length === 0) {
                                toastr.warning("请填写选择网络", "注意");
                                return false;
                            }
                            break;
                        case 3:
                            console.log(e.index);
                            break;
                        case 4:
                            console.log(e.index);
                            break;
                    }

                    return true;
                },
                onFinish: function () {
                    console.log(allowFinish);
                    if (allowFinish) {
                        allowFinish = false;
                        var vm = buildDataForCreate();
                        if (vm.memoryUnits === "GB") {
                            vm["memory"] = vm.memory * 1024;
                        }
                        delete  vm.memoryUnits;
                        delete  vm.pbmProfileDisName;
                        console.log(vm);
                        moriarty.doPost("/api/v1/vm/add", JSON.stringify(vm), function (res) {
                            if (res["result"] === "SUCCESS") {
                                allowFinish = true;
                                $("#createVMModal").modal('hide');
                                toastr.success("正在创建中，请稍后...");

                                window.waitTask.showToast(res.data.task.value, function () {
                                    $("#VMList").DataTable().ajax.reload();
                                });
                            } else {
                                allowFinish = true;
                                toastr.warning(res["message"], "注意");
                            }
                        }, true);
                    }
                }
            });

            $("#editVMSubmit").click(function () {

                var data = getEditData();
                console.log(data);

                if (typeof (data) === "string" && data.split(":")[0] === "error") {
                    toastr.warning(data.split(":")[1], "注意");

                    return;
                }

                moriarty.doPost("/api/v1/vm/update", JSON.stringify(data), function (res) {
                    if (res.result === "ERROR_NAME_EXISTED") {
                        toastr.warning("该虚拟机名称已被占用!", "警告");
                        return;
                    }
                    if(res.result === "SUCCESS"){
                        toastr.success("修改成功", "恭喜");
                        $("#updateVMModal").modal("hide");
                        $("#VMList").DataTable().ajax.reload();
                    }else {
                        toastr.info("虚拟机修改失败","抱歉");
                    }

                }, true);
                console.log(data);
            });

            $("#createDVPortSubmit").click(function () {
                createVlan();
            });
        },
        action: {
            loadClusterNameByDCName: function (value) {
                if (parseInt(value) === 0) {
                    $("#host").empty();
                    $("#cluster").empty();
                    return;
                }
                loadClusterNames(value);
            },
            loadHostNameByClusterName: function (value) {
                if (parseInt(value) === 0) {
                    $("#host").empty();
                    return;
                }
                loadHostNames(value);
            },
            loadStorageNameById: function (value) {
                if (parseInt(value) === 0) {
                    $("#storageLoading").removeClass("load");
                    $("#storage").empty();
                    return;
                }
                loadStorageId(value);
            },
            chooseAction: function (_this) {
                var value = $(_this).data("id");
                var vmName = $(_this).data("params")["displayName"];
                if (parseInt(value) === 0) {
                    return;
                }
                console.log("type" + typeof(value));
                console.log(value + "：" + vmName);
                switch (parseInt(value)) {
                    case 1:
                        vmAction("/api/v1/vm/poweron", vmName, "启动");
                        break;
                    case 2:
                        vmAction("/api/v1/vm/shutdown", vmName, "关闭");
                        break;
                    case 3:
                        vmAction("/api/v1/vm/poweroff", vmName, "强制关闭");
                        break;
                    case 4:
                        vmAction("/api/v1/vm/reset", vmName, "重启");
                        break;
                    case 5:
                        vmAction("/api/v1/vm/destroy", vmName, "销毁");
                        break;
                    case 6:
                        vmAction(null, vmName);// 编辑
                        break;
                    case 7:
                        vmAction("/api/v1/vm/suspend", vmName, "挂起");
                        break;
                    case 8:
                        window.open("/vm/console?vmName=" + vmName);//console
                        break;
                    default:
                        break;
                }
            },
            addDiskForCreate: function () {
                var $div = $("<div></div>").addClass("form-group disk-group");
                var $title = $("<label></label>").addClass("col-sm-3 control-label").text("新硬盘：");
                var $body = $("<div></div>").addClass("col-sm-9 show-times").append(
                    $('<div></div>').addClass("input-group m-t-10").append(
                        $('<input>').addClass("form-control").attr({type: "text"})).append(
                        $('<span>GB</span>').addClass("input-group-addon").attr("style", "padding: 0 25px;"))).append(
                    $('<a><i class="ti-close text-danger"></i></a>').addClass("show-no").attr({
                        href: "javascript:;",
                        onclick: 'virtualMachine.action.removeDiskForCreate(this)'
                    })
                );
                $(".disk-group").last().after($div.append($title).append($body));
            },
            addNetworkForCreate: function () {
                var $div = $("<div></div>").addClass("form-group network-group");
                var $title = $("<label></label>").addClass("col-sm-3 control-label").text("网络：");
                var $body = $("<div></div>").addClass("col-sm-9 show-times").append(
                    $('<select></select>').addClass("form-control")).append(
                    $('<a><i class="ti-close text-danger"></i></a>').addClass("show-no").attr({
                        href: "javascript:;",
                        onclick: 'virtualMachine.action.removeNetworkForCreate(this)'
                    })
                );

                if (virtualMachine.cacheNetwork !== null) {
                    $body.find("select").append($("<option></option>").attr("value", 0).text("--请选择--"));

                    var networks = virtualMachine.cacheNetwork;
                    $.each(networks, function (index, network) {
                        $body.find("select").append($("<option></option>").attr("value", network.name).text(network.name));
                    })
                } else {
                    moriarty.doGet("/api/v1/dvpg/all", null, function (res) {
                        if (res === null) {
                            toastr.error("请求超时", "注意");
                            return;
                        }
                        virtualMachine.cacheNetwork = res.data;
                        $body.find("select").append($("<option></option>").attr("value", 0).text("--请选择--"));
                        if (res.result === "SUCCESS") {
                            var networks = res.data;
                            $.each(networks, function (index, network) {
                                $body.find("select").append($("<option></option>").attr("value", network.name).text(network.name));
                            })
                        }
                    });
                }
                $(".network-group").last().after($div.append($title).append($body));
            },
            removeDiskForCreate: function (_this) {
                $(_this).parent().parent().remove();
            },
            removeNetworkForCreate: function (_this) {
                $(_this).parent().parent().remove();
            },
            removeDiskForEdit: function (_this) {
                $(_this).parent().parent().remove();
            },
            removeORReplayDiskForEdit: function (_this) {
                if ($(_this).hasClass("show-replay")) {
                    $(_this).removeClass("show-replay");
                    $(_this).parent().parent().removeClass("edit-vm-remove");
                    $(_this).parent().parent().addClass("edit-vm-edit");
                    $(_this).addClass("show-no");
                    $(_this).find("i").removeClass("fa fa-mail-reply text-success");
                    $(_this).find("i").addClass("ti-close text-danger");
                    $(_this).next().addClass("hidden");
                    $(_this).prev().removeClass("hidden");
                } else if ($(_this).hasClass("show-no")) {
                    $(_this).removeClass("show-no");
                    $(_this).addClass("show-replay");
                    $(_this).parent().parent().removeClass("edit-vm-edit");
                    $(_this).parent().parent().addClass("edit-vm-remove");
                    $(_this).find("i").removeClass("ti-close text-danger");
                    $(_this).find("i").addClass("fa fa-mail-reply text-success");
                    $(_this).prev().addClass("hidden");
                    $(_this).after($("<div></div>").attr("style", "width: 100%;text-align: center;line-height: 2.5;background-color: #d8d8d8;").text("此设备将被删除"));
                }
            },
            addDiskForEdit: function () {
                var $diskGroup = $("<div></div>").addClass("form-group edit-vm-add").append(
                    $("<label></label>").addClass("col-sm-2 control-label").text("*新硬盘：")).append(
                    $("<div></div>").addClass("col-sm-10 show-times").append(
                        $("<div></div>").addClass("input-group m-t-10").append(
                            $("<input>").addClass("form-control").attr({
                                type: "text"
                            })).append(
                            $("<span></span>").addClass("input-group-addon").attr({style: "padding: 0 24px;"}).text("GB"))).append(
                        $('<a class="show-no" href="javascript:;" onclick="virtualMachine.action.removeDiskForEdit(this)"><i class="ti-close text-danger"></i></a>'))
                );
                if ($("#hardDiskArea .form-group:last").length === 0) {
                    $("#hardDiskArea").append($diskGroup);
                } else {
                    $("#hardDiskArea .form-group:last").after($diskGroup);
                }
            },
            addNetworkForEdit: function () {
                var $diskGroup = $("<div></div>").addClass("form-group edit-vm-add").append(
                    $("<label></label>").addClass("col-sm-2 control-label").text("新网络适配器：")).append(
                    $("<div></div>").addClass("col-sm-10 show-times").append(
                        $('<a class="show-no" href="javascript:;" onclick="virtualMachine.action.removeDiskForEdit(this)"><i class="ti-close text-danger"></i></a>'))
                );
                var $select;
                if (window.virtualMachine.cacheNetworkEdit === null) {
                    $select=loadNetSelectForEdit(window.virtualMachine.cacheNetworkEdit,null);
                    $diskGroup.find(".show-times").append($select);
                    //todo request network to append select
                    $("#networkArea .form-group:last").after($diskGroup);
                } else {
                    moriarty.doGet("/api/v1/dvpg/all", null, function (res) {
                        virtualMachine.cacheNetworkEdit = res.data;
                        $select=loadNetSelectForEdit(window.virtualMachine.cacheNetworkEdit,null);
                        $diskGroup.find(".show-times").append($select);
                        //todo request network to append select
                        $("#networkArea .form-group:last").after($diskGroup);
                    });
                }
            },
            createDVPort: function () {
                $("#createDVPGModal").modal("show");
                $("#createVMModal").removeClass("in");
                $("#createVMModal").addClass("out");
            }
        }
    };

    var vmAction = function (url, vmName, action) {
        if (url === null) {
            showEditModelAndInfo(vmName);
            return;
        }

        if (action !== undefined) {
            moriarty.swal("确定" + action + "该虚拟机吗？", "", "warning", function () {
                vmRequest(url, vmName);
            });
        } else {
            vmRequest(url, vmName);
        }

    };

    var vmRequest = function (url, vmName) {
        moriarty.doPost(url, {vmName: vmName}, function (result) {
            if (result.result === "SUCCESS") {
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
                        $("#VMList").DataTable().ajax.reload(null, false);
                    });
            } else {
                swal("操作失败", "", "error");
            }
        }, true);
    };

    var loadClusterNames = function (dcName) {
        $("#clusterLoading").addClass("load");
        moriarty.doGet("/api/v1/cluster/hostFolder", {dcName: dcName}, function (result) {
            if (result === null) {
                $("#clusterLoading").removeClass("load");
            } else {

                $('#treeview4').treeview({
                    color: "#428bca",
                    selectedBackColor: "#03a9f3",
                    onhoverColor: "rgba(0, 0, 0, 0.05)",
                    expandIcon: 'ti-plus',
                    collapseIcon: 'ti-minus',
                    nodeIcon: 'fa fa-folder',
                    data: result.data
                });
            }
        });
    };

    var loadHostNames = function (clusterName) {
        $("#hostLoading").addClass("load");
        moriarty.doGet("/api/v1/cluster/hosts", {clusterName: clusterName}, function (res) {
            if (res === null) {
                $("#hostLoading").removeClass("load");
                toastr.error("请求超时", "注意");
                return;
            }
            $("#host").empty();
            $("#hostLoading").removeClass("load");
            $("#host").append($("<option></option>").attr("value", 0).text("--请选择--"));
            if (res.result === "SUCCESS") {
                var hostNames = res.data;
                $.each(hostNames, function (index, hostname) {
                    $("#host").append($("<option></option>").attr("value", hostname).text(hostname));
                })
            } else {
                toastr.warning("参数错误", "注意");
            }
        });
    };

    var loadStorageId = function (uniqueId) {
        $("#storageLoading").addClass("load");
        $.ajax({
            url: "/api/v1/vm/storage?uniqueId=" + uniqueId + "&dcName=" + $('#dataCanter').val(),
            type: "get",
            success: function (result) {
                if (result.result === "SUCCESS") {
                    $("#storage").empty();
                    $("#storageLoading").removeClass("load");
                    var storageNames = result.data;
                    $("#storage").append($("<option></option>").attr("value", 0).text("--请选择--"));
                    if (storageNames !== null) {
                        $.each(storageNames, function (index, storageName) {
                            $("#storage").append($("<option></option>").attr("value", storageName).text(storageName));
                        })
                    }
                }
            },
            error: function () {
                $("#storageLoading").removeClass("load");
                swal("", "", "error");
            }
        });
    };

    var buildDataForCreate = function () {
        var vm = {};
        vm["displayName"] = $("#vmname").val();
        vm["dataCanterName"] = $("#dataCanter").val();
        var position = getCurrentClusterOrHost();
        vm["clusterName"] = position.cluster;
        vm["hostName"] = position.host;
        vm["pbmProfileName"] = $("#storageStrategies option:selected").val();
        vm["pbmProfileDisName"] = $("#storageStrategies option:selected").text();
        vm["dataStoreName"] = $("#storage option:selected").val();
        vm["guestOsId"] = $("#guestos option:selected").val();
        vm["guestOsName"] = $("#guestos option:selected").text();
        var disks = [];
        var diskInputs = $(".disk-group input");
        $.each(diskInputs, function (index, diskInput) {
            var hardDisk = {};
            var oneOfDisk = $(diskInput).val();
            if (oneOfDisk !== null && oneOfDisk.trim() !== "" && oneOfDisk !== undefined && !isNaN(oneOfDisk)) {
                hardDisk["option"] = "Add";
                hardDisk["size"] = oneOfDisk * 1024;
                disks.push(hardDisk);
            }
        });

        var networks = [];
        var options = $(".network-group select option:selected");
        $.each(options, function (index, option) {
            var oneOfNetwork = $(option).val();
            if (oneOfNetwork !== null && oneOfNetwork.trim() !== "" && oneOfNetwork !== undefined && oneOfNetwork !== 0 && oneOfNetwork !== '0') {
                var network = {};
                network["option"] = "Add";
                network["name"] = oneOfNetwork;
                networks.push(network);
            }
        });
        vm["hardDiskSizes"] = disks;
        vm["cpu"] = $("#cpu option:selected").text();
        vm["memory"] = $("#memory").val();
        vm["memoryUnits"] = $("#memoryUnits").text();
        vm["network"] = networks;

        var isoName = $("#ISO option:selected").val();
        if (isoName !== 0 && isoName !== "0" && isoName !== undefined) {
            vm["iso"] = $("#ISO option:selected").text();
        }
        // todo if don't necessary when create,you can use "  delete {}.p; " to delete it;
        return vm;
    };

    var showEditModelAndInfo = function (vmName) {
        if (vmName === null || vmName === "" || vmName === undefined) {
            toastr.warning("未发现该虚拟机!", "注意");
            return;
        }
        $("#oldName").val(vmName);
        $("#updateVMModal").modal('show');
        moriarty.doGet("/api/v1/vm/detail", {"vmName": vmName}, function (res) {
            if (res !== null) {
                var vmInfo = res.data;
                var cpuMin = res.cpuMin;
                var cpuMax = res.cpuMax;
                var isoList = res.isoList;
                console.log(vmInfo);
                $("#EditCPU").empty();
                if ($("#oldName").val() !== vmInfo.displayName) {
                    return;
                }
                $("#editVMName").val(vmInfo.displayName);

                $("#editOldIso").val(vmInfo.iso);

                for (var i = cpuMin; i < cpuMax + 1; i++) {
                    var $option = $("<option></option>").attr("value", i).text(i);
                    if (i === vmInfo["cpu"]) {
                        $option.attr("selected", true);
                    }
                    $("#EditCPU").append($option);
                }
                $("#EditMem").val((vmInfo["memory"] / 1024).toFixed());
                var hardDisks = vmInfo["hardDiskSizes"];
                var $body = $("<div></div>").attr("id", "hardDiskArea");
                if (hardDisks !== null && hardDisks !== undefined && hardDisks.length > 0) {
                    $.each(hardDisks, function (index, hardDisk) {
                        var $diskGroup = $("<div></div>").addClass("form-group edit-vm-edit").append(
                            $("<label></label>").addClass("col-sm-2 control-label").text(hardDisk.label + "：")).append(
                            $("<div></div>").addClass("col-sm-10 show-times").append(
                                $("<div></div>").addClass("input-group m-t-10").append(
                                    $("<input>").addClass("form-control").attr({
                                        type: "text",
                                        value: (hardDisk.size / 1024).toFixed()
                                    })).append(
                                    $("<span></span>").addClass("input-group-addon").attr({style: "padding: 0 24px;"}).text("GB")).append(
                                    $("<input>").addClass("form-control hidden").attr({
                                        type: "text",
                                        "data-type": "value",
                                        value: JSON.stringify(hardDisk)
                                    }))).append($('<a class="show-no" href="javascript:;" onclick="virtualMachine.action.removeORReplayDiskForEdit(this)"><i class="ti-close text-danger"></i></a>'))
                        );
                        $body.append($diskGroup);
                    });
                }
                $("#editMemoryPosition").after($body);
                var networks = vmInfo["network"];
                if (networks !== null && networks !== undefined && networks.length > 0) {
                    moriarty.doGet("/api/v1/dvpg/all", null, function (res) {
                        virtualMachine.cacheNetworkEdit = res.data;
                        var $body = $("<div></div>").attr("id", "networkArea");
                        $.each(networks, function (index, network) {
                            var $select = loadNetSelectForEdit(res.data, network);
                            var $diskGroup = $("<div></div>").addClass("form-group edit-vm-edit").append(
                                $("<label></label>").addClass("col-sm-2 control-label").text(network.label + "：")).append(
                                $("<div></div>").addClass("col-sm-10 show-times").append($select).append(
                                    $('<a class="show-no" href="javascript:;" onclick="virtualMachine.action.removeORReplayDiskForEdit(this)"><i class="ti-close text-danger"></i></a>')).append(
                                    $("<input>").addClass("form-control hidden").attr({
                                        type: "text",
                                        value: JSON.stringify(network)
                                    }))
                            );
                            $body.append($diskGroup);
                        });

                        $("#hardDiskArea").after($body);
                    });
                }

                if (isoList !== null && isoList !== undefined && isoList.length !== 0) {
                    $("#editIso").append($("<option></option>").attr("value", 0).text("--请选择--"));
                    if (isoList !== null && isoList !== undefined) {
                        $.each(isoList, function (index, iso) {
                            var fullIsoName = vmInfo.iso;
                            var isoName = getIsoName(fullIsoName);
                            if (isoName === iso.name) {
                                $("#editIso").append($("<option></option>").attr({
                                    "value": iso.name,
                                    "selected": true
                                }).text(iso.name));
                            } else {
                                $("#editIso").append($("<option></option>").attr("value", iso.name).text(iso.name));
                            }
                        })
                    }
                }
            } else {
                toastr.warning("请求超时!", "注意");
            }
        })
    };

    var getIsoName = function (fullIsoName) {
        if (fullIsoName === null || fullIsoName === undefined) {
            return null;
        }
        var partName = fullIsoName.split("/");
        return partName.length === 0 ? "" : partName[partName.length - 1];
    };

    var getEditData = function () {
        var reg = /^[a-zA-Z0-9_-]{1,16}$/;
        var data = {};
        var oldDisplayName = $("#oldName").val();
        if (oldDisplayName === null || oldDisplayName === "" || oldDisplayName === undefined) {
            data["oldDisplayName"] = null;
        } else {
            data["oldDisplayName"] = oldDisplayName;
        }
        var displayName = $("#editVMName").val();
        if (displayName === null && displayName === "" && displayName === undefined) {
            return "error:请输入虚拟机名";
        }

        if (!reg.test(displayName)) {
            return "error:名称只能包含字母，数字，下划线，减号";
        }

        if (displayName !== oldDisplayName) {
            data["displayName"] = displayName;
        }

        var cpu = $("#EditCPU option:selected").val();
        if (cpu !== null && cpu !== "" && cpu !== undefined) {
            data["cpu"] = cpu;
        }
        var mem = $("#EditMem").val();
        if (mem !== null && cpu !== "" && cpu !== undefined && !isNaN(parseInt(mem)) && parseInt(mem) > 0) {
            data["memory"] = parseInt(mem) * 1024;
        } else {
            return "error:内存需为数字，且大于0";
        }

        var hardDiskSizes = [];

        var removeHardInputs = $("#hardDiskArea .edit-vm-remove input[data-type=value]");
        for (var i = 0; i < removeHardInputs.length; i++) {
            var info = JSON.parse($(removeHardInputs[i]).val());
            var hardDisk = buildHardDisk("Remove", info);
            hardDiskSizes.push(hardDisk);
        }

        var editHards = $("#hardDiskArea .edit-vm-edit");
        for (var j = 0; j < editHards.length; j++) {
            var current = $(editHards[j]).find("input:first").val();
            if (current === null || current === "" || current === undefined || isNaN(parseInt(current))) {
                return "error:硬盘请填写数字，且大于0";
            }
            var editInfo = JSON.parse($(editHards[j]).find("input[data-type=value]").val());
            if ((editInfo.size / 1024).toFixed() === current) {
                continue;
            } else if (!Number.isInteger(parseFloat(current)) || !parseInt(current) > 0) {
                return "error:硬盘请填写大于0的整数";
            } else {
                editInfo.size = parseInt(current) * 1024;
            }
            var editHardDisk = buildHardDisk("Edit", editInfo);
            hardDiskSizes.push(editHardDisk);
        }

        var addHards = $("#hardDiskArea .edit-vm-add");

        for (var z = 0; z < addHards.length; z++) {
            var size = $(addHards[z]).find("input:first").val();
            if (size === null || size === "" || size === undefined || isNaN(parseInt(size))) {
                return "error:硬盘请填写数字，且大于0";
            } else if (!Number.isInteger(parseFloat(current)) || !parseInt(current) > 0) {
                return "error:硬盘请填写大于0的整数";
            }
            var addHardDisk = {};
            addHardDisk.option = "Add";
            addHardDisk.label = null;
            addHardDisk.size = size * 1024;
            hardDiskSizes.push(addHardDisk);
        }

        data["hardDiskSizes"] = hardDiskSizes;

        var networks = [];
        var removeNics = $("#networkArea .edit-vm-remove input");
        for (var a = 0; a < removeNics.length; a++) {
            var removeNicInfo = JSON.parse($(removeNics[i]).val());
            var removeNic = buildNic("Remove", removeNicInfo);
            networks.push(removeNic);
        }

        var editNics = $("#networkArea .edit-vm-edit");
        for (var b = 0; b < editNics.length; b++) {
            var currentNic = $(editNics[b]).find("select option:selected").text();
            var editNicInfo = JSON.parse($(editNics[b]).find("input").val());
            if (currentNic === editNicInfo['name']) {
                continue;
            }
            editNicInfo['name'] = currentNic;
            var editNic = buildNic("Edit", editNicInfo);
            networks.push(editNic);
        }

        var addNics = $("#networkArea .edit-vm-add select");
        for (var c = 0; c < addNics.length; c++) {
            if ($(addNics[c]).val()===0||$(addNics[c]).val()==="0"){  return "error:请选择网络";}
            var addNic = $(addNics[c]).find("option:selected").text();
            var network = {};
            network.option = "Add";
            network.label = null;
            network.name = addNic;
            networks.push(network);
        }

        data["network"] = networks;

        var oldFullIso = $("#editOldIso").val();
        data["oldIso"] = oldFullIso;
        var currentIso = $("#editIso option:selected").val();
        if (getIsoName(oldFullIso) !== currentIso) {
            data["iso"] = currentIso;
        }
        return data;
    };

    var buildHardDisk = function (option, info) {
        var hardDisk = {};
        hardDisk.option = option;
        hardDisk.label = info.label;
        hardDisk.size = info.size;
        return hardDisk;
    };

    var buildNic = function (option, info) {
        var network = {};
        network.option = option;
        network.label = info.label;
        network.name = info.name;
        return network;
    };

    var getCurrentClusterOrHost = function () {
        var $select = $("#treeview4 ul").find(".node-selected");
        var position = {};
        if ($select.find(".indent").length === 0) {
            //this is cluster
            position.cluster = $select.text();
            position.host = null;
        } else if ($select.find(".indent").length === 1) {
            //this is host
            var currentNode = $select.data("nodeid");
            var currentParentNode = [];
            var allNode = $select.parent().find("li");
            $.each(allNode, function (index, node) {
                if ($(node).data("nodeid") < currentNode && $(node).find(".indent").length === 0) {
                    currentParentNode.push(node);
                }
            });
            position.cluster = $(currentParentNode[currentParentNode.length - 1]).text();
            position.host = $select.text();
        }

        return position;
    };

    var createVlan = function () {
        //todo 判断数据规则
        var name = $("#netName").val();
        var vlanId = $("#vlanId").val();
        // var dcName = $("#dcName option:selected").val();
        var dcName = $("#dcName").val();
        var dvpg = $("#group option:selected").val();
        var param = {"name": name, "vlanId": vlanId, "dcName": dcName, "dvpg": dvpg, "wait": true};
        if (name === null || name === undefined) {
            $("#createNetNameError").removeClass("hidden");
            return;
        }
        if (vlanId === null || vlanId === undefined || vlanId < 1 || vlanId > 4094) {
            $("#createVlanIdError").removeClass("hidden");
            return;
        }
        $("#createNetNameError").addClass("hidden");
        $("#createVlanIdError").addClass("hidden");
        moriarty.doPost("/api/v1/dvpg/create", param, function (res) {
            if (res.result === "SUCCESS" && res.data) {
                //todo reload network select
                reloadNetWork(name);
                $("#createDVPGModal").modal("hide");
            } else {
                toastr.warning("端口组创建失败！", "注意")
            }
        })
    };

    var reloadNetWork = function (vcNet, callback) {
        var selectedNetWork = [];
        var optionSelected = $(".network-group option:selected");
        $.each(optionSelected, function (index, option) {
            var value = $(option).val();
            if (value !== null && value !== "" && value !== undefined && value !== 0 && value !== "0") {
                selectedNetWork.push(value);
            }
        });

        moriarty.doGet("/api/v1/dvpg/all", null, function (res) {
            if (res === null) {
                toastr.error("请求超时", "注意");
                return;
            }
            virtualMachine.cacheNetwork = res.data;

            var networkGroup = $(".network-group select");
            $.each(networkGroup, function (index, one) {
                $(one).html("");
                $(one).append($("<option></option>").attr("value", 0).text("--请选择--"));
                if (res.result === "SUCCESS") {
                    var networks = res.data;
                    $.each(networks, function (idx, network) {
                        if (network.name === vcNet) {
                            $(one).find("option:first").after($("<option></option>").attr("value", network.name).text(network.name));
                        } else if (selectedNetWork[index] === network.name) {
                            $(one).append($("<option></option>").attr({"value": network.name}).text(network.name).prop("selected", true));
                        } else {
                            $(one).append($("<option></option>").attr("value", network.name).text(network.name));
                        }
                    })
                }
            });
            callback();
        });
    };

    var loadNetSelectForEdit = function (nets, network) {
        var $select = $("<select></select>").addClass("form-control");
        if (network===null){
            $select.append($("<option></option>").attr("value",0).text("--请选择--"));
        }

        $.each(nets, function (index, net) {
            var $option = $("<option></option>").text(net.name);
            if (network!==null && net.name === network.name) {
                $option.attr("selected", true);
            }
            $select.append($option);
        });
        return $select;
    }
})();