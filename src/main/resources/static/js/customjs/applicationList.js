!(function () {
    var applicationList = {};
    var name = "";
    var systemDiskSize = null;

    applicationList.init = function () {
        getApplication();
    };

    applicationList.addDiskForAdvance = function (_this) {
        var $thisRow = $(_this).parent().parent().parent().parent().parent();
        var $row = $("<div></div>").addClass("row");
        var $showTimes = $("<div></div>").addClass("col-md-11 show-times");
        var $label = $("<label></label>").addClass("monitor-label resortDisk").text("新硬盘");
        var $inputGroup = $("<div></div>").addClass("input-group");
        var $addA = $("<a></a>").addClass("show-no").attr({
            "href": "javascript:;",
            "title": "添加新硬盘",
            "onclick": "applicationList.addNewDisk(this)"
        }).css({
            "top": "8px",
            "left": "-15px",
            "right": "unset"
        }).append($("<i></i>").addClass("fa fa-plus text-success"));
        var $deleteA = $("<a></a>").addClass("show-no").attr({
            "href": "javascript:;",
            "title": "删除新硬盘",
            "onclick": "applicationList.deleteNetDisk(this)"
        }).css({"top": "8px"}).append($("<i></i>").addClass("fa fa-minus").css("color", "#cb2027"));
        var $input = $("<input>").addClass("form-control systemNewDisk");
        var $span = $("<span></span>").addClass("input-group-addon").css("padding", "0 24px").text("GB");
        $thisRow.next().find(".newDisk").append($row.append($showTimes.append($label).append($inputGroup.append($input).append($span).append($deleteA))));
    };

    applicationList.deleteNetDisk = function (_this) {
        $(_this).parent().parent().parent().remove();
    };

    applicationList.radioClick = function (_this) {
        if (_this.checked) {
            $(_this).parent().next().removeClass("hidden");
            $(_this).parent().find(".addEquipment").removeClass("hidden");
            getNetworks(function (networks) {
                $.each(networks, function (index, network) {
                    $(".network").append($("<option></option>").attr("value", network["name"]).text(network["name"]));
                });
            });
        } else {
            $(_this).parent().next().addClass("hidden");
            $(_this).parent().find(".addEquipment").addClass("hidden");
            $(".network").html("");
        }
    };

    applicationList.addNetworkForAdvance = function (_this) {
        var $thisRow = $(_this).parent().parent().parent().parent().parent();
        var $row = $("<div></div>").addClass("row");
        var $showTimes = $("<div></div>").addClass("col-md-11 show-times");
        var $label = $("<label></label>").addClass("monitor-label resortNetwork").text("新网络");
        var $addA = $("<a></a>").addClass("show-no").attr({
            "href": "javascript:;",
            "title": "添加新网络",
            "onclick": "applicationList.addNewNetWork(this)"
        }).css({
            // "top": top + "px",
            "left": "-8px",
            "right": "unset"
        }).append($("<i></i>").addClass("fa fa-plus text-success"));
        var $deleteA = $("<a></a>").addClass("show-no").attr({
            "href": "javascript:;",
            "title": "删除该网络",
            "onclick": "applicationList.deleteNetNetWork(this)"
        }).css({
            "top": top + "px",
            "right": "-8px"
        }).append($("<i></i>").addClass("fa fa-minus").css("color", "#cb2027"));
        var $select = $("<select></select>").addClass("form-control network");
        getNetworks(function (networks) {
            $.each(networks, function (index, network) {
                $select.append($("<option></option>").attr("value", network["name"]).text(network["name"]));
            });
            $thisRow.next().find(".newNetwork").append($row.append($showTimes.append($label).append($select).append($deleteA)));
        });
    };

    applicationList.deleteNetNetWork = function (_this) {
        $(_this).parent().parent().remove();
    };

    applicationList.applicationDesClick = function (_this) {
        var applicationType = $(_this).data("type");
        var description = $(_this).data("content");
        var image = $(_this).data("image");
        var images = $(_this).data("images").split(",");
        getStatus(applicationType,function (data) {
            $("#install").attr("data-status", data);
            switch (data) {
                case 0:
                    $("#install").text("安装");
                    break;
                case 1:
                    $("#install").text("部署中");
                    $("#install").removeAttr("onclick");
                    break;
                case 2:
                    $("#install").text("已发布");
                    $("#install").removeAttr("onclick");
                    break;
                case 3:
                    $("#install").text("发布失败");
                    break;
                default:
                    break;
            }

            if ($("#detail").next().hasClass("boundary")) {
                $("#detail").next().remove();
            }
            $("#detail").find("span").removeAttr("data-type").attr("data-type", applicationType).text(applicationType + " " + "详情");
            $("#detail").find("img").attr("src", "data:;base64," + image);
            $("#detail").after($("<div></div>").addClass("boundary").css({
                "border": "2px #edf1f5 solid",
                "border-radius": "5px",
                "margin-bottom": "5px"
            }));
            $("#description").text(description);
            $("#description").parent().removeClass("hidden");
            $("#systemChoose").parent().addClass("hidden");
            $("#slideShow").removeClass("hidden");
            $("#slideShow").html('');
            $.each(images,function (index,element) {
                $("#slideShow").append('<div class="col-md-4"> <img style="width: 100%;height: 200px" src="data:;base64,'+element+'"</div>')
            })
        });
        // var params = {
        //     contentType: "application",
        //     systemType: applicationType,
        //     infoType: "description"
        // };
        // moriarty.doGet("/api/v1/service/system/description", params, function (res) {
        //     if (res !== null) {
        //         var data = res.data;
        //         $("#detail").removeAttr("data-type").attr("data-type", applicationType).text(applicationType + " " + "详情");
        //         $("#description").text(data["description"]);
        //         $("#description").parent().parent().removeClass("hidden");
        //         $("#systemChoose").parent().addClass("hidden");
        //     }
        // });
    };
    applicationList.selectSize = function () {
        addVMConfig();
        getFileName();
        getNetworks(function (networks) {
            $.each(networks, function (index, network) {
                $(".setting-network").append($("<option></option>").attr("value", network["name"]).text(network["name"]));
                $(".systemNewNetwork").append($("<option></option>").attr("value", network["name"]).text(network["name"]));
            });
        });
    };
    applicationList.applyApplication = function () {
        getFileName();
        addVMConfig();
        getNetworks(function (networks) {
            $.each(networks, function (index, network) {
                $(".setting-network").append($("<option></option>").attr("value", network["name"]).text(network["name"]));
                $(".systemNewNetwork").append($("<option></option>").attr("value", network["name"]).text(network["name"]));
            });
        });
        $("#description").parent().addClass("hidden");
        $("#systemConfig").removeClass("hidden");
    };
    applicationList.customApplication = function (_this) {
        if (_this.checked) {
            $(_this).parent().next().removeClass("hidden");
            getApplicationInfo(_this);
        } else {
            $(_this).parents(".row").find(".systemCpu").val("");
            $(_this).parents(".row").find(".systemDisk").val("");
            $(_this).parents(".row").find(".systemMem").val("");
            $(_this).parent().next().addClass("hidden");
        }
    };
    applicationList.issueApplication = function () {
        if (!validateAgreementChoose()) {
            showErrorMessage("请先接受协议");
            return;
        }

        $(".error-input").removeClass("error-input");

        var vmConfig = $(".vm-name");
        if (vmConfig.length <= 0) {
            showErrorMessage("请选择业务规模");
            return;
        }

        var businessName = $(".setting-business").val();
        if (businessName === null || businessName.trim() === "") {
            $(".setting-business").addClass("error-input");
            showErrorMessage("请填写应用名称");
            return;
        }

        var businessType = $("#businessType").find("option:selected").text();
        if (businessType === undefined || businessType === null || businessType.trim() === null) {
            showErrorMessage("请选择业务类型");
            return;
        }

        var vmConfigArr = [];
        for (var i = 0; i < vmConfig.length; i++) {
            var vmInfo = {};
            var networkInfoArr = [];
            var diskInfoArr = [];
            var $vm = $(vmConfig[i]);
            vmInfo["templateName"] = name;
            var vmName = $vm.find(".setting-vmname").val();
            if (vmName === undefined || vmName.trim() === "") {
                $vm.find(".setting-vmname").addClass("error-input");
                showErrorMessage("请填写虚拟机名称");
                return;
            }
            vmInfo["vmName"] = vmName;
            var hostName = $vm.find(".setting-host").val();
            if (hostName === undefined || hostName.trim() === "") {
                $vm.find(".setting-host").addClass("error-input");
                showErrorMessage("请填写主机前缀");
                return;
            }
            vmInfo["hostname"] = hostName;
            var networkName = $vm.find(".setting-network").val();
            if (networkName === undefined || networkName.trim() === "") {
                $vm.find(".setting-network").addClass("error-input");
                showErrorMessage("请选择网络");
                return;
            }
            networkInfoArr.push({"name": networkName});
            var vmIp = $vm.find(".setting-ip").val();
            if (vmIp === undefined || vmIp.trim() === "") {
                $vm.find(".setting-ip").addClass("error-input");
                showErrorMessage("请填写虚拟机IP");
                return;
            }
            vmInfo["ip"] = vmIp;
            var subnetMask = $vm.find(".setting-subnetMask").val();
            if (subnetMask === undefined || subnetMask.trim() === "") {
                $vm.find(".setting-subnetMask").addClass("error-input");
                showErrorMessage("请填写子网掩码");
                return;
            }
            vmInfo["subnetMask"] = subnetMask;
            var dns = $vm.find(".setting-dns").val();
            if (dns === undefined || dns.trim() === "") {
                $vm.find(".setting-dns").addClass("error-input");
                showErrorMessage("请填写DNS");
                return;
            }
            vmInfo["dns"] = dns;
            var gateway = $vm.find(".setting-gateway").val();
            if (gateway === undefined || gateway.trim() === "") {
                $vm.find(".setting-gateway").addClass("error-input");
                showErrorMessage("请填写网关");
                return;
            }
            vmInfo["gateway"] = [gateway];

            var highCheck = $vm.find(".highChoose").is(":checked");
            if (highCheck) {
                var cpu = $vm.find(".systemCpu").val();
                if (cpu === undefined || cpu === "") {
                    $vm.find(".systemCpu").addClass("error-input");
                    showErrorMessage("请选择CPU大小");
                    return;
                }
                vmInfo["cpuCores"] = parseInt(cpu);
                var mem = $vm.find(".systemMem").val();
                if (mem === undefined || mem.trim() === "" || isNaN(mem) || parseInt(mem) === 0) {
                    $vm.find(".systemMem").addClass("error-input");
                    showErrorMessage("请正确输入内存");
                    return;
                }
                vmInfo["memSizeMb"] = parseInt(mem) * 1024;
                var disk = $vm.find(".systemDisk").val();
                if (disk === undefined || disk.trim() === "" || isNaN(disk) || parseInt(disk) === 0) {
                    $vm.find(".systemDisk").addClass("error-input");
                    showErrorMessage("请正确输入系统盘大小");
                    return;
                }
                vmInfo["systemDiskSizeMb"] = parseInt(disk) * 1024;

                var addDeviceCheck = $vm.find(".addDevice").is(":checked");
                if (addDeviceCheck) {
                    var diskArr = $(".systemNewDisk");
                    for (var n = 0; n < diskArr.length; n++) {
                        var diskSize = $(diskArr[n]).val();
                        if (diskSize === null || diskSize.trim() === "" || isNaN(diskSize) || parseInt(diskSize) <= 0) {
                            showErrorMessage("请正确填写新硬盘大小");
                            return;
                        }
                        diskInfoArr.push({"size": parseInt(diskSize) * 1024});
                    }
                    vmInfo["disks"] = diskInfoArr;
                    var networkArr = $(".systemNewNetwork");
                    for (var m = 0; m < networkArr.length; m++) {
                        var newNetworkName = $(networkArr[m]).find("option:selected").text();
                        if (newNetworkName === undefined || newNetworkName === null || newNetworkName.trim() === "") {
                            showErrorMessage("请选择网络");
                            return;
                        }
                        networkInfoArr.push({"name": newNetworkName});
                    }
                    vmInfo["networks"] = networkInfoArr;
                }
            }
            vmConfigArr.push(vmInfo);
        }

        var resourcePool = {
            "name": businessName + "_" + businessType,
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

        // var param = JSON.stringify({
        //     "pool":resourcePool,
        //     "configs":vmConfigArr
        // });
        var content = {
            "pool": resourcePool,
            // "dc": dcName,
            "configs": vmConfigArr
        };
        var params = JSON.stringify({
            "serviceType": "1",
            "serviceName": "业务",
            "businessType": "system",
            "businessName": businessName,
            "content": JSON.stringify(content),
            "validStatus": "1",
            "status": "1",
            "name": businessName
        });

        moriarty.doPost("/api/v1/vm/sendApplication", params, function (data) {
            console.log(JSON.stringify(data));
        })
    };
    applicationList.nextStep = function () {
        $(".setting-business").removeClass("error-input");
        var businessName = $(".setting-business").val();
        if (businessName === undefined || businessName === null || businessName.trim() === "") {
            $(".setting-business").addClass("error-input");
            showErrorMessage("请输入应用名称");
            return;
        }
        $("#systemConfig").addClass("hidden");
        $("#vmConfig").removeClass("hidden");
    };
    applicationList.prevStep = function () {
        $("#vmConfig").addClass("hidden");
        $("#systemConfig").removeClass("hidden");
    };
    applicationList.returnPrev = function () {
        $("#description").parent().addClass("hidden");
        $("#slideShow").addClass("hidden");
        $("#systemChoose").parent().removeClass("hidden");
    };

    applicationList.installApplication = function (_this) {
        var status = $(_this).data("status");
        if (parseInt(status)===3) {
            showInfoMessage("业务发布失败，请联系管理员确认失败原因.");
            return;
        }
        swal({
            title: '确认要安装该应用？',
            text: '应用安装时间较长，安装结果会通过邮件方式通知您.',
            showCancelButton: "true",
            showConfirmButton: "true",
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            animation: "slide-from-top"
        }, function (data) {
            if (!data) {
                return;
            }

            $("#install").addClass("hidden");

            var applicationName = $("#detail").find("span").data("type");
            var param = {
                applicationName: applicationName,
                folderType: "application"
            };
            moriarty.doPost("/api/vi/business/install", JSON.stringify(param),null,true);
            setTimeout(function () {
                window.location.href = "/service/business/businessList";
            },3000);
        });
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

    var getApplication = function () {
        moriarty.doGet("/api/v1/system/template/types", {type: "application"}, function (res) {
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
                }).text(item["type"])).append($("<img>").attr("src", "data:;base64," + item["image"]).css("margin-bottom", "15px"))
                    .append($("<div></div>").css({
                        "height": "60px",
                        "display": "-webkit-box",
                        "-webkit-line-clamp": "3",
                        "-webkit-box-orient": "vertical",
                        "overflow": "hidden",
                        "margin-bottom": "5px"
                    }).attr("title", item["summarize"]).text(item["summarize"]))
                    .append($("<div></div>").css({"margin-bottom": "30px"})
                        .append($("<button></button>").attr({
                            "type": "button",
                            "data-type": item["type"],
                            "data-content": item["description"],
                            "data-image": item["image"],
                            "data-images": item["images"].toString(),
                            "onClick": "applicationList.applicationDesClick(this)"
                        }).css({"padding": "5px 25px"}).text("详情")));
                $("#systemChoose").append($div);
            });
        });
    };
    var getApplicationInfo = function (_this) {
        moriarty.doGet("/api/v1/vm/detail", {"vmName": name}, function (res) {
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
                            $(_this).parents(".row").find(".systemCpu").append($("<option selected></option>").text(i));
                        } else
                            $(_this).parents(".row").find(".systemCpu").append($("<option></option>").text(i));
                    }
                    $(_this).parents(".row").find(".systemDisk").val(systemDiskSize);
                    $(_this).parents(".row").find(".systemMem").val(data["memory"] / 1024);
                }
            }
        });
    };
    var getFileName = function () {
        var packageType = $("#detail").find("span").data("type");
        var params = {
            contentType: "application",
            systemType: packageType
        };
        moriarty.doGet("/api/v1/system/template/names", params, function (res) {
            if (res !== null) {
                var data = res.data;
                if (data.length !== 0) {
                    $.each(data, function (index, item) {
                        name = item;
                    })
                }
            }
        });
    };
    var addVMConfig = function () {
        $(".vm-name").remove();
        var val = $(".instance-size").val();
        for (var i = 0; i < parseInt(val); i++) {
            var $div = $("<div class='vm-name'></div>");
            $div.attr("data-name", name);
            $div.append($("#setting-vm").html());
            $("#setting-general").append($div);
        }
    };

    var validateAgreementChoose = function () {
        return $("#agreementChoose").is(":checked");
    };

    var getStatus = function (applicationType,callback) {
      moriarty.doGet("/api/v1/business/"+applicationType,null, function (res) {
          if (res!==null) {
              callback(res.data);
          }
      })
    };

    window.applicationList = applicationList;
})();