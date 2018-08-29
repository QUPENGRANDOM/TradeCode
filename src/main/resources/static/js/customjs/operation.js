!(function () {
    var operation = {};
    var uuid = $("#uuid").text();

    operation.init = function () {
        loadWarningAmountChart();
        loadVMInfoList();
        loadCpuTopList();
        loadWorkloadList();
        loadRopDataStore();
        loadCpuAnalyze();
        loadMemAnalyze();
        loadAnalyzeResourceList();
        moriarty.stressMax(uuid);
        moriarty.workload(uuid);
        moriarty.getTimeRemainingData(uuid);
        getTimeRemaining();
        getSurplusCapacity();
        moriarty.getTopNAlert();
        moriarty.getAlertList();
    };

    var loadWarningAmountChart = function () {
        var warningAmountChart = echarts.init(document.getElementById("warningAmount"));
        warningAmountChart.showLoading();
        moriarty.doGet("/api/v1/vrop/resource/alert", {"uuid": uuid}, function (res) {
            if (res !== null) {
                var data = res.data;
                var legendData = ['严重', '紧急', '警告'];
                var seriesDatas = [];
                var xAxisData = [];
                var title = $("#business").text();
                var series = {};
                var lastSum = 0;
                $.each(data, function (index, item) {
                    var statKey = item["statKey"];
                    var datas = item["datas"];
                    var last = item["last"];
                    xAxisData = item["times"];
                    lastSum = lastSum + last;
                    switch (statKey) {
                        case 'System Attributes|alert_count_critical':
                            $("#critical").find("span").text(last);
                            series = {
                                name: "严重",
                                type: "line",
                                symbol: "none",
                                stack: '总量',
                                itemStyle: {
                                    normal: {
                                        lineStyle: {
                                            width: 1,//折线宽度
                                            color: "#FF0000"//折线颜色
                                        }
                                    }
                                },
                                areaStyle: {
                                    normal: {
                                        color: "rgba(255, 0, 0, 0.3)"
                                    }
                                },
                                data: datas
                            };
                            seriesDatas.push(series);
                            break;
                        case 'System Attributes|alert_count_immediate':
                            $("#immediate").find("span").text(last);
                            series = {
                                name: "紧急",
                                type: "line",
                                symbol: "none",
                                stack: '总量',
                                itemStyle: {
                                    normal: {
                                        lineStyle: {
                                            width: 1,//折线宽度
                                            color: "#E29301"//折线颜色
                                        }
                                    }
                                },
                                areaStyle: {
                                    normal: {
                                        color: "rgba(246, 147, 1, 0.3)"
                                    }
                                },
                                data: datas
                            };
                            seriesDatas.push(series);
                            break;
                        case 'System Attributes|alert_count_warning':
                            $("#warning").find("span").text(last);
                            series = {
                                name: "警告",
                                type: "line",
                                symbol: "none",
                                stack: '总量',
                                itemStyle: {
                                    normal: {
                                        lineStyle: {
                                            width: 1,//折线宽度
                                            color: "#FFFF00"//折线颜色
                                        }
                                    }
                                },
                                areaStyle: {
                                    normal: {
                                        color: "rgba(255, 255, 0, 0.3)"
                                    }
                                },
                                data: datas
                            };
                            seriesDatas.push(series);
                            break;
                        default:
                            break;
                    }
                });
                $("#lastSum").text("活动警示  " + lastSum);
                var option = initWarningAmountChart(title, legendData, xAxisData, seriesDatas);
                option.color = ["#FFFF00", "#E29301", "#FF0000"];
                warningAmountChart.setOption(option);
                warningAmountChart.hideLoading();
            }
        })
    };

    var loadVMInfoList = function () {
        $("#vmInfo").DataTable({
            paging: true,
            processing: false,
            lengthChange: false,
            ordering: true,
            autoWidth: true,
            info: true,
            serverSide: false,
            fixedHeader: true,
            searching: false,
            aLengthMenu: [10],
            scrollX: true,
            scrollY: "260px",
            scrollCollapse: "true",
            ajax: {
                url: "/api/v1/businessVmInfoList",
                type: "get",
                data: {"vm": ["proxy01.hyh.com_192.168.2.2", "router01.raysdata.com"]},
                dataSrc: 'data'
            },
            columns: [
                {
                    // width: "180px",
                    data: "name",
                    render:function (data,type,full,meta) {
                        return $("<div></div>").append($("<div></div>").addClass("moriary-ellipsis").text(data).attr("title",data)).html();
                    }
                },
                {
                    // width: "80px",
                    data: "numCpu"
                },
                {
                    // width: "80px",
                    data: "memory"
                },
                {
                    // width: "80px",
                    data: "diskSpace"
                },
                {
                    // width: "80px",
                    data: "fullName"
                },
                {
                    // width: "80px",
                    data: "numEthernetCards"
                },
                {
                    // width: "180px",
                    data: "ipAddress"
                },
                {
                    // width: "80px",
                    data: "powerState"
                }
                // {
                //     width: "80px",
                //     data: "connectionState"
                // },
                // {
                //     width: "80px",
                //     data: "toolsRunningStatus"
                // },
                // {
                //     width: "80px",
                //     data: "toolsVersion"
                // },
                // {
                //     width: "80px",
                //     data: "version"
                // },
                // {
                //     width: "80px",
                //     data: "parentCluster"
                // },
                // {
                //     width: "80px",
                //     data: "parentDatacenter"
                // },
                // {
                //     width: "80px",
                //     data: "parentFolder"
                // },
                // {
                //     width: "100px",
                //     data: "parentHost"
                // },
                // {
                //     width: "80px",
                //     data: "parentVcenter"
                // }
            ],
            language: {url: '/lang/datatable.chs.json'}
        });
    };

    var loadCpuTopList = function () {
        var columns = [
            {
                data: "name",
                render: function (data, type, full, meta) {
                    return $("<div></div>").append($("<div></div>").css({
                        "overflow": "hidden",
                        "text-overflow": "ellipsis",
                        "white-space": "nowrap"
                    }).text(data)).html();
                }
            },
            {
                data: "minuteMax",
                render: function (data, type, full, meta) {
                    return data.toFixed(2) + "%";
                }
            },
            {
                data: "dayMax",
                render: function (data, type, full, meta) {
                    return data.toFixed(2) + "%";
                }
            }
        ];
        initDataTables($("#cpuTop"), "/api/v1/vrop/topN/cpu?uuid=" + uuid, columns);
    };

    var loadWorkloadList = function () {
        var columns = [
            {
                data: "name"
            },
            {
                data: "minuteMax",
                render: function (data, type, full, meta) {
                    return moriarty.controlUnitKB(data);
                }
            },
            {
                data: "dayMax",
                render: function (data, type, full, meta) {
                    return moriarty.controlUnitKB(data);
                }
            }
        ];
        initDataTables($("#networkLoad"), "/api/v1/vrop/topN/net?uuid=" + uuid, columns);
    };

    var loadRopDataStore = function () {
        var columns = [
            {
                data: "name"
            },
            {
                data: "dayMax",
                render: function (data, type, full, meta) {
                    return data.toFixed(2);
                }
            },
            {
                data: "minuteMax",
                render: function (data, type, full, meta) {
                    return data.toFixed(2);
                }
            },
            {
                data: "dayMaxLoad",
                render: function (data, type, full, meta) {
                    if (data === -1) {
                        return "-";
                    } else
                        return data.toFixed(2);
                }
            },
            {
                data: "minuteMaxLoad",
                render: function (data, type, full, meta) {
                    if (data === -1) {
                        return "-";
                    } else
                        return data.toFixed(2);
                }
            }
        ];
        initDataTables($("#topDatastore"), " /api/v1/vrop/topN/datastore?uuid=" + uuid, columns);
    };

    var loadCpuAnalyze = function () {
        var chart = echarts.init(document.getElementById("cpuAnalyze"));
        chart.showLoading();
        moriarty.doGet("/api/v1/vrop/analyze/cpu", {"uuid": uuid}, function (res) {
            if (res !== null) {
                var resultData = res.data;
                $.each(resultData, function (index, data) {
                    var times = data["times"];
                    var name = data["name"];
                    var seriesDatas = [
                        {
                            name: "",
                            type: "line",
                            symbol: "none",
                            stack: '总量',
                            itemStyle: {
                                normal: {
                                    lineStyle: {
                                        width: 2,//折线宽度
                                        color: "#90B6BA"//折线颜色
                                    }
                                }
                            },
                            data: data["datas"]
                        }
                    ];
                    var option = initWarningAmountChart(name, null, times, seriesDatas);
                    chart.setOption(option);
                });
                chart.hideLoading();
            }
        })
    };

    var loadMemAnalyze = function () {
        var chart = echarts.init(document.getElementById("memAnalyze"));
        chart.showLoading();
        moriarty.doGet("/api/v1/vrop/analyze/mem", {"uuid": uuid}, function (res) {
            if (res !== null) {
                var resultData = res.data;
                $.each(resultData, function (index, data) {
                    var times = data["times"];
                    var name = data["name"];
                    var seriesDatas = [
                        {
                            name: "",
                            type: "line",
                            symbol: "none",
                            stack: '总量',
                            itemStyle: {
                                normal: {
                                    lineStyle: {
                                        width: 2,//折线宽度
                                        color: "#90B6BA"//折线颜色
                                    }
                                }
                            },
                            data: data["datas"]
                        }
                    ];
                    var option = initWarningAmountChart(name, null, times, seriesDatas);
                    chart.setOption(option);
                });
                chart.hideLoading();
            }
        })
    };

    var loadDatastoreAnalyzeChart = function () {
        var chart = echarts.init(document.getElementById("datastoreAnalyze"));
        chart.showLoading();
        moriarty.doGet("/api/v1/vrop/analyze/datastore", {"uuid": uuid}, function (res) {
            if (res !== null) {
                if (res.result === "SUCCESS") {
                    var data = res.data;
                    var legendData = [];
                    var seriesDatas = [];
                    var xAxisData = [];
                    var title = $("#business").text();
                    var series = {};
                    var lastSum = 0;
                    $.each(data, function (index, item) {
                        var statKey = item["statKey"];
                        var datas = item["datas"];
                        var last = item["last"];
                        xAxisData = item["times"];
                        lastSum = lastSum + last;
                    });
                }
            }
        })
    };

    var loadAnalyzeResourceList = function () {
        var columns = [
            {
                data: "name"
            },
            // {
            //     data: "storeName",
            //     visible: false
            // },
            {
                data: "capacityRemaining",
                render: function (data, type, full, meta) {
                    return data.toFixed(2) + "%";
                }
            },
            {
                data: "timeRemaining",
                render: function (data, type, full, meta) {
                    if (data / 365 > 1) {
                        return ">1 年";
                    } else
                        return data + " 天";
                }
            },
            {
                data: "capacityTotal",
                render: function (data, type, full, meta) {
                    return data.toFixed(2) + "GB";
                }
            },
            {
                data: "percentageTotal",
                render: function (data, type, full, meta) {
                    return data.toFixed(2) + "%";
                }
            },
            {
                data: "snapshot",
                render: function (data, type, full, meta) {
                    return data.toFixed(2) + "GB";
                }
            },
            {
                data: "powerState"
            }
        ];
        initDataTables($("#analyzeResourceList"), "/api/v1/vrop/resource/datastore?uuid=" + uuid, columns);
    };

    var initDataTables = function (selector, url, columns) {
        selector.DataTable({
            paging: false,
            processing: false,
            lengthChange: false,
            ordering: false,
            autoWidth: false,
            info: true,
            serverSide: false,
            fixedHeader: true,
            searching: false,
            // aLengthMenu: [10],
            order: [[1, "desc"]],
            scrollX: true,
            scrollY: "260px",
            scrollCollapse: true,
            ajax: {
                url: url,
                dataSrc: 'data'
            },
            columns: columns,
            initComplete: function () {
            },
            language: {url: '/lang/datatable.chs.json'}
        });
    };

    var initWarningAmountChart = function (title, legendData, xAxisData, seriesData) {
        var option = {
            title: {
                text: title,
                x: "center",
                y: "top"
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (a) {
                    var $time = null;
                    var $div = $("<div></div>");
                    $.each(a, function (index, data) {
                        if (index === 0) {
                            $time = $("<div></div>").text(new Date(parseInt(data.axisValue)).formatStandardDate() + " " + new Date(parseInt(data.axisValue)).formatStandardTime());
                        }
                        var $value = $("<div></div>").css("margin-bottom", "5px").append($("<div></div>").css({
                            "height": "10px",
                            "width": "10px",
                            "border-radius": "50%",
                            "background-color": data.color,
                            "display": "inline-block"
                        })).append($("<span></span>").css("margin-left", "10px").text(data.seriesName + " " + data.value));
                        $div.append($value);
                    });
                    return $("<div></div>").append($time).append($div).html();
                }
            },
            legend: {
                x: "center",
                y: "bottom",
                data: legendData
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: xAxisData,
                    axisLabel: {
                        margin: 10,
                        formatter: function (value, idx) {
                            var date = new Date(parseInt(value));
                            return date.formatStandardDate() + '\n\r' + date.formatStandardTime();
                        }
                    }
                }
            ],
            yAxis: {
                type: 'value',
                name: '',
                show: true,
                axisTick: {
                    show: false
                }
            },
            series: seriesData
        };
        return option;
    };

    var getSurplusCapacity = function () {
        moriarty.doGet("/api/v1/vrop/resource/surplus/capacity", {"uuid": uuid}, function (res) {
            if (res !== null) {
                if (res.result === "SUCCESS") {
                    var data = res.data;
                    $("#usageRate-surplusCapacity").text(data["capacityRemaining"].toFixed(0));
                    $("#surplusCapacity").text(data["capacityRemaining"].toFixed(0) + " % 的剩余容量");
                    $("#totalCapacity").text("总计: " + (data["totalCapacity"] / 1024 / 1024).toFixed(2) + " GB");
                    $("#availableCapacity").text("可用容量: " + (data["availableCapacity"] / 1024 / 1024).toFixed(2) + " GB (" + (data["availableCapacity"] / data["totalCapacity"]).toFixed(2) * 100 + "%)");
                    $("#remaining").text(data["capacityRemainingUsing"]);
                    $("#remaining").next().text("剩余");
                    $("#used_capacity").text((100 - data["capacityRemaining"]).toFixed(0) + " % 已使用的可用容量");
                    $("#surplus").css("background-color", "#f6fafb");

                    if (data["capacityRemaining"] === 0) {
                        $("#stressMax-surplusCapacity").css("background-image", "-webkit-linear-gradient(top,#fffafb,#fff3f4)");
                        $("#stressMax-surplusCapacity").find("img").attr("src", "/images/capacity_serious.png");
                        $("#stressType-surplusCapacity").text("容量最受限于磁盘空间(分配)。");
                        $("#stressType-surplusCapacity").after($("<div></div>").text("严重"));
                    } else {
                        $("#stressMax-surplusCapacity").css("background-image", "-webkit-linear-gradient(top,#f4fff4,#e8ffe8)");
                        $("#stressMax-surplusCapacity").find("img").attr("src", "/images/capacity_normal.png");
                        $("#stressType-surplusCapacity").text("正常: 没有问题。");
                    }

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
    };

    var getTimeRemaining = function () {
        moriarty.doGet("/api/v1/vrop/resource/timeRemaining", {"uuid": uuid}, function (res) {
            if (res !== null) {
                if (res.result === "SUCCESS") {
                    var data = res.data;
                    loadChart(data);
                    return data;
                }
            }
        })
    };

    var loadChart = function (datas) {
        var chart = echarts.init(document.getElementById("timeRemaining"));
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
                    areaStyle: {normal: {}},
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
                };
                seriesData.push(series);
            }
        });
        var option = moriarty.initChart(legend, seriesData);
        chart.setOption(option);
        chart.hideLoading();
    };

    window.onresize = function () {
        var warningAmount = echarts.init(document.getElementById("warningAmount"));
        var timeRemaining = echarts.init(document.getElementById("timeRemaining"));
        var cpuAnalyze = echarts.init(document.getElementById("cpuAnalyze"));
        var memAnalyze = echarts.init(document.getElementById("memAnalyze"));

        warningAmount.resize();
        timeRemaining.resize();
        cpuAnalyze.resize();
        memAnalyze.resize();
    };

    window.operation = operation;
})();