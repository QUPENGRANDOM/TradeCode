/**
 * Created by yanrum on 2018/3/5.
 */
!function(){
    var certDownload = {};
    certDownload.cert = function () {
        window.location.href = "/api/v1/download/file?fileName=cacert.cer";
    };
    certDownload.regedit = function () {
        window.location.href = "/api/v1/download/file?fileName=registryChrome.reg";
    };
    window.certDownload = certDownload;
}();