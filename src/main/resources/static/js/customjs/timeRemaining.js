!(function () {
    var timeRemaining = {};
    var isDisplay = true;

    timeRemaining.init = function () {
        var uuid = $("#uuid").text();
        getTimeRemaining(uuid);
    };

    var getTimeRemaining = function (uuid) {
        moriarty.doGet("/api/v1/vrop/datacenter/timeRemaining", {"uuid": uuid}, function (res) {
            if (res !== null) {
                if (res.result === "SUCCESS") {
                    var data = res.data;
                    loadChart(data);
                    loadTimeRemaining(data);
                    return data;
                }
            }
        })
    };

    var loadTimeRemaining = function (data) {
        $("#timeRemainingCpuList").DataTable({
            paging: true,
            processing: false,
            lengthChange: false,
            ordering: true,
            autoWidth: false,
            info: true,
            serverSide: false,
            fixedHeader: true,
            searching: false,
            aLengthMenu: [10],
            data: data,
            columns: [
                {
                    data: "name",
                    render: function (data, type, full, meta) {
                        return $("<div></div>").append($("<img>").attr({
                            "src": "/images/details_open.png",
                            // "data-id": uuid,
                            "data-type": full["type"],
                            "onClick": "timeRemaining.tableClick(this)"
                        })).append($("<span></span>").css("margin-left", "5px").text(data)).html();
                    }
                },
                {
                    data: 'usableCapacity',
                    render: function (data, type, full, meta) {
                        switch (full["type"]) {
                            case "cpu":
                                return $("<div></div>").append($("<div></div>").text(data.toFixed(2) + " GHz")).append($("<div></div>").text("已配置")).html();
                            case "mem":
                                return $("<div></div>").append($("<div></div>").text(data.toFixed(2) + " GB")).append($("<div></div>").text("已配置")).html();
                            case "disk":
                                return $("<div></div>").append($("<div></div>").text(data.toFixed(2) + " TB")).append($("<div></div>").text("已配置")).html();
                            case "vsphere":
                                return $("<div></div>").append($("<div></div>").text(data + " 虚拟机")).append($("<div></div>").text("已配置")).html();
                        }
                    }
                },
                {
                    data: 'stressFreePre',
                    render: function (data, type, full, meta) {
                        switch (full["type"]) {
                            case "cpu":
                                return $("<div></div>").append($("<div></div>").text(full["stressFreeValue"].toFixed(2) + " GHz")).append($("<div></div>").text(data.toFixed(2) + " %")).html();
                            case "mem":
                                return $("<div></div>").append($("<div></div>").text(full["stressFreeValue"].toFixed(1) + " GB")).append($("<div></div>").text(data.toFixed(2) + " %")).html();
                            case "disk":
                                return $("<div></div>").append($("<div></div>").text((full["stressFreeValue"]).toFixed(2) + " TB")).append($("<div></div>").text(data.toFixed(2) + " %")).html();
                            case "vsphere":
                                return $("<div></div>").append($("<div></div>").text((full["stressFreeValue"]).toFixed(2) + " 虚拟机")).append($("<div></div>").text(data.toFixed(2) + " %")).html();
                        }
                    }
                },
                {
                    data: 'remaining',
                    render: function (data, type, full, meta) {
                        if (data > 365) {
                            return "1年以上";
                        } else {
                            return data + "天";
                        }
                    }
                }],
            language: {url: '/lang/datatable.chs.json'}
        });
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
                    legendData = "CPU " + remaining;
                    break;
                case 'mem':
                    legendData = "内存 " + remaining;
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
            if (type !== "vsphere") {
                max = 100;
            }
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
                            value: [remaining, max]
                        }
                    ]
                };
                seriesData.push(series);
            }
        });
        var option = initChart(legend, seriesData);
        chart.setOption(option);
        chart.hideLoading();
    };

    timeRemaining.tableClick = function (_this) {
        if (isDisplay) {
            isDisplay = false;
            if ($(_this).parent().parent().hasClass("shown")) {
                $(_this).attr("src", "/images/details_open.png");
                if ($(_this).parent().parent().next().hasClass("hidden")) {
                    $(_this).attr("src", "/images/details_close.png");
                    $(_this).parent().parent().next().removeClass("hidden")
                } else {
                    $(_this).parent().parent().next().addClass("hidden");
                }
                isDisplay = true;
            } else {
                var uuid = $(_this).data("id");
                var type = $(_this).data("type");
                var $tr = $("<tr></tr>").append($("<td></td>").attr("colspan", "4").append($("<div></div>").attr("id", type).css({
                    "width": "100%",
                    "height": "200px"
                })));
                $(_this).parent().parent().after($tr);
                var chart = echarts.init(document.getElementById(type));
                // chart.showLoading();
                // moriarty.doGet("", null, function (res) {
                //     if (res !== null) {
                //         var data = res.data;
                $(_this).parent().parent().addClass("shown");
                $(_this).attr("src", "/images/details_close.png");


                isDisplay = true;
                chart.hideLoading();
                //     }
                // });
            }
        }
    };

    var initChart = function (legend, seriesData) {
        var data = days();
        var option = {
            color: ["#777777", "#4d593f", "#356569", "#0b314d"],
            title: {
                text: ''
            },
            tooltip: {
                trigger: 'axis',
                show: false
            },
            legend: {
                "y": "bottom",
                data: legend
            },
            grid: {
                top: "30px",
                left: '3%',
                right: '4%',
                bottom: '10%',
                containLabel: true
            },
            xAxis: {
                type: 'time',
                boundaryGap: true,
                min: 0,
                max: 365,
                data: data,
                interval: 90,
                splitLine: false,
                axisLabel: {
                    formatter: function (value) {
                        if (value === 0) {
                            return '现在';
                        } else if (value === 90) {
                            return '90天';
                        } else if (value === 180) {
                            return '180天'
                        } else if (value === 270) {
                            return '270天'
                        } else if (value === 360) {
                            return '1年'
                        }
                    }
                }
            },
            yAxis: {
                type: 'value',
                min: 0,
                max: 100,
                splitLine: false,
                axisLabel: {
                    formatter: '{value} %'
                },
                interval: 50
            },
            series: seriesData
        };
        return option;
    };

    var days = function () {
        var data = [];
        for (var i = 0; i <= 365; i++) {
            data.push(i);
        }
        return data;
    };

    window.timeRemaining = timeRemaining;
})();