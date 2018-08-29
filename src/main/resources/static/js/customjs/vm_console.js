/**
 * Created by pengq on 2017/7/14.
 */
/**
 * Created by pengq on 2017/5/22.
 */
!(function () {
    window.virtualMachineConsole = {
        init: function (host,port,ticket) {
            $('#vmConsole').height(window.screen.height);
            $('#wmksContainer').width($('#vmConsole').width());
            $('#wmksContainer').height(800);
            var wmks = WMKS.createWMKS("wmksContainer",{
                enableUint8Utf8:true,
                sendProperMouseWheelDeltas:true
            }).register(WMKS.CONST.Events.CONNECTION_STATE_CHANGE, function(e,d){
                if (d.state ===WMKS.CONST.ConnectionState.CONNECTED) {
                    console.log("connection state change:connected")
                }
            });

            wmks.connect("wss://"+host+":"+port+"/"+"ticket/"+ticket);

            $('.cad').click(function(){
                if (wmks) {
                    wmks.sendCAD();
                }
            });

            $('#back').click(function(){
                if (wmks) {
                    $('#wmksContainer').remove();
                    wmks.destroy();
                }
                history.back();
                ////TODO:返回列表
            });
        }
    };
})();