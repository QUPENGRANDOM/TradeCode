/**
 * Created by Yipin on 2017/12/25.
 */
!(function () {
    var oneSelfLog = {};

    oneSelfLog.init = function () {
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
            order: [[0, "desc"],[1,"desc"]],
            aLengthMenu: [10],
            ajax: {
                url: "/api/v1/log/oneselfList",
                dataSrc: 'data'
            },
            columns: [
                {
                    data: "entryDate"
                },
                {
                    data: "entryTime",
                    render:function (data, type, full, meta) {
                        return data.substring(0,data.indexOf("."));
                    }
                },
                {
                    data: "entryLogContent"
                },
                {
                    data: "entryResult"
                },
                {
                    data: "entryConductor"
                }
            ],
            language: {url: '/lang/datatable.chs.json'}
        });
    };

    window.oneSelfLog = oneSelfLog;
})();