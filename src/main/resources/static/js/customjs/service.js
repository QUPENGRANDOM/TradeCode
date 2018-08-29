/**
 * Created by yanrum on 11/3/2017.
 */
!(function () {
    var businessService={};
    
    businessService.previous = function (_this) {
        window.location.href = "/service/business/"+_this.name;
    };
    businessService.apply = function (_this) {
        window.location.href = "/service/business/"+_this.name+"/apply?business_name="+_this.value;
    };
    businessService.cancel = function (_this) {
        window.location.href = "/service/business/"+_this.name;
    };
    businessService.package = function (_this) {
        var loginUser = $("#loginUser").text();
        if("SAP" === _this.value) {
            var instanceType = $('input[name="instanceType"]:checked').val();
            var businessScale = $('input[name="businessScale"]:checked').val();
            var vmName = $('#vmName').val();
            var hostnamePrefix = $('#hostnamePrefix').val();
            var IPAddress = $('#IPAddress').val();
            var netmask = $('#netmask').val();
            var gateway = $('#gateway').val();
            var dns = $('#dns').val();
            var virtualNetwork = $('#virtualNetwork').val();
            var ascs = $('#ascs').val();
            var ci = $('#ci').val();
            var di = $('#di').val();
            var db_vmconfig = $('#db_vmconfig').val();
            var db_hostname = $('#db_hostname').val();
            var instanceName = $('#instanceName').val();
            var contactInfo = $('#contactInfo').val();
            var customerCode = $('#customerCode').val();
            var orderComment = $('#orderComment').val();
            var integratedFunction = $('input[name="integratedFunction"]:checked').val();

            if (vmName === null || vmName === undefined || vmName === "") {
                showInfoMessage("虚拟机名称不能为空！");
                return;
            }
            if (hostnamePrefix === null || hostnamePrefix === undefined || hostnamePrefix === "") {
                showInfoMessage("主机前缀名称不能为空！");
                return;
            }
            if (IPAddress === null || IPAddress === undefined || IPAddress === "") {
                showInfoMessage("IP地址不能为空！");
                return;
            }else if(!businessService.isValidIPV4Address(IPAddress)){
                showInfoMessage("ip地址无效");
                return;
            }
            if (netmask === null || netmask === undefined || netmask === "") {
                showInfoMessage("子网掩码不能为空！");
                return;
            }else if(!businessService.isValidIPV4Address(netmask)){
                showInfoMessage("子网掩码地址无效");
                return;
            }
            if (gateway === null || gateway === undefined || gateway === "") {
                showInfoMessage("网关不能为空！");
                return;
            }else if(!businessService.isValidIPV4Address(gateway)){
                showInfoMessage("网关地址无效");
                return;
            }
            if (dns === null || dns === undefined || dns === "") {
                showInfoMessage("dns不能为空！");
                return;
            }else if(!businessService.isValidIPV4Address(dns)){
                showInfoMessage("dns地址无效");
                return;
            }
            if (virtualNetwork === null || virtualNetwork === undefined || virtualNetwork === "") {
                showInfoMessage("虚拟网络不能为空！");
                return;
            }
            if (db_hostname === null || db_hostname === undefined || db_hostname === "") {
                showInfoMessage("用户的联系人信息不能为空！");
                return;
            }
            if (db_hostname === null || db_hostname === undefined || db_hostname === "") {
                showInfoMessage("用户的客户编码不能为空！");
                return;
            }
            if (db_hostname === null || db_hostname === undefined || db_hostname === "") {
                showInfoMessage("用户的订单备注信息不能为空！");
                return;
            }
            var data = JSON.stringify({
                "instanceType": instanceType,
                "businessScale": businessScale,
                "vmName": vmName,
                "hostnamePrefix": hostnamePrefix,
                "IPAddress": IPAddress,
                "netmask": netmask,
                "gateway": gateway,
                "dns": dns,
                "virtualNetwork": virtualNetwork,
                "ascs": ascs,
                "ci": ci,
                "di": di,
                "db_vmconfig": db_vmconfig,
                "db_hostname": db_hostname,
                "instanceName": instanceName,
                "contactInfo": contactInfo,
                "customerCode": customerCode,
                "orderComment": orderComment,
                "integratedFunction": integratedFunction
            });
            businessService.create(_this,data);
        }
        else if("windows2017" === _this.value){
            var winServerVersion = $('input[name="winServerVersion"]:checked').val();
            var systemDiskSize = $('#systemDiskSize').val();
            var mountDataDisk = $('input[name="mountDataDisk"]:checked').val();
            var dataDiskNum = $('#dataDiskNum').val();
            var dataDiskSize = $("#dataDiskSize").val();
            var systemHostname = $('#systemHostname').val();
            var ipAddress = $('#ipAddress').val();
            var netmask = $('#netmask').val();
            var gateway = $('#gateway').val();
            var dns1 = $('#dns1').val();
            var dns2 = $('#dns2').val();
            var adminPassword = $('#adminPassword').val();
            var virtualNetwork = $('#virtualNetwork').val();
            var businessInstance = $('#businessInstance').val();
            var vmName = $('#vmName').val();
            var vmConfiguration = $('#vmConfiguration').val();

            if (systemDiskSize === null || systemDiskSize === undefined || systemDiskSize === "") {
                showInfoMessage("系统盘的大小不能为空！");
                return;
            }
            if("是"===mountDataDisk){
                if (dataDiskNum === null || dataDiskNum === undefined || dataDiskNum === "") {
                    showInfoMessage("挂载数据盘数量不能为空！");
                    return;
                }
                if (dataDiskSize === null || dataDiskSize === undefined || dataDiskSize === "") {
                    showInfoMessage("挂载数据盘大小不能为空！");
                    return;
                }
            }

            if (systemHostname === null || systemHostname === undefined || systemHostname === "") {
                showInfoMessage("操作系统的主机名不能为空！");
                return;
            }
            if (ipAddress === null || ipAddress === undefined || ipAddress === "") {
                showInfoMessage("ip地址不能为空！");
                return;
            }else if(!businessService.isValidIPV4Address(ipAddress)){
                showInfoMessage("ip地址无效");
                return;
            }

            if (netmask === null || netmask === undefined || netmask === "") {
                showInfoMessage("子网掩码不能为空！");
                return;
            }else if(!businessService.isValidIPV4Address(netmask)){
                showInfoMessage("子网掩码地址无效");
                return;
            }
            if (gateway === null || gateway === undefined || gateway === "") {
                showInfoMessage("网关不能为空！");
                return;
            }else if(!businessService.isValidIPV4Address(gateway)){
                showInfoMessage("网关地址无效");
                return;
            }
            if (dns1 === null || dns1 === undefined || dns1 === "") {
                showInfoMessage("dns1不能为空！");
                return;
            }else if(!businessService.isValidIPV4Address(dns1)){
                showInfoMessage("dns1地址无效");
                return;
            }
            if (dns2 === null || dns2 === undefined || dns2 === "") {
                showInfoMessage("dns2不能为空！");
                return;
            }else if(!businessService.isValidIPV4Address(dns2)){
                showInfoMessage("dns2地址无效");
                return;
            }
            if (adminPassword === null || adminPassword === undefined || adminPassword === "") {
                showInfoMessage("管理员密码不能为空！");
                return;
            }
            if (virtualNetwork === null || virtualNetwork === undefined || virtualNetwork === "") {
                showInfoMessage("虚拟网络不能为空！");
                return;
            }
            if (businessInstance === null || businessInstance === undefined || businessInstance === "") {
                showInfoMessage("所属的业务实例不能为空！");
                return;
            }
            if (vmName === null || vmName === undefined || vmName === "") {
                showInfoMessage("虚拟机名称不能为空！");
                return;
            }
            if (vmConfiguration === null || vmConfiguration === undefined || vmConfiguration === "") {
                showInfoMessage("虚拟机配置不能为空！");
                return;
            }

            var data = JSON.stringify({
                "winServerVersion": winServerVersion,
                "systemDiskSize": systemDiskSize,
                "mountDataDisk": mountDataDisk,
                "dataDiskNum": dataDiskNum,
                "dataDiskSize": dataDiskSize,
                "systemHostname": systemHostname,
                "ipAddress": ipAddress,
                "netmask": netmask,
                "gateway": gateway,
                "dns1": dns1,
                "dns2": dns2,
                "adminPassword": adminPassword,
                "virtualNetwork": virtualNetwork,
                "businessInstance": businessInstance,
                "vmName": vmName,
                "vmConfiguration": vmConfiguration
            });
            businessService.create(_this,data);
        }
        else if("ubuntu" === _this.value){
            var ipAddress = $('#U_ipAddress').val();
            var netmask = $('#U_netmask').val();
            var gateway = $('#U_gateway').val();
            var dns1 = $('#U_dns1').val();
            var dns2 = $('#U_dns2').val();
            var vmName = $('#U_vmName').val();

            if (ipAddress === null || ipAddress === undefined || ipAddress === "") {
                showInfoMessage("ip地址不能为空！");
                return;
            }else if(!businessService.isValidIPV4Address(ipAddress)){
                showInfoMessage("ip地址无效");
                return;
            }
            if (netmask === null || netmask === undefined || netmask === "") {
                showInfoMessage("子网掩码不能为空！");
                return;
            }else if(!businessService.isValidIPV4Address(netmask)){
                showInfoMessage("子网掩码地址无效");
                return;
            }
            if (gateway === null || gateway === undefined || gateway === "") {
                showInfoMessage("网关不能为空！");
                return;
            }else if(!businessService.isValidIPV4Address(gateway)){
                showInfoMessage("网关地址无效");
                return;
            }
            if (dns1 === null || dns1 === undefined || dns1 === "") {
                showInfoMessage("dns1不能为空！");
                return;
            }else if(!businessService.isValidIPV4Address(dns1)){
                showInfoMessage("dns1地址无效");
                return;
            }
            if (dns2 === null || dns2 === undefined || dns2 === "") {
                showInfoMessage("dns2不能为空！");
                return;
            }else if(!businessService.isValidIPV4Address(dns2)){
                showInfoMessage("dns2地址无效");
                return;
            }
            if (vmName === null || vmName === undefined || vmName === "") {
                showInfoMessage("虚拟机名称不能为空！");
                return;
            }

            var data = JSON.stringify({
                "ipAddress": ipAddress,
                "netmask": netmask,
                "gateway": gateway,
                "dns1": dns1,
                "dns2": dns2,
                "vmName": vmName
            });
            businessService.create(_this,data);
        }
    };
    businessService.create = function (_this,data) {
        var params = JSON.stringify({
            "serviceType": "1",
            "serviceName": "业务",
            "businessType": _this.name,
            "businessName": _this.value,
            "content": data,
            "validStatus": "1",
            "status":"1"
        });
        moriarty.doPost("/api/v1/service/create", params, function (res) {
            if (res.result === "SUCCESS") {
                showSuccessMessage("创建成功");
                setTimeout(function () {
                    window.location.href = "/service/serviceList";
                }, 1000);
            } else {
                showErrorMessage("创建失败");
            }
        })
    };
    /*businessService.businessTable = function () {

        $("#businessTable").DataTable({
            paging: true,
            processing: false,
            lengthChange: false,
            ordering: false,
            autoWidth: false,
            info: true,
            serverSide: false,
            fixedHeader: true,
            searching: true,
            aLengthMenu: [10],
            ajax: {
                url: "/api/v1/service/business/listQuery",
                dataSrc: 'data'
            },
            columns: [
                {
                    "width":"10%",
                    data: "business_type"
                },
                {
                    "width":"10%",
                    data: "business_name"
                },
                {
                    "width":"80%",
                    data: "describe"
                }
            ],
            language: {url: '/lang/datatable.chs.json'}
        });
    };*/

    businessService.serviceTable = function (status) {
        var dataColumns = [];
        dataColumns = [{"id": 1, "name": "查看详情"}, {"id": 2, "name": "订单跟踪"}];
        $("#serviceTable").DataTable({
            paging: true,
            processing: false,
            lengthChange: false,
            ordering: false,
            autoWidth: true,
            info: true,
            serverSide: false,
            fixedHeader: true,
            searching: true,
            aLengthMenu: [10],
            serverMethod:"POST",
            ajax: {
                url: "/api/v1/service/listQuery",
                "contentType": "application/json",
                "data": function ( d ) {
                    d = {
                        "flag":"serviceList",
                        "status":status
                    };
                    return JSON.stringify( d );
                },
                dataSrc: 'data'
            },
            createdRow: function ( row, data, index ) {
                if (!moriarty.getEmployeeType()) {
                    //admin
                    if('0'===data.read_status && data.status === '1'){
                        $('td',row).css('color','black').css('font-weight','500')
                    }
                }else{
                    if('0'===data.read_status && data.status !== '1'){
                        $('td',row).css('color','black').css('font-weight','500')
                    }
                }
            },
            columns: [
                {
                    "width":"10%",
                    data: "order_id"
                },
                {
                    "width":"8%",
                    data: "service_name"
                },
                {
                    "width":"12%",
                    data: "create_time",
                    render: function (data, type, full, meta) {
                        return moriarty.dbDate(new Date(data));
                    }
                },
                {
                    "width":"10%",
                    data: "business_type"
                },
                {
                    "width":"10%",
                    data: "business_name"
                },
                {
                    "width":"30%",
                    data: "content",
                    render: function (data, type, full, meta) {
                        if(null!== data && undefined!== data) {
                            var cont = JSON.parse(data);
                            cont = businessService.contentConverter(cont);
                            if (cont.length > 60)
                                return cont.substr(0, 60) + '&nbsp;&nbsp;<span href="javascript:void(0);" ><b>...</b></span>';
                            return cont;
                        }
                        return data;
                    }
                },
                {
                    "width":"10%",
                    data: "status",
                    render: function (data, type, full, meta) {
                        switch (data) {
                            case "0":
                                return "待处理";
                            case "1":
                                return "处理中";
                            case "2":
                                return "已处理";
                            case "3":
                                return "失败";
                            default:
                                break;
                        }
                    }
                },
                {
                    data: "",
                    render: function (data, type, full, meta) {
                        if (!moriarty.getEmployeeType()) {
                            //admin
                            if('alarm' === full.business_type){
                                dataColumns = [{'id':3,"name":"回复"}];
                            }else if('application' === full.business_type){
                                if('2' === full.status)
                                    dataColumns = [{"id": 1, "name": "查看详情"}];
                                else
                                    dataColumns = [{"id": 1, "name": "查看详情"}, {"id": 4, "name": "订单确认"}];
                            }else{
                                dataColumns = [{"id": 1, "name": "查看详情"}];
                            }
                        }else{
                            //other
                            dataColumns = [{"id": 1, "name": "查看详情"}, {"id": 2, "name": "订单跟踪"}];
                        }

                        return moriarty.actionToast("操作", dataColumns,
                            {
                                "id": full.id,
                                "business_type": full.business_type,
                                "business_name":full.business_name,
                                "proposer":full.proposer,
                                "create_time":full.create_time,
                                "service_name":full.service_name,
                                "order_id":full.order_id,
                                "status":full.status,
                                "read_status":full.read_status
                            }, "businessService.action.chooseAction(this)");
                    }
                }
            ],
            language: {url: '/lang/datatable.chs.json'}
        });
    };
    businessService.action= {
        chooseAction: function (_this) {
            var value = $(_this).data("id");
            var params = $(_this).data("params");

            switch (value) {
                case 1:
                    if("0" === params.read_status){
                        var params = {'id':params.id,'readStatus':'1'};
                        moriarty.doPost("/api/v1/service/update", JSON.stringify(params), function (res) {
                            if (res.result === "SUCCESS") {

                            }
                        })
                    }
                    window.location.href = "/service/info?id="+params.id +"&option=detail";
                    break;
                case 2:
                    $("#orderTrack").modal("show");
                    $("#proposerTable").DataTable({
                        paging: false,
                        processing: false,
                        lengthChange: false,
                        ordering: false,
                        autoWidth: false,
                        info: false,
                        serverSide: false,
                        fixedHeader: true,
                        searching: false,
                        destroy: true,
                        aLengthMenu: [10],
                        ajax: {
                            url: "/api/v1/service/listQuery",
                            "contentType": "application/json",
                            "type":"POST",
                            "data": function ( d ) {
                                d = {
                                        "id":params.id
                                };
                                return JSON.stringify( d );
                            },
                            dataSrc: 'data'
                        },
                        columns: [
                            {
                                "width":"20%",
                                data: "proposer"
                            },
                            {
                                "width":"25%",
                                data: "create_time",
                                render: function (data, type, full, meta) {
                                    return businessService.timeFormat(data)
                                }
                            },
                            {
                                "width":"20%",
                                data: "service_name"
                            },
                            {
                                "width":"20%",
                                data: "business_name"
                            },
                            {
                                "width":"15%",
                                data: "status",
                                render: function (data, type, full, meta) {
                                    switch (data) {
                                        case "0":
                                            return "待处理";
                                        case "1":
                                            return "处理中";
                                        case "2":
                                            return "已处理";
                                        case "3":
                                            return "失败";
                                        default:
                                            break;
                                    }
                                }
                            }
                        ],
                        language: {url: '/lang/datatable.chs.json'}
                    });

                    $("#processorTable").DataTable({
                        paging: false,
                        processing: false,
                        lengthChange: false,
                        ordering: false,
                        autoWidth: false,
                        info: false,
                        serverSide: false,
                        fixedHeader: true,
                        searching: false,
                        destroy: true,
                        aLengthMenu: [10],
                        ajax: {
                            url: "/api/v1/service/listQuery",
                            "contentType": "application/json",
                            "type":"POST",
                            "data": function ( d ) {
                                d = {
                                    "id":params.id
                                };
                                return JSON.stringify( d );
                            },
                            dataSrc: 'data'
                        },
                        columns: [
                            {
                                "width":"20%",
                                data: "processor"
                            },
                            {
                                "width":"25%",
                                data: "end_time",
                                render: function (data, type, full, meta) {
                                    if(data !== null)
                                        return businessService.timeFormat(data);
                                    else
                                        return null;
                                }
                            },
                            {
                                "width":"20%",
                                data: "service_name"
                            },
                            {
                                "width":"20%",
                                data: "business_name"
                            },
                            {
                                "width":"15%",
                                data: "status",
                                render: function (data, type, full, meta) {
                                    return "1"===data?'待处理':'已处理'
                                }
                            }
                        ],
                        language: {url: '/lang/datatable.chs.json'}
                    });
                    break;
                case 3:
                    // window.location.href = "/service/business/"+params.business_type+"/apply?business_name="+params.business_name;
                    window.location.href = "/service/info?id="+params.id +"&option=replay";
                    break;
                case 4:
                    $("#orderConfirm").modal("show");
                    $('#confirm').attr('value',params.id);
                    break;
                default:
                    break;
            }
        }
    };
    businessService.systemList = function (business_type) {
        var params = JSON.stringify({
            "businessType": business_type
        });
        moriarty.doPost("/api/v1/service/business/listQuery", params, function (res) {
            if (res.result === "SUCCESS") {
                $('.os-body').html('');

                res.data.forEach(function(x) {
                    var $template = $($('#os-template').html());

                    $template.find('span').text(x.business_name);
                    $template.find('i').addClass(x.icon);
                    $template.find('label').html(x.status==='1'?"已安装":"未安装");
                    $template.find('button').attr('name',x.business_name);
                    $template.find('button').attr('status',x.status);

                    $('.os-body').append($template);
                });
            } else {
                showErrorMessage("查询失败");
            }
        })
    };

    businessService.detailPage = function (_this) {
        var business_name = _this.name;
        if('1'===_this.getAttribute('status')){
            window.location.href = '/service/business/businessList';
        }else{
            window.location.href = '/service/business/system/detail?business_name='+business_name;
        }
    };

    businessService.getDetail = function (business_name) {
        var params = JSON.stringify({
            "businessName": business_name
        });
        moriarty.doPost("/api/v1/service/business/listQuery", params, function (res) {
            if (res.result === "SUCCESS") {
                $('.detail-body').html('');

                res.data.forEach(function(x) {
                    if(business_name === x.business_name){
                        var $template = $($('#detail-template').html());
                        $template.find('span').html(x.describe);
                        $template.find('.btn').attr('name',x.business_type);
                        $template.find('.btn').attr('value',x.business_name);

                        $('.detail-body').append($template);
                    }
                });
            } else {
                showErrorMessage("查询失败");
            }
        })
    };

    businessService.dataReload = function (business_name) {
        if($('.'+business_name).hasClass('hidden')){
            $('.'+business_name).removeClass('hidden');
        }
        var params = JSON.stringify({
            "businessName": business_name
        });
        moriarty.doPost("/api/v1/service/listQuery", params, function (res) {
            if (res.result === "SUCCESS") {
                if(null!=res.data && res.data.length>0 && null != res.data[0].content){
                    $('.btn').addClass('hidden');
                    $('input').attr("readOnly","true");
                    businessService.renderDetail(business_name,JSON.parse(res.data[0].content));
                }
            } else {
                showErrorMessage("查询失败");
            }
        })
    };

    businessService.serviceCreate = function () {
        var business_type = $('#business_type').val();
        if (business_type === "") {
            showInfoMessage("请选择服务单类型！");
            return;
        }
        if("application" === business_type){
            window.location.href = "/service/business/application";
        }else if("system" === business_type){
            showInfoMessage("暂不支持");
            /*window.location.href = "/service/business/system";*/
        }

    };
    businessService.timeFormat = function (time) {
        var datetime = new Date();
        datetime.setTime(time);
        var year = datetime.getFullYear();
        var month = datetime.getMonth() + 1;
        var date = datetime.getDate();
        var hour = datetime.getHours();
        var minute = datetime.getMinutes();
        var second = datetime.getSeconds();
        // var mseconds = datetime.getMilliseconds();
        return year + "-" + month + "-" + date+" "+hour+":"+minute+":"+second;
    };
    businessService.renderDetail = function (business_name,data) {
        if("windows2017" === business_name){
            $('input[value="'+data.winServerVersion+'"]').prop('checked','checked');
            $('#systemDiskSize').val(data.systemDiskSize);
            $('input[value="'+data.mountDataDisk+'"]').prop('checked','checked');
            $('#dataDiskNum').val(data.dataDiskNum);
            $("#dataDiskSize").val(data.dataDiskSize);
            $('#systemHostname').val(data.systemHostname);
            $('#ipAddress').val(data.ipAddress);
            $('#netmask').val(data.netmask);
            $('#gateway').val(data.gateway);
            $('#dns1').val(data.dns1);
            $('#dns2').val(data.dns2);
            $('#adminPassword').val(data.adminPassword);
            $('#virtualNetwork').val(data.virtualNetwork);
            $('#businessInstance').val(data.businessInstance);
            $('#vmName').val(data.vmName);
            $('#vmConfiguration').val(data.vmConfiguration);
        }else if("SAP" === business_name){
            $('input[value="'+data.instanceType+'"]').prop('checked','checked');
            $('input[value="'+data.businessScale+'"]').prop('checked','checked');
            $('#vmName').val(data.vmName);
            $('#hostnamePrefix').val(data.hostnamePrefix);
            $('#IPAddress').val(data.IPAddress);
            $('#netmask').val(data.netmask);
            $('#gateway').val(data.gateway);
            $('#dns').val(data.dns);
            $('#virtualNetwork').val(data.virtualNetwork);
            $('#ascs').val(data.ascs);
            $('#ci').val(data.ci);
            $('#di').val(data.di);
            $('#db_vmconfig').val(data.db_vmconfig);
            $('#db_hostname').val(data.db_hostname);
            $('#instanceName').val(data.instanceName);
            $('#contactInfo').val(data.contactInfo);
            $('#customerCode').val(data.customerCode);
            $('#orderComment').val(data.orderComment);
            $('input[value="'+data.integratedFunction+'"]').prop('checked','checked');
        }else if("ubuntu" === business_name){
            $('#U_ipAddress').val(data.ipAddress);
            $('#U_netmask').val(data.netmask);
            $('#U_gateway').val(data.gateway);
            $('#U_dns1').val(data.dns1);
            $('#U_dns2').val(data.dns2);
            $('#U_vmName').val(data.vmName);
        }
    };
    businessService.businessList = function (id,status) {
        $(".preloader").css("display","");
        var params = JSON.stringify({
            "status": status,
            "serviceType":"1"
        });
        moriarty.doPost("/api/v1/business/listQuery", params, function (res) {
            if (res.result === "SUCCESS") {
                if(res.data === null || res.data.length === 0) {
                    if(status === "1"){
                        showInfoMessage("未查询到已申请的业务");
                    }else{
                        showInfoMessage("未查询到已安装的业务");
                    }
                    return;
                }
                status === "1"?$('#systemChoose_applied').html(''):$('#systemChoose_installed').html('');
                if(status === "2") {
                    $.each(res.data, function (index, item) {
                        var name = item["name"]+'('+item["business_name"]+')';
                        var $div;
                        if(item["business_type"] === 'application'){
                            $div = $("<div></div>").addClass("col-md-3").css({
                                "background-color": "#f5faff",
                                "border": "1px #d8d8d8 solid",
                                "text-align": "center"
                            }).append($("<div></div>").css({
                                "color": "#3c3c3c",
                                "font-size": "16px",
                                "font-weight": "bold",
                                "margin": "10px",
                                "overflow": "hidden",
                                "text-overflow": "ellipsis",
                                "white-space":"nowrap"
                            }).attr({"data-title":name,
                                "data-toggle": "tooltip",
                                "data-placement": "bottom"}).text(name))
                                .append($("<div></div>").css({"margin-bottom": "30px","text-align": "center","font-weight":"700px","font-size":"25px"})
                                    .append($("<label></label>")).text("已安装")
                                    .append($("<i class='fa fa-cloud-download' data-title='下载日志内容包' data-toggle='tooltip' data-placement= 'bottom' style='margin-left:20px;color: green'/>")
                                        .attr("onclick", "businessService.downContentPage('" + item["business_name"] + "')")))
                                .append($("<img>").attr("src", "data:;base64," + item["image"]).css("margin-bottom", "15px"))
                                .append($("<div></div>").css({
                                    "height": "60px",
                                    "display": "-webkit-box",
                                    "-webkit-line-clamp": "3",
                                    "-webkit-box-orient": "vertical",
                                    "overflow": "hidden",
                                    "margin-bottom": "5px"
                                }).attr("title", item["summarize"]).text(item["summarize"]))
                                .append($("<div></div>").css({"margin-bottom": "30px"})
                                    .append($("<button></button>").attr({
                                        "type": "button",
                                        "data-type": item["business_name"],
                                        "data-content": item["content"],
                                        "data-image": item["image"],
                                        "onClick": "businessService.applicationDesClick(this)"
                                    }).css({"padding": "5px 25px"}).text("详情")));
                        }else{
                            $div = $("<div></div>").addClass("col-md-3").css({
                                "background-color": "#f5faff",
                                "border": "1px #d8d8d8 solid",
                                "text-align": "center"
                            }).append($("<div></div>").css({
                                "color": "#3c3c3c",
                                "font-size": "16px",
                                "font-weight": "bold",
                                "margin": "10px",
                                "overflow": "hidden",
                                "text-overflow": "ellipsis",
                                "white-space":"nowrap"
                            }).attr({"data-title":name,
                                "data-toggle": "tooltip",
                                "data-placement": "bottom"}).text(name))
                                .append($("<div></div>").css({"margin-bottom": "30px","text-align": "center","font-weight":"700px","font-size":"25px"})
                                    .append($("<label></label>")).text("已安装"))
                                .append($("<img>").attr("src", "data:;base64," + item["image"]).css("margin-bottom", "15px"))
                                .append($("<div></div>").css({
                                    "height": "60px",
                                    "display": "-webkit-box",
                                    "-webkit-line-clamp": "3",
                                    "-webkit-box-orient": "vertical",
                                    "overflow": "hidden",
                                    "margin-bottom": "5px"
                                }).attr("title", item["summarize"]).text(item["summarize"]))
                                .append($("<div></div>").css({"margin-bottom": "30px"})
                                    .append($("<button></button>").attr({
                                        "type": "button",
                                        "data-type": item["business_name"],
                                        "data-content": item["content"],
                                        "data-image": item["image"],
                                        "onClick": "businessService.applicationDesClick(this)"
                                    }).css({"padding": "5px 25px"}).text("详情")));
                        }

                        $("#systemChoose_installed").append($div);
                        $('[data-toggle="tooltip"]').tooltip({
                            html: true
                        });
                    });
                }else if(status === "1"){
                    $('#systemChoose_applied').html('');
                    $.each(res.data, function (index, item) {
                        var name = item["name"]+'('+item["business_name"]+')';
                        var $div = $("<div></div>").addClass("col-md-3").css({
                            "background-color": "#f5faff",
                            "border": "1px #d8d8d8 solid",
                            "text-align": "center"
                        }).append($("<div></div>").css({
                            "color": "#3c3c3c",
                            "font-size": "16px",
                            "font-weight": "bold",
                            "margin": "10px",
                            "overflow": "hidden",
                            "text-overflow": "ellipsis",
                            "white-space":"nowrap"
                        }).attr({"data-title":name,
                            "data-toggle": "tooltip",
                            "data-placement": "bottom"}).text(name))
                            .append($("<div></div>").css({"margin-bottom": "30px","text-align": "center","font-weight":"700px","font-size":"25px"})
                                .append($("<label></label>")).text("已申请"))
                            .append($("<img>").attr("src", "data:;base64," + item["image"]).css("margin-bottom", "15px"))
                            .append($("<div></div>").css({
                                "height": "60px",
                                "display": "-webkit-box",
                                "-webkit-line-clamp": "3",
                                "-webkit-box-orient": "vertical",
                                "overflow": "hidden",
                                "margin-bottom": "5px"
                            }).attr("title", item["summarize"]).text(item["summarize"]))
                            .append($("<div></div>").addClass("progress").css({"margin-bottom": "30px","height":"20px"})
                                .append($("<div></div>").addClass("progress-bar").attr({
                                    "role": "progressbar",
                                    "aria-valuenow": "60",
                                    "aria-valuemin": "0",
                                    "aria-valuemax": "100"
                                }).css({"background-color": "green","height":"40px","width":item["progress"],"text-align": "center"})
                                    .append($("<span></span>").css({"text-align": "center"}).text(item["progress"]))));
                        $("#systemChoose_applied").append($div);
                        $('[data-toggle="tooltip"]').tooltip({
                            html: true
                        });
                    });
                }
            }
        },true);
    };
    businessService.applicationDesClick = function (_this) {
        var applicationType = $(_this).data("type");
        var content = $(_this).data("content");
        var image = $(_this).data("image");
        // var images = $(_this).data("images").split(",");
        $("#description").html('');
        $.each(content.configs,function (index,item) {
                var ipInfo = item.ip;
                var subnetMask = item.subnetMask;
                var vmType = item.templateName.indexOf("window") < 0 ? "Linux" : "Windows";
                var vmName = item.vmName;
                var description = "虚拟机名称:"+vmName+" IP地址:"+ipInfo+" 子网掩码:"+subnetMask + " 虚拟机类型:"+vmType;
                var $div = $("<div></div>");
                $div.text(description).css({"overflow": "hidden",
                    "display": "-webkit-box",
                    "-webkit-box-orient": "vertical",
                    "-webkit-line-clamp": "3"})
                    .attr({'data-title': description, "data-toggle": "tooltip", "data-placement": "bottom"});
            $("#description").append($div);
        });
        if ($("#detail").next().hasClass("boundary")) {
            $("#detail").next().remove();
        }
        $("#detail").find("span").removeAttr("data-type").attr("data-type", applicationType).text(applicationType + " " + "详情");
        $("#detail").find("img").attr("src", "data:;base64," + image);
        $("#detail").after($("<div></div>").addClass("boundary").css({
            "border": "2px #edf1f5 solid",
            "border-radius": "5px",
            "margin-bottom": "5px"
        }));
        $("#description").parent().removeClass("hidden");
        $("#systemChoose_installed").parent().addClass("hidden");
    };
    businessService.returnPrev = function () {
        $("#description").parent().addClass("hidden");
        $("#systemChoose_installed").parent().removeClass("hidden");
    };
    // businessService.businessList = function (id,status) {
    //     $(".preloader").css("display","");
    //     var params = JSON.stringify({
    //         "status": status,
    //         "serviceType":"1"
    //     });
    //     moriarty.doPost("/api/v1/business/listQuery", params, function (res) {
    //         if (res.result === "SUCCESS") {
    //             if(res.data === null || res.data.length === 0) {
    //                 if(status === "1"){
    //                     showInfoMessage("未查询到已申请的业务");
    //                 }else{
    //                     showInfoMessage("未查询到已安装的业务");
    //                 }
    //                 return;
    //             }
    //             $('.li-body').html('');
    //             res.data.forEach(function (x) {
    //                 // $(".preloader").css("display","");
    //                 var $template = $($('#li-template').html());
    //                 if(x.status==='2' && x.business_type === 'application'){
    //                     $template.find(".div_row").attr("onclick","");
    //                     $template.find('.status').html("已安装")
    //                         .after($("<i class='fa fa-cloud-download' data-title='下载日志内容包' data-toggle='tooltip' data-placement= 'bottom' style='margin-left:20px'/>")
    //                             .attr("onclick","businessService.downContentPage('"+x.business_name+"')"));
    //                 }else if(x.status === '2'){
    //                     $template.find('.status').html("已安装");
    //                 }else{
    //                     $template.find('.status').html("已申请");
    //                 }
    //                 var content = JSON.parse(x.content);
    //                 var configs = content.configs;
    //                 var configsLen = configs.length;
    //                 var lineHeight = 0;
    //                 if(configsLen === 1){
    //                     lineHeight = 70;
    //                 }else if(configsLen === 2){
    //                     lineHeight = 38;
    //                 }else if(configsLen === 3){
    //                     lineHeight = 25;
    //                 }else if(configsLen === 4){
    //                     lineHeight = 19;
    //                 }
    //                 if(lineHeight !== 0){
    //                     $template.find('.content-description').css("line-height",lineHeight+"px");
    //                 }
    //
    //                 $.each(configs,function (index,item) {
    //                     var ipInfo = item.ip;
    //                     var subnetMask = item.subnetMask;
    //                     var vmType = item.templateName.indexOf("window") < 0 ? "Linux" : "Windows";
    //                     var vmName = item.vmName;
    //                     var description = "虚拟机名称："+vmName+" IP地址:"+ipInfo+" 子网掩码:"+subnetMask + " 虚拟机类型："+vmType;
    //                     var $div = $("<div></div>");
    //                     $div.text(description).css({"overflow": "hidden",
    //                         "display": "-webkit-box",
    //                         "-webkit-box-orient": "vertical",
    //                         "-webkit-line-clamp": "3"})
    //                         .attr({'data-title': description, "data-toggle": "tooltip", "data-placement": "bottom"});
    //                     $template.find('.content-description').append($div);
    //                 });
    //
    //                 var name = x.name+"("+x.business_name+")";
    //
    //                 $template.find('.name').html(name).css({"overflow": "hidden",
    //                     "text-overflow": "ellipsis", "white-space":"nowrap"});
    //                 $template.find('.name').attr({'data-title':name, "data-toggle": "tooltip", "data-placement": "bottom"});
    //                 if(x.image !== null){
    //                     $template.find('img').attr("src", "data:;base64," + x.image);
    //                 }else {
    //                     $template.find('img').attr("src", "/images/windows.png");
    //                 }
    //
    //
    //                 $("#"+id).find('.li-body').append($template);
    //
    //                 $('[data-toggle="tooltip"]').tooltip({
    //                     html: true
    //                 });
    //             });
    //         }
    //     },true);
    // };
    businessService.changeEvent = function (_this) {
        if('是'===_this.value){
            if($('#dataDisk').hasClass('hidden')){
                $('#dataDisk').removeClass('hidden');
            }
        }else{
            if(!$('#dataDisk').hasClass('hidden')){
                $('#dataDisk').addClass('hidden');
            }
        }
    };
    businessService.contentInit = function(content,option,replay){
        var cont = businessService.contentConverter(content);
        $('#cont').html(cont);

        //replay
        if(!moriarty.getEmployeeType() && "replay" === option){
            if($('.replay').hasClass('hidden'))
                $('.replay').removeClass('hidden');
            if(replay)
                $('#replyText').text(replay);
        }
        //other
        if(moriarty.getEmployeeType() && "detail" === option && replay !== null && replay !== ''){
            if(!$('.replay').hasClass('hidden'))
                $('.replay').addClass('hidden');
            // $('#replyText').text(replay);
            // $('#replyText').attr('readonly',true);
            $('.btn').addClass('hidden');
        }
    };
    businessService.contentConverter = function (content) {
        var cont = JSON.stringify(content).replace(/,/g,'<br>').replace(/"/g,'').replace(/{/g,'').replace(/}/g,'');
        cont = cont.replace(/templateName/g,'操作系统');
        cont = cont.replace(/hostName/g,'主机名称');
        cont = cont.replace(/vmName/g,'虚拟机名称');
        cont = cont.replace(/systemDisk/g,'系统盘大小(GB)');
        cont = cont.replace(/network/g,'网络');
        cont = cont.replace(/systemCpu/g,'CPU');
        cont = cont.replace(/systemMem/g,'内存');
        cont = cont.replace(/porwerOnOrder/g,'开机顺序');
        cont = cont.replace(/belongBusiness/g,'所属业务');
        cont = cont.replace(/ip/g,'IP');
        cont = cont.replace(/subnetMask/g,'子网掩码');
        cont = cont.replace(/dns/g,'DNS');
        cont = cont.replace(/gateway/g,'网关');

        cont = cont.replace(/typeName/g,'业务名称');
        cont = cont.replace(/alarmType/g,'告警类型');
        cont = cont.replace(/description/g,'详情');
        cont = cont.replace(/name/g,'名称');
        cont = cont.replace(/systemName/g,'系统名称');

        return cont;
    };
    businessService.replyService = function (id) {
        var replayText = $('#replyText').val();
        if (replayText.length > 1000) {
            var returnText = "文本超限，请输入1000字以下内容！";
            showErrorMessage(returnText);
            return false;
        }
        var processor = $('#loginUser').val();
        var params = {'id':id,'replay':replayText,'readStatus':'0','status':'2','processor':processor, 'endTime': new Date()};
        moriarty.doPost("/api/v1/service/update", JSON.stringify(params), function (res) {
            if (res.result === "SUCCESS") {
                showSuccessMessage("回复成功");
                window.location.href = "/service/serviceList";
            } else {
                showErrorMessage("回复失败");
            }
        })
    };

    businessService.orderConfirm = function () {
        var id = $('#confirm')[0].value;
        var processor = $('#loginUser').text();
        var params = {'id':parseInt(id),'status':'2','readStatus':'0','processor':processor, 'endTime': new Date()};
        moriarty.doPost("/api/v1/service/update", JSON.stringify(params), function (res) {
            if (res.result === "SUCCESS") {
                showSuccessMessage("处理成功");
                window.location.href = "/service/serviceList";
            } else {
                showErrorMessage("处理失败");
            }
        })
    };

    businessService.cutBusiness = function (_this) {
        $('.li-body').html('');
        $(".headline").removeClass("title-selector");
        $(_this).parent().parent().find("div[class=checked]").attr("onclick","businessService.cutBusiness(this)");
        $(_this).removeAttr("onclick");
        $(_this).find("a").addClass("title-selector");
        var dataId = $(_this).data("id");
        if (dataId === "applied") {
            if ($("#applied").hasClass("hidden")) {
                $("#applied").removeClass("hidden");
                $("#installed").addClass("hidden");
            }
            businessService.businessList(dataId,"1");
        } else {
            if ($("#installed").hasClass("hidden")) {
                $("#installed").removeClass("hidden");
                $("#applied").addClass("hidden");
            }
            businessService.businessList(dataId,"2");
        }
    };
    businessService.isValidIPV4Address =function(ip){
        var reg =  /^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}$/;
        return reg.test(ip);
    };

    businessService.downContentPage = function (businessName) {
        window.location.href = "/api/v1/down/contentPage?businessName="+businessName;
    };
    window.businessService = businessService;
})();