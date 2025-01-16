let ggbApp = null;

window.onload = function() {
    const params = {
        "appName": "classic",
        "width": 800,
        "height": 600,
        "showToolBar": false,
        "showAlgebraInput": true,
        "showMenuBar": false,
        "enableLabelDrags": true,
        "enableShiftDragZoom": true,
        "enableRightClick": true,
        "showResetIcon": true,
        "useBrowserForJS": true,
        "allowStyleBar": false,
        "preventFocus": false,
        "showZoomButtons": true,
        "capturingThreshold": 3,
        "appletOnLoad": function(api) {
            // 初始化完成后的回调
            showBaseCurve();
        }
    };

    const applet = new GGBApplet(params, true);
    applet.inject('ggb-element');
}

function initializeCurve() {
    const ggbApi = ggbApp.getAppletObject();
    // 设置视图范围
    ggbApi.setCoordSystem(-10, 10, -10, 10);
    // 隐藏坐标轴
    ggbApi.setAxesVisible(true, true);
    // 设置网格
    ggbApi.setGridVisible(true);
} 