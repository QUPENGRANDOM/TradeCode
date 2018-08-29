/**
 * Created by bozhil on 2017/8/7.
 */
!(function () {

    /*给剩余时间绑定点击事件*/
    $("#timeRemaining").click(function(){
        $("#remainTimeModal").modal("show");
        var resourceUUID = ""
        moriarty.doGet("/api/v1/business/getuuid", { resourceName : "HANA虚拟机资源池" }, function (res) {
            if(res.result == 'SUCCESS'){
                resourceUUID = res.data;
            }else{
                moriarty.alert(res.message);
                return;
            }

            moriarty.doGet("/api/v1/vrop/resource/timeRemaining", {"uuid": resourceUUID}, function (res) {
                if (res !== null) {
                    if (res.result === "SUCCESS") {
                        $("#timeLoadingDiv").hide();
                        var timeRemaining = echarts.init(document.getElementById("timeRemainingModals"));
                        timeRemaining.resize();
                        moriarty.stressMax(resourceUUID);
                        moriarty.workload(resourceUUID);
                        moriarty.getTimeRemainingData(resourceUUID);
                        moriarty.getTopNAlert();
                        moriarty.getAlertList();
                        var data = res.data;
                        loadChart(data);
                        return data;
                    }
                }
            })
        })
    })

    /*给剩余容量绑定点击事件*/
    $("#capacityRemaining").click(function () {
        $("#remainCapacityModal").modal("show");
        var resourceUUID = ""
        moriarty.doGet("/api/v1/business/getuuid", { resourceName : "HANA虚拟机资源池" }, function (res) {
            if(res.result == 'SUCCESS'){
                resourceUUID = res.data;
            }else{
                moriarty.alert(res.message);
                return;
            }
            moriarty.doGet("/api/v1/vrop/resource/surplus/capacity", {"uuid": resourceUUID}, function (res) {
                if (res !== null) {
                    if (res.result === "SUCCESS") {
                        $("#capacityLoadingDiv").hide();
                        $("#capacityBody").css("z-index","1");
                        var data = res.data;

                        if (data["capacityRemaining"] === 0) {
                            $("#stressMax-surplusCapacity").css("background-image", "-webkit-linear-gradient(top,#fffafb,#fff3f4)");
                            $("#stressMax-surplusCapacity").find("img").attr("src", "/images/capacity_serious.png");
                            $("#stressType-surplusCapacity").text("容量最受限于磁盘空间(分配)。");
                            $("#stressType-surplusCapacity").siblings("div").remove();
                            $("#stressType-surplusCapacity").after($("<div></div>").text("严重"));
                        } else {
                            $("#stressMax-surplusCapacity").css("background-image", "-webkit-linear-gradient(top,#f4fff4,#e8ffe8)");
                            $("#stressMax-surplusCapacity").find("img").attr("src", "/images/capacity_normal.png");
                            $("#stressType-surplusCapacity").text("正常: 没有问题。");
                        }

                        $("#usageRate-surplusCapacity").text(data["capacityRemaining"].toFixed(0));
                        $("#surplusCapacity").text(data["capacityRemaining"].toFixed(0) + " % 的剩余容量");
                        $("#totalCapacity").text("总计: " + (data["totalCapacity"] / 1024 / 1024).toFixed(2) + " GB");
                        $("#availableCapacity").text("可用容量: " + (data["availableCapacity"] / 1024 / 1024).toFixed(2) + " GB (" + (data["availableCapacity"] / data["totalCapacity"]).toFixed(2) * 100 + "%)");
                        $("#remaining").text(data["capacityRemainingUsing"]);
                        $("#remaining").next().text("剩余");
                        $("#used_capacity").text((100 - data["capacityRemaining"]).toFixed(0) + " % 已使用的可用容量");
                        $("#surplus").css("background-color", "#f6fafb");
                        $("#barChart").html("");

                        if ((100 - data["capacityRemaining"]) === 0) {
                            $("#usedCapacityColor").css("background-color", "#3F6785");
                            $("#barChart").append($("<div></div>").css({
                                "height": "45px",
                                "background-color": "#3F6785",
                                "width": "100%"
                            }));
                            $("#cacheBarChart").css("background-color", "#0c0c0c");
                        } else if ((100 - data["capacityRemaining"]) === 100) {
                            $("#usedCapacityColor").css("background-color", "#CC2027");
                            $("#barChart").append($("<div></div>").css({
                                "height": "45px",
                                "background-color": "#CC2027",
                                "width": "100%"
                            }));
                            $("#cacheBarChart").css("background-color", "#0c0c0c");
                        } else {
                            $("#usedCapacityColor").css("background-color", "#68A543");
                            $("#barChart").append($("<div></div>").css({
                                "width": (100 - data["capacityRemaining"]) + "%",
                                "display": "inline-block",
                                "padding-right": "1px"
                            }).append($("<div></div>").css({
                                "height": "45px",
                                "background-color": "#68A543"
                            }))).append($("<div></div>").css({
                                "height": "45px",
                                "background-color": "#3F6785",
                                "width": data["capacityRemaining"] + "%",
                                "display": "inline-block"
                            }));
                            $("#cacheBarChart").css("background-color", "#0c0c0c");
                        }
                    }
                }
            })
        })
    });

    /* 给业务运行状态概览列表增加点击事件 */
    $(document).on("click","div.healthyNameDiv]",function(){
        var name = $(this).attr("title");
        moriarty.doGet("/api/v1/business/getuuid", { resourceName : name }, function (res) {
            var resourceUUID = "";
            if(res.result == 'SUCCESS'){
                resourceUUID = res.data;
            }else{
                moriarty.alert(res.message);
                return;
            }
            location.href="/operation/"+name+"?uuid="+resourceUUID;
        });
    });

    var businessStart = 3;
    var hostStart = 3;
    window.dashboard = {
        init: function () {
            moriarty.doGet("/api/v1/cluster/names", null, function (res) {
                moriarty.loadTopPage(res.data);
                $(".simulate-option").click(function () {
                    if ($(this).hasClass("selector"))
                        return;
                    $(".simulate-option").removeClass("selector");
                    $(this).addClass("selector");
                    $(".simulate-text").text($(this).text());
                    initPage();
                    var clusterName = $(".simulate-text").text();
                    if (clusterName === null || clusterName === "" || clusterName === undefined) {
                        toastr.warning("当前无群集", "注意");
                        return;
                    }
                });

                initPage();
            })
        },
        prev: function (selector, _this) {
            var start = businessStart;
            if (selector === "hostList") {
                start = hostStart;
            }
            var data = $("#" + selector).DataTable().data();
            var tableData = [];
            $.each(data, function (index, item) {
                tableData.push(item);
            });
            var arr = tableData.slice(start - 6, start - 3);
            if (start - 6 <= 0) {
                $(_this).removeAttr("onclick");
                $(_this).find("i").css("color", "#d8d8d8");
            } else {
                $(_this).attr("onclick", "dashboard.prev('" + selector + "',this)");
                $(_this).find("i").css("color", "");
            }

            if (start-3 >= 0) {
                $(_this).next().attr("onclick", "dashboard.next('" + selector + "',this)");
                $(_this).next().find("i").css("color", "");
            }

            if (selector === "hostList") {
                changeHost(arr);
                hostStart = hostStart - 3;
            } else {
                changeBusiness(arr);
                businessStart = businessStart - 3;
            }
        },
        next: function (selector, _this) {
            var start = businessStart;
            if (selector === "hostList") {
                start = hostStart;
            }
            var data = $("#" + selector).DataTable().data();
            var tableData = [];
            $.each(data, function (index, item) {
                tableData.push(item);
            });
            var arr = tableData.slice(start, start + 3);

            if (start + 3 >= data.length) {
                $(_this).removeAttr("onclick");
                $(_this).find("i").css("color", "#d8d8d8");
            } else {
                $(_this).attr("onclick", "dashboard.next('" + selector + "',this)");
                $(_this).find("i").css("color", "");
            }

            if (start - 3 >= 0) {
                $(_this).prev().attr("onclick", "dashboard.prev('" + selector + "',this)");
                $(_this).prev().find("i").css("color", "");
            }

            if (selector === "hostList") {
                changeHost(arr);
                hostStart = hostStart + 3;
            } else {
                changeBusiness(arr);
                businessStart = businessStart + 3
            }
        }
    };

    var initPage = function () {
        var clusterName = $(".simulate-text").text();
        if (clusterName === null || clusterName === "" || clusterName === undefined) {
            $(".simulate-text").text("当前无集群");
            return;
        }

        var cpuPieChart = initCpuPieChart();
        var momPieChart = initMemPieChart();
        var storagePieChart = initStoragePieChart();
        moriarty.doGet("/api/v1/cluster/info", {clusterName: clusterName}, function (res) {
            console.log(res);
            if (res !== null && res !== undefined) {
                var clusterState = res["clusterState"];

                var usageInfo = res["usageInfoList"];
                // var storageStatus = clusterState["storage"];
                // var cpuStatus = clusterState["cpu"];
                // var memStatus = clusterState["mem"];
                // loadState($("#storageStatus"), storageStatus['vsanDatastore']);
                // loadHostState($("#storage-host-state"), storageStatus, clusterName);
                var storageTotal = usageInfo["storageTotal"];
                var storageUsage = usageInfo["storageUsage"];
                var storageUsable = storageTotal - storageUsage;
                var storagePieOption = moriarty.initPieChartOption(storageUsable, storageUsage);
                storagePieChart.setOption(storagePieOption);
                storagePieChart.hideLoading();
                var storagePercentage = 0 + "%";
                if (storageTotal !== 0) {
                    storagePercentage = ((storageUsable / storageTotal) * 100).toFixed(1) + "%";
                }
                $("#storageTotal").text((storageTotal / 1024).toFixed().length > 3 ?
                    (storageTotal / (1024 * 1024)).toFixed(2) + "TB" : (storageTotal / 1024).toFixed(2) + "GB");
                $("#storagePercentage").text(storagePercentage + "可用(物理)");
                $("#storageUsage").text(
                    (storageUsage / 1024).toFixed().length > 3 ?
                        (storageUsage / (1024 * 1024)).toFixed(2) + "TB" : (storageUsage / 1024).toFixed(2) + "GB");
                $("#storageUsable").text(
                    (storageUsable / 1024).toFixed().length > 3 ?
                        (storageUsable / (1024 * 1024)).toFixed(2) + "TB" : (storageUsable / 1024).toFixed(2) + "GB");

                // loadState($("#cpuStatus"), cpuStatus[clusterName]);
                // loadHostState($("#cpu-host-state"), cpuStatus, clusterName);
                var cpuTotal = usageInfo["cpuTotal"];
                var cpuUsage = usageInfo["cpuUsage"];
                var cpuUsable = cpuTotal - cpuUsage;
                var cpuPieOption = moriarty.initPieChartOption(cpuUsable, cpuUsage);
                cpuPieChart.setOption(cpuPieOption);
                cpuPieChart.hideLoading();
                $("#cpuUsage").text((cpuUsage / 1000).toFixed(2) + "GHz");
                $("#cpuUsable").text((cpuUsable / 1000).toFixed(2) + "GHz");
                $("#cpuTotal").text((cpuTotal / 1000).toFixed(2) + "GHz");

                // loadState($("#memStatus"), memStatus[clusterName]);
                // loadHostState($("#mem-host-state"), memStatus, clusterName);
                var memoryTotal = usageInfo["memoryTotal"];
                var memoryUsage = usageInfo["memoryUsage"];
                var memoryUsable = memoryTotal - memoryUsage;

                var memPieOption = moriarty.initPieChartOption(memoryUsable, memoryUsage);
                momPieChart.setOption(memPieOption);
                momPieChart.hideLoading();
                $("#memUsable").text((memoryUsable / 1024).toFixed().length > 3 ?
                    (memoryUsable / (1024 * 1024)).toFixed(2) + "TB" : (memoryUsable / 1024).toFixed(2) + "GB");
                $("#memUsage").text((memoryUsage / 1024).toFixed().length > 3 ?
                    (memoryUsage / (1024 * 1024)).toFixed(2) + "TB" : (memoryUsage / 1024).toFixed(2) + "GB"
                );
                $("#memTotal").text((memoryTotal / 1024).toFixed().length > 3 ?
                    (memoryTotal / (1024 * 1024)).toFixed(2) + "TB" : (memoryTotal / 1024).toFixed(2) + "GB"
                );
                $('[data-toggle="tooltip"]').tooltip();
            }
        });

        //getHostStatus();
        getAlarmStatus();
        // getHealthList();
        getBusinessHealth();
        getHostList();
        getBusinessSummary();
        getScore();
    };

    var getScore = function () {
        var scoreChart = initScoreChart();
        moriarty.doGet("/api/v1/vrop/datacenter/score", null, function (res) {
            var detail = "";
            var remaining = "";
            var color = "#e66c7c";
            if (res !== null) {
                var data = res.data;
                if (data !== null && data !== "" && data !== undefined) {
                    var timeRemaining = data["capacityRemaining"];
                    var capacityRemaining = data["timeRemaining"];
                    if(capacityRemaining !== undefined){
                        capacityRemaining = Math.round(capacityRemaining);
                        $("#capacityRemaining").text("剩余容量:  " + capacityRemaining);
                    }
                    if(timeRemaining !== undefined){
                        timeRemaining = Math.round(timeRemaining);
                        $("#timeRemaining").text("剩余时间:  " + timeRemaining);
                    }

                    if(capacityRemaining === undefined && timeRemaining !== undefined){
                        remaining = timeRemaining;
                        detail = getDetailInfo("timeRemaining",remaining);
                    }
                    if(capacityRemaining !== undefined && timeRemaining === undefined){
                        remaining = capacityRemaining;
                        detail = getDetailInfo("capacityRemaining",remaining);
                    }
                    if(capacityRemaining === undefined && timeRemaining === undefined){
                        remaining = 0;
                        detail = getDetailInfo("timeRemaining",remaining);
                    }
                    if(capacityRemaining !== undefined && timeRemaining !== undefined){
                        if(capacityRemaining < timeRemaining){
                            remaining = capacityRemaining;
                            detail = getDetailInfo("capacityRemaining",remaining);
                        }else {
                            remaining = timeRemaining;
                            detail = getDetailInfo("timeRemaining",remaining);
                        }
                    }

                    if(remaining > 30){
                        color = "#6bab64";
                    }
                    $("#"+detail.type).css("color", color);
                }
                // var option = initScoreChartOption(name, remaining, color, detail);
                var option = initPieScoreChartOption(remaining, detail.detail);
                scoreChart.setOption(option);
                scoreChart.hideLoading();
            }
        })
    };

    var getDetailInfo = function (type,value) {
        if(value > 30){
            return {detail:"正常:没有问题",type:type};
        }else {
            if(type === "capacityRemaining"){
                return {detail:"容量最受限于磁盘空间(分配)。",type:type};
            }else {
                return {detail:"重大问题",type:type};
            }
        }
    };

    /*var getHostStatus = function () {
        moriarty.doGet("/api/v1/host/status", null, function (res) {
            if (res !== null) {
                var integralPieChart = initIntegralPieChart();
                var integralStateOption = moriarty.initIntegralStateOption(res.data);
                integralPieChart.setOption(integralStateOption);
                integralPieChart.hideLoading();

                integralPieChart.on('click', function (param) {
                    var dataIndex = param["dataIndex"];
                    /!* 0:正常 1：黄色告警 2：红色告警 *!/
                    switch (dataIndex) {
                        case 0:
                            window.location.href = "/host/list?type=green";
                            break;
                        case 1:
                            window.location.href = "/host/list?type=yellow";
                            break;
                        case 2:
                            window.location.href = "/host/list?type=red";
                            break;
                        default:
                            break;
                    }
                })
            }
        });
    };*/

    var getAlarmStatus = function () {
        moriarty.doGet("/api/v1/alarm/status", null, function (res) {
            if (res !== null) {
                var integralPieChart = initIntegralPieChart();
                var integralStateOption = moriarty.initAlarmIntegralStateOption(res.data);
                integralPieChart.setOption(integralStateOption);
                integralPieChart.hideLoading();

                integralPieChart.on('click', function (param) {
                    var dataIndex = param["dataIndex"];
                    /* 0:正常 1：黄色告警 2：红色告警 */
                    switch (dataIndex) {
                        case 0:
                            break;
                        case 1:
                            window.location.href = "/alarm/all/list?type=yellow";
                            break;
                        case 2:
                            window.location.href = "/alarm/all/list?type=red";
                            break;
                        default:
                            break;
                    }
                })
            }
        });
    };

    var getBusinessHealth = function () {
        var healthChart = initHealthPieChart();
        moriarty.doGet("/api/v1/vrop/business/health", null, function (res) {
            if (res !== null) {
                if (res.result === "SUCCESS") {
                    var count = res.count;
                    var seriesData = [];
                    var legendData = ["正常", "异常", "警告", "错误", "未知"];
                    $.each(count, function (status, number) {
                        switch (status) {
                            case"green":
                                seriesData.push(series(number, "正常", "#6bab64"));
                                break;
                            case"yellow":
                                seriesData.push(series(number, "异常", "#FAB648"));
                                break;
                            case"orange":
                                seriesData.push(series(number, "警告", "orange"));
                                break;
                            case"red":
                                seriesData.push(series(number, "错误", "#e66c7c"));
                                break;
                            case"grey":
                                seriesData.push(series(number, "未知", "grey"));
                                break;
                        }
                    });
                    var option = initHealthStateOption(legendData, seriesData);
                    healthChart.setOption(option);
                    healthChart.hideLoading();

                    var data = res.data;
                    var columns = [
                        {
                            data: "name",
                            render: function (data, type, full, meta) {
                                return $("<div></div>").append($("<div></div>").css({
                                    "overflow": "hidden",
                                    "text-overflow": "ellipsis",
                                    "white-space": "nowrap",
                                    "cursor" : "pointer"
                                }).attr("title", data).attr("class","healthyNameDiv").text(data)).html();
                            }
                        },
                        {
                            data: "health",
                            render: function (data, type, full, meta) {
                                data = judgeState("businessHealthList", data);
                                return $("<div></div>").append($("<div></div>").css({
                                    "overflow": "hidden",
                                    "text-overflow": "ellipsis",
                                    "white-space": "nowrap"
                                }).text(data)).html();
                            }
                        }
                    ];
                    initDatable(data, "businessHealthList", columns);
                    // initHealthTable(data, $("#businessHealthList"));
                }
            }
        })
    };

    var getHostList = function () {
        var healthChart = initHostSummaryPieChart();
        moriarty.doGet("/api/v1/host/list", null, function (res) {
            if (res !== null) {
                if (res.result === "SUCCESS") {
                    var count = res.count;
                    var seriesData = [];
                    var legendData = ["正常", "未知", "关机","维护中","警告","严重警告","挂起"];

                    seriesData.push(series(count["poweredon"], "维护中", "#768df0"));
                    seriesData.push(series(count["unknown"], "未知", "#fb9678"));
                    seriesData.push(series(count["poweredoff"], "关机", "grey"));
                    seriesData.push(series(count["red"], "严重警告", "#E66C7C"));
                    seriesData.push(series(count["yellow"], "警告", "#FAB648"));
                    seriesData.push(series(count["green"], "正常", "#6BAB64"));
                    seriesData.push(series(count["standby"], "挂起", "#19b5fe"));
                    /*$.each(count, function (status, number) {
                        switch (status) {
                            case"poweredon":
                                seriesData.push(series(number, "维护中", "#FAB648"));
                                break;
                            case"unknown":
                                seriesData.push(series(number, "未知", "grey"));
                                break;
                            case "poweredoff":
                                seriesData.push(series(number, "关机", "#fb9678"));
                                break;
                            case "red":
                                seriesData.push(series(number, "严重警告", "#E66C7C"));
                                break;
                            case "yellow":
                                seriesData.push(series(number, "警告", "#F5C4CB"));
                                break;
                            case "green":
                                seriesData.push(series(number, "正常", "#6BAB64"));
                                break;
                        }
                    });*/
                    var option = initHealthStateOption(legendData, seriesData);
                    healthChart.setOption(option);
                    healthChart.hideLoading();

                    var data = res.data;
                    var columns = [
                        {
                            data: "hostname",
                            render: function (data, type, full, meta) {
                                return $("<div></div>").append($("<div></div>").css({
                                    "overflow": "hidden",
                                    "text-overflow": "ellipsis",
                                    "white-space": "nowrap"
                                }).attr("title", data).text(data)).html();
                            }
                        },
                        {
                            data: "powerState",
                            render: function (data, type, full, meta) {
                                data = judgeState("hostList", data);
                                return $("<div></div>").append($("<div></div>").css({
                                    "overflow": "hidden",
                                    "text-overflow": "ellipsis",
                                    "white-space": "nowrap"
                                }).text(data)).html();
                            }
                        }
                    ];
                    initDatable(data, "hostList", columns);
                    // initSummaryTable(data, $("#hostList"));
                }
            }
        });

        healthChart.on('click', function (param) {
            var dataIndex = param["dataIndex"];
            switch (dataIndex) {
                case 0:
                    window.location.href = "/host/list?type=maintenance";
                    break;
                case 1:
                    window.location.href = "/host/list?type=unknown";
                    break;
                case 2:
                    window.location.href = "/host/list?type=poweredoff";
                    break;
                case 3:
                    window.location.href = "/host/list?type=red";
                    break;
                case 4:
                    window.location.href = "/host/list?type=yellow";
                    break;
                case 5:
                    window.location.href = "/host/list?type=green";
                    break;
                case 6:
                    window.location.href = "/host/list?type=standby";
                    break;

                default:
                    break;
            }
        })
    };

    var getBusinessSummary = function () {
        var healthChart = initBusinessSummaryPieChart();
        moriarty.doGet("/api/v1/business/count", null, function (res) {
            if (res !== null) {
                if (res.result === "SUCCESS") {
                    var count = res.data;
                    var seriesData = [];
                    var legendData = ["已处理", "待处理", "处理中", "失败"];
                    $.each(count, function (status, number) {
                        switch (status) {
                            case"SUCCESS":
                                seriesData.push(series(number, "已处理", "#6bab64"));
                                break;
                            case"WAIT":
                                seriesData.push(series(number, "待处理", "grey"));
                                break;
                            case"RUNNING":
                                seriesData.push(series(number, "处理中", "#FAB648"));
                                break;
                            case"FAIL":
                                seriesData.push(series(number, "失败", "#e66c7c"));
                                break;
                        }
                    });
                    var option = initHealthStateOption(legendData, seriesData);
                    healthChart.setOption(option);
                    healthChart.hideLoading();
                }
            }
        });
        healthChart.on('click', function (param) {
            var dataIndex = param["dataIndex"];
            /* 0:已处理 1：待处理 2：处理中  3：失败*/
            switch (dataIndex) {
                case 0:
                    window.location.href = "/service/serviceList?status=2";
                    break;
                case 1:
                    window.location.href = "/service/serviceList?status=0";
                    break;
                case 2:
                    window.location.href = "/service/serviceList?status=1";
                    break;
                case 3:
                    window.location.href = "/service/serviceList?status=3";
                    break;
                default:
                    break;
            }
        })
    };

    var getHealthList = function () {
        moriarty.doGet("/api/v1/vrop/health/list", null, function (res) {
            if (res !== null) {
                var data = res.data;
                if (data !== null && data.length !== 0) {
                    $.each(data, function (index, state) {
                        var type = state["type"];
                        var color = state["color"];
                        var score = state["score"].toFixed(0);
                        switch (type) {
                            case "RISK":
                                $("#risk").text(score);
                                judgeColor($("#risk_img"), color);
                                break;
                            case "EFFICIENCY":
                                $("#efficiency").text(score);
                                judgeColor($("#efficiency_img"), color);
                                break;
                            case "COMPLIANCE":
                                $("#compliance").text(score);
                                judgeColor($("#compliance_img"), color);
                                break;
                            case "TIME_REMAINING":
                                $("#restrict").text(score);
                                judgeColor($("#restrict_img"), color);
                                break;
                            case "ANOMALY":
                                $("#anomaly").text(score);
                                judgeColor($("#anomaly_img"), color);
                                break;
                            case "HEALTH":
                                $("#health").text(score);
                                judgeColor($("#health_img"), color);
                                break;
                            default:
                                break;
                        }
                    })
                }
            }
        })
    };

    var getDashboardLatecy = function () {
        //整体延时
        moriarty.doPost("/api/v1/dashboard/realTime", JSON.stringify({
            "params": [
                {"name": "totalWriteLatency", "group": "datastore"},
                {"name": "totalReadLatency", "group": "datastore"}]
        }), function (res) {
            if (res !== null) {
                var data = res.data;
                if (data === null || data === undefined) {
                    return;
                }

                var keys = Object.keys(data);
                keys.sort(function (o1, o2) {
                    return o1.localeCompare(o2);
                });


                for (var i in keys) {
                    var $body = $("<div></div>").addClass("col-md-12 item-padding");
                    var $border = $("<div></div>").attr("style", "height: 330px;").addClass("item-dashboard");
                    var $title = $("<div></div>").attr("style", "position: relative").addClass("item-title").text(keys[i] + "整体延时情况");
                    var $chartBody = $("<div></div>").attr("style", "height: 300px").addClass("item-body").append($("<div></div>").attr({
                        "style": "width: 100%;height: 100%",
                        "id": keys[i] + "dataStore"
                    }));
                    $body.append($border.append($title).append($chartBody));
                    $(".panel-body .row .item-padding:last").after($body);
                }

                for (var j in keys) {
                    var chart = echarts.init(document.getElementById(keys[j] + "dataStore"));
                    chart.showLoading();
                    var series = [];
                    var category = data[keys[j]];
                    var times;
                    var legend = [];

                    for (var key in category) {
                        var name;
                        if (key === "name:totalreadlatency;group:datastore;") {
                            name = "读取滞后时间";
                        } else if (key === "name:totalwritelatency;group:datastore;") {
                            name = "写入滞后时间";
                        } else {
                            continue;
                        }
                        if (category.hasOwnProperty(key)) {
                            var o = category[key];
                            times = o["times"];
                            delete o["times"];
                            for (var x in o) {
                                if (!o.hasOwnProperty(x)) {
                                    continue;
                                }
                                legend.push(x + " " + name);
                                var one = buildSeries(x + " " + name, o[x]);
                                series.push(one);
                            }
                        }
                    }

                    var option = moriarty.initLMultipleLineChartOption(times, null, legend);
                    option.series = series;
                    chart.setOption(option);
                    chart.hideLoading();
                }
            }
        });
    };

    var getDashboardNetwork = function () {
        //整体网络
        moriarty.doPost("/api/v1/dashboard/realTime", JSON.stringify({
            "params": [
                {"name": "usage", "group": "net"},
                {"name": "received", "group": "net"},
                {"name": "transmitted", "group": "net"}
            ]
        }), function (res) {
            if (res !== null) {
                var data = res.data;
                if (data === null || data === undefined) {
                    return;
                }

                var keys = Object.keys(data);
                keys.sort(function (o1, o2) {
                    return o1.localeCompare(o2);
                });


                for (var i in keys) {
                    var $body = $("<div></div>").addClass("col-md-12 item-padding");
                    var $border = $("<div></div>").attr("style", "height: 330px;").addClass("item-dashboard");
                    var $title = $("<div></div>").attr("style", "position: relative").addClass("item-title").text(keys[i] + "整体网络情况");
                    var $chartBody = $("<div></div>").attr("style", "height: 300px").addClass("item-body").append($("<div></div>").attr({
                        "style": "width: 100%;height: 100%",
                        "id": keys[i] + "network"
                    }));
                    $body.append($border.append($title).append($chartBody));
                    $(".panel-body .row .item-padding:last").after($body);
                }

                for (var j in keys) {
                    var chart = echarts.init(document.getElementById(keys[j] + "network"));
                    chart.showLoading();
                    var series = [];
                    var category = data[keys[j]];
                    var times;
                    var legend = [];

                    for (var key in category) {
                        var name;
                        if (key === "name:received;group:net;") {
                            name = "数据接收速度";
                        } else if (key === "name:usage;group:net;") {
                            name = "使用情况";
                        } else if (key === "name:transmitted;group:net;") {
                            name = "数据传输速度";
                        } else {
                            continue;
                        }
                        if (category.hasOwnProperty(key)) {
                            var o = category[key];
                            times = o["times"];
                            delete o["times"];
                            for (var x in o) {
                                if (!o.hasOwnProperty(x)) {
                                    continue;
                                }

                                legend.push((x.trim() === "" ? keys[j] : x ) + " " + name);
                                var one = buildSeries((x.trim() === "" ? keys[j] : x) + " " + name, o[x]);
                                series.push(one);
                            }
                        }
                    }

                    var option = moriarty.initLMultipleLineChartOption(times, null, legend);
                    option.series = series;
                    chart.setOption(option);
                    chart.hideLoading();
                }
            }
        });
    };

    var getCpuLatecy = function () {
        //cpu 延时排名
        moriarty.doPost("/api/v1/performance/vm/realTime", JSON.stringify({
            params: [
                {"name": "transmitted", "group": "net", "filter": true},
                {"name": "ready", "group": "cpu", "filter": false},
                {"name": "usage", "group": "net", "filter": true},
                {"name": "totalReadLatency", "group": "datastore", "filter": false},
                {"name": "totalWriteLatency", "group": "datastore", "filter": false}
            ],
            type: "vm",
            performance: "AVERAGE",
            length: 10
        }), function (res) {
            if (res !== null) {
                var result = res.data;
                var dataStoreReadLatency = result["name:totalreadlatency;group:datastore;"];
                var dataStoreWriteLatency = result["name:totalwritelatency;group:datastore;"];
                var cpuReady = result["name:ready;group:cpu;"];
                var netUsage = result["name:usage;group:net;"];
                var netTransmitted = result["name:transmitted;group:net;"];

                var $drlTable = loadTopTen(dataStoreReadLatency, function (item, callback) {
                    callback(item["name:totalreadlatency;group:datastore;"].toFixed(2) + "ms");
                });
                $("#vm-iops-read").append($drlTable);

                var $drwTable = loadTopTen(dataStoreWriteLatency, function (item, callback) {
                    callback(item["name:totalwritelatency;group:datastore;"].toFixed(2) + "ms");
                });
                $("#vm-iops-write").append($drwTable);

                var $cupReadyTable = loadTopTen(cpuReady, function (item, callback) {
                    callback(item["name:ready;group:cpu;"].toFixed(2) + "ms");
                });
                $("#cpu-ready").append($cupReadyTable);

                var $nuTable = loadTopTen(netUsage, function (item, callback) {
                    callback(item["name:usage;group:net;"].toFixed(2) + "kbps");
                });
                $("#net-usage").append($nuTable);

                var $ntTable = loadTopTen(netTransmitted, function (item, callback) {
                    callback(item["name:transmitted;group:net;"].toFixed(2) + "kbps");
                });
                $("#net-transmitted").append($ntTable);
            }
        });
    };

    var buildSeries = function (name, data) {
        return {
            name: name,
            type: 'line',
            smooth: true,
            data: data
        }
    };

    var initCpuPieChart = function () {
        var chart = echarts.init(document.getElementById("cpu_pie_chart"));
        moriarty.showChartLoading(chart);
        return chart;
    };

    var initMemPieChart = function () {
        var chart = echarts.init(document.getElementById("mem_pie_chart"));
        moriarty.showChartLoading(chart);
        return chart;
    };

    var initStoragePieChart = function () {
        var chart = echarts.init(document.getElementById("storage_pie_chart"));
        moriarty.showChartLoading(chart);
        return chart;
    };

    var initIntegralPieChart = function () {
        var chart = echarts.init(document.getElementById("integral_pie_chart"));
        moriarty.showChartLoading(chart);
        return chart;
    };

    var initHealthPieChart = function () {
        var chart = echarts.init(document.getElementById("business_health_pie_chart"));
        moriarty.showChartLoading(chart);
        return chart;
    };

    var initHostSummaryPieChart = function () {
        var chart = echarts.init(document.getElementById("host_list_pie_chart"));
        moriarty.showChartLoading(chart);
        return chart;
    };

    var initScoreChart = function () {
        var chart = echarts.init(document.getElementById("score_chart"));
        moriarty.showChartLoading(chart);
        return chart;
    };

    var initBusinessSummaryPieChart = function () {
        var chart = echarts.init(document.getElementById("business_count_pie_chart"));
        moriarty.showChartLoading(chart);
        return chart;
    };

    /*-- 健康状态 --*/
    var initHealthStateOption = function (legendData, seriesData) {
        return {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: '1%',
                data: legendData
            },
            series: [
                {
                    name: '运行状态',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '50%'],
                    data: seriesData,
                    itemStyle: {
                        normal: {
                            label: {
                                show: false
                            }
                        }
                    }
                }
            ]
        };
    };

    var series = function (value, name, color) {
        return {
            value: value,
            name: name,
            itemStyle: {
                normal: {
                    color: color
                }
            }
        };
    };

    var initDatable = function (data, selector, column) {
        $("#" + selector).DataTable({
            paging: true,
            processing: false,
            lengthChange: false,
            ordering: false,
            autoWidth: true,
            info: false,
            serverSide: false,
            fixedHeader: true,
            searching: false,
            aLengthMenu: [3],
            // scrollY: "142px",
            // scrollCollapse: true,
            data: data,
            columns: column,
            initComplete: function () {
                changeTableStyle(selector);
            },
            language: {url: '/lang/datatable.chs.json'}
        });
    };

    var changeTableStyle = function (selector) {
        var color;
        var data = $("#" + selector).DataTable().data();
        var $next = "";
        if (data !== null && data !== "" && data !== undefined) {
            if (data.length <= 3) {
                color = "#d8d8d8";
            }
        }
        var $row = $("<div></div>").addClass("row");
        var $prev = $("<div></div>").css({
            "display": "inline-block",
            "margin-right": "22px"
        }).append($("<i></i>").css({
            "cursor": "pointer",
            "color": "#d8d8d8"
        }).addClass("fa  fa-backward"));

        if (color === "#d8d8d8") {
            $next = $("<div></div>").css("display", "inline-block").append($("<i></i>").css({
                "cursor": "pointer",
                "color": color
            }).addClass("fa  fa-forward"));
        } else {
            $next = $("<div></div>").css("display", "inline-block").attr("onclick", "dashboard.next('" + selector + "',this)").append($("<i></i>").css({
                "cursor": "pointer",
                "color": color
            }).addClass("fa  fa-forward"));
        }
        $row.append($("<div></div>").addClass("col-md-12").css("text-align", "center").append($prev).append($next));
        $("#" + selector + "_paginate").parent().parent().after($row);

        $("#" + selector + "_paginate").parent().parent().remove();
    };

    var changeBusiness = function (arr) {
        var $tbody = $("#businessHealthList").find("tbody");
        $tbody.html("");
        var $name = "";
        var $state = "";
        var state = "";
        $.each(arr, function (index, item) {
            var $tr = $("<tr></tr>").attr("role", "row");
            state = judgeState("businessHealthList", item["health"]);
            $name = $("<div></div>").css({
                "overflow": "hidden",
                "text-overflow": "ellipsis",
                "white-space": "nowrap",
                "cursor" : "pointer"
            }).attr("title", item["name"]).attr("class","healthyNameDiv").text(item["name"]);
            $state = $("<div></div>").css({
                "overflow": "hidden",
                "text-overflow": "ellipsis",
                "white-space": "nowrap"
            }).attr("title", state).text(state);
            $tr.append($("<td></td>").append($name)).append($("<td></td>").append($state));
            $tbody.append($tr);
        })
    };

    var changeHost = function (arr) {
        var $tbody = $("#hostList").find("tbody");
        $tbody.html("");
        var $name = "";
        var $state = "";
        var state = "";
        $.each(arr, function (index, item) {
            var $tr = $("<tr></tr>").attr("role", "row");
            state = judgeState("hostList", item["powerState"]);
            $name = $("<div></div>").css({
                "overflow": "hidden",
                "text-overflow": "ellipsis",
                "white-space": "nowrap"
            }).attr("title", item["hostname"]).text(item["hostname"]);
            $state = $("<div></div>").css({
                "overflow": "hidden",
                "text-overflow": "ellipsis",
                "white-space": "nowrap"
            }).attr("title", state).text(state);
            $tr.append($("<td></td>").append($name)).append($("<td></td>").append($state));
            $tbody.append($tr);
        })
    };

    var judgeState = function (type, data) {
        if (type === "hostList") {
            switch (data) {
                case"poweredoff":
                    data = "关机";
                    break;
                case"unknown":
                    data = "未知";
                    break;
                case"standby":
                    data = "挂起";
                    break;
                case"yellow":
                    data = "警告";
                    break;
                case"red":
                    data = "严重警告";
                    break;
                case"poweredon":
                    data = "维护中";
                    break;
                case"green":
                    data = "正常";
                    break;
            }
            return data;
        } else if (type === "businessHealthList") {
            switch (data) {
                case"GREEN":
                    data = "正常";
                    break;
                case"YELLOW":
                    data = "异常";
                    break;
                case"ORANGE":
                    data = "警告";
                    break;
                case"RED":
                    data = "错误";
                    break;
                case"GREY":
                    data = "未知";
                    break;
            }
            return data;
        }
    };

    var loadTopTen = function (list, callback) {
        var $table = $("<table></table>").attr("style", "margin-top:0 !important;").addClass("table table-striped dataTable no-footer");
        var $tbody = $("<tbody></tbody>");
        $.each(list, function (index, item) {
            var $tr = $("<tr></tr>").addClass(index % 2 === 0 ? "odd" : "even");
            var $tdName = $("<td></td>").addClass("sorting_1").text(item["vmName"]);

            callback(item, function (val) {
                var $tdValue = $("<td></td>").addClass("sorting_1").attr("style", "text-align:right;").text(val);
                $tr.append($tdName).append($tdValue);
                $tbody.append($tr);
            });

        });

        $table.append($tbody);

        return $table;
    };

    var judgeColor = function (selector, color) {
        switch (color) {
            case "GREEN":
                selector.attr("src", "/images/green_score.png");
                break;
            case "YELLOW":
                selector.attr("src", "/images/yellow_score.png");
                break;
            case "ORANGE":
                selector.attr("src", "/images/orange_score.png");
                break;
            case "RED":
                selector.attr("src", "/images/red_score.png");
                break;
            case "GREY":
                selector.attr("src", "/images/grey_score.png");
                break;
        }
    };

    var initPieScoreChartOption = function (data, detail) {
        var color = ["#e66c7c", 'rgba(230, 108, 124, 0.4)'];
        // color = ["#da891d", 'rgba(218, 137, 29, 0.4)'];
        if (data > 30 && data <= 100) {
            color = ['#6bab64', 'rgba(107, 171, 100, 0.4)'];
        }
        return {
            color: color,
            tooltip: {
                trigger: 'item',
                formatter: "{a}"
            },
            legend: {
                show: false
            },
            series: [
                {
                    name: detail,
                    type: 'pie',
                    radius: ['45%', '80%'],
                    avoidLabelOverlap: false,
                    hoverAnimation: false,
                    label: {
                        normal: {
                            show: true,
                            position: 'center',
                            formatter: function (params) {
                                return data;
                            },
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: [
                        {
                            value: data
                        },
                        {
                            value: 100 - data
                        }
                    ]
                }
            ]
        }
    };

    var loadChart = function (datas) {
        var chart = echarts.init(document.getElementById("timeRemainingModals"));
        chart.showLoading();
        var seriesData = [];
        var legend = [];
        var legendData = "";
        $.each(datas, function (index, data) {
            var type = data["type"];
            var remaining = data["remaining"];
            var max = 0;
            switch (type) {
                case 'cpu':
                    if (remaining > 365) {
                        legendData = "CPU 1 年以上";
                        remaining = 365;
                    } else {
                        legendData = "CPU " + remaining;
                    }
                    break;
                case 'mem':
                    if (remaining > 365) {
                        legendData = "内存 1 年以上";
                        remaining = 365;
                    } else {
                        legendData = "内存 " + remaining;
                    }
                    break;
                case 'disk':
                    legendData = "磁盘 " + remaining;
                    break;
                case 'vsphere':
                    if (remaining > 365) {
                        legendData = "vSphere 配置限制 1 年以上";
                        remaining = 365;
                    } else {
                        legendData = "vSphere 配置限制 " + remaining;
                    }
                    break;
            }
            legend.push(legendData);
            // if (type !== "vsphere") {
            //     max = 100;
            // }
            if (data["name"] !== "Disk Demand") {
                var series = {
                    name: legendData,
                    type: 'line',
                    areaStyle: {
                        normal: {},
                        data: [
                            {
                                name: data["stressFreePre"],
                                value: [0, data["stressFreePre"]]
                            },
                            {
                                name: data["stressFreePre"],
                                value: [remaining, data["stressFreePre"]]
                            }
                        ]
                    }
                 };
                seriesData.push(series);
            }
        });
        var option = moriarty.initChart(legend, seriesData);
        chart.setOption(option);
        chart.hideLoading();
    };

    window.onresize = function () {
        var cpuChart = echarts.init(document.getElementById("cpu_pie_chart"));
        var memChart = echarts.init(document.getElementById("mem_pie_chart"));
        var storageChart = echarts.init(document.getElementById("storage_pie_chart"));
        var integralChart = echarts.init(document.getElementById("integral_pie_chart"));
        var business_health_chart = echarts.init(document.getElementById("business_health_pie_chart"));
        var host_list_chart = echarts.init(document.getElementById("host_list_pie_chart"));
        var business_count_chart = echarts.init(document.getElementById("business_count_pie_chart"));
        var score_chart = echarts.init(document.getElementById("score_chart"));
        cpuChart.resize();
        memChart.resize();
        storageChart.resize();
        integralChart.resize();
        business_health_chart.resize();
        host_list_chart.resize();
        business_count_chart.resize();
        score_chart.resize();
        // window.location.reload();
    }
})();
