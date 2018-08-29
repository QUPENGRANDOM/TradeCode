/**
 * Created by Yipin on 2017/6/7.
 */
!(function () {
    var log = {};

    log.init = function () {
        $(".table").DataTable({
            paging: true,
            processing: false,
            lengthChange: false,
            ordering: true,
            autoWidth: false,
            info: true,
            serverSide: false,
            fixedHeader: true,
            searching: true,
            order: [[1, "asc"]],
            aLengthMenu: [10],
            ajax: {
                url: "/api/v1/host/logCollection",
                dataSrc: 'data'
            },
            columns: [
                {
                    data: "unitType"
                },
                {
                    data: "hostname"
                },
                {
                    data: "",
                    render: function (data, type, full, meta) {
                        return '<a style="color:blue" href="/host/vm-support?hostIp='+full.hostname+'">收集</a>';
                    }
                }
            ],
            language: {url: '/lang/datatable.chs.json'}
        });
    };

    window.LogCollection = log;
})();