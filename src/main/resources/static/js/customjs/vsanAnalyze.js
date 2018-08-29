!(function () {
    var vsanAnalyze = {};
    var clusteruuid = "";
    var hostuuid = "";
    var diskuuid = "";
    var writeDataLength = 0;
    var writeColors = ["#02fe00", "#0bf500", "#22e100", "#29db00", "#32d300", "#42c500", "#52b700", "#55b500", "#66a600", "#789600", "#878800", "#967800", "#9f6e00", "#a66500", "#ad5d00", "#b55500", "#ba4f00", "#c14700", "#c54200", "#ca3d00", "#cf3700", "#d33200", "#db2900", "#e02400", "#e32000", "#ea1800", "#f11000", "#f60a00", "#fc0400", "#fb0500"];
    var readColors = ["#fb0500", "#fc0400", "#f60a00", "#f11000", "#b55500", "#ad5d00", "#a66500", "#9f6e00", "#967800", "#878800", "#789600", "#66a600", "#55b500", "#52b700", "#42c500", "#32d300", "#29db00", "#22e100", "#0bf500", "#02fe00"];
    vsanAnalyze.init = function () {
        getVsanClusterList();
        moriarty.getTopNAlert();
        moriarty.getAlertList();
    };

    var getVsanClusterList = function () {
        moriarty.doGet("/api/v1/vrop/vsan/list", null, function (res) {
            if (res !== null) {
                loadVsanClusterList(res.data);
                $('#vsanClusterList tbody').on('click', 'tr', function () {
                    if (!$(this).hasClass("selector")) {

                        $(this).parent().find("tr").css("background-color", "#fff").removeClass("selector");
                        $(this).css("background-color", "#d9e4ea").addClass("selector");
                        clusteruuid = $("#vsanClusterList").DataTable().row(this).data().uuid;
                        loadVsanClusterBusyChart();
                        loadVsanDelayChart();
                        loadUnfinishedIOChart();
                        loadVsanCacheLayerChart();
                        getVsanHostList();
                        getDiskGroupWrite();
                        getResourceClusterId(clusteruuid);

                        $("#diskGroupWrite").html("");
                        $("#tooltipSelector").html("");
                        $("#tooltip").html("");
                        $("#diskGroupReadIO").html("");
                    }
                });
            }
        });
    };

    var getVsanHostList = function () {
        moriarty.doGet("/api/v1/vrop/vsan/hosts", {"uuid": clusteruuid}, function (res) {
            if (res !== null) {
                loadVsanHostList(res.data);
                $('#vsanHostList tbody').on('click', 'tr', function () {
                    if (!$(this).hasClass("selector")) {
                        $(this).parent().find("tr").css("background-color", "#fff").removeClass("selector");
                        $(this).css("background-color", "#d9e4ea").addClass("selector");
                        hostuuid = $("#vsanHostList").DataTable().row(this).data().uuid;
                        loadVsanHostBusyChart();
                        getDiskGroupList();
                    }
                });
            }
        });
    };

    var getDiskGroupList = function () {
        moriarty.doGet("/api/v1/vrop/host/diskGroup", {"uuid": hostuuid}, function (res) {
            if (res !== null) {
                loadDiskGroupList(res.data);
                $('#diskGroupList tbody').on('click', 'tr', function () {
                    if (!$(this).hasClass("selector")) {
                        $(this).parent().find("tr").css("background-color", "#fff").removeClass("selector");
                        $(this).css("background-color", "#d9e4ea").addClass("selector");
                        diskuuid = $("#diskGroupList").DataTable().row(this).data().uuid;
                        loadDiskGroupChart();
                    }
                });
            }
        });
    };

    var getDiskGroupWrite = function () {
        moriarty.doGet("/api/v1/vrop/vsan/diskGroup/write", {"uuid": clusteruuid}, function (res) {
            $("#tooltip").html("");
            $("#tooltipSelector").html("");
            $("#diskGroupWrite").html("");
            if (res !== null) {
                var data = res.data;
                if (data !== null && data.length !== 0 && data !== '') {
                    var writeData = res.data;
                    var option = null;
                    var max = 0;
                    var min = 0;
                    var grid = {
                        "top": 0,
                        "bottom": 0
                    };
                    writeDataLength = writeData.length;
                    var lastNum = getLastNum(writeData);
                    writeData.sort(function (a, b) {
                        return b["last"] - a["last"];
                    });
                    $.each(writeData, function (index, data) {
                        var times = data["times"];
                        var datas = data["datas"];
                        var last = data["last"];
                        var name = data["name"];
                        var $tooltip = $("<div></div>").css("display", "none").attr("id", "tooltip" + index);
                        var $diskGroupWrite = "";
                        var backgroundColor = "";
                        var minValue = 70;
                        if (last >= minValue) {
                            for (var i = 0; i <= 30; i++) {
                                minValue = minValue + 1;
                                if (last < minValue) {
                                    backgroundColor = writeColors[i - 1];
                                    break;
                                }
                            }
                        }
                        if (index === 0) {
                            $diskGroupWrite = $("<div></div>").addClass("vsan-disk-group-write").css({
                                "position": "relative",
                                "background-color": backgroundColor
                            }).attr({
                                "id": "vsanDiskGroup" + index,
                                "data-id": "tooltip" + index
                            }).append($("<div></div>").css({
                                "color": "#000",
                                "position": "absolute",
                                "font-size": "8px"
                            }).text(name));
                        } else {
                            $diskGroupWrite = $("<div></div>").addClass("vsan-disk-group-write").css("background-color", backgroundColor).attr({
                                "id": "vsanDiskGroup" + index,
                                "data-id": "tooltip" + index
                            });
                        }
                        $("#tooltipSelector").append("div#tooltip" + index + "{ position:absolute; width:auto; height:auto; border:1px solid #ffff;background-color: #ffff;padding: 5px;border-radius: 5px}")
                        $("#tooltip").append($tooltip);
                        $("#diskGroupWrite").append($diskGroupWrite);
                        $("#vsanDiskGroup" + index).css({"width": (last / lastNum) * 100 + "%"});
                        var $vsanCluster = $("<div></div>").addClass("row").css("margin-bottom", "5px").append($("<div></div>").addClass("col-md-3").text("vSAN 群集:")).append($("<div></div>").addClass("col-md-9").css("font-size", "12px").text(name));
                        var $vsanDiskGroup = $("<div></div>").addClass("row").css("margin-bottom", "5px").append($("<div></div>").addClass("col-md-3").text("vSAN磁盘组:")).append($("<div></div>").addClass("col-md-9").css("font-size", "12px").text(name));
                        var $sizeAccording = $("<div></div>").addClass("row").css("margin-bottom", "5px").append($("<div></div>").addClass("col-md-10").text("大小依据 - 写入缓冲区|使用情况(%):")).append($("<div></div>").addClass("col-md-2").text(last));
                        var $colorAccording = $("<div></div>").addClass("row").css("margin-bottom", "5px").append($("<div></div>").addClass("col-md-10").text("颜色依据 - 写入缓冲区|使用情况(%):")).append($("<div></div>").addClass("col-md-2").text(last));
                        var $chart = $("<div></div>").addClass("row").css("margin-bottom", "5px").append($("<div></div>").addClass("col-md-3").text("迷你图")).append($("<div></div>").addClass("col-md-7").append($("<div></div>").css({
                            "height": "20px",
                            "width": "100%"
                        }).attr("id", "diskGroupWriteChart" + index))).append($("<div></div>").addClass("col-md-2").text(last));
                        $("#" + "tooltip" + index).append($vsanCluster).append($vsanDiskGroup).append($sizeAccording).append($colorAccording).append($chart);
                        var chart = echarts.init(document.getElementById("diskGroupWriteChart" + index));
                        fixedList(datas, function (items) {
                            option = initVsanBusyChart(times, items, name);
                            max = Math.max.apply(Math, items);
                            min = Math.min.apply(Math, items);
                            option.grid = grid;
                            option.yAxis.max = max;
                            option.yAxis.min = min;
                            chart.setOption(option);
                        });
                    });
                    var $colorStrip = $("<div></div>").css({"width": "50%"});
                    $.each(writeColors, function (index, color) {
                        var width = "";
                        if (index < 20) {
                            width = "3%";
                        } else {
                            width = "4%";
                        }
                        $colorStrip.append($("<div></div>").css({
                            "background-color": color,
                            "display": "inline-block",
                            "height": "15px",
                            "width": width
                        }));
                    });
                    $("#diskGroupWrite").append($colorStrip);
                    $colorStrip.after($("<div></div>").css("width", "50%").append($("<div></div>").addClass("pull-left").css("font-size", "10px").text("70")).append($("<div></div>").addClass("pull-right").css("font-size", "10px").text("100")));
                } else {
                    $("#diskGroupWrite").append($("<div></div>").css({
                        "text-align": "center",
                        "padding-top": "70px"
                    }).text("无数据"));
                }
                getDiskGroupReadIO();
            }
        });
    };

    var getDiskGroupReadIO = function () {
        moriarty.doGet("/api/v1/vrop/vsan/diskGroup/readio", {"uuid": clusteruuid}, function (res) {
            $("#diskGroupReadIO").html("");
            if (res !== null) {
                var data = res.data;
                if (data !== null && data.length !== 0 && data !== '') {
                    var option = null;
                    var max = 0;
                    var min = 0;
                    var grid = {
                        "top": 0,
                        "bottom": 0
                    };
                    $.each(res.data, function (index, data) {
                        var times = data["times"];
                        var datas = data["datas"];
                        var last = data["last"];
                        var name = data["name"];
                        var $tooltip = $("<div></div>").css("display", "none").attr("id", "tooltip" + (index + writeDataLength));
                        var backgroundColor = "";
                        var minValue = 80;
                        if (last >= minValue) {
                            for (var i = 0; i <= 20; i++) {
                                minValue = minValue + 1;
                                if (last < minValue) {
                                    backgroundColor = readColors[i - 1];
                                    break;
                                }
                            }
                        } else {
                            backgroundColor = readColors[0];
                        }
                        var $diskGroupWrite = $("<div></div>").addClass("vsan-disk-group-write").css("background-color", backgroundColor).attr({
                            "id": "vsanDiskGroup" + (index + writeDataLength),
                            "data-id": "tooltip" + (index + writeDataLength)
                        });
                        $("#tooltipSelector").append("div#tooltip" + (index + writeDataLength) + "{ position:absolute; width:auto; height:auto; border:1px solid #ffff;background-color: #ffff;padding: 5px;border-radius: 5px}")
                        $("#tooltip").append($tooltip);
                        $("#diskGroupReadIO").append($diskGroupWrite);

                        $("#vsanDiskGroup" + (index + writeDataLength)).css({"width": 100 / (res.data.length) + "%"});
                        var $vsanDiskGroup = $("<div></div>").addClass("row").append($("<div></div>").addClass("col-md-3").text("vSAN磁盘组:")).append($("<div></div>").addClass("col-md-9").text(name));
                        var $colorAccording = $("<div></div>").addClass("row").append($("<div></div>").addClass("col-md-10").text("颜色依据 - 读取缓存|命中率(%):")).append($("<div></div>").addClass("col-md-2").text(last));
                        var $chart = $("<div></div>").addClass("row").css("margin-bottom", "5px").append($("<div></div>").addClass("col-md-3").text("迷你图:")).append($("<div></div>").addClass("col-md-7").append($("<div></div>").css({
                            "height": "20px",
                            "width": "100%"
                        }).attr("id", "diskGroupReadIOChart" + index))).append($("<div></div>").addClass("col-md-2").text(last));
                        $("#" + "tooltip" + (index + writeDataLength)).append($vsanDiskGroup).append($colorAccording).append($chart);
                        var chart = echarts.init(document.getElementById("diskGroupReadIOChart" + index));
                        fixedList(datas, function (items) {
                            option = initVsanBusyChart(times, items, name);
                            max = Math.max.apply(Math, items);
                            min = Math.min.apply(Math, items);
                            option.grid = grid;
                            option.yAxis.max = max;
                            option.yAxis.min = min;
                            chart.setOption(option);
                        });
                    });
                    var $colorStrip = $("<div></div>").css({"width": "50%"});
                    $.each(readColors, function (index, color) {
                        $colorStrip.append($("<div></div>").css({
                            "background-color": color,
                            "display": "inline-block",
                            "height": "15px",
                            "width": "5%"
                        }));
                    });
                    $("#diskGroupReadIO").append($colorStrip);
                    $colorStrip.after($("<div></div>").css("width", "50%").append($("<div></div>").addClass("pull-left").css("font-size", "10px").text("80")).append($("<div></div>").addClass("pull-right").css("font-size", "10px").text("100")));
                } else {
                    $("#diskGroupReadIO").append($("<div></div>").css({
                        "text-align": "center",
                        "padding-top": "70px"
                    }).text("无数据"));
                }
                initDiskDialog();
            }
        });
    };

    var loadVsanClusterList = function (data) {
        $("#vsanClusterList").DataTable({
            paging: true,
            processing: false,
            lengthChange: false,
            ordering: false,
            autoWidth: false,
            info: true,
            serverSide: false,
            fixedHeader: true,
            searching: false,
            aLengthMenu: [10],
            data: data,
            columns: [
                {
                    data: 'name'
                },
                {
                    data: 'hostNum'
                },
                {
                    data: 'vmNum'
                },
                {
                    data: 'cacheDiskNum'
                },
                {
                    data: 'capacityDiskNum'
                },
                {
                    data: 'deduplication'
                },
                {
                    data: 'configurationType'
                },
                {
                    data: 'stretched'
                },
                {
                    data: 'uuid',
                    visible: false
                }
            ],
            initComplete: function () {
                $('#vsanClusterList tbody').find("tr:first").click();
            },
            language: {url: '/lang/datatable.chs.json'}
        });
    };

    var loadVsanHostList = function (data) {
        $("#vsanHostList").DataTable({
            paging: true,
            processing: false,
            lengthChange: false,
            ordering: false,
            autoWidth: false,
            info: true,
            serverSide: false,
            fixedHeader: true,
            searching: false,
            aLengthMenu: [10],
            data: data,
            destroy: true,
            columns: [
                {
                    data: 'name'
                },
                {
                    data: 'model'
                },
                {
                    data: 'version'
                },
                {
                    data: 'vsan'
                },
                {
                    data: 'biosVersion'
                },
                {
                    data: 'maintenanceState'
                },
                {
                    data: 'cluster'
                },
                {
                    data: 'uuid',
                    visible: false
                }
            ],
            initComplete: function () {
                $('#vsanHostList tbody').find("tr:first").click();
            },
            language: {url: '/lang/datatable.chs.json'}
        });
    };

    var loadDiskGroupList = function (data) {
        $("#diskGroupList").DataTable({
            paging: true,
            processing: false,
            lengthChange: false,
            ordering: false,
            autoWidth: false,
            info: true,
            serverSide: false,
            fixedHeader: true,
            searching: false,
            aLengthMenu: [10],
            data: data,
            destroy: true,
            columns: [
                {
                    data: 'name'
                },
                {
                    data: 'adapterKindKey'
                },
                {
                    data: 'resourceKindKey'
                },
                {
                    data: 'uuid',
                    visible: false
                }
            ],
            initComplete: function () {
                $('#diskGroupList tbody').find("tr:first").click();
            },
            language: {url: '/lang/datatable.chs.json'}
        });
    };

    var loadVsanClusterBusyChart = function () {
        var cpuWorkloadChart = echarts.init(document.getElementById("cpu_workload"));
        var memWorkloadChart = echarts.init(document.getElementById("mem_workload"));
        var capacityRemainingChart = echarts.init(document.getElementById("cluster_capacity_remaining_percent"));
        var componentLimitUsedChart = echarts.init(document.getElementById("componentLimitUsed"));
        var totalThroughputChart = echarts.init(document.getElementById("total_throughput"));
        var totalIopsChart = echarts.init(document.getElementById("total_iops"));
        cpuWorkloadChart.clear();
        memWorkloadChart.clear();
        capacityRemainingChart.clear();
        componentLimitUsedChart.clear();
        totalThroughputChart.clear();
        totalIopsChart.clear();
        cpuWorkloadChart.showLoading();
        memWorkloadChart.showLoading();
        capacityRemainingChart.showLoading();
        componentLimitUsedChart.showLoading();
        totalThroughputChart.showLoading();
        totalIopsChart.showLoading();
        moriarty.doGet("/api/v1/vrop/vsan/busy", {uuid: clusteruuid}, function (res) {
            if (res !== null) {
                var option = null;
                var data = res.data;
                if (data !== null && data.length !== 0 && data !== '') {
                    $.each(res.data, function (index, data) {
                        var statKey = data["statKey"];
                        var times = data["times"];
                        var datas = data["datas"];
                        var last = data["last"].toFixed(2);
                        var name = data["name"];
                        fixedList(datas, function (items) {
                            switch (statKey) {
                                case "vsan|performance|total_throughput":
                                    removeNoData($("#total_throughput .no-data"));
                                    $("#total_throughput_value").text(last + "KBps");
                                    option = initVsanBusyChart(times, items, name);
                                    totalThroughputChart.setOption(option);
                                    break;
                                case "vsan|componentLimit|componentLimitUsed":
                                    removeNoData($("#componentLimitUsed .no-data"));
                                    $("#componentLimitUsed_value").text(last + "%");
                                    option = initVsanBusyChart(times, items, name);
                                    componentLimitUsedChart.setOption(option);
                                    break;
                                case "summary|mem_workload":
                                    removeNoData($("#mem_workload .no-data"));
                                    $("#mem_workload_value").text(last + "%");
                                    option = initVsanBusyChart(times, items, name);
                                    memWorkloadChart.setOption(option);
                                    break;
                                case "summary|cluster_capacity_remaining_percent":
                                    removeNoData($("#cluster_capacity_remaining_percent .no-data"));
                                    $("#cluster_capacity_remaining_percent_value").text(last + "%");
                                    option = initVsanBusyChart(times, datas);
                                    capacityRemainingChart.setOption(option);
                                    break;
                                case "summary|cpu_workload":
                                    removeNoData($("#cpu_workload .no-data"));
                                    $("#cpu_workload_value").text(last + "%");
                                    option = initVsanBusyChart(times, items, name);
                                    cpuWorkloadChart.setOption(option);
                                    break;
                                case "vsan|performance|total_iops":
                                    removeNoData($("#total_iops .no-data"));
                                    $("#total_iops_value").text(last + "%");
                                    option = initVsanBusyChart(times, items, name);
                                    totalIopsChart.setOption(option);
                                    break;
                                default:
                                    break;
                            }
                        });
                    });
                }
                haveData($("#cpu_workload"), cpuWorkloadChart, "15px", "40%");
                haveData($("#mem_workload"), memWorkloadChart, "15px", "40%");
                haveData($("#cluster_capacity_remaining_percent"), capacityRemainingChart, "15px", "40%");
                haveData($("#componentLimitUsed"), componentLimitUsedChart, "15px", "40%");
                haveData($("#total_throughput"), totalThroughputChart, "15px", "40%");
                haveData($("#total_iops"), totalIopsChart, "15px", "40%");
                cpuWorkloadChart.hideLoading();
                memWorkloadChart.hideLoading();
                capacityRemainingChart.hideLoading();
                componentLimitUsedChart.hideLoading();
                totalThroughputChart.hideLoading();
                totalIopsChart.hideLoading();
            }
        })
    };

    var loadVsanHostBusyChart = function () {
        var cpuWorkloadChart = echarts.init(document.getElementById("host_cpu_workload"));
        var memWorkloadChart = echarts.init(document.getElementById("host_memory_workload"));
        var cpuContentionChart = echarts.init(document.getElementById("host_cpu_contention"));
        var memContentionChart = echarts.init(document.getElementById("host_memory_contention"));
        var networkChart = echarts.init(document.getElementById("network_usage"));
        var droppedChart = echarts.init(document.getElementById("packets_dropped"));
        cpuWorkloadChart.clear();
        memWorkloadChart.clear();
        cpuContentionChart.clear();
        memContentionChart.clear();
        networkChart.clear();
        droppedChart.clear();
        cpuWorkloadChart.showLoading();
        memWorkloadChart.showLoading();
        cpuContentionChart.showLoading();
        memContentionChart.showLoading();
        networkChart.showLoading();
        droppedChart.showLoading();
        moriarty.doGet("/api/v1/vrop/host/busy", {uuid: hostuuid}, function (res) {
            if (res !== null) {
                var option = null;
                var min = 0;
                var max = 0;
                $.each(res.data, function (index, data) {
                    var statKey = data["statKey"];
                    var times = data["times"];
                    var datas = data["datas"];
                    var last = data["last"].toFixed(2);
                    var name = data["name"];
                    fixedList(datas, function (items) {
                        switch (statKey) {
                            case "mem|workload":
                                removeNoData($("#host_memory_workload .no-data"));
                                $("#host_memory_workload_value").text(last + "%");
                                option = initVsanBusyChart(times, items, name);
                                max = Math.max.apply(Math, items);
                                min = Math.min.apply(Math, items);
                                option.yAxis.max = max;
                                option.yAxis.min = min;
                                memWorkloadChart.setOption(option);
                                break;
                            case "cpu|capacity_contentionPct":
                                removeNoData($("#host_cpu_contention .no-data"));
                                $("#host_cpu_contention_value").text(last + "%");
                                option = initVsanBusyChart(times, items, name);
                                max = Math.max.apply(Math, items);
                                min = Math.min.apply(Math, items);
                                option.yAxis.max = max;
                                option.yAxis.min = min;
                                cpuContentionChart.setOption(option);
                                break;
                            case "mem|host_contentionPct":
                                removeNoData($("#host_memory_contention .no-data"));
                                $("#host_memory_contention_value").text(last + "%");
                                option = initVsanBusyChart(times, items, name);
                                max = Math.max.apply(Math, items);
                                min = Math.min.apply(Math, items);
                                option.yAxis.max = max;
                                option.yAxis.min = min;
                                memContentionChart.setOption(option);
                                break;
                            case "cpu|demand|workload":
                                removeNoData($("#host_cpu_workload .no-data"));
                                $("#host_cpu_workload_value").text(last + "%");
                                option = initVsanBusyChart(times, items, name);
                                max = Math.max.apply(Math, items);
                                min = Math.min.apply(Math, items);
                                option.yAxis.max = max;
                                option.yAxis.min = min;
                                cpuWorkloadChart.setOption(option);
                                break;
                            case "net:Aggregate of all instances|dropped":
                                removeNoData($("#packets_dropped .no-data"));
                                $("#packets_dropped_value").text(last + "%");
                                option = initVsanBusyChart(times, items, name);
                                max = Math.max.apply(Math, items);
                                min = Math.min.apply(Math, items);
                                option.yAxis.max = max;
                                option.yAxis.min = min;
                                droppedChart.setOption(option);
                                break;
                            case "net|usage_average":
                                removeNoData($("#network_usage .no-data"));
                                $("#network_usage_value").text(last + "KBps");
                                option = initVsanBusyChart(times, items, name);
                                max = Math.max.apply(Math, items);
                                min = Math.min.apply(Math, items);
                                option.yAxis.max = max;
                                option.yAxis.min = min;
                                networkChart.setOption(option);
                                break;
                            default:
                                break;
                        }
                    });
                });
                haveData($("#host_cpu_workload"), cpuWorkloadChart, "15px", "40%");
                haveData($("#host_memory_workload"), memWorkloadChart, "15px", "40%");
                haveData($("#host_cpu_contention"), cpuContentionChart, "15px", "40%");
                haveData($("#host_memory_contention"), memContentionChart, "15px", "40%");
                haveData($("#network_usage"), networkChart, "15px", "40%");
                haveData($("#packets_dropped"), droppedChart, "15px", "40%");
                cpuWorkloadChart.hideLoading();
                memWorkloadChart.hideLoading();
                cpuContentionChart.hideLoading();
                memContentionChart.hideLoading();
                networkChart.hideLoading();
                droppedChart.hideLoading();
            }
        })
    };

    var loadVsanDelayChart = function () {
        var readDelayChart = echarts.init(document.getElementById("readDelay"));
        var writeDelayChart = echarts.init(document.getElementById("writeDelay"));
        readDelayChart.clear();
        writeDelayChart.clear();
        readDelayChart.showLoading();
        writeDelayChart.showLoading();
        moriarty.doGet("/api/v1/vrop/vsan/latency", {"uuid": clusteruuid}, function (res) {
            if (res !== null) {
                var data = res.data;
                if (data !== null && data.length !== 0 && data !== '') {
                    $.each(res.data, function (index, data) {
                        var statKey = data["statKey"];
                        var times = data["times"];
                        var datas = data["datas"];
                        var last = data["last"].toFixed(2);
                        var name = data["name"];
                        fixedList(datas, function (items) {
                            var option = initVsanDelayChart(times, items, name, last);
                            switch (statKey) {
                                case "vsan|performance|latencyAvgRead":
                                    removeNoData($("#readDelay .no-data"));
                                    var areaStyle = {
                                        normal: {
                                            color: "#d9e4ea"
                                        }
                                    };
                                    option.series[0].areaStyle = areaStyle;
                                    option.color = ["#309948"];
                                    readDelayChart.setOption(option);
                                    break;
                                case "vsan|performance|latencyAvgWrite":
                                    removeNoData($("#writeDelay .no-data"));
                                    var j = 0;
                                    var visualMap = {
                                        show: false,
                                        dimension: 0,
                                        pieces: [],  //pieces的值由动态数据决定
                                        outOfRange: {
                                            color: '#F98200'
                                        }
                                    };
                                    option.visualMap = visualMap;
                                    for (var i = 0; i < items.length; i++) {
                                        if (items[i] < 30) {
                                            option.visualMap.pieces[j] = {gte: i, lte: i + 1, color: 'green'};
                                            j++;
                                        }
                                    }
                                    writeDelayChart.setOption(option);
                                    break;
                                default:
                                    break;
                            }
                        });
                    });
                }
                haveData($("#readDelay"), readDelayChart, "65px", "45%");
                haveData($("#writeDelay"), writeDelayChart, "65px", "45%");
                readDelayChart.hideLoading();
                writeDelayChart.hideLoading();
            }
        })
    };

    var loadVsanCacheLayerChart = function () {
        var congestedChart = echarts.init(document.getElementById("cacheLayer"));
        congestedChart.clear();
        congestedChart.showLoading();
        moriarty.doGet("/api/v1/vrop/vsan/congested", {"uuid": clusteruuid}, function (res) {
            if (res !== null) {
                var data = res.data;
                if (data !== null && data.length !== 0 && data !== '') {
                    $.each(res.data, function (index, data) {
                        var times = data["times"];
                        var datas = data["datas"];
                        var last = data["last"].toFixed(2);
                        var name = data["name"];
                        fixedList(datas, function (items) {
                            removeNoData($("#cacheLayer .no-data"));
                            var option = initVsanDelayChart(times, items, name, last);
                            option.color = ["#309948"];
                            congestedChart.setOption(option);
                        });
                    });
                }
                haveData($("#cacheLayer"), congestedChart, "65px", "45%");
                congestedChart.hideLoading();
            }
        })
    };

    var loadUnfinishedIOChart = function () {
        var unfinishedIOChart = echarts.init(document.getElementById("unfinishedIO"));
        unfinishedIOChart.clear();
        unfinishedIOChart.showLoading();
        moriarty.doGet("/api/v1/vrop/vsan/io", {"uuid": clusteruuid}, function (res) {
            if (res !== null) {
                var data = res.data;
                if (data !== null && data.length !== 0 && data !== '') {
                    $.each(res.data, function (index, data) {
                        var times = data["times"];
                        var datas = data["datas"];
                        var last = data["last"].toFixed(2);
                        var name = data["name"];
                        fixedList(datas, function (items) {
                            removeNoData($("#unfinishedIO .no-data"));
                            var option = initVsanDelayChart(times, items, name, last);
                            option.color = ["#309948"];
                            unfinishedIOChart.setOption(option);
                        });
                    });
                }
                haveData($("#unfinishedIO"), unfinishedIOChart, "65px", "45%");
                unfinishedIOChart.hideLoading();
            }
        })
    };

    var loadDiskGroupChart = function () {
        var busResetsChart = echarts.init(document.getElementById("busResets"));
        var commandsAbortedChart = echarts.init(document.getElementById("commandsAborted"));
        busResetsChart.clear();
        commandsAbortedChart.clear();
        busResetsChart.showLoading();
        commandsAbortedChart.showLoading();
        moriarty.doGet("/api/v1/vrop/host/disk/performance", {"uuid": diskuuid}, function (res) {
            if (res !== null) {
                var data = res.data;
                if (data !== null && data.length !== 0 && data !== '') {
                    $.each(res.data, function (index, data) {
                        var statKey = data["statKey"];
                        var times = data["times"];
                        var datas = data["datas"];
                        var last = data["last"].toFixed(2);
                        var name = data["name"];
                        fixedList(datas, function (items) {
                            var option = initVsanDelayChart(times, items, name, last);
                            switch (statKey) {
                                case "DiskI/O|busResets":
                                    removeNoData($("#busResets .no-data"));
                                    option.color = ["#309948"];
                                    busResetsChart.setOption(option);
                                    break;
                                case "DiskI/O|commandsAborted":
                                    removeNoData($("#commandsAborted .no-data"));
                                    option.color = ["#309948"];
                                    commandsAbortedChart.setOption(option);
                                    break;
                                default:
                                    break;
                            }
                        });
                    });
                }
                haveData($("#busResets"), busResetsChart, "65px", "45%");
                haveData($("#commandsAborted"), commandsAbortedChart, "65px", "45%");
                busResetsChart.hideLoading();
                commandsAbortedChart.hideLoading();
            }
        })
    };

    var initVsanBusyChart = function (xData, seriesData, name) {
        var option = {
            color: ["#000"],
            title: {
                text: "",
                left: 'left'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c}'
            },
            grid: {
                top: '5px',
                bottom: '5px',
                left: '5px',
                right: '5px'
            },
            xAxis: {
                type: 'category',
                name: 'x',
                splitLine: {show: false},
                show: false,
                axisTick: {
                    show: false
                },
                data: xData
            },
            yAxis: {
                type: 'value',
                name: 'y',
                show: false,
                min: 0,
                max: 100,
                axisTick: {
                    show: false
                }
            },
            series: [
                {
                    name: name,
                    type: 'line',
                    data: seriesData,
                    symbol: "none",
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                width: 1,//折线宽度
                                // color:"#FF0000"//折线颜色
                            }
                        }
                    },
                    markPoint: {
                        symbol: "circle",
                        symbolSize: 5,
                        itemStyle: {
                            normal: {
                                label: {
                                    show: false
                                },
                                color: "red"
                            }
                        },
                        data: [{
                            type: 'max',
                            name: '最大值'
                        }, {
                            type: 'min',
                            name: '最小值'
                        }]
                    },
                    markArea: {
                        silent: true,
                        label: {
                            normal: {
                                position: ['10%', '50%']
                            }
                        },
                        data: [
                            [{
                                name: '',
                                yAxis: 0,
                                itemStyle: {
                                    normal: {
                                        color: '#d8d8d8'
                                    }
                                }
                            }, {
                                yAxis: 10000000
                            }]
                        ]
                    }
                }
            ]
        };
        return option;
    };

    var initVsanDelayChart = function (xData, seriesData, name, subText) {
        var option = {
            // color: ["#309948", "#F98200"],
            title: {
                text: name,
                textStyle: {
                    fontSize: 12
                },
                subtext: subText,
                subtextStyle: {
                    fontSize: 12
                },
                left: 20
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (a) {
                    var $background = $("<div></div>").css({"color": "#fff"});
                    var $time = null;
                    var $value = null;
                    $.each(a, function (index, data) {
                        $time = $("<div></div>").text(new Date(parseInt(data.axisValue)).formatStandardDate() + " " + new Date(parseInt(data.axisValue)).formatStandardTime());
                        $value = $("<div></div>").text("衡量指标值：" + data.value);
                    });
                    return $("<div></div>").append($background.append($time).append($value)).html();
                }
            },
            xAxis: {
                type: 'category',
                name: '',
                splitLine: {show: true},
                show: true,
                axisTick: {
                    show: true
                },
                axisLabel: {
                    margin: 10,
                    formatter: function (value, idx) {
                        var date = new Date(parseInt(value));
                        return date.formatStandardDate() + '\n\r' + date.formatStandardTime();
                    }
                },
                data: xData
            },
            yAxis: {
                type: 'value',
                name: '',
                show: false,
                axisTick: {
                    show: false
                }
            },
            series: [
                {
                    name: "",
                    type: 'line',
                    data: seriesData,
                    symbol: "none",
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                width: 1,//折线宽度
                                // color:"#FF0000"//折线颜色
                            }
                        }
                    }
                    // areaStyle: {
                    //     normal: {
                    //         color:""
                    //     }
                    // }
                }
            ]
        };
        return option;
    };

    var initDiskDialog = function () {
        var num = $(".vsan-disk-group-write");
        for (var i = 0; i < num.length; i++) {
            var id = num[i].id;
            initOver(id);
        }
    };

    var initOver = function (vsanDiskGroupId) {
        $("#" + vsanDiskGroupId).hover(function () {
            var id = $(this).data("id");
            $("#" + id).fadeIn('slow');
        });

        $("#" + vsanDiskGroupId).mousemove(function (e) {
            var id = $(this).data("id");
            var top = e.pageY + 5;
            var left = e.pageX + 5;
            var number = id.substr(id.length - 1, 1);
            if (parseInt(number) < 5) {
                $("#" + id).css({
                    'top': top + 'px',
                    'left': left + 'px',
                    'z-index': '999'
                });
            } else {
                $("#" + id).css({
                    'top': top + 'px',
                    'left': (left - 420) + 'px',
                    'z-index': '999'
                });
            }
        });

        $("#" + vsanDiskGroupId).mouseout(function () {
            var id = $(this).data("id");
            $("#" + id).css({
                'top': 'unset',
                'left': 'unset',
                'z-index': '-1',
                'display': 'none'
            });
        });
    };

    var fixedList = function (datas, callback) {
        var items = [];
        $.each(datas, function (index, item) {
            items.push(item.toFixed(2));
        });
        callback(items);
    };

    var getLastNum = function (datas) {
        var lastNum = 0;
        $.each(datas, function (index, data) {
            var last = data["last"];
            lastNum = lastNum + last;
        });
        return lastNum;
    };

    var haveData = function (selector, chart, top, left) {
        var option = chart.getOption();
        if (option === undefined || option === null || Object.keys(option).length === 0 || option["series"].length === 0) {
            selector.append($("<div></div>").addClass("no-data").css({
                "position": "absolute",
                "top": top,
                "left": left
            }).text("无数据"));
        }
    };

    var removeNoData = function (selector) {
        selector.remove();
    };

    var getResourceClusterId = function (uuid) {
        moriarty.doGet("/api/v1/vrop/resource/cluster/id", {"uuid": uuid}, function (res) {
            $("#barChart").html("");
            $("#stressType-surplusCapacity").next().remove();
            if (res !== null) {
                var data = res.data;
                moriarty.getTimeRemainingData(data);
                moriarty.getTimeRemaining(data);
                moriarty.getSurplusCapacity(data);
            }
        });
    };

    window.onresize = function () {
        var cpu_workload = echarts.init(document.getElementById("cpu_workload"));
        var mem_workload = echarts.init(document.getElementById("mem_workload"));
        var cluster_capacity_remaining_percent = echarts.init(document.getElementById("cluster_capacity_remaining_percent"));
        var componentLimitUsed = echarts.init(document.getElementById("componentLimitUsed"));
        var total_throughput = echarts.init(document.getElementById("total_throughput"));
        var total_iops = echarts.init(document.getElementById("total_iops"));
        var readDelay = echarts.init(document.getElementById("readDelay"));
        var writeDelay = echarts.init(document.getElementById("writeDelay"));
        var unfinishedIO = echarts.init(document.getElementById("unfinishedIO"));
        var cacheLayer = echarts.init(document.getElementById("cacheLayer"));
        var timeRemaining = echarts.init(document.getElementById("timeRemaining"));
        var host_cpu_workload = echarts.init(document.getElementById("host_cpu_workload"));
        var host_cpu_contention = echarts.init(document.getElementById("host_cpu_contention"));
        var host_memory_workload = echarts.init(document.getElementById("host_memory_workload"));
        var host_memory_contention = echarts.init(document.getElementById("host_memory_contention"));
        var network_usage = echarts.init(document.getElementById("network_usage"));
        var packets_dropped = echarts.init(document.getElementById("packets_dropped"));
        var busResets = echarts.init(document.getElementById("busResets"));
        var commandsAborted = echarts.init(document.getElementById("commandsAborted"));

        cpu_workload.resize();
        mem_workload.resize();
        cluster_capacity_remaining_percent.resize();
        componentLimitUsed.resize();
        total_throughput.resize();
        total_iops.resize();
        readDelay.resize();
        writeDelay.resize();
        unfinishedIO.resize();
        cacheLayer.resize();
        timeRemaining.resize();
        host_cpu_workload.resize();
        host_cpu_contention.resize();
        host_memory_workload.resize();
        host_memory_contention.resize();
        network_usage.resize();
        packets_dropped.resize();
        busResets.resize();
        commandsAborted.resize();
    };

    window.vsanAnalyze = vsanAnalyze;
})();