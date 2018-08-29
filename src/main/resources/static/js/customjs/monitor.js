/**
 * Created by bozhil on 2017/11/14.
 */
!(function () {
    var monitor = {};

    var cpuLoadChart = echarts.init(document.getElementById("cpu-load"));
    var cpuUtilChart = echarts.init(document.getElementById("cpu-util"));
    var memotyChart = echarts.init(document.getElementById("memory"));
    var diskChart = echarts.init(document.getElementById("disk"));
    var networkChart = echarts.init(document.getElementById("network"));

    monitor.init = function () {
        var selectIpLen = $("#dropdown-menu").find(".selector").length;
        var hostName = "";
        if(selectIpLen <= 0){
            $("#dropdown-menu").find("li:first").find("a").addClass("selector");
         hostName = $("#dropdown-menu").find("li:first").find("a").text();
        }else {
            hostName = $(".selector").text();
        }

        $("#hostName").text(hostName).append($("<span></span>").addClass("caret"));
        var timeType = $(".monitor-radio").find("i[class='checked']").parent().parent().find("a").data("type");
        $.each($(".item-type"), function (index, item) {
            var itemType = $(item).data("type");
            getHistory(hostName, itemType, timeType);
        });
        getNetHistory(hostName,timeType);
        getMonitorStatus();
        timeChoose();
        hostChoose();
    };

    var getHistory = function (hostName, itemType, timeType) {
        cpuLoadChart.showLoading();
        cpuUtilChart.showLoading();
        memotyChart.showLoading();
        diskChart.showLoading();
        var params = {
            hostName: hostName,
            itemType: itemType,
            timeType: timeType
        };
        moriarty.doGet("/api/v1/monitor/history", params, function (res) {
            if (res !== null) {
                if (res.result === "SUCCESS") {
                    var data = res.data;
                    var option;
                    if (data === null || data === undefined) {
                        return;
                    }
                    switch (itemType) {
                        case "proc-zomb":
                            if (data.length === 0) {
                                $("#proc-zomb").parent().parent().remove();
                            } else {
                                $("#proc-zomb").text(data[0]["value"]);
                            }
                            break;
                        case "proc-num":
                            $("#proc-num").text(data[0]["value"]);
                            break;
                        case "cpu-load":
                            if (data.length !== 0) {
                                option = chartOption(data, itemType);
                                cpuLoadChart.setOption(option);
                            }
                            cpuLoadChart.hideLoading();
                            break;
                        case "cpu-util":
                            if (data.length !== 0) {
                                option = chartOption(data, itemType);
                                cpuUtilChart.setOption(option);
                            }
                            cpuUtilChart.hideLoading();
                            break;
                        case "memory":
                            if (data.length !== 0) {
                                option = chartOption(data, itemType);
                                memotyChart.setOption(option);
                            }
                            memotyChart.hideLoading();
                            break;
                        case "disk":
                            if (data.length !== 0) {
                                option = chartOption(data, itemType);
                                diskChart.setOption(option);
                            }
                            diskChart.hideLoading();
                            break;
                        case "network":
                            if (data.length !== 0) {
                                option = chartOption(data, itemType);
                                networkChart.setOption(option);
                            }
                            networkChart.hideLoading();
                            break;
                        default:
                            break;
                    }
                } else {
                    return null;
                }
            }
        })
    };

    var getNetHistory = function (hostName, timeType) {
        networkChart.showLoading();
        var params = {
            hostName: hostName,
            timeType: timeType
        };
        moriarty.doGet("/api/v1/monitor/network-history", params, function (res) {
            if (res !== null) {
                if (res.result === "SUCCESS") {
                    var data = res.data;
                    var option;
                    if (data === null || data === undefined) {
                        return;
                    }
                    if (data.length !== 0) {
                        option = chartOption(data, "network");
                        networkChart.setOption(option);
                    }
                    networkChart.hideLoading();
                }else {
                    networkChart.hideLoading();
                }
            }
        });
    };

    var getMonitorStatus = function () {
        var hostName = $("#hostName").text();
        moriarty.doGet("/api/v1/monitor/status", {hostName: hostName}, function (res) {
            if (res !== null) {
                $.each(res.data, function (index, data) {
                    if (data["description"].substr(length - 2, 2) === "_S") {
                        circleStatus($("#businessState"), data["value"]);
                    } else {
                        circleStatus($("#vmState"), data["value"]);
                    }
                });
                $('[data-toggle="tooltip"]').tooltip();
            }
        })
    };

    var circleStatus = function (selector, state) {
        if (state === "0") {
            selector.css("background-color", "#6bab64").attr({
                "data-toggle": "tooltip",
                "data-placement": "top",
                "data-title": "正常"
            });
        } else {
            selector.css("background-color", "#e66c7c").attr({
                "data-toggle": "tooltip",
                "data-placement": "top",
                "data-title": "异常"
            });
        }
    };

    var timeChoose = function () {
        $(".monitor-radio").bind("click", function () {
            var checked = $(this).find("i");
            if (checked.hasClass("checked")) {
                return;
            } else {
                $(this).parent().parent().find("i").removeClass("checked");
                checked.addClass("checked");

                var hostName = $("#hostName").text();
                var timeType = $(this).parent().find("a").data("type");
                $.each($(".item-type"), function (index, item) {
                    var itemType = $(item).data("type");
                    getHistory(hostName, itemType, timeType);
                });
                getNetHistory(hostName,timeType);
            }
        })
    };

    var hostChoose = function () {
        $(".simulate-option").bind("click", function () {
            $("#proc-zomb").text("0");
            $("#proc-num").text("0");
            clearStateInfo();

            if ($(this).hasClass("selector"))
                return;
            $(".simulate-option").removeClass("selector");
            $(this).addClass("selector");
            $("#hostName").text($(this).text()).append($("<span></span>").addClass("caret"));

            var hostName = $(this).text();
            var timeType = $(".monitor-radio").find("i[class='checked']").parent().parent().find("a").data("type");
            $.each($(".item-type"), function (index, item) {
                var itemType = $(item).data("type");
                getHistory(hostName, itemType, timeType);
            });
            getNetHistory(hostName,timeType);
        });
    };

    var clearStateInfo = function () {
        $("#businessState").css("background-color", "");
        $("#businessState").removeAttr("data-toggle");
        $("#businessState").removeAttr("data-placement");
        $("#businessState").removeAttr("data-title");

        $("#vmState").css("background-color", "");
        $("#vmState").removeAttr("data-toggle");
        $("#vmState").removeAttr("data-placement");
        $("#vmState").removeAttr("data-title");
    };

    var chartOption = function (data, itemType) {
        var legend = [];
        var series = [];
        var xData = [];
        $.each(data, function (index, item) {
            series.push(buildSeries(item, itemType));
            legend.push(item["itemName"]);
            xData = item["timestamp"];
        });
        return moriarty.initMonitorOption(xData, itemType, legend, series);
    };

    var buildSeries = function (item, itemType) {
        var values = [];
        switch (itemType) {
            case "cpu-load":
                // $.each(item["value"], function (index, value) {
                //     values.push(parseInt(value).toFixed(2) * 100);
                // });
                values = item["value"];
                break;
            case "cpu-util":
                $.each(item["value"], function (index, value) {
                    values.push(parseInt(value).toFixed(2));
                });
                break;
            case "memory":
                $.each(item["value"], function (index, value) {
                    values.push((parseInt(value) / 1024 / 1024 / 1024).toFixed(2));
                });
                break;
            case "disk":
                $.each(item["value"], function (index, value) {
                    values.push((parseInt(value) / 1024 / 1024 / 1024).toFixed(2));
                });
                break;
            case "network":
                values = item["value"];
                break;
            default:
                break;
        }
        return {
            name: item["itemName"],
            type: 'line',
            smooth: true,
            show: true,
            showSymbol: false,
            symbol: 'circle',
            symbolSize: 6,
            data: values,
            lineStyle: {
                normal: {
                    width: 3
                }
            }
        }
    };

    window.onresize = function () {
        cpuLoadChart.resize();
        cpuUtilChart.resize();
        memotyChart.resize();
        diskChart.resize();
        networkChart.resize();
    };

    window.monitor = monitor;
})();