// 创建场景
var scenes = [];
// 创建相机
var cameras = [];
// 创建点云容器
var point = [];
// 创建控制器
var controlers = [];
// 创建渲染器
const renderer = new THREE.WebGLRenderer();
// 定义场景颜色
var sceneColors = [0x002451, 0x363537, 0x002451, 0x454372, 0x70877F];
// 浏览器视图大小
var W_12 = window.innerWidth / 2;
var H_12 = window.innerHeight / 2;
var W_13 = window.innerWidth / 3;
// 定义视图范围
var ViewRanges = [
    // 原点在左上角
    { x: 0, y: 0, w: W_13, h: H_12 }, // 左上
    { x: W_13, y: 0, w: W_13, h: H_12 }, // 中上
    { x: W_13 * 2, y: 0, w: W_13, h: H_12 }, // 右上
    { x: 0, y: H_12, w: W_12, h: H_12 }, // 左下
    { x: W_12, y: H_12, w: W_12, h: H_12 }, // 右下
];


function init() {
    // 设置渲染器
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    // 初始化场景和相机
    for (var i = 0; i <= 4; i++) {
        scenes[i] = new THREE.Scene();
        scenes[i].background = new THREE.Color(sceneColors[i]);

        cameras[i] = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.001, 1000);
        cameras[i].position.set(0, 0, 15);
        cameras[i].lookAt(0, 0, 0);

        controlers[i] = new THREE.OrbitControls(cameras[i], renderer.domElement);
    }
}
init();


function render() {
    for (var i = 0; i <= 4; i++) {
        var viewRange = ViewRanges[i];
        // 启用裁剪测试
        renderer.setScissorTest(true);
        // 设置渲染的视口
        renderer.setViewport(viewRange.x, viewRange.y, viewRange.w, viewRange.h);
        // 设置裁剪区域
        renderer.setScissor(viewRange.x, viewRange.y, viewRange.w, viewRange.h);
        renderer.render(scenes[i], cameras[i]);
    }
}
// 渲染函数
function animate() {
    requestAnimationFrame(animate);
    render();
}

var GlobleGUI = new dat.GUI();
const pcdLoader = new THREE.PCDLoader();
var ArrayBufferData;

// PCL.PointCloud数据类型
var OriginCloud;
var VoxelGridCloud;
var FilterCloud;
var MinSegCloud;
var ISSCloud;

const InitParams = {
    Origin: {
        rotate: true,
        pcdFile: "./images/car.pcd",
        pointSize: 1,
        color: 0xffd800,
    },

    OutlineFilter:
    {
        pointSize: 1,
        color: 0x00ff00,
        MeanK: 40,
        StddevMulThresh: 1.0
    },
    VoxelGrid:
    {
        pointSize: 4,
        color: 0x340ed2,
        leaf_size: 0.2,
    },
    ISSKeypoint:
    {
        pointSize: 5,
        color: 0xf07373,
        salientRadius: 6,
        nonMaxRadius: 4,
        threshold21: 0.975,
        threshold32: 0.975,
        minNeighbors: 5
    },
    Segment:
    {
        pointSize: 1,
        objectCenter: {
            x: 68.97,
            y: -18.55,
            z: 0.57,
        },
        radius: 3.0433856,
        sigma: 0.25,
        sourceWeight: 0.8,
        numberOfNeighbours: 14
    }
}
var loadDom = document.getElementById("loading");
async function initLoad() {
    await PCL.init({
        // 改变点云文件后需要重新编译？
        url: `./js/pcl-core.wasm`
    });
    loadDom.style.display = "block";
    ArrayBufferData = await fetch(InitParams.Origin.pcdFile).then((res) => res.arrayBuffer()); // arrayBuffer
    OriginCloud = PCL.loadPCDData(ArrayBufferData, PCL.PointXYZ);
    loadScene(0, 'origin');
    // 最小分割
    MinSeg(OriginCloud);
    loadScene(1, 'segmentation');
    // 统计离群点滤波
    OutlierFilter(OriginCloud);
    loadScene(2, 'filter');
    // ISS 关键点提取
    ISSKeypoint(OriginCloud);
    loadScene(3, 'keypoint');
    // 体素网格滤波
    VoxelGridFilter(OriginCloud);
    loadScene(4, 'voxelGrid');
    loadDom.style.display = "none";
}


// 读取PCL.PointCloud数据到THREE.BufferGeometry
function readPCLPointCloudDataToGeometry(PointCloud, needColor) {
    var PointData = PointCloud.data;
    var PointCloudLength = PointCloud.size; // 点云的点数size
    var position = [];
    var color = [];
    if (needColor) {
        for (var i = 0; i < PointCloudLength; i++) {
            position.push(PointData[i].x);
            position.push(PointData[i].y);
            position.push(PointData[i].z);
            color.push(PointData[i].r / 255);
            color.push(PointData[i].g / 255);
            color.push(PointData[i].b / 255);
        }
    }
    else {
        for (var i = 0; i < PointCloudLength; i++) {
            position.push(PointData[i].x);
            position.push(PointData[i].y);
            position.push(PointData[i].z);
        }
    }
    var geometry = new THREE.BufferGeometry();
    var positionAttribute = new THREE.Float32BufferAttribute(position, 3);
    geometry.addAttribute('position', positionAttribute);
    if (needColor) {
        var colorAttribute = new THREE.Float32BufferAttribute(color, 3);
        console.log(colorAttribute);
        geometry.addAttribute('color', colorAttribute);
    }

    return geometry;
}
// 加载点云场景
function loadScene(index, type = 'origin') {
    // index : 所处视图序号
    var cloud;
    var size;
    var color;
    var needVertexColor = false;
    if (type == 'origin') {
        size = InitParams.Origin.pointSize;
        color = InitParams.Origin.color;
        cloud = OriginCloud;
    }
    else if (type == 'filter') {
        size = InitParams.OutlineFilter.pointSize;
        color = InitParams.OutlineFilter.color;
        cloud = FilterCloud;
    }
    else if (type == 'voxelGrid') {
        size = InitParams.VoxelGrid.pointSize;
        color = InitParams.VoxelGrid.color;
        cloud = VoxelGridCloud;
    }
    else if (type == 'keypoint') {
        size = InitParams.ISSKeypoint.pointSize;
        color = InitParams.ISSKeypoint.color;
        cloud = ISSCloud;
    }
    else if (type == 'segmentation') {
        size = InitParams.Segment.pointSize;
        cloud = MinSegCloud;
        // 使用顶点颜色
        needVertexColor = true;
    }
    color = parseInt(color); // 转换为整数（十进制）

    scenes[index].remove(point[index]); // 移除上一次的点云

    var material;
    var geometry = readPCLPointCloudDataToGeometry(cloud, needVertexColor);
    if (needVertexColor) {
        material = new THREE.PointsMaterial({
            size: size,
            vertexColors: true,
            opacity: 0.5,
            transparent: true,
            sizeAttenuation: false,
        });
    }
    else {
        material = new THREE.PointsMaterial({
            size: size,
            color: color,
            opacity: 0.5,
            transparent: true,
            sizeAttenuation: false,
        });
        console.log("material", material);
    }
    point[index] = new THREE.Points(geometry, material);

    point[index].geometry.center();
    point[index].geometry.scale(1, 1, 1);
    scenes[index].add(point[index]);
    var AxesHelper = new THREE.AxisHelper(10);
    scenes[index].add(AxesHelper);
    cameras[index].lookAt(point[index].position);
}
//GUI
function loadOriginGUI(index) {
    var MainGUI = GlobleGUI.addFolder("原始点云（部分点云较小请滚动鼠标放大显示）");
    MainGUI.open();
    MainGUI.domElement.style.position = 'absolute';
    MainGUI.domElement.style.top = ViewRanges[index].x + 'px';
    MainGUI.domElement.style.left = ViewRanges[index].y + 'px';


    MainGUI.add(InitParams.Origin, "pointSize", 0.1, 5, 0.1).onFinishChange(function () {
        loadScene(index, 'origin');
    }).name("点大小");
    MainGUI.addColor(InitParams.Origin, "color").onFinishChange(function () {
        loadScene(index, 'origin');
    }).name("点云颜色");
    MainGUI.add(InitParams.Origin, "pcdFile", {
        'room': "./images/room1.pcd",
        'rabit（坐标值小，请放大）': "./images/bun0.pcd",
        'table（数据量大，速度较慢）': "./images/table.pcd",
        'car': "./images/car.pcd",
    }).onChange(function () {
        initLoad();
    }).name("示例文件");
}
function loadSegGUI(index) {
    var segGUI = GlobleGUI.addFolder("最小分割");
    segGUI.open();
    segGUI.domElement.style.position = 'absolute';
    segGUI.domElement.style.left = ViewRanges[index].x + 'px';
    segGUI.domElement.style.top = ViewRanges[index].y + 'px';

    segGUI.add(InitParams.Segment, "pointSize", 0.1, 5, 0.1).onFinishChange(function () {
        MinSeg(OriginCloud);
        loadScene(index, 'segmentation');
    }).name("点大小");

    var segCenterGUI = segGUI.addFolder("目标中心坐标");
    segCenterGUI.open();
    segCenterGUI.add(InitParams.Segment.objectCenter, "x", -100, 100).onFinishChange(function () {
        MinSeg(OriginCloud);
        loadScene(index, 'segmentation');
    }).name("x");
    segCenterGUI.add(InitParams.Segment.objectCenter, "y", -100, 100).onFinishChange(function () {
        MinSeg(OriginCloud);
        loadScene(index, 'segmentation');
    }).name("y");
    segCenterGUI.add(InitParams.Segment.objectCenter, "z", -100, 100).onFinishChange(function () {
        MinSeg(OriginCloud);
        loadScene(index, 'segmentation');
    }).name("z");
    segGUI.add(InitParams.Segment, "radius", 0, 10, 0.001).onFinishChange(function () {
        MinSeg(OriginCloud);
        loadScene(index, 'segmentation');
    }).name("邻域半径");
    segGUI.add(InitParams.Segment, "sigma", 0, 1, 0.01).onFinishChange(function () {
        MinSeg(OriginCloud);
        loadScene(index, 'segmentation');
    }).name("Sigma");
    segGUI.add(InitParams.Segment, "sourceWeight", 0, 1, 0.01).onFinishChange(function () {
        MinSeg(OriginCloud);
        loadScene(index, 'segmentation');
    }).name("源权重");
    segGUI.add(InitParams.Segment, "numberOfNeighbours", 1, 50, 1).onFinishChange(function () {
        MinSeg(OriginCloud);
        loadScene(index, 'segmentation');
    }).name("邻域点数");
}
function loadFilterGUI(index) {
    var filterGUI = GlobleGUI.addFolder("异常值过滤");
    filterGUI.open();
    filterGUI.domElement.style.position = 'absolute';
    filterGUI.domElement.style.left = ViewRanges[index].x + 'px';
    filterGUI.domElement.style.top = ViewRanges[index].y + 'px';

    filterGUI.add(InitParams.OutlineFilter, "pointSize", 0.1, 5, 0.1).onFinishChange(function () {
        OutlierFilter(OriginCloud);
        loadScene(index, 'filter');
    }).name("点大小");
    filterGUI.addColor(InitParams.OutlineFilter, "color").onFinishChange(function () {
        OutlierFilter(OriginCloud);
        loadScene(index, 'filter');
    }).name("点云颜色");

    filterGUI.add(InitParams.OutlineFilter, "MeanK", 0, 100, 1).onFinishChange(function () {
        OutlierFilter(OriginCloud);
        loadScene(index, 'filter');
    }).name("邻域内点数");
    filterGUI.add(InitParams.OutlineFilter, "StddevMulThresh", 0, 10).onFinishChange(function () {
        OutlierFilter(OriginCloud);
        loadScene(index, 'filter');
    }).name("标准差倍数阈值");

}
function loadISSGUI(index) {
    var keypointGUI = GlobleGUI.addFolder("ISS关键点提取");
    keypointGUI.open();
    keypointGUI.domElement.style.position = 'absolute';
    keypointGUI.domElement.style.left = ViewRanges[index].x + 'px';
    keypointGUI.domElement.style.top = ViewRanges[index].y + 'px';
    keypointGUI.add(InitParams.ISSKeypoint, "pointSize", 0.1, 10, 0.5).onFinishChange(function () {
        ISSKeypoint(OriginCloud);
        loadScene(index, 'keypoint');
    }).name("点大小");
    keypointGUI.addColor(InitParams.ISSKeypoint, "color").onFinishChange(function () {
        ISSKeypoint(OriginCloud);
        loadScene(index, 'keypoint');
    }).name("点云颜色");

    keypointGUI.add(InitParams.ISSKeypoint, "salientRadius", 1, 20, 1).onFinishChange(function () {
        ISSKeypoint(OriginCloud);
        loadScene(index, 'keypoint');
    }).name("窗口半径");
    keypointGUI.add(InitParams.ISSKeypoint, "nonMaxRadius", 1, 20, 1).onFinishChange(function () {
        ISSKeypoint(OriginCloud);
        loadScene(index, 'keypoint');
    }).name("非极大值抑制半径");
    keypointGUI.add(InitParams.ISSKeypoint, "threshold21", 0, 2, 0.001).onFinishChange(function () {
        ISSKeypoint(OriginCloud);
        loadScene(index, 'keypoint');
    }).name("稳定阈值参数");
    keypointGUI.add(InitParams.ISSKeypoint, "threshold32", 0, 2, 0.001).onFinishChange(function () {
        ISSKeypoint(OriginCloud);
        loadScene(index, 'keypoint');
    }).name("极稳定阈值参数");
    keypointGUI.add(InitParams.ISSKeypoint, "minNeighbors", 1, 20, 1).onFinishChange(function () {
        ISSKeypoint();
        loadScene(index, 'keypoint');
    }).name("最小邻域点数");
}
async function loadVoxelGridGUI(index) {
    var voxelGridGUI = GlobleGUI.addFolder("体素网格滤波");
    voxelGridGUI.open();
    voxelGridGUI.domElement.style.position = 'absolute';
    voxelGridGUI.domElement.style.left = ViewRanges[index].x + 'px';
    voxelGridGUI.domElement.style.top = ViewRanges[index].y + 'px';

    voxelGridGUI.add(InitParams.VoxelGrid, "pointSize", 1, 20, 1).onFinishChange(function () {
        VoxelGridFilter(OriginCloud);
        loadScene(index, 'voxelGrid');
    }).name("点大小");
    voxelGridGUI.addColor(InitParams.VoxelGrid, "color").onFinishChange(function () {
        VoxelGridFilter(OriginCloud);
        loadScene(index, 'voxelGrid');
    }).name("点云颜色");
    voxelGridGUI.add(InitParams.VoxelGrid, "leaf_size", 0, 5, 0.01).onFinishChange(function () {
        VoxelGridFilter(OriginCloud);
        loadScene(index, 'voxelGrid');
    }).name("滤波空间大小");
}


//最小分割
function MinSeg(originCloud) {
    const mcSeg = new PCL.MinCutSegmentation();
    const objectCenter = new PCL.PointXYZ(
        InitParams.Segment.objectCenter.x,
        InitParams.Segment.objectCenter.y,
        InitParams.Segment.objectCenter.z
    );
    const foregroundPoints = new PCL.PointCloud();
    foregroundPoints.addPoint(objectCenter);
    mcSeg.setForegroundPoints(foregroundPoints);
    mcSeg.setInputCloud(originCloud);
    mcSeg.setRadius(InitParams.Segment.radius);
    mcSeg.setSigma(InitParams.Segment.sigma);
    mcSeg.setSourceWeight(InitParams.Segment.sourceWeight);
    mcSeg.setNumberOfNeighbours(InitParams.Segment.numberOfNeighbours);
    mcSeg.extract();

    MinSegCloud = mcSeg.getColoredCloud();
    return MinSegCloud;
}
//统计异常点滤波
function OutlierFilter(originCloud) {
    const sor = new PCL.StatisticalOutlierRemoval();
    sor.setInputCloud(originCloud);
    sor.setMeanK(InitParams.OutlineFilter.MeanK);
    sor.setStddevMulThresh(InitParams.OutlineFilter.StddevMulThresh);

    FilterCloud = sor.filter();
    return FilterCloud;
}
//ISS关键点提取
function ISSKeypoint(originCloud) {
    const resolution = PCL.computeCloudResolution(originCloud);
    const tree = new PCL.SearchKdTree();
    const keypoints = new PCL.PointCloud();
    const iss = new PCL.ISSKeypoint3D();
    iss.setSearchMethod(tree);
    iss.setSalientRadius(InitParams.ISSKeypoint.salientRadius * resolution);
    iss.setNonMaxRadius(InitParams.ISSKeypoint.nonMaxRadius * resolution);
    iss.setThreshold21(InitParams.ISSKeypoint.threshold21);
    iss.setThreshold32(InitParams.ISSKeypoint.threshold32);
    iss.setMinNeighbors(InitParams.ISSKeypoint.minNeighbors);
    iss.setInputCloud(originCloud);
    iss.compute(keypoints);

    ISSCloud = keypoints;
    return ISSCloud;
}
//体素网格滤波
function VoxelGridFilter(originCloud) {
    const sor = new PCL.VoxelGrid();
    sor.setInputCloud(originCloud);
    sor.setLeafSize(InitParams.VoxelGrid.leaf_size, InitParams.VoxelGrid.leaf_size, InitParams.VoxelGrid.leaf_size);

    VoxelGridCloud = sor.filter();
    return VoxelGridCloud;
}

// 文件上传
// 将方法挂载到全局
window.uploadFiles = function () {
    // 创建一个文件输入框
    const fileInput = document.getElementById('fileInput');
    // 模拟点击文件输入框以触发文件选择对话框
    fileInput.click();
    // 当用户选择文件后，监听 change 事件
    fileInput.addEventListener('change', handleFileSelect);
}

function handleFileSelect(event) {
    const file = event.target.files[0]; //单文件
    console.log(file);
    InitParams.Origin.pcdFile = URL.createObjectURL(file);
    initLoad();
}


loadOriginGUI(0);
loadSegGUI(1);
loadFilterGUI(2);
loadISSGUI(3);
loadVoxelGridGUI(4);

initLoad();

animate();
