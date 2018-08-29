/**
 * Created by bozhil on 2017/11/23.
 */
!(function () {
    var vropDashboard = {};
    var isDisplay = true;


    vropDashboard.init = function (uuid) {
        workload(uuid);
        stressDetailList(uuid);
        stressMax(uuid);
    };

    vropDashboard.tableClick = function (_this) {
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
                switch (type) {
                    case "cpu":
                        loadChart("/api/v1/vrop/analyze/datacenter/cpu/charts", type, _this);
                        break;
                    case "mem":
                        loadChart("/api/v1/vrop/analyze/datacenter/mem/charts", type, _this);
                        break;
                    case "limit":
                        loadChart("", type, _this);
                        break;
                    default:
                        break;
                }
            }
        }
    };

    var stressMax = function (uuid) {
        moriarty.doGet("/api/v1/stress/score?uuid=" + uuid, null, function (res) {
            if (res !== null) {
                var data = res.data;
                var type = data["key"].split("|")[0];
                var score = data["score"].toFixed(0);
                if (score > 70) {
                    var text = "";
                    switch (type) {
                        case "cpu":
                            text = "CPU";
                            break;
                        case "mem":
                            text = "内存";
                            break;
                        case "limit":
                            text = "限制";
                            break;
                        default:
                            break;
                    }
                    $("#stressMax").css("background-image", "-webkit-linear-gradient(top,#fffafb,#fff3f4)");
                    $("#stressMax").find("img").attr("src", "/images/stress_serious.png");
                    $("#usageRate").text(score);
                    $("#stressType").text("压力最大 (按 " + text + "(已消耗))。");
                    $("#stressType").after($("<div></div>").text("严重"));
                } else {
                    $("#stressMax").css("background-image", "-webkit-linear-gradient(top,#f4fff4,#e8ffe8)");
                    $("#stressMax").find("img").attr("src", "/images/stress_normal.png");
                    $("#usageRate").text(score);
                    $("#stressType").text("正常: 没有问题。");
                    if ($("#usageRate").text().length < 2) {
                        $("#usageRate").css("left", "26px");
                    }
                }
            }
        })
    };

    var stressDetailList = function (uuid) {
        $("#vropList").DataTable({
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
            ajax: {
                url: "/api/v1/stress/breakdown?uuid=" + uuid,
                dataSrc: 'data'
            },
            columns: [
                {
                    data: "name",
                    render: function (data, type, full, meta) {
                        return $("<div></div>").append($("<img>").attr({
                            "src": "/images/details_open.png",
                            "data-id": uuid,
                            "data-type": full["type"],
                            "onClick": "vropDashboard.tableClick(this)"
                        })).append($("<span></span>").css("margin-left", "5px").text(data)).html();
                    }
                },
                {
                    data: 'currentSize',
                    render: function (data, type, full, meta) {
                        switch (full["type"]) {
                            case "cpu":
                                return $("<div></div>").append($("<div></div>").text(data + " 内核")).append($("<div></div>").text("已配置")).html();
                            case "mem":
                                return $("<div></div>").append($("<div></div>").text(data.toFixed(2) + " GB")).append($("<div></div>").text("已配置")).html();
                            case "limit":
                                return $("<div></div>").append($("<div></div>").text(data + " 虚拟机")).append($("<div></div>").text("已配置")).html();
                        }
                    }
                },
                {
                    data: 'stressFreePre',
                    render: function (data, type, full, meta) {
                        switch (full["type"]) {
                            case "cpu":
                                return $("<div></div>").append($("<div></div>").text(data.toFixed(2) + " %")).append($("<div></div>").text((full["stressFree"] / 1000).toFixed(2) + " GHz")).append($("<div></div>").text("需求")).html();
                            case "mem":
                                return $("<div></div>").append($("<div></div>").text(data.toFixed(2) + " %")).append($("<div></div>").text(full["stressFree"].toFixed(1) + " GB")).append($("<div></div>").text("需求")).html();
                            case "limit":
                                return $("<div></div>").append($("<div></div>").text(data.toFixed(2) + " %")).append($("<div></div>").text((full["stressFree"]).toFixed(2) + " 虚拟机")).append($("<div></div>").text("需求")).html();
                        }
                    }
                },
                {
                    data: 'demandPre',
                    render: function (data, type, full, meta) {
                        switch (full["type"]) {
                            case "cpu":
                                return $("<div></div>").append($("<div></div>").text((data * 100).toFixed(2) + " %")).append($("<div></div>").text(full["demand"].toFixed(2) + " 内核")).html();
                            case "mem":
                                return $("<div></div>").append($("<div></div>").text((data * 100).toFixed(2) + " %")).append($("<div></div>").text(full["demand"].toFixed(2) + " GB")).html();
                            case "limit":
                                return $("<div></div>").append($("<div></div>").text((data * 100).toFixed(2) + " %")).append($("<div></div>").text(full["demand"].toFixed(2) + " 虚拟机")).html();
                        }
                    }
                },
                {
                    data: '',
                    render: function (data, type, full, meta) {
                        return $("<div></div>").append($("<div></div>").text(">70.0%")).html();
                    }
                },
                {
                    data: 'stress',
                    render: function (data, type, full, meta) {
                        var stress = data.toFixed(2);
                        var backGround = "none";
                        var color = "";
                        if (stress > 70) {
                            backGround = "#e66c7c";
                            color = "#fff";
                        }
                        return $("<div></div>").append($("<div></div>").css({
                            "background-color": backGround,
                            "color": color
                        }).text(data.toFixed(2) + "%")).html();
                    }
                }],
            language: {url: '/lang/datatable.chs.json'}
        });
    };

    var workload = function (uuid) {
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            console.log(e);
            if ($(e.target).attr("href") === "#storage_chart") {

            }
        });
        var colors = ["#00FF00", "#05FF00", "#0AFF00", "#0FFF00", "#14FF00", "#19FF00", "#1EFF00", "#23FF00", "#28FF00", "#2DFF00", "#32FF00", "#37FF00", "#3CFF00", "#41FF00", "#46FF00", "#4BFF00", "#50FF00", "#55FF00", "#5AFF00", "#5FFF00", "#64FF00", "#69FF00", "#6EFF00", "#73FF00", "#78FF00", "#7DFF00", "#82FF00", "#87FF00", "#8CFF00", "#91FF00", "#96FF00", "#9BFF00", "#A0FF00", "#A5FF00", "#AAFF00", "#AFFF00", "#B4FF00", "#B9FF00", "#BEFF00", "#C3FF00", "#C8FF00", "#CDFF00", "#D2FF00", "#D7FF00", "#DCFF00", "#E1FF00", "#E6FF00", "#EBFF00", "#F0FF00", "#F5FF00", "#FAFF00", "#FFFF00", "#FFFA00", "#FFF500", "#FFF000", "#FFEB00", "#FFE600", "#FFE100", "#FFDC00", "#FFD700", "#FFD200", "#FFCD00", "#FFC800", "#FFC300", "#FFBE00", "#FFB900", "#FFB400", "#FFAF00", "#FFAA00", "#FFA500", "#FFA000", "#FF9B00", "#FF9600", "#FF9100", "#FF8C00", "#FF8700", "#FF8200", "#FF7D00", "#FF7800", "#FF7300", "#FF6E00", "#FF6900", "#FF6400", "#FF5F00", "#FF5A00", "#FF5500", "#FF5000", "#FF4B00", "#FF4600", "#FF4100", "#FF3C00", "#FF3700", "#FF3200", "#FF2D00", "#FF2800", "#FF2300", "#FF1E00", "#FF1900", "#FF1400", "#FF0F00"];

        moriarty.doGet("/api/v1/stress/workload?uuid=" + uuid, null, function (res) {
            var data = res.data;
            var a = data["MONDAY"];
            var b = data["TUESDAY"];
            var c = data["WEDNESDAY"];
            var d = data["THURSDAY"];
            var e = data["FRIDAY"];
            var f = data["SATURDAY"];
            var g = data["SUNDAY"];
            var weeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", ""];
            var $week = $("<tr></tr>");
            $.each(weeks, function (index, week) {
                $week.append($("<td></td>").addClass("week-style").text(week));
            });

            var $workload = $("<div></div>").css({"margin-bottom": "10px"}).append($("<div></div>").css({
                "font-weight": "600",
                "display": "inline-block"
            }).text("工作周工作负载：")).append($("<div></div>").css("display", "inline-block").text("平均每小时，过去6周"));
            var $table = $("<table></table>").addClass("table table-hover table-condensed table-bordered");
            $table.append($week);
            for (var i = 0; i < 24; i++) {
                var $tr = $("<tr></tr>");
                $tr.append($("<td></td>").css({
                    padding: "5px 8px",
                    background: colors[parseInt(g[i]["value"] / g[i]["count"])]
                }).text("   "))
                    .append($("<td></td>").css({
                        padding: "5px 8px",
                        background: colors[parseInt(a[i]["value"] / a[i]["count"])]
                    }).text("   "))
                    .append($("<td></td>").css({
                        padding: "5px 8px",
                        background: colors[parseInt(b[i]["value"] / b[i]["count"])]
                    }).text("   "))
                    .append($("<td></td>").css({
                        padding: "5px 8px",
                        background: colors[parseInt(c[i]["value"] / c[i]["count"])]
                    }).text("   "))
                    .append($("<td></td>").css({
                        padding: "5px 8px",
                        background: colors[parseInt(d[i]["value"] / d[i]["count"])]
                    }).text("   "))
                    .append($("<td></td>").css({
                        padding: "5px 8px",
                        background: colors[parseInt(e[i]["value"] / e[i]["count"])]
                    }).text("   "))
                    .append($("<td></td>").css({
                        padding: "5px 8px",
                        background: colors[parseInt(f[i]["value"] / f[i]["count"])]
                    }).text("   "));
                if (i % 3 === 0) {
                    var $td = $("<td></td>").css({
                        color: "#a0a0a0",
                        padding: "5px",
                        textAlign: "center",
                        "border": "none"
                    }).attr("rowspan", "3").text(i + "点");
                    $tr.append($td);
                }
                $table.append($tr);
            }
            var $line = $("<div></div>").append($("<div></div>").addClass("linearColor").css("width", "50%").append($("<div></div>").addClass("linearColorBar")).append($("<div></div>").addClass("numbers").append($("<div></div>").addClass("left").text("0")).append($("<div></div>").addClass("right").text("100"))));
            $("#workLoad").append($workload).append($table).append($line);
        })
    };

    var loadChart = function (url, type, _this) {
        var $tr = $("<tr></tr>").append($("<td></td>").attr("colspan", "4").append($("<div></div>").attr("id", type).css({
            "width": "100%",
            "height": "200px"
        })));
        $(_this).parent().parent().after($tr);
        var chart = echarts.init(document.getElementById(type));
        chart.showLoading();
        moriarty.doGet(url, null, function (res) {
            if (res !== null) {
                var data = res.data;
                $(_this).parent().parent().addClass("shown");
                $(_this).attr("src", "/images/details_close.png");
                var capacity = "", stress = "", peak = "";
                var seriesData = [];
                $.each(data, function (index, info) {
                    var statKey = info["statKey"];
                    var chart = info["chart"];
                    var value = info["value"];
                    switch (statKey) {
                        case "cpu|demandmhz":
                            if (type === "cpu") {
                                peak = (value / 1000).toFixed(2) + "GHz";
                            } else if (type === "limit") {
                                peak = value + "虚拟机";
                            }
                            break;
                        case "cpu|demand|actual.capacity.normalized":
                            if (type === "cpu") {
                                capacity = (value / 1000).toFixed(2) + "GHz";
                            } else if (type === "limit") {
                                capacity = value.toFixed(0) + "虚拟机";
                            }
                            break;
                        case "cpu|demand|object.demand":
                            if (type === "cpu") {
                                stress = (value / 1000).toFixed(2) + "GHz";
                            } else if (type === "limit") {
                                stress = value.toFixed(2) + "虚拟机";
                            }
                            break;
                        case "mem|host_systemUsage":
                            peak = (value/1024/1024).toFixed(2) + "GB";
                            break;
                        case "mem|consumed|actual.capacity.normalized":
                            capacity = (value/1024/1024).toFixed(2) + "GB";
                            break;
                        case "mem|consumed|object.demand":
                            stress = (value/1024/1024).toFixed(2) + "GB";
                            break;
                        default:
                            break;
                    }
                    seriesData.push(chart);
                });
                var $div = $("<div></div>").append($("<div></div>").append($("<div></div>").css({
                    "height": "10px",
                    "width": "10px",
                    "background-color": "#ffcccf",
                    "display": "inline-block",
                    "margin-right": "5px"
                })).append($("<span></span>").css({"color": "#7c7b7b"}).text("压力区域: >70%"))).append($("<div></div>").css({
                    "color": "#565656",
                    "font-weight": "600"
                }).text("总容量: " + capacity)).append($("<div></div>").css({
                    "color": "#B10045",
                    "font-weight": "600"
                }).text("无压力值: " + stress)).append($("<div></div>").css({
                    "color": "#7c7b7b",
                    "font-weight": "600"
                }).text("峰值: " + peak));
                $tr.append($("<td></td>").attr("colspan", "2").append($div));
                chart.setOption(chartOption(seriesData));
                isDisplay = true;
                chart.hideLoading();
            }
        });
    };

    var chartOption = function (seriesData) {
        var markArea = {
            silent: true,
            label: {
                normal: {
                    position: ['10%', '50%']
                }
            },
            data: [
                [{
                    name: '',
                    yAxis: 70,
                    itemStyle: {
                        normal: {
                            color: '#ffcccf'
                        }
                    }
                }, {
                    yAxis: 100
                }]
            ]
        };
        $.each(seriesData, function (index, data) {
            if (index === 0) {
                data["markArea"] = markArea;
            }
        });
        return {
            xAxis: {
                type: 'time',
                name: '时间'
            },
            yAxis: {
                axisLabel: {
                    formatter: function () {
                        return "";
                    }
                },
                axisTick: {
                    show: false
                }
            },
            legend: {
                show: false
            },
            series: seriesData
        };
    };

    window.vropDashboard = vropDashboard;
})();