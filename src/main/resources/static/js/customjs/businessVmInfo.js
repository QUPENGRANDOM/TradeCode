/**
 * Created by bozhil on 2017/10/26.
 */
(function () {
    var businessVmInfo = {};

    businessVmInfo.init = function () {
        initDataTable();
    };

    var initDataTable = function () {
        //todo 传入虚拟机参数
        $("#businessVmInfoTable").DataTable({
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
            scrollX: true,
            ajax: {
                url: "/api/v1/businessVmInfoList",
                type:"get",
                data:{"vm":["proxy01.hyh.com_192.168.2.2","router01.raysdata.com"]},
                dataSrc: 'data'
            },
            columns: [
                {
                    data: "name"
                },
                {
                    data: "numCpu"
                },
                {
                    data: "memory"
                },
                {
                    data: "diskSpace"
                },
                {
                    data: "fullName"
                },
                {
                    data: "numEthernetCards"
                },
                {
                    data: "ipAddress"
                },
                {
                    data: "powerState"
                },
                {
                    data: "connectionState"
                },
                {
                    data: "toolsRunningStatus"
                },
                {
                    data: "toolsVersion"
                },
                {
                    data: "version"
                },
                {
                    data: "parentCluster"
                },
                {
                    data: "parentDatacenter"
                },
                {
                    data: "parentFolder"
                },
                {
                    data: "parentHost"
                },
                {
                    data: "parentVcenter"
                }
            ],
            language: {url: '/lang/datatable.chs.json'}
        });
    };

    window.bussinessVmInfo = businessVmInfo;
})();