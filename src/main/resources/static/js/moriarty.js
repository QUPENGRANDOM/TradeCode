/**
 * Created by bozhil on 2017/6/30.
 */
!(function () {
    var moriarty = {};

    moriarty.regPass = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)(?=.*?[#@!~*&.])[a-zA-Z\d#@!~*&.]*$/;
    moriarty.mobileVerify = /^1(3|4|5|7|8)\d{9}$/;
    moriarty.mailVerify = /^[A-Z_a-z0-9-\.]+@([A-Z_a-z0-9-]+\.)+[a-z0-9A-Z]{2,4}$/;
    moriarty.ipVerify = /^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}$/;
    moriarty.number = /^[0-9]*$/;
    moriarty.mask = /^(254|252|248|240|224|192|128|0)\.0\.0\.0|255\.(254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(254|252|248|240|224|192|128|0)$/;
    moriarty.DNS = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\\-]*[a-zA-Z0-9])\\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\\-]*[A-Za-z0-9])$/;

    moriarty.initDataTables = function (selector, url, columns) {
        selector.DataTable({
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
            // order: [[1, "desc"]],
            ajax: {
                url: url,
                dataSrc: 'data'
            },
            columns: columns,
            language: {url: '/lang/datatable.chs.json'}
        });
    };

    moriarty.doGet = function (url, params, callback, loading) {
        if (loading !== null && loading !== undefined && loading) {
            $(".preloader").attr("style", "opacity:0.5").show();
        }
        var doGetStart = new Date().getTime();
        $.ajax({
            url: url,
            type: "get",
            data: params,
            timeout: 120000,
            success: function (data) {
                if (loading !== null && loading !== undefined && loading) {
                    $('.preloader').hide();
                }
                console.log("url:" + url + "   响应时间： " + (new Date().getTime() - doGetStart) / 1000 + "s");
                callback(data)
            },
            complete: function (XMLHttpRequest, status) {
                if (loading !== null && loading !== undefined && loading) {
                    $('.preloader').hide();
                }
                if (status === 'timeout') {
                    callback(null);
                }
            },
            error: function () {
                if (loading !== null && loading !== undefined && loading) {
                    $('.preloader').hide();
                }
                callback(null);
                showErrorMessage("请求失败！")
            }
        });
    };

    moriarty.doPost = function (url, param, callback, loading) {
        if (loading !== null && loading !== undefined && loading) {
            $(".preloader").attr("style", "opacity:0.5").show();
        }
        console.log("param:" + param);
        var httpGetStart = new Date().getTime();
        var option = {
            url: url,
            type: "post",
            timeout: 200000,
            success: function (data) {
                if (loading !== null && loading !== undefined && loading) {
                    $('.preloader').hide();
                }
                console.log("url:" + url + "   响应时间： " + (new Date().getTime() - httpGetStart) / 1000 + "s");
                callback(data);
            },
            complete: function (XMLHttpRequest, status) {
                if (status === 'timeout') {
                    if (loading !== null && loading !== undefined && loading) {
                        $('.preloader').hide();
                    }
                    callback(null);
                }
            },
            error: function () {
                if (loading !== null && loading !== undefined && loading) {
                    $('.preloader').hide();
                }
                callback(null);
            }
        };
        if (typeof (param) === "string") {
            option.contentType = "application/json;charset=utf-8"
        }
        if (param !== null) {
            option.data = param;
        }
        $.ajax(option);
    };


    moriarty.actionToast = function (showName, actions, params, run) {
        var $name = $("<a></a>").addClass("dropdown-toggle u-dropdown").attr({
            'href': "javascript:;",
            'data-toggle': "dropdown",
            'role': "button",
            'aria-haspopup': "true",
            'aria-expanded': "false"
        }).text(showName).append($("<span></span>").addClass("caret"));

        var $actionBody = $("<ul></ul>").addClass("dropdown-menu animated flipInY").css("left","-50%");

        $.each(actions, function (index, action) {
            var $action = $("<li></li>").addClass("vc-action-click").attr({
                "data-id": action["id"],
                "data-params": JSON.stringify(params)
            }).attr("onclick", run).append(
                $("<a></a>").attr("href", "javascript:;").append(
                    $("<span></span>").text(action["name"])
                )
            );
            $actionBody.append($action);
        });

        var $showBody = $("<div></div>").addClass("user-profile").append(
            $("<div></div>").addClass("dropdown user-pro-body").append(
                $name).append(
                $actionBody)
        );

        return $showBody.html();
    };

    moriarty.loading = function (callback) {
        $(".preloader").attr("style", "opacity:0.5").show();
        if (callback) {
            var dtd = $.Deferred();
            callback(dtd);
            dtd.done(function () {
                $('.preloader').hide();
            });
        }
    };

    moriarty.loadTopPage = function (dcNames) {
        if (dcNames === null || dcNames === undefined) {
            toastr.warning("未发现集群", "注意");
            return;
        }
        var $show = $("<a></a>").addClass("dropdown-toggle profile-pic text-show").attr({
            'data-toggle': "dropdown",
            href: "#",
            'aria-expanded': "false"
        }).append($("<b></b>").append($("<span></span>").addClass("simulate-text")).append(
            $("<span></span>").addClass("caret").attr("style", "color: #ffffff;margin-left:5px;")
        ));

        var $list = $("<ul></ul>").addClass("dropdown-menu dropdown-user animated flipInY");
        var keys = Object.keys(dcNames);
        console.log(keys);
        for (var i = 0; i < keys.length; i++) {
            var clusters = dcNames[keys[i]];
            $.each(clusters, function (index, cluster) {
                $list.append($("<li></li>").append($("<a></a>").addClass("simulate-option").attr({
                    "href": "javascript:;",
                    "data-datacenter": keys[i]
                }).text(cluster)))
            });
        }
        //todo add default css
        $list.find("li:first a").addClass("selector");
        $show.find(".simulate-text").text($list.find("li:first a").text());
        $("#topDcNames").append($show).append($list);
    };

    moriarty.showChartLoading = function (args) {
        var charts = [];
        if (args instanceof Array) {
            charts = args;
        } else if (args instanceof Object) {
            charts.push(args)
        }

        if ((!charts.length > 0)) {
            console.warn("not found chart!");
            return;
        }
        for (var i = 0; i < charts.length; i++) {
            charts[i].showLoading("", {
                text: '加载中...',
                color: '#5b686d',
                textColor: '#000',
                maskColor: 'rgba(255, 255, 255, 0.8)',
                zlevel: 1
            });
        }
    };

    moriarty.initPieChartOption = function (arg1, arg2) {
        var a = arg2 / (arg1 + arg2);
        var color = ['#6bab64', 'rgba(107, 171, 100, 0.4)'];
        if (a > 0.75 && a < 0.9) {
            color = ["#da891d", 'rgba(218, 137, 29, 0.4)'];
        } else if (a > 0.9 || a === 0.9) {
            color = ["#e66c7c", 'rgba(230, 108, 124, 0.4)'];
        }
        return {
            color: color,
            tooltip: {
                trigger: 'item',
                formatter: function(data){
                    var name = data["name"];
                    var percent = Math.round(data["percent"]);
                    return name+" "+percent+"%";
                }
            },
            legend: {
                show: false
            },
            series: [
                {
                    type: 'pie',
                    radius: ['50%', '90%'],
                    avoidLabelOverlap: false,
                    hoverAnimation: false,
                    label: {
                        normal: {
                            show: true,
                            position: 'center',
                            formatter: function (params) {
                                if (params["name"] === "已用") {
                                    return  Math.round(params["percent"])+"%";
                                } else {
                                    return '';
                                }
                            },
                            textStyle: {
                                fontSize: '16',
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
                            value: arg2,
                            name: '已用',
                        },
                        {
                            value: arg1,
                            name: '可用',

                        }
                    ]
                }
            ]
        }
    };

    /*-- 一 告警体机运行状态 --*/
    moriarty.initAlarmIntegralStateOption = function (params) {
        var redCount = params["red"];
        var yellowCount = params["yellow"];
        //如果有告警，则显示所有告警和占比，如果没有任何告警，则显示100%正常
        if(0 == redCount && 0 == yellowCount){
            return {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} :  (100%)"
                },
                legend: {
                    orient: 'vertical',
                    left: '5%',
                    data: ["正常", "黄色告警", "红色告警"]
                },
                series: [
                    {
                        name: '运行状态',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '50%'],
                        data: [
                            {
                                value: "100",
                                name: '正常',
                                itemStyle: {
                                    normal: {
                                        color: '#6bab64'
                                    }
                                }
                            },
                            {
                                value: "0",
                                name: '黄色告警',
                                itemStyle: {
                                    normal: {
                                        color: '#FAB648'
                                    }
                                }
                            },
                            {
                                value: "0",
                                name: '红色告警',
                                itemStyle: {
                                    normal: {
                                        color: '#e66c7c'
                                    }
                                }
                            }
                        ],
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
        }else{
            return {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: '5%',
                    data: ["正常", "黄色告警", "红色告警"]
                },
                series: [
                    {
                        name: '运行状态',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '50%'],
                        data: [
                            {
                                value: params["green"],
                                name: '正常',
                                itemStyle: {
                                    normal: {
                                        color: '#6bab64'
                                    }
                                }
                            },
                            {
                                value: params["yellow"],
                                name: '黄色告警',
                                itemStyle: {
                                    normal: {
                                        color: '#FAB648'
                                    }
                                }
                            },
                            {
                                value: params["red"],
                                name: '红色告警',
                                itemStyle: {
                                    normal: {
                                        color: '#e66c7c'
                                    }
                                }
                            }
                        ],
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
    };

    /*-- 一 告警体机运行状态 --*/
    moriarty.initIntegralStateOption = function (params) {
        return {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: '5%',
                data: ["正常", "黄色告警", "红色告警"]
            },
            series: [
                {
                    name: '运行状态',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '50%'],
                    data: [
                        {
                            value: params["green"],
                            name: '正常',
                            itemStyle: {
                                normal: {
                                    color: '#6bab64'
                                }
                            }
                        },
                        {
                            value: params["yellow"],
                            name: '黄色告警',
                            itemStyle: {
                                normal: {
                                    color: '#FAB648'
                                }
                            }
                        },
                        {
                            value: params["red"],
                            name: '红色告警',
                            itemStyle: {
                                normal: {
                                    color: '#e66c7c'
                                }
                            }
                        }
                    ],
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

    Date.prototype.formatStandardDate = function () {
        return this.getFullYear()
            + '-' + ((this.getMonth() + 1) >= 10 ? '' : '0') + (this.getMonth() + 1)
            + '-' + (this.getDate() >= 10 ? '' : '0') + this.getDate();
    };
    Date.prototype.formatStandardTime = function () {
        return (this.getHours() >= 10 ? '' : '0') + this.getHours()
            + ':' + (this.getMinutes() >= 10 ? '' : '0') + this.getMinutes()
            + ':' + (this.getSeconds() >= 10 ? '' : '0') + this.getSeconds();
    };
    moriarty.initLMultipleLineChartOption = function (xData, yShow, legend, isToFixed) {
        if (isToFixed === undefined) {
            isToFixed = true;
        }
        return {
            color: ["#e66c7c", "#f7b851", "#609ee9", "#698B22", "#40E0D0", "#00CD00", "#00BFFF", "#00EE76", "#20B2AA", "#228B22", "#6CA6CD", "#778899", "#87CEFA", "#8B3A3A"],
            tooltip: {
                trigger: 'axis',
                formatter: function (a) {
                    var $toast = $("<div></div>");
                    var $time = null;
                    var $detail = $("<div></div>");
                    $.each(a, function (index, data) {
                        if (index === 0) {
                            $time = $("<div></div>").text(new Date(data.axisValue).formatStandardDate() + " " + new Date(data.axisValue).formatStandardTime());
                        }
                        var $point = $("<a></a>").attr({
                            style: "width:10px;height:10px;border-radius:10px;display:inline-block;background-color:" + data.color
                        });

                        var $name = $("<span></span>").css({
                            style: "margin-left:5px;color:#fff;font-size:10px;"
                        }).text(data.seriesName + ":");

                        var $value = $("<a></a>").attr({
                            style: "margin-left:5px;color:#fff;font-size:10px;"
                        }).text(isToFixed ? (data.value).toFixed(0) : data.value);

                        $detail.append($("<div></div>").append($point).append($name).append($value));
                    });

                    if ($time === null) {
                        $toast.append($detail)
                    } else {
                        $toast.append($time).append($detail)
                    }

                    return $toast.html()
                }
            },
            legend: {
                x: 'center',
                y: 'bottom',
                // orient: "vertical",
                data: legend
            },
            grid: {
                top: '5%',
                left: '2%',
                right: '2%',
                bottom: '8%',
                width: 'auto',
                height: '80%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: xData.length > 2 ? xData.slice(0, xData.length - 2) : xData,
                axisLabel: {
                    formatter: function (value, idx) {
                        var date = new Date(value);
                        return date.formatStandardDate() + '\n\r' + date.formatStandardTime();
                    }
                }
            },
            yAxis: {
                type: 'value'
                // axisLabel: {
                //     formatter: yShow
                // }
            }
        };
    };

    moriarty.initLPieChartOption = function (legend) {
        return {
            color: ["#e66c7c", "#f7b851", "#609ee9", "#698B22", "#40E0D0", "#00CD00", "#00BFFF", "#00EE76", "#20B2AA", "#228B22", "#6CA6CD", "#778899", "#87CEFA", "#8B3A3A"],
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    var seriesName = params.seriesName;
                    console.log(params);
                }

            },
            legend: {
                x: 'left',
                y: 'top',
                orient: "vertical",
                data: legend
            }
        };
    };

    moriarty.initMonitorOption = function (xData, itemType, legend, series) {
        return {
            color: ["#e66c7c", "#f7b851", "#609ee9", "#698B22", "#40E0D0", "#00CD00", "#00BFFF", "#00EE76", "#20B2AA", "#228B22", "#6CA6CD", "#778899", "#87CEFA", "#8B3A3A"],
            // title: {
            //     text: '',
            //     left: '50%',
            //     textAlign: 'center'
            // },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        color: '#000'
                    }
                },
                backgroundColor: 'rgba(255,255,255,1)',
                padding: [5, 10],
                textStyle: {
                    color: '#7588E4'
                },
                extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)',
                formatter: function (a) {
                    var $toast = $("<div></div>");
                    var $time = null;
                    var $detail = $("<div></div>");
                    $.each(a, function (index, data) {
                        if (index === 0) {
                            $time = $("<div></div>").text(new Date(parseInt(data.axisValue)).formatStandardDate() + " " + new Date(parseInt(data.axisValue)).formatStandardTime());
                        }
                        var $point = $("<a></a>").attr({
                            style: "width:10px;height:10px;border-radius:10px;display:inline-block;background-color:" + data.color
                        });

                        var $name = $("<span></span>").css({
                            style: "margin-left:5px;color:#fff;font-size:10px;"
                        }).text(data.seriesName + ":");

                        var $value = $("<a></a>").attr({
                            style: "margin-left:5px;font-size:10px;"
                        });

                        switch (itemType) {
                            case "cpu-load":
                                $value.text(data.value);
                                break;
                            case "cpu-util":
                                $value.text(data.value + "%");
                                break;
                            case "memory":
                                $value.text(data.value + "GB");
                                break;
                            case "disk":
                                $value.text(data.value + "GB");
                                break;
                            case "network":
                                $value.text(data.value + "Bps");
                                break;
                            default:
                                break;
                        }

                        $detail.append($("<div></div>").append($point).append($name).append($value));
                    });

                    if ($time === null) {
                        $toast.append($detail)
                    } else {
                        $toast.append($time).append($detail)
                    }

                    return $toast.html()
                }
            },
            legend: {
                right: 20,
                orient: 'horizontal',
                y: 'bottom',
                x: 'center',
                data: legend
            },
            xAxis: {
                type: 'category',
                name: '',
                data: xData,
                boundaryGap: false,
                splitLine: {
                    show: true,
                    interval: 'auto',
                    lineStyle: {
                        color: ['#D4DFF5']
                    }
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#609ee9'
                    }
                },
                axisLabel: {
                    margin: 10,
                    formatter: function (value, idx) {
                        var date = new Date(parseInt(value));
                        return date.formatStandardDate() + '\n\r' + date.formatStandardTime();
                    }
                }
            },
            yAxis: {
                type: 'value',
                name: '',
                splitLine: {
                    lineStyle: {
                        color: ['#D4DFF5']
                    }
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#609ee9'
                    }
                },
                axisLabel: {
                    margin: 10,
                    formatter: function (value) {
                        switch (itemType) {
                            case "cpu-load":
                                return value;
                                return;
                            case "cpu-util":
                                return value + "%";
                            case "memory":
                                return value + "GB";
                            case "disk":
                                return value + "GB";
                            case "network":
                                return value + "Bps";
                            default:
                                break;
                        }
                    }
                }
            },
            series: series
        }
    };

    /*判断单位MB、GB、TB*/
    moriarty.controlUnit = function (param) { /*param 单位MB*/
        if (parseInt(param) >= 1024) {
            param = (param / 1024).toFixed(2);
            /*GB*/
            if (parseInt(param) >= 1024) {
                param = (param / 1024).toFixed(2);
                /*TB*/
                return param + "TB";
            } else {
                return param + "GB";
            }
        } else {
            return param.toFixed(2) + "MB";
        }
    };

    /*判断单位 KB、MB、GB、TB*/
    moriarty.controlUnitKB = function (param) { /*param 单位B*/
        var params = parseInt(param);
        if (params >= 1024) {
            params = (params / 1024).toFixed(2);
            /*MB*/
            if (params >= 1024) {
                params = (params / 1024).toFixed(2);
                /*GB*/
                if (params >= 1024) {
                    params = (params / 1024).toFixed(2);
                    /*TB*/
                    return params + "TB";
                } else {
                    return params + "GB";
                }
            } else {
                return params + "MB";
            }
        } else {
            return params + "KB";
        }
    };

    /*判断单位 B、KB、MB、GB、TB*/
    moriarty.controlUnitB = function (param) { /*param 单位B*/
        var params = parseInt(param);
        if (params >= 1024) {
            params = (params / 1024).toFixed(2);
            /*KB*/
            if (params >= 1024) {
                params = (params / 1024).toFixed(2);
                /*MB*/
                if (params >= 1024) {
                    params = (params / 1024).toFixed(2);
                    /*GB*/
                    if (params >= 1024) {
                        params = (params / 1024).toFixed(2);
                        /*TB*/
                        return params + "TB";
                    } else {
                        return params + "GB";
                    }
                } else {
                    return params + "MB";
                }
            } else {
                return params + "KB";
            }
        } else {
            return params.toFixed(2) + "B";
        }
    };
    // moriarty.data = {
    //     "parent": {"title": "统一告警", "icon": "sss", "url": ""},
    //     "child": {
    //         "titles": [
    //             "123",
    //             "234",
    //             {
    //                 "parent": {"title": "统一告警", "icon": "sss", "url": ""},
    //                 "child": {
    //                     "titles": ["1", "2", "3", "4"],
    //                     "urls": ["/a", "/b", "/c", "/d"]
    //                 }
    //             },
    //             "345"],
    //         "urls": ["/aa", "/bb", "/cc", "/dd"]
    //     }
    // };
    moriarty.loadBusiness = function ($selector, url) {
        $.ajax({
            url: "/api/v1/cluster/resourcePool",
            type: "get",
            cache: true,
            timeout: 5000,
            async: false,
            success: function (res) {
                if (res.data === null || res.data === undefined) {
                    console.warn("无业务");
                    return;
                }

                if (url.lastIndexOf("/") !== url.length - 1) {
                    url += "/";
                }

                var result = res.data;
                $.each(result, function (index, item) {
                    var $li = $("<li></li>").append($("<a></a>").attr("href", url + item).text(item));
                    $selector.append($li);
                })
            },
            complete: function (XMLHttpRequest, status) {
                if (status === 'timeout') {
                    console.warn("加载业务超时");
                }
            },
            error: function () {
                console.warn("加载业务失败");
            }
        })
    };

    moriarty.getBusinessList = function ($selector, url) {
        $.ajax({
            url: "/api/v1/business/list?uuid=",
            type: "get",
            cache: true,
            timeout: 5000,
            async: false,
            success: function (res) {
                if (res.data === null || res.data === undefined) {
                    console.warn("无业务");
                    return;
                }

                if (url.lastIndexOf("/") !== url.length - 1) {
                    url += "/";
                }

                var result = res.data;
                $.each(result, function (index, item) {
                    var $li = $("<li></li>").append($("<a></a>").attr("href", url + item["name"] + "?uuid=" + item["uuid"]).text(item["name"]));
                    $selector.append($li);
                })
            },
            complete: function (XMLHttpRequest, status) {
                if (status === 'timeout') {
                    console.warn("加载业务超时");
                }
            },
            error: function () {
                console.warn("加载业务失败");
            }
        })
    };

    function buildBussinessData(data) {
        var dataTemplate = {
            "parent": {"title": "统一告警", "icon": ""},
            "child": {
                "titles": data,
                "urls": []
            }
        };
        var url = "/alarm/group/";
        var urls = [];
        $.each(data, function (i, name) {
            urls.push(url + name);
        });
        dataTemplate.child.urls = urls;
        return dataTemplate;
    }

    moriarty.initLeftPage = function (data, $select) {
        var $li = leftHelperOfLi();
        $li.append(leftHelperOfParent(data["parent"])).append(leftHelperOfChild(data["child"], false));
        $select.after($li);
    };

    function leftHelperOfLi() {
        return $("<li></li>");
    }

    function leftHelperOfParent(parent) {
        return $("<a></a>").attr("href", "javascript:;").addClass("waves-effect").append(
            $("<li></li>").addClass("zmdi zmdi-view-dashboard zmdi-hc-fw fa-fw")).append(
            $("<span></span>").addClass("hide-menu").text(parent["title"]).append(
                $("<span></span>").addClass("fa arrow")
            )
        );
    }

    function leftHelperOfChild(child, second) {
        var $ul = $("<ul></ul>").addClass(second ? "nav nav-second-level collapse" : "nav nav-third-level collapse");

        var titles = child["titles"];
        var urls = child["urls"];

        var length = titles.length;
        for (var i = 0; i < length; i++) {
            var title = titles[i];
            if (typeof title === "string") {
                var $item = $("<li></li>").append($("<a></a>").attr("href", urls[i]).text(title));
                $ul.append($item);
            } else {
                var $secondTitle = leftHelperOfParent(title["parent"]);
                var $secondUl = leftHelperOfChild(title["child"], false);
                $ul.append($("<li></li>").append($secondTitle).append($secondUl));
            }
        }
        return $ul;
    }

    moriarty.initLineChartOption = function (xData, yData, yShow, toast) {
        return {
            tooltip: {
                trigger: 'axis',
                formatter: toast,
                axisPointer: {
                    animation: false
                }
            },
            color: ["#49afd9"],
            xAxis: {
                type: 'category',
                splitLine: {
                    show: false
                },
                data: xData.length > 2 ? xData.slice(0, xData.length - 2) : xData,
                axisLabel: {
                    formatter: function (value, idx) {
                        var date = new Date(parseInt(value));
                        return date.formatStandardDate() + '\n\r' + date.formatStandardTime();
                    }
                }
            },
            grid: {
                top: '5%',
                left: '5%',
                right: '5%',
                bottom: '5%',
                width: '90%',
                height: '80%',
                containLabel: true
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, '100%'],
                splitLine: {
                    show: false
                },
                axisLabel: {
                    formatter: yShow
                }
            },
            series: [{
                name: '',
                type: 'line',
                showSymbol: false,
                hoverAnimation: false,
                data: yData.length > 2 ? yData.slice(0, yData.length - 2) : yData
            }],
            dataZoom: [{
                type: 'inside'
            }, {
                labelFormatter: function (value) {
                    var date = new Date(parseInt(xData[value]));
                    return date.formatStandardDate() + " " + date.formatStandardTime();
                }
            }]
        };
    };

    moriarty.swal = function (title, text, type, callback) {
        swal({
                title: title,
                text: text,
                type: type,
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnConfirm: true,
                closeOnCancel: true
            },
            function (is) {
                if (is) {
                    callback();
                }
            });

    };

    moriarty.dbDate = function (date) {
        var localDate = "";
        var d = new Date();
        d.setTime(date);
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var hours = d.getHours();
        var minutes = d.getMinutes();
        var seconds = d.getSeconds();
        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }
        if (hours < 10) {
            hours = "0" + hours;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        localDate = year + "-" + month + "-" + day + " " +
            hours + ":" + minutes + ":" + seconds;
        return localDate;
    };

    moriarty.alarmState = function (state) {
        var $div = $('<div></div>');
        var $i = $('<i class="fa fa-circle" style="font-size: 23px"></i>');
        if (state === "green") {
            return $div.append($i.css("color", "green")).html();
        } else if (state === "yellow") {
            return $div.append($i.css("color", "#FCEB9A")).html();
        } else if (state === "red") {
            return $div.append($i.css("color", "red")).html();
        } else {
            return $div.append($i.css("color", "gray")).html();
        }
    };

    /*判断单位 KB、MB、GB、TB*/
    moriarty.controlUnit = function (param) { /*param 单位MB*/
        if (parseInt(param) >= 1024) {
            param = (param / 1024).toFixed(2);
            /*GB*/
            if (parseInt(param) >= 1024) {
                param = (param / 1024).toFixed(2);
                /*TB*/
                return param + "TB";
            } else {
                return param + "GB";
            }
        } else {
            return param.toFixed(2) + "MB";
        }
    };

    /*判断单位 Hz、KHz、MHz、GHz*/
    moriarty.controlUnitHz = function (param) { /*param 单位MHz*/
        if (parseInt(param) >= 1000) {
            param = (param / 1000).toFixed(2);
            /*GHz*/
            return param + "GHz"
        } else {
            return param + "MHz";
        }
    };

    moriarty.getEmployeeType = function () {
        var employeeType = $("#employeeType").text();
        if (employeeType === "" || employeeType === null || employeeType === undefined) {
            //admin
            return false;
        } else
        //others
            return true;
    };

    //压力系数
    moriarty.stressMax = function (uuid) {
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
                }
            }
        })
    };

    //工作周工作负载
    moriarty.workload = function (uuid) {
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
                    padding: "3px 8px",
                    background: colors[parseInt(g[i]["value"] / g[i]["count"])]
                }).text("   "))
                    .append($("<td></td>").css({
                        padding: "3px 8px",
                        background: colors[parseInt(a[i]["value"] / a[i]["count"])]
                    }).text("   "))
                    .append($("<td></td>").css({
                        padding: "3px 8px",
                        background: colors[parseInt(b[i]["value"] / b[i]["count"])]
                    }).text("   "))
                    .append($("<td></td>").css({
                        padding: "3px 8px",
                        background: colors[parseInt(c[i]["value"] / c[i]["count"])]
                    }).text("   "))
                    .append($("<td></td>").css({
                        padding: "3px 8px",
                        background: colors[parseInt(d[i]["value"] / d[i]["count"])]
                    }).text("   "))
                    .append($("<td></td>").css({
                        padding: "3px 8px",
                        background: colors[parseInt(e[i]["value"] / e[i]["count"])]
                    }).text("   "))
                    .append($("<td></td>").css({
                        padding: "3px 8px",
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

    //时间系数
    moriarty.getTimeRemainingData = function (uuid) {
        moriarty.doGet("/api/v1/vrop/datacenter/timeRemaining/data", {"uuid": uuid}, function (res) {
            if (res !== null) {
                if (res.result === "SUCCESS") {
                    var data = res.data;
                    var score = Math.round(data["badge|timeRemaining"]);
                    $("#usageRate-timeRemaining").text(score);
                    if (score < 70) {
                        $("#stressMax-timeRemaining").css("background-image", "-webkit-linear-gradient(top,#fffafb,#fff3f4)");
                        $("#stressMax-timeRemaining").find("img").attr("src", "/images/time_remaining_serious.png");
                        $("#stressType-timeRemaining").text("重大问题");
                    } else {
                        $("#stressMax-timeRemaining").css("background-image", "-webkit-linear-gradient(top,#f4fff4,#e8ffe8)");
                        $("#stressMax-timeRemaining").find("img").attr("src", "/images/time_remaining_nomal.png");
                        $("#stressType-timeRemaining").text("正常: 没有问题。");
                    }
                }
            }
        })
    };

    //剩余容量
    moriarty.getSurplusCapacity = function (uuid) {
        moriarty.doGet("/api/v1/vrop/datacenter/surplus/capacity", {"uuid": uuid}, function (res) {
            if (res !== null) {
                if (res.result === "SUCCESS") {
                    var data = res.data;
                    $("#usageRate-surplusCapacity").text(data["capacityRemaining"].toFixed(0));
                    $("#surplusCapacity").text(data["capacityRemaining"].toFixed(0) + " % 的剩余容量");
                    $("#totalCapacity").text("总计: " + (data["totalCapacity"] / 1024).toFixed(2) + " TB");
                    $("#availableCapacity").text("可用容量: " + (data["availableCapacity"] / 1024).toFixed(2) + " TB (" + (data["availableCapacity"] / data["totalCapacity"]).toFixed(2) * 100 + "%)");
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

    //剩余时间
    moriarty.getTimeRemaining = function (uuid) {
        moriarty.doGet("/api/v1/vrop/datacenter/timeRemaining", {"uuid": uuid}, function (res) {
            if (res !== null) {
                if (res.result === "SUCCESS") {
                    var data = res.data;
                    loadChart(data);
                    return data;
                }
            }
        })
    };

    //警示TopN
    moriarty.getTopNAlert = function () {
        moriarty.doGet("/api/v1/vrop/topN/alert", null, function (res) {
            if (res !== null) {
                var data = res.data;
                if (data !== null && data.length !== 0) {
                    $.each(data, function (index, alert) {
                        var $div = $("<div></div>").css({
                            "padding": "5px",
                            "border": "1px #d8d8d8 solid",
                            "background-color": "#D9E4EA"
                        });
                        var name = alert["name"];
                        var overallCriticality = alert["overallCriticality"];
                        var impact = alert["impact"];
                        switch (impact) {
                            case "health":
                                if (overallCriticality === 4) {
                                    $div.append($("<div></div>").css("margin-bottom", "5px").append($("<img>").attr("src", "/images/03_red.png").css({
                                        "display": "inline-block",
                                        "margin-right": "5px"
                                    })).append($("<div></div>").css({
                                        "display": "inline-block",
                                        "font-weight": "600"
                                    }).text(name)));
                                } else if (overallCriticality === 3) {
                                    $div.append($("<div></div>").css("margin-bottom", "5px").append($("<img>").attr("src", "/images/03_orange.png").css({
                                        "display": "inline-block",
                                        "margin-right": "5px"
                                    })).append($("<div></div>").css({
                                        "display": "inline-block",
                                        "font-weight": "600"
                                    }).text(name)));
                                } else {
                                    $div.append($("<div></div>").css("margin-bottom", "5px").append($("<img>").attr("src", "/images/03_yellow.png").css({
                                        "display": "inline-block",
                                        "margin-right": "5px"
                                    })).append($("<div></div>").css({
                                        "display": "inline-block",
                                        "font-weight": "600"
                                    }).text(name)));
                                }
                                break;
                            case "risk":
                                if (overallCriticality === 4) {
                                    $div.append($("<div></div>").css("margin-bottom", "5px").append($("<img>").attr("src", "/images/02_red.png").css({
                                        "display": "inline-block",
                                        "margin-right": "5px"
                                    })).append($("<div></div>").css({
                                        "display": "inline-block",
                                        "font-weight": "600"
                                    }).text(name)));
                                } else if (overallCriticality === 3) {
                                    $div.append($("<div></div>").css("margin-bottom", "5px").append($("<img>").attr("src", "/images/02_orange.png").css({
                                        "display": "inline-block",
                                        "margin-right": "5px"
                                    })).append($("<div></div>").css({
                                        "display": "inline-block",
                                        "font-weight": "600"
                                    }).text(name)));
                                } else {
                                    $div.append($("<div></div>").css("margin-bottom", "5px").append($("<img>").attr("src", "/images/02_yellow.png").css({
                                        "display": "inline-block",
                                        "margin-right": "5px"
                                    })).append($("<div></div>").css({
                                        "display": "inline-block",
                                        "font-weight": "600"
                                    }).text(name)));
                                }
                                break;
                            case "efficiency":
                                if (overallCriticality === 4) {
                                    $div.append($("<div></div>").css("margin-bottom", "5px").append($("<img>").attr("src", "/images/01_red.png").css({
                                        "display": "inline-block",
                                        "margin-right": "5px"
                                    })).append($("<div></div>").css({
                                        "display": "inline-block",
                                        "font-weight": "600"
                                    }).text(name)));
                                } else if (overallCriticality === 3) {
                                    $div.append($("<div></div>").css("margin-bottom", "5px").append($("<img>").attr("src", "/images/01_orange.png").css({
                                        "display": "inline-block",
                                        "margin-right": "5px"
                                    })).append($("<div></div>").css({
                                        "display": "inline-block",
                                        "font-weight": "600"
                                    }).text(name)));
                                } else {
                                    $div.append($("<div></div>").css("margin-bottom", "5px").append($("<img>").attr("src", "/images/01_yellow.png").css({
                                        "display": "inline-block",
                                        "margin-right": "5px"
                                    })).append($("<div></div>").css({
                                        "display": "inline-block",
                                        "font-weight": "600"
                                    }).text(name)));
                                }
                                break;
                            default:
                                break;
                        }
                        $div.append($("<div></div>").css("padding-left", "20px").text(alert["affectedResourceCount"] + " 对象受影响 | " + alert["recommendationCount"] + " 个建议"));
                        $div.append($("<div></div>").css({"padding-left": "20px"}).html(alert["description"]));
                        $("#alertTopN").append($div);
                    });
                }
            }
        })
    };

    //警示列表
    moriarty.getAlertList = function () {
        $("#vropAlertList").DataTable({
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
            scrollY: "325px",
            scrollCollapse: true,
            ajax: {
                url: "/api/v1/vrop/alert",
                dataSrc: 'data'
            },
            columns: [
                {
                    data: "state",
                    render: function (data, type, full, meta) {
                        if (data === "WARNING") {
                            return $("<div></div>").append($("<img>").attr("src", "/images/criticalityLevel_2.png")).html();
                        } else if (data === "CRITICAL") {
                            return $("<div></div>").append($("<img>").attr("src", "/images/criticalityLevel_4.png")).html();
                        } else if (data === "IMMEDIATE") {
                            return $("<div></div>").append($("<img>").attr("src", "/images/criticalityLevel_3.png")).html();
                        } else {
                            return $("<div></div>").append($("<img>").attr("src", "/images/criticalityLevel_4.png")).html();
                        }
                    }
                },
                {
                    data: "alertInfo",
                    render: function (data, type, full, meta) {
                        return $("<div></div>").append($("<div></div>").css({
                            "overflow": "hidden",
                            "text-overflow": "ellipsis",
                            "white-space": "nowrap"
                        }).attr("title",data).text(data)).html();
                    }
                },
                {
                    data: "resourceIdentifiers",
                    render: function (data, type, full, meta) {
                        return $("<div></div>").append($("<div></div>").css({
                            "overflow": "hidden",
                            "text-overflow": "ellipsis",
                            "white-space": "nowrap"
                        }).attr("title",data).text(data)).html();
                    }
                },
                {
                    data: "datetimeCreated",
                    render: function (data, type, full, meta) {
                        return new Date(data).formatStandardTime();
                    }
                },
                {
                    data: "status",
                    render: function (data, type, full, meta) {
                        if (data === "CANCELED") {
                            return $("<div></div>").append($("<img>").attr("src", "/images/state_canceled.png ")).html();
                        } else if (data === "ACTIVE") {
                            return $("<div></div>").append($("<img>").attr("src", "/images/state_active.png")).html();
                        }
                    }
                },
                {
                    data: "type",
                    render: function (data, type, full, meta) {
                        return $("<div></div>").append($("<div></div>").css({
                            "overflow": "hidden",
                            "text-overflow": "ellipsis",
                            "white-space": "nowrap"
                        }).attr("title",data).text(data)).html();
                    }
                },
                {
                    data: "subType"
                }
            ],
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
        var option = moriarty.initChart(legend, seriesData);
        chart.setOption(option);
        chart.hideLoading();
    };

    moriarty.initChart = function (legend, seriesData) {
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

    window.moriarty = moriarty;
})();