/**
 * Created by bozhil on 2017/11/9.
 */
!(function () {
    var dataCenterMonitor = {};

    var cpuChart = echarts.init(document.getElementById("cpu_chart"));
    var cpuPercentageChart = echarts.init(document.getElementById("cpu_chart_percentage"));
    var memChart = echarts.init(document.getElementById("memory_chart"));
    var memPercentageChart = echarts.init(document.getElementById("memory_chart_percentage"));
    var storageChart = echarts.init(document.getElementById("storage_chart"));
    var networkChart = echarts.init(document.getElementById("network_chart"));

    dataCenterMonitor.init = function () {
        getHostNames();
        $(".gbtn").bind("click", function () {
            chartInit(this);
        });
    };

    var chartInit = function (_this) {
        $("#hostname").removeAttr("data-toggle").parent().removeClass("open");
        var url, type, chart, duration = $(_this).data("duration");
        $(_this).parent().find(".gbtn").removeClass("checked");
        type = $(_this).parent().data("type");
        $(_this).addClass("checked");
        switch (type) {
            case "cpu":
                url = "/api/v1/performance/host/cpuUsageHistoryInfo";
                chart = cpuChart;
                break;
            case "mem":
                url = "/api/v1/performance/host/memUsageHistoryInfo";
                chart = memChart;
                break;
            case "storage":
                url = "/api/v1/performance/host/diskUsageHistoryInfo";
                chart = storageChart;
                break;
            case "cpuPercentage":
                url = "/api/v1/performance/host/cpuPercentageHistoryInfo";
                chart = cpuPercentageChart;
                break;
            case "memPercentage":
                url = "/api/v1/performance/host/memPercentageHistoryInfo";
                chart = memPercentageChart;
                break;
            case "network":
                url = "/api/v1/performance/host/netUsageHistoryInfo";
                chart = networkChart;
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
                        option = moriarty.initLineChartOption(cpuData.dates, cpuData.values, cpuYAxisShow, cpuToast);
                    }
                    if (memData !== null && memData !== undefined) {
                        if ($("#memGroup .checked").data("duration") !== memData["duration"]) {
                            return;
                        }
                        option = moriarty.initLineChartOption(memData.dates, memData.values, memYAxisShow, memToast);
                    }
                    if (storageData !== null && storageData !== undefined) {
                        if ($("#storageGroup .checked").data("duration") !== storageData["duration"]) {
                            return;
                        }
                        option = moriarty.initLineChartOption(storageData.dates, storageData.values, storageYAxisShow, storageToast);
                    }
                    if (cpuPercentageData !== null && cpuPercentageData !== undefined) {
                        if ($("#cpuPercentageGroup .checked").data("duration") !== cpuPercentageData["duration"]) {
                            return;
                        }
                        option = moriarty.initLineChartOption(cpuPercentageData.dates, cpuPercentageData.values, cpuPercentageYAxisShow, cpuPercentageToast);
                    }
                    if (memPercentageData !== null && memPercentageData !== undefined) {
                        if ($("#memPercentageGroup .checked").data("duration") !== memPercentageData["duration"]) {
                            return;
                        }
                        option = moriarty.initLineChartOption(memPercentageData.dates, memPercentageData.values, memPercentageYAxisShow, memPercentageToast);
                    }
                    if (networkData !== null && networkData !== undefined) {
                        if ($("#networkGroup .checked").data("duration") !== networkData["duration"]) {
                            return;
                        }
                        option = moriarty.initLineChartOption(networkData.dates, networkData.values, networkYAxisShow, networkToast);
                    }
                    chart.clear();
                    chart.setOption(option);
                    chart.hideLoading();
                } else {
                    chart.clear();
                }

                $("#hostname").attr("data-toggle", "dropdown");
            } else {
                swal("", "请求超时", "error");
            }
        })
    };

    var getHostNames = function () {
        moriarty.doGet("/api/v1/host/hostNames", null, function (res) {
            if (res === null || res.data === null || res.data === undefined || res.data.length === 0) {
                $("#hostname").text("暂无主机");
                return;
            }
            var $ul = $("<ul></ul>").addClass("dropdown-menu").attr("role", "menu");
            var hostNames = res.data;
            hostNames.sort(function (a, b) {
                return a.localeCompare(b);
            });
            $.each(hostNames, function (index, data) {
                if (index === 0) {
                    $ul.append($("<li></li>").addClass("simulate-select").append($("<a></a>").addClass("simulate-option selector").css("cursor", "pointer").text(data)));
                    $("#hostname").text(data).append($("<span></span>").addClass("caret").css({
                        "color": "#777676",
                        "margin-left": "5px"
                    }));
                    var typeList = $(".gbtn.checked");
                    $.each(typeList, function (index, _this) {
                        chartInit(_this);
                    });
                } else {
                    $ul.append($("<li></li>").addClass("simulate-select").append($("<a></a>").addClass("simulate-option").css("cursor", "pointer").text(data)));
                }
            });
            $("#hostname").after($ul);
            getHostInfo();

            $(".simulate-option").bind("click", function () {
                if ($(this).hasClass("selector"))
                    return;
                $(".simulate-option").removeClass("selector");
                $(this).addClass("selector");
                $("#hostname").text($(this).text()).append($("<span></span>").addClass("caret").css("margin-left", "5px"));
                var typeList = $(".gbtn.checked");
                $.each(typeList, function (index, _this) {
                    chartInit(_this);
                });
                clearHostInfo();
                getHostInfo();
            });
        });
    };

    var getHostInfo = function () {
        var hostname = $("#hostname").text();
        moriarty.doGet("/api/v1/host/detailInfo", {hostname: hostname}, function (res) {
            console.log(res);
            if (res !== null && res !== undefined) {
                var info = res.data;
                if (info === null || info === undefined) {
                    return;
                }

                var cpuTotal = info["cpuCapacity"],
                    cpuUsage = info["cpuUsage"],

                    memTotal = info["memoryCapacity"],
                    memUsage = info["memoryUsage"],

                    storageTotal = info["dataStoreCapacity"],
                    storageUsage = info["dataStoreUsage"];

                if (cpuUsage / cpuTotal >= 0.9) {
                    $("#cpuStatus").css("background-color", "#e66c7c").attr({
                        "data-toggle": "tooltip",
                        "data-placement": "bottom",
                        "data-title": "CPU使用率超过90%."
                    });
                } else {
                    $("#cpuStatus").css("background-color", "#6bab64").attr({
                        "data-toggle": "tooltip",
                        "data-placement": "bottom",
                        "data-title": "CPU剩余空间充足."
                    });
                }

                if (memUsage / memTotal >= 0.9) {
                    $("#memStatus").css("background-color", "#e66c7c").attr({
                        "data-toggle": "tooltip",
                        "data-placement": "bottom",
                        "data-title": "内存使用率超过90%."
                    });
                } else {
                    $("#memStatus").css("background-color", "#6bab64").attr({
                        "data-toggle": "tooltip",
                        "data-placement": "bottom",
                        "data-title": "内存剩余空间充足."
                    });
                }

                if (storageUsage / storageTotal >= 0.9) {
                    $("#storageStatus").css("background-color", "#e66c7c").attr({
                        "data-toggle": "tooltip",
                        "data-placement": "bottom",
                        "data-title": "存储使用率超过90%."
                    });
                } else {
                    $("#storageStatus").css("background-color", "#6bab64").attr({
                        "data-toggle": "tooltip",
                        "data-placement": "bottom",
                        "data-title": "存储剩余空间充足."
                    });
                }

                $('[data-toggle="tooltip"]').tooltip();
            }
        });
    };

    var clearHostInfo = function () {
        $("#cpuStatus").css("background-color", "");
        $("#cpuStatus").removeAttr("data-toggle");
        $("#cpuStatus").removeAttr("data-placement");
        $("#cpuStatus").removeAttr("data-title");

        $("#memStatus").css("background-color", "");
        $("#memStatus").removeAttr("data-toggle");
        $("#memStatus").removeAttr("data-placement");
        $("#memStatus").removeAttr("data-title");

        $("#storageStatus").css("background-color", "");
        $("#storageStatus").removeAttr("data-toggle");
        $("#storageStatus").removeAttr("data-placement");
        $("#storageStatus").removeAttr("data-title");
    };

    var cpuToast = function (params) {
        params = params[0];
        var date = new Date(params.name);
        return date.formatStandardDate() + " " + date.formatStandardTime() + ' ' + 'CPU使用情况：' + (params.value).toFixed(2) + "MHz";
    };
    var cpuYAxisShow = function (value, idx) {
        return value.toFixed(2) + " MHz";
    };

    var cpuPercentageToast = function (params) {
        params = params[0];
        var date = new Date(params.name);
        return date.formatStandardDate() + " " + date.formatStandardTime() + ' ' + 'CPU使用率：' + (params.value * 10).toFixed(2) + "%";
    };
    var cpuPercentageYAxisShow = function (value, idx) {
        return (10 * value).toFixed(2) + " %";
    };

    var memPercentageToast = function (params) {
        params = params[0];
        var date = new Date(params.name);
        return date.formatStandardDate() + " " + date.formatStandardTime() + ' ' + '内存使用率：' + (params.value * 10).toFixed(2) + "%";
    };
    var memPercentageYAxisShow = function (value, idx) {
        return (value * 10).toFixed(2) + " %";
    };

    var memToast = function (params) {
        params = params[0];
        var date = new Date(params.name);
        return date.formatStandardDate() + " " + date.formatStandardTime() + ' ' + '内存使用：' + (params.value / 1024).toFixed(2) + "GB";
    };
    var memYAxisShow = function (value, idx) {
        return (value / 1024).toFixed(2) + " GB";
    };

    var storageToast = function (params) {
        params = params[0];
        var date = new Date(params.name);
        return date.formatStandardDate() + " " + date.formatStandardTime() + ' ' + '存储使用：' + (params.value).toFixed(2) + "KBps";
    };
    var storageYAxisShow = function (value, idx) {
        return value.toFixed(2) + " KBps";
    };
    var networkToast = function (params) {
        params = params[0];
        var date = new Date(params.name);
        return date.formatStandardDate() + " " + date.formatStandardTime() + ' ' + '网络使用：' + (params.value).toFixed(2) + "KBps";
    };
    var networkYAxisShow = function (value, idx) {
        return value.toFixed(2) + " KBps";
    };

    window.dataCenterMonitor = dataCenterMonitor;
})();