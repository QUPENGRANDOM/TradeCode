!(function () {
    var vsanDashboard = {};
    var clusteruuid = "";

    vsanDashboard.init = function () {
        getVsanworldSummary();
        getVsanClusterList();
        getCapacity();
        moriarty.getTopNAlert();
        moriarty.getAlertList();
    };

    var getCapacity = function () {
        var total_capacity_chart = echarts.init(document.getElementById("total_capacity_chart"));
        var used_disk_space_chart = echarts.init(document.getElementById("used_disk_space_chart"));
        var capacity_remaining_chart = echarts.init(document.getElementById("capacity_remaining_chart"));
        var dedupe_chart = echarts.init(document.getElementById("dedupe_chart"));
        total_capacity_chart.showLoading();
        used_disk_space_chart.showLoading();
        capacity_remaining_chart.showLoading();
        dedupe_chart.showLoading();
        moriarty.doGet("/api/v1/vrop/vsan/remaining/capacity", null, function (res) {
            if (res !== null) {
                var data = res.data;
                if (data !== null) {
                    var option = null;
                    var min = 0;
                    var max = 0;
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
                    };
                    $.each(data, function (index, item) {
                        var statKey = item["statKey"];
                        var times = item["times"];
                        var datas = item["datas"];
                        var last = item["last"].toFixed(2);
                        var name = item["name"];
                        switch (statKey) {
                            case "summary|vsan_diskspace_capacity":
                                $("#total_capacity").text(last).append($("<span></span>").addClass("vrop-unit").text(" TB"));
                                option = initVsanChart(times, datas, name);
                                max = Math.max.apply(Math, datas);
                                min = Math.min.apply(Math, datas);
                                option.yAxis.max = max;
                                option.yAxis.min = min;
                                option.series[0].markArea = markArea;
                                total_capacity_chart.setOption(option);
                                break;
                            case "summary|vsan_diskspace_capacity_used":
                                $("#used_disk_space").text(last).append($("<span></span>").addClass("vrop-unit").text(" TB"));
                                option = initVsanChart(times, datas, name);
                                max = Math.max.apply(Math, datas);
                                min = Math.min.apply(Math, datas);
                                option.yAxis.max = max;
                                option.yAxis.min = min;
                                option.series[0].markArea = markArea;
                                used_disk_space_chart.setOption(option);
                                break;
                            case "summary|remaining_capacity":
                                $("#capacity_remaining").text(last).append($("<span></span>").addClass("vrop-unit").text(" TB"));
                                option = initVsanChart(times, datas, name);
                                max = Math.max.apply(Math, datas);
                                min = Math.min.apply(Math, datas);
                                option.yAxis.max = max;
                                option.yAxis.min = min;
                                option.series[0].markArea = markArea;
                                capacity_remaining_chart.setOption(option);
                                break;
                            case "summary|total_dedup_compress_savings":
                                $("#dedupe").text(last).append($("<span></span>").addClass("vrop-unit").text(" GB"));
                                option = initVsanChart(times, datas, name);
                                max = Math.max.apply(Math, datas);
                                min = Math.min.apply(Math, datas);
                                option.yAxis.max = max;
                                option.yAxis.min = min;
                                option.series[0].markArea = markArea;
                                dedupe_chart.setOption(option);
                                break;
                            default:
                                break;
                        }
                    });
                }
            }
            total_capacity_chart.hideLoading();
            used_disk_space_chart.hideLoading();
            capacity_remaining_chart.hideLoading();
            dedupe_chart.hideLoading();
        });
    };

    var getVsanworldSummary = function () {
        var vsanClustersChart = echarts.init(document.getElementById("vsanClusters_chart"));
        var hostsChart = echarts.init(document.getElementById("hosts_chart"));
        var cacheDisksChart = echarts.init(document.getElementById("cacheDisks_chart"));
        var capacityDisksChart = echarts.init(document.getElementById("capacityDisks_chart"));
        var vms_vsanClustersChart = echarts.init(document.getElementById("vms_vsanCluster_chart"));
        var iopsServedChart = echarts.init(document.getElementById("iopsServed_chart"));
        var atLatencyChart = echarts.init(document.getElementById("atLatency_chart"));
        vsanClustersChart.showLoading();
        hostsChart.showLoading();
        cacheDisksChart.showLoading();
        capacityDisksChart.showLoading();
        vms_vsanClustersChart.showLoading();
        iopsServedChart.showLoading();
        atLatencyChart.showLoading();
        moriarty.doGet("/api/v1/vrop/vsan/dashboard/vsanworld/summary", null, function (res) {
            if (res !== null) {
                var data = res.data;
                if (data !== null) {
                    var option = null;
                    var min = 0;
                    var max = 0;
                    $.each(data, function (index, item) {
                        var statKey = item["statKey"];
                        var times = item["times"];
                        var datas = item["datas"];
                        var last = item["last"];
                        var name = item["name"];
                        switch (statKey) {
                            case "summary|total_cluster_count":
                                $("#vsanClusters").text(last);
                                option = initVsanChart(times, datas, name);
                                max = Math.max.apply(Math, datas);
                                min = Math.min.apply(Math, datas);
                                option.yAxis.max = max;
                                option.yAxis.min = min;
                                vsanClustersChart.setOption(option);
                                break;
                            case "summary|total_number_hosts":
                                $("#hosts").text(last);
                                option = initVsanChart(times, datas, name);
                                max = Math.max.apply(Math, datas);
                                min = Math.min.apply(Math, datas);
                                option.yAxis.max = max;
                                option.yAxis.min = min;
                                hostsChart.setOption(option);
                                break;
                            case "summary|total_number_cache_disks":
                                $("#cacheDisks").text(last);
                                option = initVsanChart(times, datas, name);
                                max = Math.max.apply(Math, datas);
                                min = Math.min.apply(Math, datas);
                                option.yAxis.max = max;
                                option.yAxis.min = min;
                                cacheDisksChart.setOption(option);
                                break;
                            case "summary|total_number_capacity_disks":
                                $("#capacityDisks").text(last);
                                option = initVsanChart(times, datas, name);
                                max = Math.max.apply(Math, datas);
                                min = Math.min.apply(Math, datas);
                                option.yAxis.max = max;
                                option.yAxis.min = min;
                                capacityDisksChart.setOption(option);
                                break;
                            case "summary|total_number_vms":
                                $("#vms_vsanClusters").text(last);
                                option = initVsanChart(times, datas, name);
                                max = Math.max.apply(Math, datas);
                                min = Math.min.apply(Math, datas);
                                option.yAxis.max = max;
                                option.yAxis.min = min;
                                vms_vsanClustersChart.setOption(option);
                                break;
                            case "summary|total_iops":
                                $("#iopsServed").text(last);
                                option = initVsanChart(times, datas, name);
                                max = Math.max.apply(Math, datas);
                                min = Math.min.apply(Math, datas);
                                option.yAxis.max = max;
                                option.yAxis.min = min;
                                iopsServedChart.setOption(option);
                                break;
                            case "summary|total_latency":
                                $("#atLatency").text(last.toFixed(0));
                                option = initVsanChart(times, datas, name);
                                max = Math.max.apply(Math, datas);
                                min = Math.min.apply(Math, datas);
                                option.yAxis.max = max;
                                option.yAxis.min = min;
                                atLatencyChart.setOption(option);
                                break;
                            default:
                                break;
                        }
                    });
                }
            }
            vsanClustersChart.hideLoading();
            hostsChart.hideLoading();
            cacheDisksChart.hideLoading();
            capacityDisksChart.hideLoading();
            vms_vsanClustersChart.hideLoading();
            iopsServedChart.hideLoading();
            atLatencyChart.hideLoading();
        })
    };

    var getVsanClusterList = function () {
        $("#vsanClusterList").DataTable({
            paging: true,
            processing: false,
            lengthChange: false,
            // ordering: true,
            autoWidth: false,
            info: true,
            serverSide: false,
            fixedHeader: true,
            searching: false,
            aLengthMenu: [10],
            scrollX: true,
            ajax: {
                url: "/api/v1/vrop/vsan/list",
                ataSrc: 'data'
            },
            columns: [
                {
                    "width": "80px",
                    data: 'name',
                    render: function (data, type, full, meta) {
                        return $("<div></div>").append($("<div></div>").css({
                            "overflow": "hidden",
                            "text-overflow": "ellipsis",
                            "white-space": "nowrap"
                        }).attr("title", data).text(data)).html();
                    }
                },
                {
                    "width": "60px",
                    data: 'deduplication'
                },
                {
                    "width": "60px",
                    data: 'configurationType'
                },
                {
                    "width": "60px",
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
        $('#vsanClusterList tbody').on('click', 'tr', function () {
            if (!$(this).hasClass("selector")) {
                $(".no-data").remove();
                $(this).parent().find("tr").css("background-color", "#fff").removeClass("selector");
                $(this).css("background-color", "#d9e4ea").addClass("selector");
                clusteruuid = $("#vsanClusterList").DataTable().row(this).data().uuid;

                getClusterSummary();
                getClusterDatastore();
                loadWarningAmountChart();
                getClusterModule();
                getClusterCalculate();
                getClusterLatency();
                getClusterIOPS();
                getClusterThroughput();
            }
        });
    };

    var getClusterSummary = function () {
        var cluster_hosts_chart = echarts.init(document.getElementById("cluster_hosts_chart"));
        var cluster_vm_chart = echarts.init(document.getElementById("cluster_vm_chart"));
        cluster_hosts_chart.showLoading();
        cluster_vm_chart.showLoading();
      moriarty.doGet("/api/v1/vrop/vsan/dashboard/cluster/summary", {"uuid":clusteruuid}, function (res) {
          if (res !== null) {
              var data = res.data;
              if (data !== null) {
                  var option = null;
                  var min = 0;
                  var max = 0;
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
                  };
                  $.each(data, function (index, item) {
                      var statKey = item["statKey"];
                      var times = item["times"];
                      var datas = item["datas"];
                      var last = item["last"];
                      var name = item["name"];
                      switch (statKey) {
                          case "summary|total_number_hosts":
                              $("#cluster_hosts").text(last);
                              option = initVsanChart(times, datas, name);
                              max = Math.max.apply(Math, datas);
                              min = Math.min.apply(Math, datas);
                              option.yAxis.max = max;
                              option.yAxis.min = min;
                              option.series[0].markArea = markArea;
                              cluster_hosts_chart.setOption(option);
                              break;
                          case "summary|total_number_vms":
                              $("#cluster_vm").text(last);
                              option = initVsanChart(times, datas, name);
                              max = Math.max.apply(Math, datas);
                              min = Math.min.apply(Math, datas);
                              option.yAxis.max = max;
                              option.yAxis.min = min;
                              option.series[0].markArea = markArea;
                              cluster_vm_chart.setOption(option);
                              break;
                          default:
                              break;
                      }
                  });
              }
          }
          cluster_hosts_chart.hideLoading();
          cluster_vm_chart.hideLoading();
      });
    };

    var getClusterDatastore = function () {
        var stroageTotal_chart = echarts.init(document.getElementById("stroageTotal_chart"));
        var stroageUsed_chart = echarts.init(document.getElementById("stroageUsed_chart"));
        stroageTotal_chart.showLoading();
        stroageUsed_chart.showLoading();
        moriarty.doGet("/api/v1/vrop/vsan/dashboard/cluster/datastore", {"uuid":clusteruuid}, function (res) {
            if (res !== null) {
                var data = res.data;
                if (data !== null) {
                    var option = null;
                    var min = 0;
                    var max = 0;
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
                    };
                    $.each(data, function (index, item) {
                        var statKey = item["statKey"];
                        var times = item["times"];
                        var datas = item["datas"];
                        var last = item["last"];
                        var name = item["name"];
                        switch (statKey) {
                            case "vsan|diskSpace|totalDiskSpace":
                                $("#stroageTotal").text(last.toFixed(0)).append($("<span></span>").addClass("vrop-unit").text("GB"));
                                option = initVsanChart(times, datas, name);
                                max = Math.max.apply(Math, datas);
                                min = Math.min.apply(Math, datas);
                                option.yAxis.max = max;
                                option.yAxis.min = min;
                                option.series[0].markArea = markArea;
                                stroageTotal_chart.setOption(option);
                                break;
                            case "vsan|diskSpace|diskSpaceUsed":
                                $("#stroageUsed").text(last.toFixed(0)).append($("<span></span>").addClass("vrop-unit").text("%"));
                                option = initVsanChart(times, datas, name);
                                max = Math.max.apply(Math, datas);
                                min = Math.min.apply(Math, datas);
                                option.yAxis.max = max;
                                option.yAxis.min = min;
                                option.series[0].markArea = markArea;
                                stroageUsed_chart.setOption(option);
                                break;
                            default:
                                break;
                        }
                    });
                }
            }
            stroageTotal_chart.hideLoading();
            stroageUsed_chart.hideLoading();
        });
    };

    var getClusterModule = function () {
        var total_components_chart = echarts.init(document.getElementById("total_components_chart"));
        var components_used_chart = echarts.init(document.getElementById("components_used_chart"));
        total_components_chart.showLoading();
        components_used_chart.showLoading();
        moriarty.doGet("/api/v1/vrop/vsan/dashboard/cluster/module", {"uuid":clusteruuid}, function (res) {
            if (res !== null) {
                var data = res.data;
                if (data !== null) {
                    var option = null;
                    var min = 0;
                    var max = 0;
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
                    };
                    $.each(data, function (index, item) {
                        var statKey = item["statKey"];
                        var times = item["times"];
                        var datas = item["datas"];
                        var last = item["last"];
                        var name = item["name"];
                        switch (statKey) {
                            case "vsan|componentLimit|totalComponentLimit":
                                $("#total_components").text(last);
                                option = initVsanChart(times, datas, name);
                                max = Math.max.apply(Math, datas);
                                min = Math.min.apply(Math, datas);
                                option.yAxis.max = max;
                                option.yAxis.min = min;
                                option.series[0].markArea = markArea;
                                total_components_chart.setOption(option);
                                break;
                            case "vsan|componentLimit|componentLimitUsed":
                                $("#components_used").text(last.toFixed(1)).append($("<span></span>").addClass("vrop-unit").text("%"));
                                option = initVsanChart(times, datas, name);
                                max = Math.max.apply(Math, datas);
                                min = Math.min.apply(Math, datas);
                                option.yAxis.max = max;
                                option.yAxis.min = min;
                                option.series[0].markArea = markArea;
                                components_used_chart.setOption(option);
                                break;
                            default:
                                break;
                        }
                    });
                }
            }
            total_components_chart.hideLoading();
            components_used_chart.hideLoading();
        });
    };

    var getClusterCalculate = function () {
        var cpu_workload_chart = echarts.init(document.getElementById("cpu_workload_chart"));
        var memory_workload_chart = echarts.init(document.getElementById("memory_workload_chart"));
        cpu_workload_chart.showLoading();
        memory_workload_chart.showLoading();
        moriarty.doGet("/api/v1/vrop/vsan/dashboard/cluster/calculate", {"uuid":clusteruuid}, function (res) {
            if (res !== null) {
                var data = res.data;
                if (data !== null) {
                    var option = null;
                    var min = 0;
                    var max = 0;
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
                    };
                    $.each(data, function (index, item) {
                        var statKey = item["statKey"];
                        var times = item["times"];
                        var datas = item["datas"];
                        var last = item["last"];
                        var name = item["name"];
                        switch (statKey) {
                            case "summary|cpu_workload":
                                $("#cpu_workload").text(last.toFixed(0)).append($("<span></span>").addClass("vrop-unit").text("%"));
                                option = initVsanChart(times, datas, name);
                                max = Math.max.apply(Math, datas);
                                min = Math.min.apply(Math, datas);
                                option.yAxis.max = max;
                                option.yAxis.min = min;
                                option.series[0].markArea = markArea;
                                cpu_workload_chart.setOption(option);
                                break;
                            case "summary|mem_workload":
                                $("#memory_workload").text(last.toFixed(0)).append($("<span></span>").addClass("vrop-unit").text("%"));
                                option = initVsanChart(times, datas, name);
                                max = Math.max.apply(Math, datas);
                                min = Math.min.apply(Math, datas);
                                option.yAxis.max = max;
                                option.yAxis.min = min;
                                option.series[0].markArea = markArea;
                                memory_workload_chart.setOption(option);
                                break;
                            default:
                                break;
                        }
                    });
                }
            }
            cpu_workload_chart.hideLoading();
            memory_workload_chart.hideLoading();
        });
    };

    var getClusterLatency = function () {
        var chart = echarts.init(document.getElementById("cluster_latency"));
        chart.clear();
        chart.showLoading();
        moriarty.doGet("/api/v1/vrop/vsan/dashboard/cluster/latency", {"uuid":clusteruuid}, function (res) {
            if (res !== null) {
                var data = res.data;
                if (data !== null && data.length !== 0 && data !== '') {
                    var areaStyle = {
                        normal: {
                            color: "#d9e4ea"
                        }
                    };
                    $.each(res.data, function (index, data) {
                        var times = data["times"];
                        var datas = data["datas"];
                        var last = data["last"].toFixed(2);
                        var name = data["name"];
                        fixedList(datas, function (items) {
                            var option = initVsanDelayChart(times, items, name, last);
                            option.series[0].areaStyle = areaStyle;
                            option.color = ["#309948"];
                            chart.setOption(option);
                        });
                    });
                }else {
                    haveData($("#cluster_latency"), chart,"105px", "45%");
                }
            }
            chart.hideLoading();
        });
    };

    var getClusterIOPS = function () {
        var chart = echarts.init(document.getElementById("cluster_iops"));
        chart.clear();
        chart.showLoading();
        moriarty.doGet("/api/v1/vrop/vsan/dashboard/cluster/iops", {"uuid":clusteruuid}, function (res) {
            if (res !== null) {
                var data = res.data;
                if (data !== null && data.length !== 0 && data !== '') {
                    var areaStyle = {
                        normal: {
                            color: "#d9e4ea"
                        }
                    };
                    $.each(res.data, function (index, data) {
                        var times = data["times"];
                        var datas = data["datas"];
                        var last = data["last"].toFixed(2);
                        var name = data["name"];
                        fixedList(datas, function (items) {
                            var option = initVsanDelayChart(times, items, name, last);
                            option.series[0].areaStyle = areaStyle;
                            option.color = ["#309948"];
                            chart.setOption(option);
                        });
                    });
                }else {
                    haveData($("#cluster_iops"), chart,"105px", "45%");
                }
            }
            chart.hideLoading();
        });
    };

    var getClusterThroughput = function () {
        var chart = echarts.init(document.getElementById("cluster_throughput"));
        chart.clear();
        chart.showLoading();
        moriarty.doGet("/api/v1/vrop/vsan/dashboard/cluster/throughput", {"uuid":clusteruuid}, function (res) {
            if (res !== null) {
                var data = res.data;
                if (data !== null && data.length !== 0 && data !== '') {
                    var areaStyle = {
                        normal: {
                            color: "#d9e4ea"
                        }
                    };
                    $.each(res.data, function (index, data) {
                        var times = data["times"];
                        var datas = data["datas"];
                        var last = data["last"].toFixed(2);
                        var name = data["name"];
                        fixedList(datas, function (items) {
                            var option = initVsanDelayChart(times, items, name, last);
                            option.series[0].areaStyle = areaStyle;
                            option.color = ["#309948"];
                            chart.setOption(option);
                        });
                    });
                }else {
                    haveData($("#cluster_throughput"),chart, "105px", "45%");
                }
            }
            chart.hideLoading();
        });
    };

    var loadWarningAmountChart = function () {
        var warningAmountChart = echarts.init(document.getElementById("warningAmount"));
        warningAmountChart.showLoading();
        moriarty.doGet("/api/v1/vrop/vsan/dashboard/cluster/alert", {"uuid": clusteruuid}, function (res) {
            if (res !== null) {
                var data = res.data;
                var legendData = ['严重', '紧急', '警告'];
                var seriesDatas = [];
                var xAxisData = [];
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
                var option = initWarningAmountChart("", legendData, xAxisData, seriesDatas);
                option.color = ["#FFFF00", "#E29301", "#FF0000"];
                warningAmountChart.setOption(option);
                warningAmountChart.hideLoading();
            }
        })
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
                }
            ]
        };
        return option;
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
                top:"5%",
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

    var initVsanChart = function (xData, seriesData, name) {
        var option = {
            color: ["#565656"],
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
                    // markPoint: {
                    //     symbol: "circle",
                    //     symbolSize: 5,
                    //     itemStyle: {
                    //         normal: {
                    //             label: {
                    //                 show: false
                    //             },
                    //             color: "red"
                    //         }
                    //     },
                    //     data: [{
                    //         type: 'max',
                    //         name: '最大值'
                    //     }, {
                    //         type: 'min',
                    //         name: '最小值'
                    //     }]
                    // }
                }
            ]
        };
        return option;
    };

    var fixedList = function (datas, callback) {
        var items = [];
        $.each(datas, function (index, item) {
            items.push(item.toFixed(2));
        });
        callback(items);
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

    window.onresize = function () {
        var vsanClusters_chart = echarts.init(document.getElementById("vsanClusters_chart"));
        var hosts_chart = echarts.init(document.getElementById("hosts_chart"));
        var cacheDisks_chart = echarts.init(document.getElementById("cacheDisks_chart"));
        var capacityDisks_chart = echarts.init(document.getElementById("capacityDisks_chart"));
        var vms_vsanCluster_chart = echarts.init(document.getElementById("vms_vsanCluster_chart"));
        var iopsServed_chart = echarts.init(document.getElementById("iopsServed_chart"));
        var atLatency_chart = echarts.init(document.getElementById("atLatency_chart"));
        var total_capacity_chart = echarts.init(document.getElementById("total_capacity_chart"));
        var used_disk_space_chart = echarts.init(document.getElementById("used_disk_space_chart"));
        var capacity_remaining_chart = echarts.init(document.getElementById("capacity_remaining_chart"));
        var dedupe_chart = echarts.init(document.getElementById("dedupe_chart"));
        var cluster_hosts_chart = echarts.init(document.getElementById("cluster_hosts_chart"));
        var cluster_vm_chart = echarts.init(document.getElementById("cluster_vm_chart"));
        var stroageTotal_chart = echarts.init(document.getElementById("stroageTotal_chart"));
        var stroageUsed_chart = echarts.init(document.getElementById("stroageUsed_chart"));
        var total_components_chart = echarts.init(document.getElementById("total_components_chart"));
        var components_used_chart = echarts.init(document.getElementById("components_used_chart"));
        var cpu_workload_chart = echarts.init(document.getElementById("cpu_workload_chart"));
        var memory_workload_chart = echarts.init(document.getElementById("memory_workload_chart"));
        var warningAmount_chart = echarts.init(document.getElementById("warningAmount"));
        var cluster_latency_chart = echarts.init(document.getElementById("cluster_latency"));
        var cluster_iops_chart = echarts.init(document.getElementById("cluster_iops"));
        var cluster_throughput_chart = echarts.init(document.getElementById("cluster_throughput"));
        vsanClusters_chart.resize();
        hosts_chart.resize();
        cacheDisks_chart.resize();
        capacityDisks_chart.resize();
        vms_vsanCluster_chart.resize();
        iopsServed_chart.resize();
        atLatency_chart.resize();
        total_capacity_chart.resize();
        used_disk_space_chart.resize();
        capacity_remaining_chart.resize();
        dedupe_chart.resize();
        cluster_hosts_chart.resize();
        cluster_vm_chart.resize();
        stroageTotal_chart.resize();
        stroageUsed_chart.resize();
        components_used_chart.resize();
        total_components_chart.resize();
        cpu_workload_chart.resize();
        memory_workload_chart.resize();
        warningAmount_chart.resize();
        cluster_latency_chart.resize();
        cluster_iops_chart.resize();
        cluster_throughput_chart.resize();
    };

    window.vsanDashboard = vsanDashboard;
})();