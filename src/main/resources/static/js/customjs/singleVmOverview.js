/**
 * Created by bozhil on 2017/8/14.
 */
!(function () {
    window.singleVmOverview = {
        cpuChart: echarts.init(document.getElementById("cpu_chart")),
        memChart: echarts.init(document.getElementById("mem_chart")),
        cpuPercentageChart: echarts.init(document.getElementById("cpu-percentage_chart")),
        memPercentageChart: echarts.init(document.getElementById("mem-percentage_chart")),
        networkChart: echarts.init(document.getElementById("network-chart")),
        init: function () {
            var vmName = $("#vmName").text();
            loadCpuChart(vmName, "oneWeek");
            loadMemChart(vmName, "oneWeek");
            loadCpuPercentageChart(vmName, "oneWeek");
            loadMemPercentageChart(vmName, "oneWeek");
            loadNetworkChart(vmName, "oneWeek");
            $("#vmEventList").DataTable({
                paging: true,
                processing: false,
                lengthChange: false,
                ordering: true,
                autoWidth: false,
                info: true,
                serverSide: false,
                fixedHeader: true,
                searching: true,
                aLengthMenu: [10],
                destroy: true,
                ajax: {
                    url: "/api/v1/event/list?vmName=" + vmName,
                    dataSrc: 'data'
                },
                columns: [
                    {
                        "width": "15%",
                        data: 'name'
                    },
                    {
                        "width": "15%",
                        data: 'time',
                        render: function (data, type, full, meta) {
                            return new Date(data).formatStandardDate()
                        }
                    },
                    {
                        data: 'message'
                    }
                ],
                language: {url: '/lang/datatable.chs.json'}
            });

            $("#vmAlertsList").DataTable({
                paging: true,
                processing: false,
                lengthChange: false,
                ordering: true,
                autoWidth: false,
                info: true,
                serverSide: false,
                fixedHeader: true,
                searching: true,
                aLengthMenu: [10],
                destroy: true,
                ajax: {
                    url: "/api/v1/alarm/vm?vmName=" + vmName,
                    dataSrc: 'data'
                },
                columns: [
                    {
                        width: "10%",
                        data: "typeName"
                    },
                    {
                        data: "name",
                        render: function (data, type, full, meta) {
                            return '<div style="cursor: pointer;overflow: hidden;text-overflow: ellipsis;" ' +
                                'title="' + full.description + '">' + data + '</div>';
                        }
                    },
                    {
                        data: "overallStatus",
                        render: function (data, type, full, meta) {
                            return moriarty.alarmState(data);
                        }
                    },
                    {
                        data: "stateTime",
                        render: function (data, type, full, meta) {
                            return moriarty.dbDate(data);
                        }
                    }
                ],
                language: {url: '/lang/datatable.chs.json'}
            });

            $(".gbtn").bind("click", function () {
                if ($(this).hasClass("checked")) {
                    return;
                }
                var type, duration = $(this).data("duration");
                $(this).parent().find(".gbtn").removeClass("checked");
                type = $(this).parent().data("type");
                $(this).addClass("checked");
                vmName = $("#vmName").text();
                if (vmName === null || vmName === "" || vmName === undefined) {
                    toastr.warning("未发现该虚拟机", "注意");
                    return;
                }

                switch (type) {
                    case "cpu":
                        loadCpuChart(vmName, duration);
                        break;
                    case "mem":
                        loadMemChart(vmName, duration);
                        break;
                    case "cpuPercentage":
                        loadCpuPercentageChart(vmName, duration);
                        break;
                    case "memPercentage":
                        loadMemPercentageChart(vmName, duration);
                        break;
                    case "network":
                        loadNetworkChart(vmName, duration);
                        break;
                    default:
                        break;
                }
            })
        }
    };

    var loadCpuChart = function (vmName, duration) {
        var chart = this.singleVmOverview.cpuChart;
        chart.clear();
        moriarty.showChartLoading(chart);
        moriarty.doGet("/api/v1/performance/vm/historyInfo", {
            vmName: vmName,
            duration: duration,
            type: "cpu"
        }, function (res) {
            if (res !== null && res.result === "SUCCESS") {
                var data = res.data;
                if (data !== null && data !== undefined) {
                    var result = data[vmName + "-cpuUsage"];
                    if (result !== null && result !== undefined) {
                        $("#cpu_chart .no-data").remove();
                        if ($("#cpuGroup .checked").data("duration") !== result["duration"]) {
                            return;
                        }

                        var cpu_x = result.dates;
                        var cpu_y = result.values;
                        chart.clear();
                        var option = moriarty.initLineChartOption(cpu_x, cpu_y, cpuYAxisShow, cpuToast);
                        chart.setOption(option);
                    }
                    haveData($("#cpu_chart"), chart,"65px", "45%");
                    chart.hideLoading();
                }
            }
        });
    };

    var loadMemChart = function (vmName, duration) {
        var chart = this.singleVmOverview.memChart;
        chart.clear();
        moriarty.showChartLoading(chart);
        moriarty.doGet("/api/v1/performance/vm/historyInfo", {
            vmName: vmName,
            duration: duration,
            type: "mem"
        }, function (res) {
            if (res !== null && res.result === "SUCCESS") {
                var data = res.data;
                if (data !== null && data !== undefined) {
                    var result = data[vmName + "-memUsage"];
                    if (result !== null && result !== undefined) {
                        $("#mem_chart .no-data").remove();
                        if ($("#memGroup .checked").data("duration") !== result["duration"]) {
                            return;
                        }

                        var x = result.dates;
                        var y = result.values;
                        chart.clear();
                        var option = moriarty.initLineChartOption(x, y, memYAxisShow, memToast);
                        chart.setOption(option);
                    }
                    haveData($("#mem_chart"), chart,"65px", "45%");
                    chart.hideLoading();
                }
            }
        });
    };

    var loadCpuPercentageChart = function (vmName, duration) {
        var chart = this.singleVmOverview.cpuPercentageChart;
        chart.clear();
        moriarty.showChartLoading(chart);
        moriarty.doGet("/api/v1/performance/vm/historyInfo", {
            vmName: vmName,
            duration: duration,
            type: "hostCpuPercentage"
        }, function (res) {
            if (res !== null && res.result === "SUCCESS") {
                var data = res.data;
                if (data !== null && data !== undefined) {
                    var result = data[vmName + "-cpuPercentage"];
                    if (result !== null && result !== undefined) {
                        $("#cpu-percentage_chart .no-data").remove();
                        if ($("#cpuPercentageGroup .checked").data("duration") !== result["duration"]) {
                            return;
                        }

                        var x = result.dates;
                        var y = result.values;
                        chart.clear();
                        var option = moriarty.initLineChartOption(x, y, cpuPercentageYAxisShow, cpuPercentageToast);
                        chart.setOption(option);
                    }
                    haveData($("#cpu-percentage_chart"), chart,"65px", "45%");
                    chart.hideLoading();
                }
            }
        });
    };

    var loadMemPercentageChart = function (vmName, duration) {
        var chart = this.singleVmOverview.memPercentageChart;
        chart.clear();
        moriarty.showChartLoading(chart);
        moriarty.doGet("/api/v1/performance/vm/historyInfo", {
            vmName: vmName,
            duration: duration,
            type: "hostMemPercentage"
        }, function (res) {
            if (res !== null && res.result === "SUCCESS") {
                var data = res.data;
                if (data !== null && data !== undefined) {
                    var result = data[vmName + "-memPercentage"];
                    if (result !== null && result !== undefined) {
                        $("#mem-percentage_chart .no-data").remove();
                        if ($("#memPercentageGroup .checked").data("duration") !== result["duration"]) {
                            return;
                        }

                        var x = result.dates;
                        var y = result.values;
                        chart.clear();
                        var option = moriarty.initLineChartOption(x, y, memPercentageYAxisShow, memPercentageToast);
                        chart.setOption(option);
                    }
                    haveData($("#mem-percentage_chart"), chart,"65px", "45%");
                    chart.hideLoading();
                }
            }
        });
    };

    var loadNetworkChart = function (vmName, duration) {
        var chart = this.singleVmOverview.networkChart;
        chart.clear();
        moriarty.showChartLoading(chart);
        moriarty.doGet("/api/v1/performance/vm/historyInfo", {
            vmName: vmName,
            duration: duration,
            type: "hostNetwork"
        }, function (res) {
            if (res !== null && res.result === "SUCCESS") {
                var data = res.data;
                if (data !== null && data !== undefined) {
                    var result = data[vmName + "-netUsage"];
                    if (result !== null && result !== undefined) {
                        $("#network-chart .no-data").remove();
                        if ($("#networkGroup .checked").data("duration") !== result["duration"]) {
                            return;
                        }

                        var cpu_x = result.dates;
                        var cpu_y = result.values;
                        chart.clear();
                        var option = moriarty.initLineChartOption(cpu_x, cpu_y, networkYAxisShow, networkToast);
                        chart.setOption(option);
                    }
                    haveData($("#network-chart"), chart,"65px", "45%");
                    chart.hideLoading();
                }
            }
        });
    };

    var haveData = function (selector, chart, top, left) {
        var option = chart.getOption();
        if (option===undefined||option===null||Object.keys(option).length===0||option["series"].length===0) {
            selector.append($("<div></div>").addClass("no-data").css({
                "position": "absolute",
                "top": top,
                "left": left
            }).text("无数据"));
        }
    };

    var cpuToast = function (params) {
        params = params[0];
        var date = new Date(parseInt(params.name));
        return date.formatStandardDate() + " " + date.formatStandardTime() + ' ' + 'CPU使用率：' + (params.value).toFixed(2) + "MHz";
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

    var networkToast = function (params) {
        params = params[0];
        var date = new Date(parseInt(params.name));
        return date.formatStandardDate() + " " + date.formatStandardTime() + ' ' + '网络使用：' + (params.value).toFixed(2) + "KBps";
    };
    var networkYAxisShow = function (value, idx) {
        return value.toFixed(2) + " KBps";
    };

    window.onresize = function () {
        singleVmOverview.cpuChart.resize();
        singleVmOverview.memChart.resize();
        singleVmOverview.cpuPercentageChart.resize();
        singleVmOverview.memPercentageChart.resize();
        singleVmOverview.networkChart.resize();
    }
})();