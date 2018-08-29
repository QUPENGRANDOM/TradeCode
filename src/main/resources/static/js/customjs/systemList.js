/**
 * Created by bozhil on 2017/11/29.
 */
!(function () {
    var systemList = {};

    var systemSelector = null;

    var systemDiskSize = null;

    /*system*/
    systemList.init = function () {
        /*getTemplate(function (systemTypes) {
            $.each(systemTypes, function (index, data) {
                var systemType = data["type"];
                getDescription(systemType);
            });
        });*/
        getTemplate();
        createPool();
        createNetwork();
        $("#createPoolModal").on("hidden.bs.modal", function () {
            $("#poolName").val("");
        });
        $("#createDVPGModal").on("hidden.bs.modal", function () {
            $("#netName").val("");
            $("#vlanId").val("");
        });
    };

    systemList.returnPrev = function () {
        $("#description").parent().parent().addClass("hidden");
        $("#systemChoose").parent().removeClass("hidden");
    };

    systemList.applyIssue = function () {//申请
        $("#description").parent().parent().addClass("hidden");
        $("#systemConfig").removeClass("hidden");
        getResourcePool();
        getNetworks(function (networks) {
            $.each(networks, function (index, network) {
                $("#network").append($("<option></option>").attr("value", network["name"]).text(network["name"]));
            });
        });
    };

    systemList.desClick = function (_this) {
        var detail = $(_this).data("detail");
        systemSelector = detail;
        var desContent = $(_this).data("content");
        $("#detail").text(detail + " " + "详情");
        $("#description").text(desContent);
        getSystemVersion(detail);
        $("#description").parent().parent().removeClass("hidden");
        $("#systemChoose").parent().addClass("hidden");
    };

    systemList.issue = function () {
        if (!validateAgreementChoose()) {
            showErrorMessage("请先接受协议");
            return;
        }
        var templateName = $("#templateName option:selected").val();
        var hostName = $("#hostName").val();
        var vmName = $("#vmName").val();
        var systemDisk = $("#systemDisk").val();
        var belongBusiness = $("#belongBusiness option:selected").val();
        var systemCpu = $("#systemCpu").val();
        var systemMem = $("#systemMem").val();
        var password = $("#password").val();
        var confirmPassword = $("#confirmPassword").val();
        var ip = $("#ip").val();
        var subnetMask = $("#subnetMask").val();
        var dns = $("#dns").val();
        var gateway = $("#gateway").val();
        var disks = [];
        var networks = [];
        var configs = [];

        if (templateName === "" || templateName === null || templateName === undefined) {
            showErrorMessage("请选择系统版本！");
            return;
        }
        if (hostName === "" || hostName === null || hostName === undefined) {
            showErrorMessage("主机名称不能为空！");
            return;
        }
        if (vmName === "" || vmName === null || vmName === undefined) {
            showErrorMessage("虚拟机名称不能为空！");
            return;
        }
        if (systemDisk === "" || systemDisk === null || systemDisk === undefined) {
            showErrorMessage("系统磁盘不能为空！");
            return;
        }
        if (systemDisk < systemDiskSize) {
            showErrorMessage("系统盘不能小于模板系统磁盘大小！");
            return;
        }
        if (!moriarty.number.test(systemDisk)) {
            showErrorMessage("系统磁盘必须为正整数！");
            return;
        }
        if (belongBusiness === "" || belongBusiness === null || belongBusiness === undefined) {
            showErrorMessage("请选择所属业务！");
            return;
        }
        if (systemCpu === "" || systemCpu === null || systemCpu === undefined) {
            showErrorMessage("CPU不能为空！");
            return;
        }
        if (!moriarty.number.test(systemCpu)) {
            showErrorMessage("CPU必须为正整数！");
            return;
        }
        if (systemMem === "" || systemMem === null || systemMem === undefined) {
            showErrorMessage("内存不能为空！");
            return;
        }
        if (!moriarty.number.test(systemMem)) {
            showErrorMessage("内存必须为正整数！");
            return;
        }
        // if (password === "" || password === null || password === undefined) {
        //     showErrorMessage("登录密码不能为空！");
        //     return;
        // }
        // if (confirmPassword === "" || confirmPassword === null || confirmPassword === undefined) {
        //     showErrorMessage("确认密码不能为空！");
        //     return;
        // }
        // if (confirmPassword !== password) {
        //     showErrorMessage("两次密码输入不一致！");
        //     return;
        // }
        if (ip === "" || ip === null || ip === undefined) {
            showErrorMessage("IP不能为空！");
            return;
        }
        if (!moriarty.ipVerify.test(ip)) {
            showErrorMessage("请输入正确的IP格式！");
            return;
        }
        if (subnetMask === "" || subnetMask === null || subnetMask === undefined) {
            showErrorMessage("子网掩码不能为空！");
            return;
        }
        if (!moriarty.mask.test(subnetMask)) {
            showErrorMessage("请输入正确的子网掩码格式！");
            return;
        }
        if (dns === "" || dns === null || dns === undefined) {
            showErrorMessage("DNS不能为空！");
            return;
        }
        // if (!moriarty.DNS.test(dns)) {
        //     showErrorMessage("请输入正确的DNS格式！");
        //     return;
        // }
        if (gateway === "" || gateway === null || gateway === undefined) {
            showErrorMessage("网关不能为空！");
            return;
        }
        var systemTypeSelector = true;
        if (systemSelector === "Windows") {
            systemTypeSelector = false;
        } else {
            systemTypeSelector = true;
        }
        var resourcePool = {
            "name": belongBusiness,
            // "clusterName": "nested_cluster_vsan01",
            "cpuAllocation": {
                "reservation": 0,
                "expandableReservation": true,
                "limit": "-1"
            },
            "memAllocation": {
                "reservation": 0,
                "expandableReservation": true,
                "limit": "-1"
            }
        };
        var dcName = $("#dcName").val();
        $.each($(".systemDisk"), function (index, systemDisk) {
            var disk = {"size": parseInt($(systemDisk).val()) * 1024};
            disks.push(disk);
        });
        $.each($(".network"), function (index, network) {
            var net = {"name": $(network).val()};
            networks.push(net);
        });
        var systemConfig = {
            "ip": ip,
            "subnetMask": subnetMask,
            "dns": dns,
            "gateway": [gateway],
            "linux": systemTypeSelector,
            "vmName": vmName,
            "templateName": templateName,
            "systemDiskSizeMb": parseInt(systemDisk) * 1024,
            "cpuCores":systemCpu,
            "memSizeMb":parseInt(systemMem)*1024,
            "hostname":hostName,
            "disks": disks,
            "networks": networks
        };
        configs.push(systemConfig);
        var content = {
            "pool": resourcePool,
            "dc": dcName,
            "configs": configs
        };
        var params = JSON.stringify({
            "serviceType": "1",
            "serviceName": "业务",
            "businessType": "system",
            "businessName": templateName,
            "content": JSON.stringify(content),
            "validStatus": "1",
            "status": "1",
            "name":vmName
        });
        $("#issue").attr("disabled", "disabled");
        getVmlist(belongBusiness, function (data) {
            if ($("#porwerOnOrder").val() > data.length + 1) {
                showErrorMessage("最大开机顺序不能大于" + (data.length + 1));
                return;
            } else {
                moriarty.doPost("/api/v1/vm/sendSystem", params, function (res) {
                    showInfoMessage("正在发布...");
                    // setTimeout(window.location.href = "/service/serviceList", 5000);
                });
            }
        });
    };

    systemList.addNetwork = function () {
        $("#createDVPGModal").modal("show");
    };

    systemList.addResourcePool = function () {
        $("#createPoolModal").modal("show");
    };

    systemList.radioClick = function (_this) {
        if (_this.checked) {
            $(_this).parent().next().removeClass("hidden");
            $("#addEquipment").removeClass("hidden");
            getNetworks(function (networks) {
                $.each(networks, function (index, network) {
                    $(".network").append($("<option></option>").attr("value", network["name"]).text(network["name"]));
                });
            });
        } else {
            $(_this).parent().next().addClass("hidden");
            $("#addEquipment").addClass("hidden");
            $(".network").html("");
        }
    };

    systemList.addDiskForAdvance = function (_this) {
        // var $thisRow = $(_this).parent().parent().parent();
        var $row = $("<div></div>").addClass("row");
        var $showTimes = $("<div></div>").addClass("col-md-11 show-times");
        var $label = $("<label></label>").addClass("monitor-label resortDisk").text("新硬盘");
        var $inputGroup = $("<div></div>").addClass("input-group");
        var $addA = $("<a></a>").addClass("show-no").attr({
            "href": "javascript:;",
            "title": "添加新硬盘",
            "onclick": "systemList.addNewDisk(this)"
        }).css({
            "top": "8px",
            "left": "-15px",
            "right": "unset"
        }).append($("<i></i>").addClass("fa fa-plus text-success"));
        var $deleteA = $("<a></a>").addClass("show-no").attr({
            "href": "javascript:;",
            "title": "删除新硬盘",
            "onclick": "systemList.deleteNetDisk(this)"
        }).css({"top": "8px"}).append($("<i></i>").addClass("fa fa-minus").css("color", "#cb2027"));
        var $input = $("<input>").addClass("form-control systemDisk");
        var $span = $("<span></span>").addClass("input-group-addon").css("padding", "0 24px").text("GB");
        $("#newDisk").append($row.append($showTimes.append($label).append($inputGroup.append($input).append($span).append($deleteA))));
    };

    systemList.deleteNetDisk = function (_this) {
        $(_this).parent().parent().parent().remove();
    };

    systemList.addNetworkForAdvance = function (_this) {
        // var $thisRow = $(_this).parent().parent();
        var $row = $("<div></div>").addClass("row");
        var $showTimes = $("<div></div>").addClass("col-md-11 show-times");
        var $label = $("<label></label>").addClass("monitor-label resortNetwork").text("新网络");
        var $addA = $("<a></a>").addClass("show-no").attr({
            "href": "javascript:;",
            "title": "添加新网络",
            "onclick": "systemList.addNewNetWork(this)"
        }).css({
            // "top": top + "px",
            "left": "-8px",
            "right": "unset"
        }).append($("<i></i>").addClass("fa fa-plus text-success"));
        var $deleteA = $("<a></a>").addClass("show-no").attr({
            "href": "javascript:;",
            "title": "删除该网络",
            "onclick": "systemList.deleteNetNetWork(this)"
        }).css({
            "top": top + "px",
            "right": "-8px"
        }).append($("<i></i>").addClass("fa fa-minus").css("color", "#cb2027"));
        var $select = $("<select></select>").addClass("form-control network");
        getNetworks(function (networks) {
            $.each(networks, function (index, network) {
                $select.append($("<option></option>").attr("value", network["name"]).text(network["name"]));
            });
            $("#newNetwork").append($row.append($showTimes.append($label).append($select).append($deleteA)));
        });
    };

    systemList.deleteNetNetWork = function (_this) {
        $(_this).parent().parent().remove();
    };

    /*system*/
    var getDescription = function (systemType) {
        moriarty.doGet("/api/v1/service/system/description", {"systemType": systemType}, function (res) {
            var data = res.data;
            var $div = $("<div></div>").addClass("col-md-3").css({
                "background-color": "#f5faff",
                "border": "1px #d8d8d8 solid",
                "text-align": "center"
            }).append($("<div></div>").css({
                "color": "#3c3c3c",
                "font-size": "16px",
                "font-weight": "bold",
                "margin": "10px"
            }).text(systemType)).append($("<img>").attr("src", "data:;base64," + data["image"]).css("margin-bottom", "15px")).append($("<div></div>").css({"margin-bottom": "30px"}).append($("<button></button>").attr({
                "type": "button",
                "data-detail": systemType,
                "data-content": data["description"],
                "onClick": "systemList.desClick(this)"
            }).css({"padding": "5px 25px"}).text("详情")));
            $("#systemChoose").append($div);
        });
    };
    /* var getTemplate = function (callback) {
         moriarty.doGet("/api/v1/system/template/types", null, function (res) {
             var data = res.data;
             data.sort(function (a, b) {
                 return a["type"].localeCompare(b["type"]);
             });
             callback(data);
         });
     };*/
    var getTemplate = function () {
        moriarty.doGet("/api/v1/system/template/types", {type: "template"}, function (res) {
            var data = res.data;
            $.each(data, function (index, item) {
                var $div = $("<div></div>").addClass("col-md-3").css({
                    "background-color": "#f5faff",
                    "border": "1px #d8d8d8 solid",
                    "text-align": "center"
                }).append($("<div></div>").css({
                    "color": "#3c3c3c",
                    "font-size": "16px",
                    "font-weight": "bold",
                    "margin": "10px"
                }).text(item["type"])).append($("<img>").attr("src", "data:;base64," + item["image"]).css("margin-bottom", "15px")).append($("<div></div>").css({"margin-bottom": "30px"}).append($("<button></button>").attr({
                    "type": "button",
                    "data-detail": item["type"],
                    "data-content": item["description"],
                    "onClick": "systemList.desClick(this)"
                }).css({"padding": "5px 25px"}).text("详情")));
                $("#systemChoose").append($div);
            });
        });
    };
    var getSystemVersion = function (systemType) {
        $("#templateName").html("");
        moriarty.doGet("/api/v1/system/template/names", {"systemType": systemType}, function (res) {
            if (res !== null) {
                var data = res.data;
                $.each(data, function (index, versionName) {
                    $("#templateName").append($("<option></option>").text(versionName));
                });
                systemList.getTemplateInfo();
            }
        })
    };
    var getResourcePool = function () {
        moriarty.doGet("/api/v1/cluster/resourcePool", null, function (res) {
            if (res !== null) {
                var data = res.data;
                $.each(data, function (index, resourcePool) {
                    $("#belongBusiness").append($("<option></option>").attr("value", resourcePool).text(resourcePool));
                });
            }
        })
    };
    var getNetworks = function (callback) {
        moriarty.doGet("/api/v1/dvpg/all", null, function (res) {
            if (res !== null) {
                var data = res.data;
                data.sort(function (a, b) {
                    return a["name"].localeCompare(b["name"]);
                });
                callback(data);
            }
        })
    };
    var createPool = function () {
        $("#sureToAddPool").bind("click", function () {
            var poolName = $("#poolName").val();
            if (poolName === "" || poolName === null || poolName === undefined) {
                showErrorMessage("业务名称不能为空！");
                return;
            }
            $("#belongBusiness").append($("<option selected></option>").attr({
                "value": poolName,
                "readonly": "readonly"
            }).text(poolName));
            $("#belongBusiness").next().addClass("hidden");
            var param = {
                "name": poolName,
                "clusterName": "nested_cluster_vsan01",
                "cpuAllocation": {
                    "reservation": 0,
                    "expandableReservation": true,
                    "limit": "-1"
                },
                "memAllocation": {
                    "reservation": 0,
                    "expandableReservation": true,
                    "limit": "-1"
                }
            };
            moriarty.doPost("/api/v1/resource/create", JSON.stringify(param).toString(), function (res) {
                if (res !== null) {
                    var data = res.data;
                    if (data) {
                        $("#createPoolModal").modal("hide");
                        showSuccessMessage("创建业务成功！");
                        $("#belongBusiness").append($("<option selected></option>").attr("value", poolName).text(poolName));
                    } else {
                        $("#createPoolModal").modal("hide");
                        showErrorMessage("创建业务失败！");
                    }
                } else {
                    $("#createPoolModal").modal("hide");
                    showErrorMessage("创建业务失败！");
                }
            });
        });
    };
    var createNetwork = function () {
        $("#createDVPortSubmit").bind("click", function () {
            var name = $("#netName").val();
            var vlanId = $("#vlanId").val();
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
                    $("#createDVPGModal").modal("hide");
                    $("#network").append($("<option selected></option>").attr("value", name).text(name));
                    showSuccessMessage("端口组创建成功！");
                } else {
                    $("#createDVPGModal").modal("hide");
                    showErrorMessage("端口组创建失败！");
                }
            })
        });
    };
    var validateAgreementChoose = function () {
        return $("#agreementChoose").is(":checked");
    };
    systemList.getTemplateInfo = function () {
        $("#systemDisk").val("");
        var obj=document.getElementById('systemCpu');
        obj.options.length=0;
        $("#systemMem").val("");

        var templateName = $("#templateName option:selected").val();
        moriarty.doGet("/api/v1/vm/detail", {"vmName": templateName}, function (res) {
            if (res !== null) {
                if (res.result === "SUCCESS") {
                    var data = res.data;
                    var cpuMin = res["cpuMin"];
                    var cpuMax = res["cpuMax"];
                    $(data["virtualDevices"]).each(function (index, item) {
                        if (item["size"] !== undefined && item["size"] !== null) {
                            systemDiskSize = item["size"] / 1024;
                        }
                    });

                    for (var i = cpuMin; i <= cpuMax; i++) {
                        if (i === data["cpu"]) {
                            $("#systemCpu").append($("<option selected></option>").text(i));
                        } else
                            $("#systemCpu").append($("<option></option>").text(i));
                    }
                    $("#systemDisk").val(systemDiskSize);
                    $("#systemMem").val(data["memory"] / 1024);
                }
            }
        });
    };
    var getVmlist = function (resoucepool, callback) {
        moriarty.doGet("/api/v1/vm/list/" + resoucepool, null, function (res) {
            if (res.result === "SUCCESS") {
                callback(res.data);
            }
        })
    };

    window.systemList = systemList;
})();