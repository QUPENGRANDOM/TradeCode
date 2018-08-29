/**
 * Created by pengq on 9/18/2017.
 */
!(function () {
    window.sap = {
        init: function () {
            loadHostAndItems(function (hostAndItems) {
                var hostnames =Object.keys(hostAndItems);
                if (hostnames.length===0){
                    return;
                }

                for(var i=0; i<hostnames.length;i++){
                    var hostname = hostnames[i];

                    var items = hostAndItems[hostname];

                    for (var j=0;j<items.length;j++){
                        var item = items[j];
                        addPage(hostname+" "+item,hostname,item);
                        loadChartByHostAndItem(hostname,item,"oneHour",getIdSelector(hostname,item));
                    }
                }
            })
        }
    };

    var loadHostAndItems = function (callback) {
        moriarty.doGet("/api/v1/monitor/hostName",null,function (res) {
            if (res.result==="SUCCESS"){
                var data = res.data;
                callback(data);
            }
        })
    };

    var loadChartByHostAndItem=function(hostName,item,timeType,dom){
        var url = "/api/v1/monitor/history?hostName="+hostName+"&itemType="+item+"&timeType="+timeType;
        moriarty.doGet(url,null,function (res) {
            if (res.result==="SUCCESS"){
                var data = res.data.data;
                var trigger =res.data.trigger;
                // 解析data  画图
                var chartData;
                /*if(isPort(item)){
                    console.log(item);
                    console.log("PORT");
                   return;
                }else */if(isLineChart(item)){
                    chartData= buildLineData(data);
                    if (chartData===null){
                        $("#"+getIdSelector(hostName,item)).append(
                            $("<div></div>").attr({
                                style:"text-align: center"
                            }).text("无数据！")
                        );
                        return;
                    }
                }else{
                    chartData= buildPieData(data);
                    //将总数据替换成 剩余数据
                    var totalValue=0;
                    var totalKey ="";
                    var seriesData=chartData.series.data;
                    for(var i=0;i<seriesData.length;i++){
                        var d = seriesData[i];
                        if (d.value>totalValue){
                            totalValue=d.value;
                            totalKey=d.name;
                        }
                    }
                    var newData = seriesData;
                    var newLegend=chartData.legend;
                    for(var j=0;j<seriesData.length;j++){
                        var jd = seriesData[j];
                        if (jd.name===totalKey){
                            newData = remove(seriesData,j);
                            newLegend = remove(newLegend,j);
                            break;
                        }
                    }

                    var free = newData[0].value;
                    var usage = totalValue-free;
                    var key = totalKey.split(" ");
                    var fullKey = remove(key,0);
                    insert(fullKey,0,"Usage");
                    var s  = {name:fullKey.toString().replace(/,/g," "),value:usage};
                    newLegend.push(fullKey.toString().replace(/,/g," "));
                    newData.push(s);
                    chartData.legend=newLegend;
                    chartData.series.data=newData;
                }
                var legend=chartData.legend;
                var series=chartData.series;
                var xData=chartData.xData;
                var chart = echarts.init(document.getElementById(dom));
                legend.push(trigger);
                var option;
                if(isLineChart(item)){
                    option = moriarty.initLMultipleLineChartOption(xData,"",legend,false);
                }else{
                    option = moriarty.initLPieChartOption(legend);
                }

                option.series = series;
                chart.setOption(option);
            }
        })
    };

    var buildLineData = function (data) {
        var legend=[];
        var series=[];
        var xData=[];
        if (data !==null&&data!==undefined&&typeof(data)==="object"){
            for (var key in data){
                if (data.hasOwnProperty(key)){
                    var listData = data[key];
                    if (listData===null||listData===undefined||listData.length===0){
                        continue;
                    }
                    legend.push(key);
                    var a={};
                    a.name=key;
                    var d = [];
                    xData=[];
                    $.each(listData,function (index,o) {
                        d.push(o['value']);
                        xData.push(o['clock']*1000);
                    });

                    a.data=d;
                    a.smooth=true;
                    a.type="line";

                    series.push(a);
                }
            }
        }
        if (legend.length===0&&series.length===0&&xData.length===0){
            return null;
        }
        return {legend:legend,series:series,xData:xData};
    };

    var buildPieData = function (data) {
        var legend=[];
        var series=[];
        if (data !==null&&data!==undefined&&typeof(data)==="object"){
            for (var key in data){
                if (data.hasOwnProperty(key)){
                    legend.push(key);
                    var listData = data[key];
                    var a={};
                    a.name=key;
                    var sumValue=0;
                    if (listData===null||listData===undefined){
                        series.push(a);
                        continue;
                    }
                    $.each(listData,function (index,o) {
                        var v = parseInt(o['value']);
                        if (!Number.isNaN(v)){
                            sumValue+=v;
                        }
                    });

                    a.value=sumValue/(listData.length===0?1:listData.length);

                    series.push(a);
                }
            }
        }

        return {
            legend:legend,
            series:{ name: '访问来源',
                    type: 'pie',
                    radius: '75%',
                    center: ['50%', '50%'],
                    data:series
            }
        };
    };

    var addPage= function (title,hostname,item) {
        var id = getIdSelector(hostname,item);
        var chartBody = $("<div></div>").addClass(" col-md-6 item-padding").append(
            $("<div></div>").addClass("item-dashboard item-dashboard-chart").append(
                $("<div></div>").addClass("item-title").text(title)).append(
                $("<div></div>").addClass("item-body item-body-chart").attr("id",id))
        );

        // if (item==="Port"){
        //     $($("#chartArea").children()[0]).before(chartBody);
        // }else {
            $("#chartArea").append(chartBody);
        // }

    };

    var isLineChart = function(item){
      return !(item==="Disk space usage /boot"||item==="Disk space usage /"||item==="Swap usage");
    };

    var isPort = function(item){
        return !(item==="Port");
    };

    var remove=function(array,index) {
        if(index<0){
            return array;
        }
        return array.slice(0,index).concat(array.slice(index+1,array.length));
    };

    var insert = function (array,index, item) {
        array.splice(index, 0, item);
    };

    var getIdSelector = function(hostname,item){
        return (hostname + "-" + item).replace(/[ ]/g, "");
    }
})();