/**
 * Created by pengq on 2017/6/9.
 */
!(function () {
    window.hostoverview = {
        cpuChart: echarts.init(document.getElementById("cpu_chart")),
        cpuPercentageChart: echarts.init(document.getElementById("cpu_chart_percentage")),
        memChart: echarts.init(document.getElementById("memory_chart")),
        memPercentageChart: echarts.init(document.getElementById("memory_chart_percentage")),
        storageChart: echarts.init(document.getElementById("storage_chart")),
        networkChart: echarts.init(document.getElementById("network_chart")),
        cpuOption: {},
        cpuPercentageOption: {},
        memOption: {},
        memPercentageOption: {},
        storageOption: {},
        networkOption: {},
        heatMapCache: null,//{"host1":data1,"host2":data2}
        heatMapHistoryWidth:0,
        init: function () {
            hostoverview.heatMapHistoryWidth = $("#hostContainer").width();
            $("#hostContainer").resize(function (e) {
                initHeatMap("");
            });

            moriarty.doGet("/api/v1/host/hostNames", null, function (res) {
                if (res === null || res.data === null || res.data === undefined || res.data.length === 0) {
                    $("#hostname").text("暂无主机");
                    return;
                }
                var hostname = $("#hostname").text();
                var $ul = $("<ul></ul>").addClass("dropdown-menu").attr("role", "menu");
                var hostNames = res.data;
                hostNames.sort(function (a, b) {
                    return a.localeCompare(b);
                });
                $.each(hostNames, function (index, data) {
                    if (data === hostname) {
                        $ul.append($("<li></li>").addClass("simulate-select").append($("<a></a>").addClass("simulate-option selector").css("cursor", "pointer").text(data)));
                    } else {
                        $ul.append($("<li></li>").addClass("simulate-select").append($("<a></a>").addClass("simulate-option").css("cursor", "pointer").text(data)));
                    }
                });
                $("#hostname").after($ul);

                $(".simulate-option").bind("click", function () {
                    if ($(this).hasClass("selector"))
                        return;
                    $(".simulate-option").removeClass("selector");
                    $(this).addClass("selector");
                    $("#hostname").text($(this).text()).append($("<span></span>").addClass("caret").css("margin-left", "5px"));
                    initPage();
                });
            });

            $(".gbtn").bind("click", function () {
                if ($(this).hasClass("checked")) {
                    return;
                }
                var url, type, chart, duration = $(this).data("duration");
                $(this).parent().find(".gbtn").removeClass("checked");
                type = $(this).parent().data("type");
                $(this).addClass("checked");
                switch (type) {
                    case "cpu":
                        url = "/api/v1/performance/host/cpuUsageHistoryInfo";
                        chart = hostoverview.cpuChart;
                        break;
                    case "mem":
                        url = "/api/v1/performance/host/memUsageHistoryInfo";
                        chart = hostoverview.memChart;
                        break;
                    case "storage":
                        url = "/api/v1/performance/host/diskUsageHistoryInfo";
                        chart = hostoverview.storageChart;
                        break;
                    case "cpuPercentage":
                        url = "/api/v1/performance/host/cpuPercentageHistoryInfo";
                        chart = hostoverview.cpuPercentageChart;
                        break;
                    case "memPercentage":
                        url = "/api/v1/performance/host/memPercentageHistoryInfo";
                        chart = hostoverview.memPercentageChart;
                        break;
                    case "network":
                        url = "/api/v1/performance/host/netUsageHistoryInfo";
                        chart = hostoverview.networkChart;
                        break;
                    default:
                        break;
                }
                var hostname = $("#hostname").text();
                if (hostname === null || hostname === "" || hostname === undefined) {
                    toastr.warning("当前无主机", "注意");
                    return;
                }
                moriarty.showChartLoading(chart);
                moriarty.doGet(url, {
                    duration: duration,
                    hostName: hostname
                }, function (res) {
                    if (res !== null) {
                        var option;
                        if (typeof (res.data) === "object" && Object.keys(res.data).length > 0) {
                            var cpuData = res.data[hostname + "-cpuUsage"];
                            var memData = res.data[hostname + "-memUsage"];
                            var cpuPercentageData = res.data[hostname + "-cpuPercentage"];
                            var memPercentageData = res.data[hostname + "-memPercentage"];
                            var storageData = res.data[hostname + "-diskUsage"];
                            var networkData = res.data[hostname + "-netUsage"];

                            if (cpuData !== null && cpuData !== undefined) {
                                if ($("#cpuGroup .checked").data("duration") !== cpuData["duration"]) {
                                    return;
                                }
                                option = hostoverview.cpuOption = moriarty.initLineChartOption(cpuData.dates, cpuData.values, cpuYAxisShow, cpuToast);
                            }
                            if (memData !== null && memData !== undefined) {
                                if ($("#memGroup .checked").data("duration") !== memData["duration"]) {
                                    return;
                                }
                                option = hostoverview.memOption = moriarty.initLineChartOption(memData.dates, memData.values, memYAxisShow, memToast);
                            }
                            if (storageData !== null && storageData !== undefined) {
                                if ($("#storageGroup .checked").data("duration") !== storageData["duration"]) {
                                    return;
                                }
                                option = hostoverview.storageOption = moriarty.initLineChartOption(storageData.dates, storageData.values, storageYAxisShow, storageToast);
                            }
                            if (cpuPercentageData !== null && cpuPercentageData !== undefined) {
                                if ($("#cpuPercentageGroup .checked").data("duration") !== cpuPercentageData["duration"]) {
                                    return;
                                }
                                option = hostoverview.cpuPercentageOption = moriarty.initLineChartOption(cpuPercentageData.dates, cpuPercentageData.values, cpuPercentageYAxisShow, cpuPercentageToast);
                            }
                            if (memPercentageData !== null && memPercentageData !== undefined) {
                                if ($("#memPercentageGroup .checked").data("duration") !== memPercentageData["duration"]) {
                                    return;
                                }
                                option = hostoverview.memPercentageOption = moriarty.initLineChartOption(memPercentageData.dates, memPercentageData.values, memPercentageYAxisShow, memPercentageToast);
                            }
                            if (networkData !== null && networkData !== undefined) {
                                if ($("#networkGroup .checked").data("duration") !== networkData["duration"]) {
                                    return;
                                }
                                option = hostoverview.networkOption = moriarty.initLineChartOption(networkData.dates, networkData.values, networkYAxisShow, networkToast);
                            }
                            chart.clear();
                            chart.setOption(option);
                            chart.hideLoading();
                        } else {
                            chart.clear();
                        }
                    } else {
                        swal("", "请求超时", "error");
                    }
                })
            });

            initPage();
        },
        switchBody: function (_this) {
            var hostname = $("#hostname").text();
            if (!$(_this).hasClass("title-selector")) {
                $(_this).parent().children().removeClass("title-selector");
                $(_this).addClass("title-selector");
            }
            var category = $(_this).data("category");
            $("#" + category).parent().children("div[class='panel-body switch-body']").addClass("hidden");
            $("#" + category).removeClass("hidden");
            if (category==="hardwareSummary"){
                initPage();
                // initHeatMap(hostname);
            }
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

    var cpuToast = function (params) {
        params = params[0];
        var date = new Date(parseInt(params.name));
        return date.formatStandardDate() + " " + date.formatStandardTime() + ' ' + 'CPU使用情况：' + (params.value).toFixed(2) + "MHz";
    };
    var cpuYAxisShow = function (value, idx) {
        return value.toFixed(2) + " MHz";
    };

    var cpuPercentageToast = function (params) {
        params = params[0];
        var date = new Date(parseInt(params.name));
        return date.formatStandardDate() + " " + date.formatStandardTime() + ' ' + 'CPU使用率：' + (params.value * 10).toFixed(2) + "%";
    };
    var cpuPercentageYAxisShow = function (value, idx) {
        return (10 * value).toFixed(2) + " %";
    };

    var memPercentageToast = function (params) {
        params = params[0];
        var date = new Date(parseInt(params.name));
        return date.formatStandardDate() + " " + date.formatStandardTime() + ' ' + '内存使用率：' + (params.value * 10).toFixed(2) + "%";
    };
    var memPercentageYAxisShow = function (value, idx) {
        return (value * 10).toFixed(2) + " %";
    };

    var memToast = function (params) {
        params = params[0];
        var date = new Date(parseInt(params.name));
        return date.formatStandardDate() + " " + date.formatStandardTime() + ' ' + '内存使用：' + (params.value / 1024).toFixed(2) + "GB";
    };
    var memYAxisShow = function (value, idx) {
        return (value / 1024).toFixed(2) + " GB";
    };

    var storageToast = function (params) {
        params = params[0];
        var date = new Date(parseInt(params.name));
        return date.formatStandardDate() + " " + date.formatStandardTime() + ' ' + '存储使用：' + (params.value).toFixed(2) + "KBps";
    };
    var storageYAxisShow = function (value, idx) {
        return value.toFixed(2) + " KBps";
    };
    var networkToast = function (params) {
        params = params[0];
        var date = new Date(parseInt(params.name));
        return date.formatStandardDate() + " " + date.formatStandardTime() + ' ' + '网络使用：' + (params.value).toFixed(2) + "KBps";
    };
    var networkYAxisShow = function (value, idx) {
        return value.toFixed(2) + " KBps";
    };

    var initPage = function () {
        var hostname = $("#hostname").text();
        if (hostname === null || hostname === "" || hostname === undefined) {
            toastr.warning("选择主机", "注意");
            return;
        }

        moriarty.showChartLoading([
            hostoverview.cpuPercentageChart,
            hostoverview.cpuPercentageChart,
            hostoverview.memPercentageChart,
            hostoverview.networkChart,
            hostoverview.cpuChart,
            hostoverview.memChart,
            hostoverview.storageChart]);
        moriarty.doGet("/api/v1/performance/host/historyInfo", {
            hostName: hostname,
            duration: "oneWeek"
        }, function (res) {
            console.log(res);
            if (res !== null && res !== undefined) {
                var data = res.data;
                if (data === null || data === undefined) {
                    return;
                }
                var mem = data[hostname + "-memUsage"];
                var cpu = data[hostname + "-cpuUsage"];
                var memPercentage = data[hostname + "-memPercentage"];
                var cpuPercentage = data[hostname + "-cpuPercentage"];
                var storage = data[hostname + "-diskUsage"];
                var network = data[hostname + "-netUsage"];
                if (cpu !== null && cpu !== undefined) {
                    hostoverview.cpuOption = moriarty.initLineChartOption(cpu.dates, cpu.values, cpuYAxisShow, cpuToast);
                    hostoverview.cpuChart.setOption(hostoverview.cpuOption);
                }
                if (mem !== null && mem !== undefined) {
                    hostoverview.memOption = moriarty.initLineChartOption(mem.dates, mem.values, memYAxisShow, memToast);
                    hostoverview.memChart.setOption(hostoverview.memOption);
                }
                if (storage !== null && storage !== undefined) {
                    hostoverview.storageOption = moriarty.initLineChartOption(storage.dates, storage.values, storageYAxisShow, storageToast);
                    hostoverview.storageChart.setOption(hostoverview.storageOption);
                }
                if (cpuPercentage !== null && cpuPercentage !== undefined) {
                    hostoverview.cpuPercentageOption = moriarty.initLineChartOption(cpuPercentage.dates, cpuPercentage.values, cpuPercentageYAxisShow, cpuPercentageToast);
                    hostoverview.cpuPercentageChart.setOption(hostoverview.cpuPercentageOption);
                }
                if (memPercentage !== null && memPercentage !== undefined) {
                    hostoverview.memPercentageOption = moriarty.initLineChartOption(memPercentage.dates, memPercentage.values, memPercentageYAxisShow, memPercentageToast);
                    hostoverview.memPercentageChart.setOption(hostoverview.memPercentageOption);
                }
                if (network !== null && network !== undefined) {
                    hostoverview.networkOption = moriarty.initLineChartOption(network.dates, network.values, networkYAxisShow, networkToast);
                    hostoverview.networkChart.setOption(hostoverview.networkOption);
                }
                hostoverview.cpuChart.hideLoading();
                hostoverview.memChart.hideLoading();
                hostoverview.storageChart.hideLoading();
                hostoverview.cpuPercentageChart.hideLoading();
                hostoverview.memPercentageChart.hideLoading();
                hostoverview.networkChart.hideLoading();
            }

            initHeatMap(hostname);
        });

        var cpuPieChart = initCpuPieChart();
        var momPieChart = initMemPieChart();
        var storagePieChart = initStoragePieChart();
        //todo init pie chart
        moriarty.doGet("/api/v1/host/detailInfo", {hostname: hostname}, function (res) {
            console.log(res);
            if (res !== null && res !== undefined) {
                var info = res.data;
                if (info === null || info === undefined) {
                    return;
                }

                var cpuTotal = info["cpuCapacity"],
                    cpuUsage = info["cpuUsage"],
                    cpuUnused = cpuTotal - cpuUsage,
                    memTotal = info["memoryCapacity"],
                    memUsage = info["memoryUsage"],
                    memUnused = memTotal - memUsage,
                    storageTotal = info["dataStoreCapacity"],
                    storageUsage = info["dataStoreUsage"],
                    storageUnused = storageTotal - storageUsage;

                $("#storageTotal").text((storageTotal / (1024 * 1024)).toFixed(2) + " TB");
                $("#storageUsage").text((storageUsage / (1024 * 1024)).toFixed(2) + " TB");
                $("#storageUsable").text((storageUnused / (1024 * 1024)).toFixed(2) + " TB");
                $("#cpuTotal").text(cpuTotal / 1000 + " GHz");
                $("#cpuUsage").text(cpuUsage / 1000 + " GHz");
                $("#cpuUsable").text(cpuUnused / 1000 + " GHz");
                $("#memTotal").text((memTotal / 1024).toFixed(2) + " GB");
                $("#memUsage").text((memUsage / 1024).toFixed(2) + " GB");
                $("#memUsable").text((memUnused / 1024).toFixed(2) + " GB");
                var cpuPieOption = moriarty.initPieChartOption(cpuUnused, cpuUsage),
                    memPieOption = moriarty.initPieChartOption(memUnused, memUsage),
                    storagePieOption = moriarty.initPieChartOption(storageUnused, storageUsage);
                cpuPieChart.setOption(cpuPieOption);
                cpuPieChart.hideLoading();
                momPieChart.setOption(memPieOption);
                momPieChart.hideLoading();
                storagePieChart.setOption(storagePieOption);
                storagePieChart.hideLoading();

                /*硬件概要*/
                $("#memoryValue").html("");

                if (info["supplier"] === "" || info["supplier"] === null || info["supplier"] === undefined) {
                    $("#vendorValue").text("无");
                } else {
                    $("#vendorValue").text(info["supplier"]);
                }
                if (info["model"] === "" || info["model"] === null || info["model"] === undefined) {
                    $("#modelValue").text("无");
                } else {
                    $("#modelValue").text(info["model"]);
                }
                var hostMemorySize = parseFloat(info["memoryCapacity"] / 1024).toFixed(2);
                $("<div></div>").text(hostMemorySize + "GB").appendTo($("#memoryValue"));
                $.each(info["memoryStatusInfo"], function (index, item) {
                    $("<span></span>").text("状态：").append($("<i></i>").addClass("fa fa-circle").css({
                        "color": item.state,
                        "margin-left": "5px"
                    })).appendTo($("#memoryValue"));
                });
                $("#cpuCoresValue").text(info["cpuCores"]);
                $("#numCpuPkgs").text(info["cpuCount"]);
                $.each(info["cpuStatusInfo"], function (index, item) {
                    $("<tr></tr>").append($("<td></td>").addClass("numCpuPkgs").text("CPU" + (index + 1)).css({
                        "text-align": "center",
                        "vertical-align": "middle"
                    }))
                        .append($("<td></td>").append($("<div></div>").text("名称：" + item.name)).css("text-align", "center").append($("<span></span>").text("状态：").append($("<i></i>").addClass("fa fa-circle").css({
                            "color": item.state,
                            "margin-left": "5px"
                        })))).appendTo($("#hardwareInfoTBody"));
                })
            }
        });

        moriarty.doGet("/api/v1/alarm/hostsList", {hostname: hostname}, function (res) {
            $(".health-body").empty();
            if (res.result === "SUCCESS") {
                if (res.data === null || res.data.length <= 0) {
                    $(".health-body").append($("<div style='text-align: center'>暂无警告</div>"))
                } else {
                    var alarmList = res.data;
                    $.each(alarmList, function (index, alarm) {
                        var backgroundColor;
                        if (alarm["overallStatus"] === "red") {
                            backgroundColor = "#fb5257";
                        } else if (alarm["overallStatus"] === "yellow") {
                            backgroundColor = "#fab648";
                        }

                        var $div = $("<div></div>").addClass("list").css({
                            "background-color": backgroundColor,
                            "color": "#fff"
                        }).text(
                            alarm["name"] + ":" + alarm["description"] + " " + new Date(alarm["stateTime"]).formatStandardDate() + " " + new Date(alarm["stateTime"]).formatStandardTime());

                        $(".health-body").append($div);
                    })
                }
            } else {
                $(".health-body").append($("<div style='text-align: center'>暂无警告</div>"))
            }
        });

        var url = '/api/v1/vm/list/hostName?hostName=' + hostname;
        virtualMachine.init(url);
        $('.preloader').hide();
    };

    var initHeatMap = function (hostname) {
        $("#hostContainer").html("");
        var $heatItem = $("<div></div>").addClass("disk-state");
        var $leftItem = $("<div></div>").addClass("col-md-6 col-sm-6 disk_half left");
        var $rightItem = $("<div></div>").addClass("col-md-6 col-sm-6 disk_half right");
        appendItems($leftItem,0);
        appendItems($rightItem,6);
        $heatItem.append($leftItem).append($rightItem);

        var $powerInfo = $("<div></div>").addClass("power-state");
        $powerInfo.append(
            $("<span></span>").addClass("host-name").text("-----")).append(
            $("<div></div>").addClass("disk").append(
                $("<scan></scan>").text("系统盘1：")).append(
                $("<scan></scan>").attr("data-key","BAY12").addClass("disk-state-unKnown"))).append(
            $("<div></div>").addClass("disk").append(
                $("<scan></scan>").text("系统盘2：")).append(
                $("<scan></scan>").attr("data-key","BAY13").addClass("disk-state-unKnown"))).append(
            $("<div></div>").addClass("power").append(
                $("<scan></scan>").text("电源状态：")).append(
                $("<scan></scan>").attr("data-key","power").addClass("disconnected").css("margin-right","5px")));

        $("#hostContainer").append($heatItem).append($powerInfo);
        var heatWidth = $(".disk-state").width();
        var halfWidth = $(".disk-state .disk_half").width();



        $(".disk-state").css({
            height:heatWidth/3
        });
        $("#hostContainer").html("");
        var $heatItem = $("<div></div>").addClass("disk-state");
        var $leftItem = $("<div></div>").addClass("col-md-6 col-sm-6 disk_half left");
        var $rightItem = $("<div></div>").addClass("col-md-6 col-sm-6 disk_half right");
        appendItems($leftItem,0);
        appendItems($rightItem,6);
        $heatItem.append($leftItem).append($rightItem);

        var $powerInfo = $("<div></div>").addClass("power-state");
        $powerInfo.append(
            $("<span></span>").addClass("host-name").text("-----")).append(
            $("<div></div>").addClass("disk").append(
                $("<scan></scan>").text("系统盘1：")).append(
                $("<scan></scan>").attr("data-key","BAY12").addClass("disk-state-unKnown"))).append(
            $("<div></div>").addClass("disk").append(
                $("<scan></scan>").text("系统盘2：")).append(
                $("<scan></scan>").attr("data-key","BAY13").addClass("disk-state-unKnown"))).append(
            $("<div></div>").addClass("power").append(
                $("<scan></scan>").text("电源状态：")).append(
                $("<scan></scan>").attr("data-key","power").addClass("disconnected").css("margin-right","5px")));

        $("#hostContainer").append($heatItem).append($powerInfo);

       /* var $powerInfo = $("<div></div>").addClass("power-state");
        $powerInfo.append(
            $("<span></span>").addClass("host-name").text("192.168.1111.111")).append(
            $("<div></div>").addClass("disk").text("1")).append(
            $("<div></div>").addClass("disk").text("2")).append(
            $("<div></div>").addClass("power").text("3"));
            $("#hostContainer").append($heatItem).append($powerInfo)*/;

        var heatWidth = $(".disk-state").width();
        var halfWidth = $(".disk-state .disk_half").width();
        $(".disk-state").css({
            height:heatWidth/3
        });
        var minItem = halfWidth/25;
        var itemWidth = 3*minItem;
        $(".disk_host_map_item").css({
            "width":itemWidth,
            "margin-right":0,
            "margin-left":minItem
        });

        if(hostname !== ""){
            buildCoverLayer(hostname,itemWidth);
        }

    };

    var appendItems = function ($selector,index) {
        for (var i = index;i<index+6;i++){
            $selector.append($("<div></div>").addClass("disk_host_map_item").attr("data-bay",i));
        }
    };

    var buildCoverLayer = function (hostname,itemWidth) {
        loadData(hostname,itemWidth);
    };



    var loadData = function (hostname,itemWidth) {
        var cache = window.hostoverview.heatMapCache;
        if (cache === null || cache === undefined||!cache.hasOwnProperty(hostname)) {
            moriarty.doGet("/api/v1/disk/health", {hostname: hostname}, function (res) {
                var data = res.data;
                if (data === null || data === undefined) {
                    return;
                }
                if(cache===null){
                    cache={}
                }

                cache[hostname] = data;
                fillPage(data,itemWidth);
            });
        } else {
            fillPage(cache[hostname],itemWidth);
        }
    };

    var fillPage = function (data,itemWidth) {
        if (data === null || data === undefined) {
            return;
        }
        var $hosts = $(".disk-state");
        var size = $hosts.length;
        var keys = Object.keys(data);
        if (keys===null||keys===undefined){
            return;
        }

        keys.sort(function (a,b) {
            return a.localeCompare(b);
        });

        for (var i=0;i<keys.length;i++){
            if (i>size-1){
                break;
            }
            var hostname = keys[i];
            var disks = data[hostname];

            if (disks===null||disks===undefined||disks.length===0){
                var hostItem = $hosts[i];
                $(hostItem).attr("data-key",hostname);
                $(hostItem).next().find(".host-name").text(hostname);
                continue;
            }

            var hostItem = $hosts[i];
            $(hostItem).attr("data-key",hostname);
            $(hostItem).next().find(".host-name").text(hostname);
            getPowerStatus(hostname);
            for(var j=0;j<disks.length;j++) {
                var disk = disks[j];
                var hostDiskConfig = disk["hostDiskConfig"];
                var bayIdx = hostDiskConfig["bayIdx"];
                var sn = hostDiskConfig["sn"];
                var health = disk["health"];
                if (bayIdx===12||bayIdx===13){
                    var style = "disk-state-alarm";
                    if (health!==null&&health!==""&&health!==undefined){
                        var state = health.toLowerCase();
                        if (state==="green"){
                            state = "disk-state-normal";
                        }
                    }
                    var $current = $(".disk-state[data-key='"+hostname+"']");
                    var $power = $current.next();
                    $power.find("scan[data-key=BAY"+bayIdx+"]").attr("class",style);
                    continue;
                    // $(".power-state span[data-key=bay"+bayIdx+"]").attr("class",style);
                    // continue;
                }

                var $heatItems = $(hostItem).find(".disk_host_map_item");
                var heatItemsLength = $heatItems.length;
                if (bayIdx<=heatItemsLength-1){
                    var color = "#d8d8d8";
                    if (health!==null&&health!==""&&health!==undefined){
                        color = health.toLowerCase();
                    }
                    $($heatItems[bayIdx]).html("");
                    var $sn = $("<a></a>").addClass("top").attr("title",sn).text("BAY"+bayIdx);
                    $($heatItems[bayIdx]).append($sn);
                    var snWidth  = $sn.width();
                    $sn.attr("style","left:"+(itemWidth-snWidth)/2 +"px");
                    var $healthDiv = $("<scan></scan>").addClass("bottom").css({
                        "height": itemWidth/3,
                        "width": itemWidth/3,
                        "border-radius": itemWidth/3,
                        "background-color": color,
                        "display": "block",
                        "left":itemWidth/3
                    });

                    $($heatItems[bayIdx]).append($sn).append($healthDiv)
                }
            }
        }
    };

    var getPowerStatus = function (hostname) {
      moriarty.doGet("/api/v1/host/power",{"hostname":hostname},function (res) {
          if (res!==null && res.data!==null && res.data!==undefined && res.data!==""){
              var powerState = res.data[hostname];
              if (powerState==="on"){
                  $(".power-state scan[data-key='power']").removeClass("disconnected");
                  $(".power-state scan[data-key='power']").addClass("connected");
              }
          }
      })
    };

    window.onresize = function () {
        hostoverview.cpuChart.resize();
        hostoverview.cpuPercentageChart.resize();
        hostoverview.memChart.resize();
        hostoverview.memPercentageChart.resize();
        hostoverview.storageChart.resize();
        hostoverview.networkChart.resize();
    }
})();