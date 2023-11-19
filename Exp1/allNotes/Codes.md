# Wave

````js
//从 Three.js 库中导入了所有导出的成员并命名为 THREE，* 表示导入 Three.js 库中的所有导出项，而 as THREE 将这些导出项命名为 THREE，使得你可以通过 THREE 对象来访问 Three.js 库的所有功能。这样做的目的是为了方便使用 Three.js 库中的各种模块和功能，而不必单独导入每个模块
import * as THREE from 'three';
//从 Three.js 库中的 OrbitControls.js 文件中导入了 OrbitControls 类。
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PCDLoader } from 'three/addons/loaders/PCDLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.01, 10000000);
camera.position.set(0, 0, 10);//通常情况下就是定义完camera就开始设置它的位置

// /*
// 在three.js中,canvas元素常见的处理方式包括:
// 1. 创建渲染器时生成
// 使用WebGLRenderer时会创建一个canvas元素作为渲染目标。
// ```js
// const renderer = new THREE.WebGLRenderer();
// ```
// 2. 插入到网页DOM
// 生成的canvas会插入到网页的DOM中,常见的有:
// ```js
// document.body.appendChild(renderer.domElement); 
// // 添加到body
// document.getElementById('container').appendChild(renderer.domElement);
// // 添加到一个指定的DOM元素中
// ```
// 3. 调整大小
// 可以通过设置renderer的setSize方法来调整canvas大小:
// ```js
// renderer.setSize(width, height); 
// ```
// 4. 渲染到canvas
// 场景渲染时会渲染到所创建的canvas上:
// ```js
// renderer.render(scene, camera);
// ```
// 5. 事件处理
// 可以通过添加事件监听来处理canvas上的鼠标交互等。
// ```js
// renderer.domElement.addEventListener('click', onClick);
// ```
// 6. 获取图像数据
// 可以通过renderer.domElement访问canvas元素,从而获取图像数据。

// 综上,three.js将底层的渲染细节封装起来了,我们主要通过renderer接口与canvas元素进行交互。
// */

/*dom元素是什么？
在 web 开发中,DOM(文档对象模型)元素表示 HTML 文档中的各个组成部分,主要包括:

1. 标签元素

如 <div>、<p>、<img> 等 HTML 标签,以及它们对应的 DOM 对象,如 DivElement、ImageElement 等。

2. 属性元素 

元素的属性,如 id、class、src 等,通过元素的 attributes 属性访问。

3. 文本节点

元素之间或元素内部的文本,通过 Node.textContent 或 Node.innerText 访问。
每个 DOM 元素都可以通过 JavaScript 进行访问和操作,主要的属性和方法包括:
- nodeName/tagName - 获取元素标签名
- attributes - 获取属性节点对象
- getAttribute()/setAttribute() - 读取和修改属性
- textContent/innerText - 访问文本内容
- parentNode - 访问父节点
- childNodes - 访问子节点
- appendChild()/removeChild() - 添加或删除子节点
三维库如 three.js 中会将创建的 renderer 对象的 dom 属性指向一个 canvas 元素,通过操作这个 DOM 元素可以插入场景、添加交互等。
所以理解 DOM 元素的工作机制对使用三维引擎进行渲染和交互都非常重要。
*/
const renderer = new THREE.WebGLRenderer();//使用 THREE.WebGLRenderer() 构造函数创建一个WebGL渲染器实例。
renderer.setSize(window.innerWidth, window.innerHeight);//调用 renderer.setSize() 方法设置渲染器的大小为整个窗口的内宽高。
/*
3. 获取渲染器的dom元素,它是一个 canvas 元素。
4. 将这个dom元素作为子元素添加到页面 body 中。
5. 这样就在页面中添加了一个Three.js的WebGL渲染画布。
6. 后续就可以通过控制渲染器的render()方法,将three.js场景渲染到这个canvas画布中。
7. 通过调整渲染器的大小,可以自适应不同分辨率的显示设备。
8. WebGL渲染器提供硬件GPU加速,使three.js场景可以硬件渲染,性能好。
*/
document.body.appendChild(renderer.domElement);

//创建一个四级标题元素，将其添加到HTML文档<body>元素中
const title1 = document.createElement('h4');//创建的<h4>元素分配给名为title1的常量
title1.textContent = 'PLUS-WAVE\'s PCD加载器';//设置<h4>元素的文本内容
title1.style.position = 'absolute';//设置<h4>元素的CSS样式属性position为'absolute'，这意味着它将使用绝对定位。
title1.style.top = '1%';// 设置<h4>元素相对于其包含元素（在这种情况下是<body>）顶部的距离为1%。
title1.style.left = '42%';//设置<h4>元素相对于其包含元素左侧的距离为42%
title1.style.color = 'white';//设置<h4>元素的文本颜色为白色
document.body.appendChild(title1);// 将创建的<h4>元素追加到文档的<body>元素中，使其成为文档的一部分。

const title2 = document.createElement('h5');
title2.innerHTML = '点击右上角按钮选择文件<br>(看不见点云的话记得改改颜色或者缩放)';
title2.style.position = 'absolute';
title2.style.top = '4%';
title2.style.left = '41%';
title2.style.color = 'white';
title2.style.textAlign = 'center';//设置名为 title2 的元素的文本对齐方式为居中
document.body.appendChild(title2);

//创建了一个OrbitControls对象，将相机 (camera) 和渲染器 (renderer) 的 DOM 元素传递给它
//使用 Three.js 库中提供的 OrbitControls 来实现用户对相机的交互控制，通常用于实现场景中的旋转、缩放和平移等操作
//这样就可以使用鼠标和触摸设备来交互式地控制相机，以改变 Three.js 场景的视角、缩放和旋转
const controls = new OrbitControls(camera, renderer.domElement);

//创建了一个名为 isRotation 的对象，其中包含一个属性 bool，其初始值为 false。这样的结构被用来存储一个布尔值，可能在代码的其他部分用于控制某些条件或状态。
const isRotation = { bool: false };

//使用了 dat.GUI，这是一个用于在网页上创建交互式的用户界面的库
var gui = new GUI();
//这行代码将 isRotation 对象的 bool 属性添加到 GUI 中，可以通过 GUI 控制该属性的布尔值。
// gui.add(isRotation, 'bool').name('旋转');
//创建一个名为 '点云设置' 的文件夹，用于组织和分类 GUI 中的控制元素
var attributesFolder = gui.addFolder('点云设置');
//设置 GUI 元素的 CSS 样式，将其左侧位置设置为 0 像素。这可以用来调整 GUI 控制面板在页面上的位置。
gui.domElement.style.left = '0px';

//重置（或重新初始化）之前创建的 dat.GUI 实例
function resetGUI() {
    // 删除之前的GUI
    gui.destroy();

    // 创建一个新的GUI实例
    gui = new GUI();
    // gui.add(isRotation, 'bool').name('旋转');
    attributesFolder = gui.addFolder('点云设置');
    gui.domElement.style.left = '0px';

}

//使用 Three.js 库创建了一个包含四个透视摄像机的数组 helpCamera
var helpCamera = [];//创建一个空数组 helpCamera，用于存储透视摄像机对象
for (let i = 0; i < 4; i++) {
    helpCamera[i] = new THREE.PerspectiveCamera(60, 1, 0.1, 0.4);//创建一个新的透视摄像机，将其存储在 helpCamera 数组的相应索引位置
    scene.add(helpCamera[i]);//将每个透视摄像机添加到场景中。这样，这四个透视摄像机就成为了场景中的一部分。
}

//以下是对这四个相机操作
//创建了一个变换矩阵 transformMatrix0，然后将这个变换矩阵应用到之前创建的 helpCamera 数组中的第一个透视摄像机（helpCamera[0]）上。
const transformMatrix0 = new THREE.Matrix4();
//使用 set 方法为变换矩阵设置具体的数值。这些数值是矩阵的元素，按列主序设置。这个具体的矩阵表示了一种空间变换，它可能包括平移、旋转和缩放等变换。
transformMatrix0.set(
    0.9635227966591445, -0.0298251417806896, -0.2659591721221557, -3.1861460134378618,
    0.04168012934974072, 0.9983679551673119, 0.03904091331448917, -0.0658694912288581,
    0.264360714054735, -0.04870202267670474, 0.963193400024973, 1.701830863209624117,
    0, 0, 0, 1
);
//将之前创建的透视摄像机 helpCamera[0] 应用变换矩阵 transformMatrix0。这样，透视摄像机的位置、方向和视锥体等属性就会根据这个变换矩阵进行相应的变换
helpCamera[0].applyMatrix4(transformMatrix0);

const transformMatrix1 = new THREE.Matrix4();
transformMatrix1.set(
    0.8671344194352608, -0.01285630331924969, -0.4979082386300075, -1.981515886805006,
    0.03166906549661311, 0.9990671872561505, 0.02935686697614572, -0.0212592897059282,
    0.4970663626933977, -0.04122463842227529, 0.8667326925100427, 2.75149718348900723,
    0, 0, 0, 1
);
helpCamera[1].applyMatrix4(transformMatrix1);

const transformMatrix2 = new THREE.Matrix4();
transformMatrix2.set(
    0.7024094659673048, -0.007144654873624021, -0.711737238049452, -2.685856668225444,
    0.09031055886130245, 0.9927625554048429, 0.07916130079909767, -0.0514197827631538,
    0.7060204990492023, -0.1198810347502172, 0.6979710541487608, 2.332535510893329,
    0, 0, 0, 1
);
helpCamera[2].applyMatrix4(transformMatrix2);

const transformMatrix3 = new THREE.Matrix4();
transformMatrix3.set(
    0.5308375671028522, 0.00925889315102485, -0.8474230054995811, -3.381832006499801,
    0.1320681431688673, 0.9868199683489367, 0.09351125936341173, -0.0917595736102196,
    0.8371197542241209, -0.1615568722321077, 0.5226183063406084, 1.036010012067961,
    0, 0, 0, 1
);
helpCamera[3].applyMatrix4(transformMatrix3);


const helpers = [];
// 初始点云生成
const loader = new PCDLoader();
//加载指定路径的 .pcd 文件，并在加载完成后执行回调函数。回调函数接收一个 points 参数，其中包含了加载的点云数据。
loader.load("./images/point_cloud.pcd", function (points) {
	//将点云的几何体（geometry）进行居中操作
    points.geometry.center();
    //将点云绕 X 轴旋转 180 度
    points.geometry.rotateX(Math.PI);

    //创建一个点云材质 material，并使用它来创建一个 THREE.Points 对象 pointCloud，将这个点云对象添加到场景中。
    const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.08, vertexColors: true });
    //material.vertexColors = showVertices.bool;

    //创建一个 THREE.Points 对象 pointCloud，将这个点云对象添加到场景中
    const pointCloud = new THREE.Points(points.geometry, material);
    scene.add(pointCloud);

    //使用循环为每个 helpCamera 对象设置朝向，让它们都看向点云的位置
    for (let i = 0; i < helpCamera.length; i++) {
        helpCamera[i].lookAt(pointCloud.position);
    }

    // 创建了一个名为 '点云 0' 的 GUI 文件夹，用于组织和分类点云相关的控制元素
    const folder = attributesFolder.addFolder(`点云 0`);

    //创建了一个名为 text 的对象，其中包含两个属性：pointsNum: 表示点云的点数  file: 表示文件名，初始值为字符串 "初始pcd"
    const text = { pointsNum: points.geometry.attributes.position.count, file: "初始pcd" };
    //使用 dat.GUI 的 add 方法向 GUI 文件夹中添加一个控制元素，该元素将显示 text 对象的 file 属性
    folder.add(text, 'file').name('文件');
    folder.add(text, 'pointsNum').name('点数');

    folder.add(material, 'size', 0, 2).name('点大小');
    folder.addColor(material, 'color').name('点颜色');
    //向 GUI 文件夹中添加一个控制元素，该元素将显示和控制 Three.js 中点云材质对象 (material) 的 vertexColors 属性
    //add(material, 'vertexColors'): 将 Three.js 材质对象 material 的 vertexColors 属性添加到 GUI 文件夹中作为一个控制元素。这个属性控制着点云材质是否使用顶点颜色。 .name('显示顶点颜色'): 设置该控制元素在 GUI 中的显示名称为 '显示顶点颜色  .onChange(function () { material.needsUpdate = true; }): 添加一个回调函数，当用户通过 GUI 修改 '显示顶点颜色' 的状态时，会触发这个回调函数。在这里，回调函数简单地将材质的 needsUpdate 属性设置为 true，表示需要手动更新材质。这是因为修改了这个属性后，需要通知 Three.js 运行时更新渲染。
    folder.add(material, 'vertexColors').name('显示顶点颜色').onChange(function () {
        material.needsUpdate = true; // 手动更新材质
    });

    //为每个 helpCamera 创建一个 THREE.CameraHelper 对象，然后将这些辅助对象添加到场景中。这些辅助对象可以帮助可视化相机的位置和方向
    for (let i = 0; i < 4; i++) {
        helpers[i] = new THREE.CameraHelper(helpCamera[i]);
        scene.add(helpers[i]);
    }
}
);


//创建了一个包含文件选择按钮和相应输入框的简单的HTML元素
//跟踪选择文件的次数
var count = 0;
//用于文件选择。这个输入框通常用于接受用户选择的文件
const input = document.createElement('input');
//用于触发文件选择操作。
const button = document.createElement('button');
button.textContent = '选择文件 (可选择多个)';
button.style.position = 'absolute';
button.style.top = '10px';
button.style.right = '10px';
//在按钮被点击时触发的事件处理函数。这个函数会模拟点击 input 元素，从而触发文件选择操作
button.onclick = function () {
    input.click();
};
//将按钮添加到文档的 <body> 元素中
document.body.appendChild(button);
//这样，页面上就会有一个按钮，用户点击按钮时会触发文件选择操作。文件选择框（input 元素）是隐藏的，通过点击按钮来触发它的点击事件，从而弹出文件选择对话框


//对之前创建的 input 元素进行一些设置，并定义了一个 onchange 事件处理函数，用于处理用户选择文件后的操
//设置 input 元素的类型为文件选择框
input.type = 'file';
//设置文件选择框只接受 .pcd 后缀的文件
input.accept = '.pcd';
//允许用户选择多个文件
input.multiple = true;
//将 input 元素的显示样式设置为 'none'，即隐藏该元素。实际上，文件选择框是通过点击之前创建的按钮来触发的，而不是直接点击 input 元素。
input.style.display = 'none';
//为 input 元素添加一个 onchange 事件处理函数。这个函数会在用户选择文件后触发。
input.onchange = function (event) {
    count++;
    //获取用户选择的文件列表
    const files = event.target.files;
    //存储后续创建的 Three.js 材质。
    const materials = [];
    //存储后续创建的 Three.js 点云对象。
    const pointClouds = [];


    // 遍历 Three.js 场景中的所有子对象，并将它们从场景中移除
    for (let i = 0; i < scene.children.length; i++) {
        //获取场景中第 i 个子对象
        const object = scene.children[i];
        //将取得的子对象从场景中移除
        scene.remove(object);
    }

    //连相机都移除
    for (let i = 0; i < 4; i++) {
        scene.remove(helpers[i]);
    }

    //这里的循环是因为可能要处理多个文件，实际的处理过程基本一致
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        //读取文件并将其转换为 Data URL
        reader.readAsDataURL(file);
        //设置了一个事件处理函数，当文件读取完成后触发
        reader.onload = function () {
            const data = reader.result;

            const loader = new PCDLoader();
            loader.load(data, function (points) {
                scene.remove(scene.children[0]);

                points.geometry.center();
                points.geometry.rotateX(Math.PI);

                var material = new THREE.PointsMaterial({ color: Math.random() * 0xffffff, size: 0.1, vertexColors: false });

                //material.vertexColors = showVertices.bool;
                //将这个材质对象添加到一个名为 materials 的数组中
                materials.push(material);

                const pointCloud = new THREE.Points(points.geometry, material);
                pointClouds.push(pointCloud);

                if (pointClouds.length === files.length) {
                    // 所有点云数据都加载完成后，将它们添加到场景中
                    for (let j = 0; j < pointClouds.length; j++) {
                        scene.add(pointClouds[j]);
                    }

                    if (count >= 1) {
                        resetGUI();
                    }
                    gui.add(isRotation, 'bool').name('旋转');
                    // 为每个点云创建 GUI 控件
                    for (let j = 0; j < materials.length; j++) {
                        const material = materials[j];
                        const points = pointClouds[j];
                        const file = files[j];


                        const folder = attributesFolder.addFolder(`点云 ${j + 1}`);

                        const text = { pointsNum: points.geometry.attributes.position.count, file: file.name };
                        folder.add(text, 'file').name('文件');
                        folder.add(text, 'pointsNum').name('点数');

                        folder.add(material, 'size', 0, 2).name('点大小');
                        folder.addColor(material, 'color').name('点颜色');
                        folder.add(material, 'vertexColors').name('显示顶点颜色').onChange(function () {
                            material.needsUpdate = true; // 手动更新材质
                        });
                    }


                    // 计算点云的边界
                    const box = new THREE.Box3().setFromObject(scene);
                    // 计算点云的中心
                    const center = box.getCenter(new THREE.Vector3());
                    // 计算点云的大小
                    const size = box.getSize(new THREE.Vector3());

                    // 设置相机的位置为点云的中心，再向后移动一段距离
                    camera.position.copy(center);
                    camera.position.z += size.length();
                    camera.lookAt(center);

                }
            }
            );
        };
    }
};
document.body.appendChild(input);


// onresize 事件会在窗口被调整大小时发生
//定义了一个 onresize 事件处理函数，当浏览器窗口大小改变时将被触发。在事件处理函数中，进行了一些操作来适应新的窗口大小
window.onresize = function () {
    // 重置渲染器输出画布，相机
    
    //将渲染器的输出画布大小设置为当前窗口的宽度和高度。这确保了渲染器的输出与窗口大小一致
    renderer.setSize(window.innerWidth, window.innerHeight);
    //更新相机的纵横比（aspect ratio），以匹配新的窗口纵横比。这是为了防止渲染出来的图像在宽高比变化时出现变形。
    camera.aspect = window.innerWidth / window.innerHeight;
    //更新相机的投影矩阵。这是因为修改了相机的纵横比后，投影矩阵也需要相应地更新。
    camera.updateProjectionMatrix();
};


//定义了一个 animate 函数，并使用 requestAnimationFrame 方法创建了一个循环，用于持续地更新和渲染 Three.js 场景、
function animate() {
    //检查 isRotation 对象的 bool 属性是否为 true，如果是，则启用旋转。
    if (isRotation.bool) {
        scene.rotation.y += 0.005;//如果启用了旋转，就使场景绕 y 轴旋转。这是一个简单的旋转动画效果。
    }

    //使用渲染器 renderer 渲染场景 scene 中的元素，使用相机 camera 来观察场景。
    renderer.render(scene, camera);

    //请求下一帧动画，从而创建一个循环。这样可以持续不断地更新和渲染场景，形成动画效果
    requestAnimationFrame(animate);
}
//调用 animate 函数，开始动画循环。这样会立即触发第一帧的渲染，之后就会在每一帧继续更新和渲染，形成动画效果
animate();

````

---

# Bian

```html

<!DOCTYPE html>
<html>
<!-- //设置本html的'<head>'部分 -->
<head>
    </head>
    <!-- //标题是“实验一 点云实现” -->
	<title>实验一 点云实现</title>
    <!-- //<style> 标签包含了一些 CSS 样式规则 -->
	<style type="text/css">      
        /* body 元素的外边距被设置为 0 */
		body { margin: 0; }
        /* canvas 元素的宽度和高度都被设置为 100%。这表明页面中的 canvas 将充满整个视口 */
		canvas { width: 100%; height: 100%; }
	</style>
    <!-- 指定模块导入映射。在这里，使用了 ECMAScript 模块的 importmap，指定了一些模块的导入路径 -->
  <script type="importmap">
    {
      "imports": {
        <!-- three: 通过 CDN 导入 Three.js 库的模块版本 0.158.0 -->
        "three":"https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js",
        <!-- 相对路径导入 OrbitControls.js 文件 -->
        "./js/OrbitControls.js": "./js/OrbitControls.js",
        "./js/PCDLoader.js": "./js/PCDLoader.js"
      }
    }   
</script>
</head>
<body>
	<!-- 这是一个HTML中的 <button> 元素，其中使用了 onclick 属性，该属性用于指定当用户点击按钮时要调用的 JavaScript 函数。
        在这里，changeColor1() 函数将在按钮点击时被调用。 -->
	  <button onclick="changeColor1()">转换颜色1</button>
    <button onclick="changeColor2()">转换颜色2</button>
    <button onclick="resetColor1()">重置颜色1</button>
    <button onclick="resetColor2()">重置颜色2</button>
	
	<script type="module">
     import * as THREE from 'three';
     import { OrbitControls } from './js/OrbitControls.js';
     import { PCDLoader } from './js/PCDLoader.js';

/*
在 Three.js 中，材质（Material）是用于定义物体外观的对象。它决定了物体如何对光线做出反应，从而影响其表面的颜色、反射、透明度等视觉特性。
在三维图形中，材质是渲染引擎用来计算光照和颜色的重要组成部分。

以下是一些常见的 Three.js 材质类型和它们的主要作用：
1. **MeshBasicMaterial（基础材质）：** 这是最简单的材质，不考虑光照，只显示一种纯色。这个材质不受光照影响，适用于一些不需要光照计算的场景。
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
2. **MeshLambertMaterial（兰伯特材质）：** 兰伯特材质考虑了光照，但不考虑镜面反射。它产生一种漫反射效果，表现为某一点的亮度与入射光线与法线之间的夹角有关。
    const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
3. **MeshPhongMaterial（冯氏材质）：** 冯氏材质是一种更复杂的光照模型，考虑了漫反射和镜面反射。它对于渲染具有光泽表面的物体非常有用。
    const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
4. **MeshStandardMaterial（标准材质）：** 标准材质是一种更现代的材质，综合了冯氏光照模型和镜面反射。它是 Three.js 推荐使用的主要材质之一。
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
这些材质类型提供了不同的外观效果，可以根据场景的需求选择合适的材质。通过调整材质的属性，例如颜色、透明度、贴图等，可以实现丰富的视觉效果。
*/


/*
在 Three.js 中，网格（Mesh）是表示三维对象的基本单位。网格由几何体（Geometry）和材质（Material）组成，它定义了物体的形状和外观。网格是场景中的可渲染对象，可以被摆放在三维空间中，并通过渲染引擎进行渲染，最终呈现在屏幕上。

以下是网格的主要作用和功能：

1. **表示三维对象：** 网格是用于表示三维对象的基本元素。通过指定几何体和材质，可以创建各种形状和外观的物体，如立方体、球体、平面等。
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const mesh = new THREE.Mesh(geometry, material);
2. **可渲染的对象：** 网格是可以被渲染引擎处理的对象，它参与了光照、阴影和其他渲染效果的计算，最终在屏幕上呈现。
3. **支持变换和动画：** 通过修改网格的位置、旋转和缩放等属性，可以对物体进行变换。这使得在场景中创建动画效果成为可能。
    mesh.position.set(0, 0, 0);
    mesh.rotation.set(0, Math.PI / 2, 0);
    mesh.scale.set(2, 2, 2);
4. **交互和事件处理：** 网格对象可以参与鼠标交互和其他用户输入事件的处理。你可以附加事件监听器，以响应用户与网格对象的交互。
    mesh.addEventListener('click', onClickHandler);
总体而言，网格是 Three.js 中用于构建和呈现三维场景的核心元素之一。通过组合不同的几何体和材质，可以创建出各种各样的三维对象，从简单的几何体到复杂的模型。
*/

/*
`AxesHelper` 是 Three.js 中的一个辅助对象，用于在场景中显示坐标轴。它的作用主要包括以下几个方面：

1. **可视化坐标轴：** `AxesHelper` 可以帮助你可视化场景中的坐标轴。每个轴（X、Y、Z）都有一个不同的颜色，通常是红色表示 X 轴，绿色表示 Y 轴，蓝色表示 Z 轴。
2. **辅助调试：** 在构建和调试场景时，`AxesHelper` 提供了一个快速的方式来确认对象的位置和方向。通过查看坐标轴的方向和长度，你可以更容易地理解和调整物体的位置和旋转。
3. **比例和方向：** 坐标轴的长度和比例通常是按照场景的尺度设置的，因此你可以直观地看到对象在场景中的大小。这对于确保相对比例和方向正确非常有帮助。
下面是一个简单的例子，演示了如何在 Three.js 中使用 `AxesHelper`：
const axesHelper = new THREE.AxesHelper(30); // 创建一个坐标轴辅助对象，长度为30个单位
scene.add(axesHelper); // 将坐标轴辅助对象添加到场景中
在这个例子中，`AxesHelper` 的构造函数参数是指定坐标轴长度的值。你可以调整这个值，以适应你的场景尺度。在场景中添加了 `AxesHelper` 后，你就可以在渲染的时候看到坐标轴了。
*/


//点云1观察相机设置
// 创建了一个包含相机图标的 3D 物体
// 创建一个 Three.js 中的 Object3D 对象，它表示一个容器，可以包含其他 3D 对象
const cameraIcon1 = new THREE.Object3D();
// 创建一个立方体的几何体，长宽高分别为 10 个单位。
const geometry1 = new THREE.BoxGeometry(10, 10, 10);
// 创建一个基础材质，设置颜色为红色（十六进制表示为 0xff0000）。
const material1 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
// 使用几何体和材质创建一个网格（Mesh），这个网格表示一个具有形状和颜色的对象。
const cameraMesh1 = new THREE.Mesh(geometry1, material1);
// 将上面创建的网格对象添加到之前创建的 Object3D 容器 cameraIcon1 中。
cameraIcon1.add(cameraMesh1);
// 设置 cameraIcon1 的位置，将其放置在三维空间中的 (-150, -110, -110) 坐标处。
cameraIcon1.position.set(-150,-110,-110);
// 创建一个辅助对象，用于显示坐标轴，参数 30 表示轴的长度。
const axesHelper1=new THREE.AxesHelper(30);
//  设置坐标轴辅助对象的位置，与 cameraIcon1 相同。
     axesHelper1.position.set(-150,-110,-110);
    //  绕 x 轴旋转坐标轴辅助对象，角度为负的 π/6 弧度（30 度）。
	 axesHelper1.rotation.x = -Math.PI/6 ;     

// 下面与上面的基本相同
const cameraIcon2 = new THREE.Object3D();
const geometry2 = new THREE.BoxGeometry(10, 10, 10);
const material2 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const cameraMesh2 = new THREE.Mesh(geometry2, material2);
cameraIcon2.add(cameraMesh2);
cameraIcon2.position.set(-250,-80,-110);
const axesHelper2=new THREE.AxesHelper(30);
     axesHelper2.position.set(-250,-80,-110);
	 axesHelper2.rotation.x = -Math.PI/6 ;     

const cameraIcon3 = new THREE.Object3D();
const geometry3 = new THREE.BoxGeometry(10, 10, 10);
const material3 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const cameraMesh3 = new THREE.Mesh(geometry3, material3);
cameraIcon3.add(cameraMesh3);
cameraIcon3.position.set(-50,-80,-110);
const axesHelper3=new THREE.AxesHelper(30);
     axesHelper3.position.set(-50,-80,-110);
	 axesHelper3.rotation.z = Math.PI/2;

const cameraIcon4= new THREE.Object3D();
const geometry4 = new THREE.BoxGeometry(10, 10, 10);
const material4 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const cameraMesh4 = new THREE.Mesh(geometry4, material4);
cameraIcon4.add(cameraMesh4);
cameraIcon4.position.set(-50,80,-110);
const axesHelper4=new THREE.AxesHelper(30);
     axesHelper4.position.set(-50,80,-110);
	 axesHelper4.rotation.y = Math.PI;	 
	 axesHelper4.rotation.x = Math.PI;	

const cameraIcon5= new THREE.Object3D();
const geometry5 = new THREE.BoxGeometry(10, 10, 10);
const material5 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const cameraMesh5 = new THREE.Mesh(geometry5, material5);
cameraIcon5.add(cameraMesh5);
cameraIcon5.position.set(-150,110,-110);
const axesHelper5=new THREE.AxesHelper(30);
     axesHelper5.position.set(-150,110,-110);
	 axesHelper5.rotation.y = Math.PI*(2/3);	 
	 axesHelper5.rotation.x = Math.PI*(4/3);

const cameraIcon6= new THREE.Object3D();
const geometry6 = new THREE.BoxGeometry(10, 10, 10);
const material6 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const cameraMesh6 = new THREE.Mesh(geometry6, material6);
cameraIcon6.add(cameraMesh6);
cameraIcon6.position.set(-250,80,-110);
const axesHelper6=new THREE.AxesHelper(30);
     axesHelper6.position.set(-250,80,-110);
	 axesHelper6.rotation.y = Math.PI/2;	 
	 axesHelper6.rotation.x = Math.PI;	
	 
const cameraIcon7 = new THREE.Object3D();
const geometry7 = new THREE.BoxGeometry(10, 10, 10);
const material7 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const cameraMesh7 = new THREE.Mesh(geometry7, material7);
cameraIcon7.add(cameraMesh7);
cameraIcon7.position.set(150,-110,-110);
const axesHelper7=new THREE.AxesHelper(30);
     axesHelper7.position.set(150,-110,-110);
	 axesHelper7.rotation.x = Math.PI/6 ;     

const cameraIcon8 = new THREE.Object3D();
const geometry8 = new THREE.BoxGeometry(10, 10, 10);
const material8 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const cameraMesh8 = new THREE.Mesh(geometry8, material8);
cameraIcon8.add(cameraMesh8);
cameraIcon8.position.set(250,-80,-110);
const axesHelper8=new THREE.AxesHelper(30);
     axesHelper8.position.set(250,-80,-110);
	 axesHelper8.rotation.x = -Math.PI/6 ;     

const cameraIcon9 = new THREE.Object3D();
const geometry9 = new THREE.BoxGeometry(10, 10, 10);
const material9 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const cameraMesh9 = new THREE.Mesh(geometry9, material9);
cameraIcon9.add(cameraMesh9);
cameraIcon9.position.set(50,-80,-110);
const axesHelper9=new THREE.AxesHelper(30);
     axesHelper9.position.set(50,-80,-110);
	 axesHelper9.rotation.z = Math.PI/2;
	 axesHelper9.rotation.y = Math.PI/2;


const cameraIcon10= new THREE.Object3D();
const geometry10 = new THREE.BoxGeometry(10, 10, 10);
const material10 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const cameraMesh10 = new THREE.Mesh(geometry10, material10);
cameraIcon10.add(cameraMesh10);
cameraIcon10.position.set(50,80,-110);
const axesHelper10=new THREE.AxesHelper(30);
     axesHelper10.position.set(50,80,-110);
	 axesHelper10.rotation.y = Math.PI/2;	 
	 axesHelper10.rotation.x = Math.PI;	

const cameraIcon11= new THREE.Object3D();
const geometry11 = new THREE.BoxGeometry(10, 10, 10);
const material11 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const cameraMesh11 = new THREE.Mesh(geometry11, material11);
cameraIcon11.add(cameraMesh11);
cameraIcon11.position.set(150,110,-110);
const axesHelper11=new THREE.AxesHelper(30);
     axesHelper11.position.set(150,110,-110);
	 axesHelper11.rotation.y = Math.PI*(2/3);	 
	 axesHelper11.rotation.x = Math.PI*(4/3);

const cameraIcon12= new THREE.Object3D();
const geometry12 = new THREE.BoxGeometry(10, 10, 10);
const material12 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const cameraMesh12 = new THREE.Mesh(geometry12, material12);
cameraIcon12.add(cameraMesh12);
cameraIcon12.position.set(250,80,-110);
const axesHelper12=new THREE.AxesHelper(30);
     axesHelper12.position.set(250,80,-110);
	 axesHelper12.rotation.y = -Math.PI;	 
	 axesHelper12.rotation.x = Math.PI;	

//上面使用库的镜像，设置对于两个点云的按钮
function changeColor1() {
        const points1 = scene.getObjectByName("points1");
        points1.material.color.set(0x0000ff); // 设置颜色为蓝色
    }

    function changeColor2() {
        const points2 = scene.getObjectByName("points2");
        points2.material.color.set(0xff00ff); // 设置颜色为紫色
    }

    function resetColor1() {
        const points1 = scene.getObjectByName("points1");
        points1.material.color.set(0x00ff00); // 重置颜色为绿色
    }

    function resetColor2() {
        const points2 = scene.getObjectByName("points2");
        points2.material.color.set(0xff0000); // 重置颜色为红色
    }
//摄像机，画布
        // 使用 Three.js 创建了一个基本的三维场景，包括一个相机、渲染器、地面平面、相机助手（CameraHelper），以及一个轨道控制器（OrbitControls）

        // 创建Three.js的基础的场景对象
		const scene = new THREE.Scene();
        // 透视相机
		const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);、
        // 渲染器
		const renderer = new THREE.WebGLRenderer();
        // 设置渲染器的大小为窗口的大小
		renderer.setSize(window.innerWidth, window.innerHeight);
        // 添加渲染元素到文档的body中
		document.body.appendChild(renderer.domElement);

        // 创建一个平面几何体
		const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
        // 创建一个基础材质 (MeshBasicMaterial)，颜色为灰色
        const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
        // 创建一个网格对象 (Mesh)，将几何体和材质组合在一起
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        // 将地面对象添加到场景中，并绕 x 轴旋转了 180 度（-Math.PI），使其位于场景下方
        ground.rotation.x = -Math.PI ; 
        scene.add(ground);

        // 设置相机位置
        camera.position.set(0, -500, -100);
        // 创建一个相机助手 (CameraHelper)，它可用于可视化相机的视锥体
		const helper = new THREE.CameraHelper(camera);
		scene.add(helper);
        // 创建一个轨道控制器 (OrbitControls)，它允许用户通过鼠标控制相机的位置和方向。
		const controls = new OrbitControls(camera, renderer.domElement);
        // 启用阻尼效果使得相机移动和旋转时有平滑的过渡
		controls.enableDamping = true;
		controls.dampingFactor = 0.25;
        // 启用缩放功能，允许用户通过滚轮进行缩放操作
		controls.enableZoom = true;

//第一个点云
		const loader1 = new PCDLoader();
		loader1.load('./images/ism_train_lioness.pcd',function (points) {

                // 设置Three.js中的点云大小
				points.material.size=0.01;
				points.material.color= new THREE.Color(0x00ff00);
                // 绕 X 轴旋转点云的几何体。Math.PI 表示 180 度的弧度，因此这里是绕 X 轴进行了180度的旋转
				points.geometry.rotateX(Math.PI);
                // 绕 Z 轴旋转点云的几何体，同样是180度的旋转。
				points.geometry.rotateZ(Math.PI);
                // 将点云的 X 坐标减小 150 个单位。这会使点云在 X 轴方向上向左移动。
				points.position.x+=-150;
				points.name = "points1"; 
				scene.add(points);
                scene.add(cameraIcon1);
				scene.add(axesHelper1);
				scene.add(cameraIcon2);
                scene.add(axesHelper2);
				scene.add(cameraIcon3);
                scene.add(axesHelper3);
                scene.add(cameraIcon4);
                scene.add(axesHelper4);
				scene.add(cameraIcon5);
                scene.add(axesHelper5);
				scene.add(cameraIcon6);
                scene.add(axesHelper6);
				function animate() {
            // 浏览器提供的函数，用于请求浏览器执行下一次重绘时调用指定的函数，通常用于创建动画效果。在这里，它会不断地调用 animate 函数，形成动画循环。
			requestAnimationFrame(animate);
            // 用于在每一帧中渲染场景。scene 是 Three.js 场景对象，camera 是相机对象。这将触发渲染引擎将场景投影到相机上，并通过渲染器在屏幕上呈现。
			renderer.render(scene, camera);
            // 更新轨道控制器（OrbitControls），以响应用户的交互操作。轨道控制器允许用户通过鼠标操作来旋转、缩放和平移相机
			controls.update();
            // 启用阴影映射。这是为了开启场景中物体的阴影渲染。
			renderer.shadowMap.enabled = true;
            // 设置阴影映射的类型为 PCFSoftShadowMap。这是一种平滑阴影映射类型，通常提供更柔和的阴影效果
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            //  设置地面（可能是一个平面）接收阴影，使其能够显示其他物体的投影阴影。
            ground.receiveShadow = true;
            //  绕 Z 轴旋转点云的几何体。这个操作会在每一帧中以 0.01 弧度的速度使点云旋转。
			points.geometry.rotateZ(0.01);
		}

		animate();
			},
            // 加载资源时的回调函数，可能用于监视加载过程或处理加载错误。在这里，回调函数被传递给加载函数，该函数在资源加载时进行调用
			function (xhr) {
                // 加载进度回调函数。在资源加载过程中，xhr 参数包含了加载的信息，xhr.loaded 表示已加载的字节数，
                // xhr.total 表示总字节数。通过这两个值计算出加载的百分比，并通过 console.log 输出到控制台，以便在加载过程中查看加载进度
				console.log((xhr.loaded / xhr.total * 100) + '% 加载数');
			},
			function (error) {
                // 处理加载错误的回调函数。如果在加载资源时发生错误，加载函数将调用此回调函数，并将错误信息传递给 error 参数。在这里，错误信息被输出到控制台
				console.log('发生错误', error);
			}
		);

//第二个点云
const loader2 = new PCDLoader();
		loader2.load('./images/ism_train_cat.pcd',function (points) {

				points.material.size=0.01;
				points.material.color= new THREE.Color(0xff0000);
				points.geometry.rotateX(Math.PI);
				points.geometry.rotateZ(Math.PI);
				points.position.x+=150;
				points.name = "points2"; 
				scene.add(points);
				scene.add(points);
                scene.add(cameraIcon7);
				scene.add(axesHelper7);
				scene.add(cameraIcon8);
                scene.add(axesHelper8);
				scene.add(cameraIcon9);
                scene.add(axesHelper9);
                scene.add(cameraIcon10);
                scene.add(axesHelper10);
				scene.add(cameraIcon11);
                scene.add(axesHelper11);
				scene.add(cameraIcon12);
                scene.add(axesHelper12);

				function animate() {
			requestAnimationFrame(animate);
			renderer.render(scene, camera);
			controls.update();
			renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            ground.receiveShadow = true;
			points.geometry.rotateZ(0.01);
		}

		animate();
			},
			function (xhr) {
				console.log((xhr.loaded / xhr.total * 100) + '% 加载数');
			},
			function (error) {
				console.log('发生错误', error);
			}
		);



		
  </script>
</body>
</html>
```

---

# 王嘉楠

```html

<html>
<head>
    <!-- HTML 中的 <meta> 标签，用于指定文档的元数据。具体来说，<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
    这个标签的作用是定义文档的字符集编码为 UTF-8。 http-equiv 属性用于模拟 HTTP 头部字段，这里是模拟 HTTP 头部中的 Content-Type 字段，它告诉浏览器如何解释文档的内容
    content 属性指定了 Content-Type 字段的内容，表示文档的类型是 HTML，字符集编码为 UTF-8。这个 <meta> 标签确保浏览器正确地解释和渲染 HTML 文档，并使用 UTF-8 编码来支持各种字符-->
    <meta http-equiv="Content-Type" content="textml;charset=UTF-8">
	<title>王嘉楠 实验一</title>
	<style type="text/css">
        /* 去除页面的默认边距 */
		body { margin: 0; }
        /* 将所有 <canvas> 元素的宽度和高度都设置为100%，使其充满其包含的容器。这通常用于确保画布占据整个屏幕或容器的空间。 */
		canvas { width: 100%; height: 100%; }
        /*  ID 选择器，选择了 ID 为 "per" 的元素 ，选择器定义的样式是元素：高度 宽度 背景颜色 文本颜色 行高（百分比是对父元素来说）*/
        #per {
        height: 2%;
        width: 100%;
        background: #d61717;
        color: #00ffff;
        line-height: 15px;        
    }
	</style>
    <script type="importmap">
        {
            "imports":{
                "three":"./js/three.module.js"
                
            }
        }
    </script>
</head>
<body>
    <div id="container">
        <!-- 进度条 -->
        <div id="per"> </div>
    </div>
    <!-- 三个具有相同类名的 <div> 元素 <div id="green" class="bu">绿</div>, <div id="red" class="bu">红</div>, <div id="blue" class="bu">蓝</div> -->
    <div  id="green" class="bu">绿</div> <div  id="red" class="bu">红</div> <div  id="blue" class="bu">蓝</div>//切换大点云颜色
	<script type="module">
        import * as THREE from 'three';
        import { OrbitControls } from './js/OrbitControls.js';
        import { PCDLoader } from './js/PCDLoader.js';

//场景
const scene=new THREE.Scene();
const width=1500;
const height=800;
//摄像机
const camera=new THREE.PerspectiveCamera(80,width/height,0.1,3000);
camera.position.set(1,-1,-1);
camera.lookAt( -1,1,-1);


//显示摄像机（camerahelper)


const helper = new THREE.CameraHelper( camera);
scene.add(helper);


//渲染器
const renderer=new THREE.WebGLRenderer();
renderer.setSize(width,height);
// 使用了 Three.js 中的 setClearColor 方法，用于设置渲染器的清除颜色，即背景色
renderer.setClearColor(0xADD8E6);  
renderer.render(scene,camera);
document.body.appendChild(renderer.domElement);
//光源
// 创建了一个点光源（PointLight）并将其添加到场景中

// 1: 光源的强度，表示光的亮度。值为1表示全强度。
// 100: 光的距离，表示光的影响范围，超过这个距离光将不再产生影响。
const pl=new THREE.PointLight(0x00ffff,1,100);
// 设置点光源的位置为 (10, 0, 0)。这表示光源在场景中的坐标位置。
pl.position.set(10,0,0);
scene.add(pl);
//辅助坐标系
const axesHelper=new THREE.AxesHelper(-0.2);
axesHelper.position.set(0.6,0.1,0.1);
scene.add(axesHelper);
const axesHelper2=new THREE.AxesHelper(-0.2);
axesHelper2.position.set(0.45,0.1,0.35);
axesHelper2.rotateY(0.98*Math.PI);
scene.add(axesHelper2);
const axesHelper3=new THREE.AxesHelper(-0.2);
axesHelper3.position.set(0.1,0.1,0.6);
scene.add(axesHelper3);

//添加虚拟摄像机1
// 创建了一个黄色的立方体
const geometry=new THREE.BoxGeometry(0.05,0.05,0.05);
const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
// 使用几何体和材质创建一个网格对象，即立方体。
const cube = new THREE.Mesh(geometry, material);
cube.position.set(0.6,0.1,0.1);
cube.rotateY(-0.06*Math.PI);
// 将立方体添加到场景中，使其可见
scene.add(cube);
//添加虚拟摄像机2
const geometry2=new THREE.BoxGeometry(0.05,0.05,0.05);
const material2 = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const cube2 = new THREE.Mesh(geometry2, material2);
cube2.position.set(-0.45,0.1,-0.35);
cube2.rotateY(0.3*Math.PI);
scene.add(cube2);
//添加虚拟摄像机3
const geometry3=new THREE.BoxGeometry(0.05,0.05,0.05);
const material3 = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const cube3 = new THREE.Mesh(geometry3, material3);
cube3.position.set(0.1,0.1,0.6);
cube3.rotateY(0.06*Math.PI);
scene.add(cube3);

//旋转虚拟摄像机 
var t=0;

//PCDLoader(加载第一个pcd)
const loader=new PCDLoader();
loader.load('./images/pl2.pcd',
function(points){
points.geometry.center();//将摄像机对向图像中心
const texture = new THREE.TextureLoader().load('./images/shu.jpg');//使用 Three.js 中的 TextureLoader 类加载了一个纹理（图片），并将其赋值给 texture 变量。
points.material.size = 0.0001;//设置点云大小，足够小才能看的更清晰
points.material.color = new THREE.Color(0xd61717); // 模型颜色
// 这行代码将之前加载的纹理 (texture) 赋值给 points 对象的材质的 map 属性。这通常用于将纹理映射到 Three.js 场景中的点云对象 (points) 上
points.material.map=texture;//可切换材质（但是好像没啥用）
scene.add(points);  
points.geometry.rotateZ(1* Math.PI);//第一个图不反转就是反的
//通过点击菜单里的字来改变点云的颜色
// 使用原生 JavaScript 给 id 为 'green' 的 HTML 元素（可能是一个按钮或其他可点击的元素）添加了一个点击事件监听器。
// 当用户点击这个元素时，执行回调函数，将 points 对象的材质颜色设置为绿色（0x00ff00）。
// 通过 getElementById 方法获取 HTML 中 id 为 'green' 的元素。addEventListener('click', function(){...})给选中的元素添加一个点击事件的监听器，当元素被点击时，执行后面的匿名函数。
// points.material.color.set(0x00ff00): 在点击事件触发时，这行代码将 points 对象的材质颜色设置为绿色（0x00ff00）。
// 这假定 points 是一个 Three.js 中的对象，其中 material 是其材质属性，color 是材质的颜色属性
document.getElementById('green').addEventListener('click',function(){points.material.color.set(0x00ff00);})
document.getElementById('red').addEventListener('click',function(){points.material.color.set(0xd61717);})
document.getElementById('blue').addEventListener('click',function(){points.material.color.set(0x00ffff);})
//渲染
function animate() {  
requestAnimationFrame(animate);
renderer.render(scene, camera);  
points.geometry.rotateY(0.01);//旋转三维图像的同时渲染

t+=0.01;//时间
//摄像机1
cube.rotateY(0.01);
axesHelper.rotateY(0.01);
cube.position.x=0.61*Math.sin(t+0.5);
cube.position.z=0.61*Math.cos(t+0.5);
axesHelper.position.x=Math.sin(t+0.5)*0.61;
axesHelper.position.z=Math.cos(t+0.5)*0.61;
//摄像机2
cube2.rotateY(0.01);
axesHelper2.rotateY(0.01);
cube2.position.x=0.58*Math.sin(t-2);
cube2.position.z=0.58*Math.cos(t-2);
axesHelper2.position.x=Math.sin(t-2)*0.58;
axesHelper2.position.z=Math.cos(t-2)*0.58;
//摄像机3
cube3.rotateY(0.01);
axesHelper3.rotateY(0.01);
cube3.position.x=0.61*Math.sin(t+2.3);
cube3.position.z=0.61*Math.cos(t+2.3);
axesHelper3.position.x=Math.sin(t+2.3)*0.61;
axesHelper3.position.z=Math.cos(t+2.3)*0.61;
}  
//令虚拟摄像机对准大点云
axesHelper.rotateY(-0.1);
axesHelper2.rotateY(0.4);
axesHelper3.rotateY(1.5);
animate();
const numPoints = points.geometry.getAttribute('position').count; 
console.log('点云1个数为：'+numPoints);//显示点云个数
},
function(xhr){
const a=xhr.loaded/xhr.total*100;
console.log(('点云1加载进度'+xhr.loaded/xhr.total*100+'%'));//显示加载进度
const percentDiv = document.getElementById("per");// 获取进度条元素
percentDiv.style.width =a + "px";//进度条元素长度
percentDiv.style.textIndent = a + 5 +"px";//缩进元素中的首行文本
percentDiv.innerHTML =a+'%';//进度百分比
//加载pcd文件太快了。。根本看不到进度条变化的过程
},
function(error){
console.log('An error happened');
}
);
//PCDLoader(加载第二个pcd)，同理第一个
const loader2=new PCDLoader();
loader.load('./images/pointcloud.pcd',
function(points){

points.geometry.center();
points.material.size = 0.001;
points.material.color = new THREE.Color(0x00ff0); // 模型颜色
points.position.y+=0.33;//将两个点云文件分开，方便展示

scene.add(points);  
console.log('Point cloud contains: ', points.num, ' points');  
function animate() {  
requestAnimationFrame(animate);
renderer.render(scene, camera);  
points.geometry.rotateY(-0.01);//旋转三维图像的同时渲染
const obj=new THREE.Object3D();
}  
animate();
const numPoints = points.geometry.getAttribute('position').count; 
console.log('点云2个数为：'+numPoints);//显示点云个数
},
function(xhr){
const a=xhr.loaded/xhr.total*100;
console.log(('点云2加载进度'+xhr.loaded/xhr.total*100+'%'));//显示加载进度
const percentDiv = document.getElementById("per");// 获取进度条元素
percentDiv.style.width =a + "px";//进度条元素长度
percentDiv.style.textIndent = a + 5 +"px";//缩进元素中的首行文本
percentDiv.innerHTML =a+'%';//进度百分比

},
function(error){
console.log('An error happened');
}
);
//相机控件，用于拖动摄像机方便观察（鼠标交互）
const controls=new OrbitControls(camera,renderer.domElement);
controls.addEventListener('change',function(){
    renderer.render(scene,camera);});
    </script>
</body>
</html>
```

---

# 李俊呈

```html

<!DOCTYPE html>
<html>
<head>
	<title>点云渲染</title>
	<script type="importmap">
		{
			"imports": {
				"three": "./node_modules/three/build/three.module.js",
				"three/addons/": "./node_modules/three/examples/jsm/"
			}
		}
	</script>
	<script type="module">
		import * as THREE from 'three';

		import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
		import { PCDLoader } from 'three/addons/loaders/PCDLoader.js';
		import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.001, 1000);
		const renderer = new THREE.WebGLRenderer( );
		renderer.setSize(window.innerWidth, window.innerHeight);
		
		document.body.appendChild(renderer.domElement);
		

		const controls = new OrbitControls(camera, renderer.domElement);
		camera.position.z =0.15;

        // 创建了一个 Three.js 中的网格辅助对象，即 GridHelper
        // 构造函数的两个参数分别是网格的大小和网格的分割数。在这里，网格的大小为 10 个单位，分割数也为 10，因此会创建一个大小为 10x10 的网格。
        // GridHelper 对象通常用于在 Three.js 场景中可视化地显示网格，以帮助你更好地定位和理解场景中的物体
		const gridHelper = new THREE.GridHelper(10, 10);
		scene.add(gridHelper);

		const axesHelper = new THREE.AxesHelper(0.5);
		scene.add(axesHelper);
		//const helper = new THREE.CameraHelper( camera ); 
        //scene.add( helper );
		

		const virtualCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		virtualCamera.position.set(0, 0.1, 0.15); // 设置虚拟摄像机位置
		virtualCamera.lookAt(5, 100, 100); // 设置虚拟摄像机视图方向
		const virtualHelper = new THREE.CameraHelper( virtualCamera ); 
		scene.add( virtualHelper);

		const loader = new PCDLoader();
		loader.load('ChinaDragon.pcd', (points) =>
			{
				scene.add(points);

                // 通过调用 Date.now() 来获取当前时间戳(单位毫秒),然后乘以 0.001 来计算一个以秒为单位的时间。
                // 这个时间值会随着真实时间的流逝而变化,所以可以用来控制旋转的速度。
				const angle = Date.now() * 0.001; // 控制旋转速度
       		    const radius = 2; // 控制旋转半径
                // 通过三角函数计算相机的x、z坐标:x = 物体x坐标 + 半径 * sin(角度)
                // z = 物体z坐标 + 半径 * cos(角度)
        		// virtualCamera.position.x = points.position.x + radius * Math.sin(angle);
        		// virtualCamera.position.z = points.position.z + radius * Math.cos(angle);
        		// virtualCamera.lookAt(points);
                // updateMatrixWorld()更新相机的矩阵,确保效果立即渲染到场景中
				// virtualCamera.updateMatrixWorld(); 
				virtualHelper.update();
				//scene.add( virtualHelper);

				points.position.set(0,-0.1,0);
			
				points.rotation.set(0,0,0);
				points.scale.set(1,1,1);
				
				//Light
                // 创建环境光实例：环境光是一种全局的光照效果,会均匀地照亮场景中的所有物体
				const ambientLight = new THREE.AmbientLight(0x404040); // 设置环境光颜色
    			scene.add(ambientLight);

   				 // 添加点光源
    			const pointLight = new THREE.PointLight(0xffffff, 100); // 设置点光源颜色和强度
    			pointLight.position.set(1, 1, 1); // 设置光源位置
    			scene.add(pointLight);


				//set Point
				const pointSize = 0.0001;
				const color = new THREE.Color(0,255,0);
				const material = new THREE.PointsMaterial({size: pointSize, color: color, emissive: new THREE.Color(0xffffff)});
				points.material = material;
				
				//gui
				const gui = new GUI();

				const colorControl = gui.addColor(material,'color');
				 // 添加控制点云的位置的选项
				 const positionFolder = gui.addFolder('Position');
    			positionFolder.add(points.position, 'x', -1, 1).step(0.001);
    			positionFolder.add(points.position, 'y', -1, 1).step(0.001);
   				 positionFolder.add(points.position, 'z', -1, 1).step(0.001);

    // 添加控制点云的旋转的选项
				const rotationFolder = gui.addFolder('Rotation');
				rotationFolder.add(points.rotation, 'x', -Math.PI, Math.PI).step(0.1);
				rotationFolder.add(points.rotation, 'y', -Math.PI, Math.PI).step(0.1);
				rotationFolder.add(points.rotation, 'z', -Math.PI, Math.PI).step(0.1);

				 const scaleFolder = gui.addFolder('scale');
    			scaleFolder.add(points.scale, 'x', -1, 10).step(0.1);
    			scaleFolder.add(points.scale, 'y', -1, 10).step(0.1);
   				scaleFolder.add(points.scale, 'z', -1, 10).step(0.1);
	
				
				 const animate = () => {
				requestAnimationFrame(animate);
				controls.update();
				renderer.render(scene, camera);
				}

		animate();
	});
	</script>
</head>
<body></body>
</html>
```

---

# 杨朝

```html

<!DOCTYPE html>
<html lang="en"><head>
	<title>homework01</title>
    <!-- <meta charset="utf-8"> 设置文档使用UTF-8字符编码 -->
	<meta charset="utf-8">
    <!-- 为移动端设置的视口(viewport)元信息 -->
	<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
	
</head>
/*
    1. importmap 主要用于自定义模块Specifier的映射,比如可以把一个模块指向本地的文件,而不是从网上加载。
    2. module 表示该脚本是一个模块,可以使用 import/export 语法,与其他模块互相导入导出
*/
<body>
	<!-- 这是导入映射脚本 -->
	<script type="importmap">
		{
			"imports": {
				"three": "./js/three.module.js"
			}
		}
	</script>
	
    <!-- ECMAScript 模块脚本 -->
	<script type="module">

		import * as THREE from 'three';
		import { OrbitControls } from './js/OrbitControls.js';
		import { PCDLoader } from './js/PCDLoader.js';
		import { GUI } from './js/lil-gui.module.min.js';

		let camera, scene, renderer;
		let gridHelper,cameraHelper;
		let T0;

		init();
		render();

		function init() {
//render
            // 设置对象,开启了抗锯齿功能
			renderer = new THREE.WebGLRenderer( { antialias: true } );
            // renderer.setPixelRatio 方法设置渲染的像素比率 window.devicePixelRatio 获取窗口的物理像素和CSS像素比率
            // 这样设置可以使渲染的分辨率与显示设备的实际分辨率匹配,防止画面模糊。
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( window.innerWidth, window.innerHeight );
			document.body.appendChild( renderer.domElement );
			scene = new THREE.Scene();
//camera&&cameraHelper
			camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 5, 80 );
			camera.position.set( 0, 0, 10);
			const cameraHelper = new THREE.CameraHelper( camera ); 
			scene.add( camera );
			scene.add( cameraHelper );
//gridHelper			
 			gridHelper = new THREE.GridHelper( 100, 30, 0x2C2C2C, 0x888888 );
			gridHelper.position.y = -10;
			scene.add(gridHelper)
//light			
			const light = new THREE.SpotLight( 0xffffff, 10000 );
			light.position.set( 0, 25, 50 );
			light.angle = Math.PI / 9;
			scene.add( light );
//controls
			const controls = new OrbitControls( camera, renderer.domElement );
            // 添加了change事件监听,在控制器变化时调用render函数重新渲染。
            // minDistance和maxDistance设置了允许的缩放范围,这里设置为了10,相当于禁用了缩放功能。
            // 这样就创建了一个围绕目标旋转而不能缩放的轨道控制器。
            // 在animate循环中调用controls.update()可以持续更新控制器状态
			controls.addEventListener( 'change', render ); // use if there is no animation loop
			controls.minDistance = 10;
			controls.maxDistance = 10;
//loader1
			const loader = new PCDLoader();
			loader.load( 'images/rabbit.pcd', function ( points ) {
				points.position.y=-10;
				points.geometry.rotateX( Math.PI );
				points.name = 'rabbit.pcd';
				scene.add( points );
//gui1
				const gui = new GUI();
				gui.addFolder('folder');
				//gui.add( points.material, 'size', 0.001, 0.01 ).onChange( render );
                // gui.open();
				gui.addColor( points.material, 'color' ).onChange( render );
                //  gui.open() 就是最后一步,将先前定义的各种控件以面板的形式展示出来,供用户交互。不调用 open() 方法的话,先前添加的控件也不会显示。
                // 另外,GUI 打开后可以通过 gui.close() 来进行关闭
				gui.open();
//animate1
				function animate() {
					requestAnimationFrame(animate);
					renderer.render(scene, camera);
					controls.update();
					points.geometry.rotateZ(-0.003);
				}
				animate();

				render();

			} );

//loader2
			loader.load( 'images/room_scan1.pcd', function ( points ) {
				points.position.y=10;
				points.geometry.rotateX( Math.PI );
				points.name = 'room_scan1.pcd';
				scene.add( points );
// //gui2
// 				const gui = new GUI();
// 				gui.addColor( points.material, 'color' ).onChange( render );
// 				gui.open();


				const gui = new GUI();
				gui.addFolder('folder');
				gui.addColor( points.material, 'color' ).onChange( render );
				gui.open();
//animate2
				function animate() {
					requestAnimationFrame(animate);
					renderer.render(scene, camera);
					controls.update();
					points.geometry.rotateZ(0.003);
				}
				animate();
				
				render();
			});
//loader3
			loader.load( 'images/table_scene_lms400.pcd', function ( points ) {
				points.position.x=10;
				points.geometry.rotateX( Math.PI );
				points.name = 'table_scene_lms400.pcd';
				scene.add( points );
//gui3
				const gui = new GUI();
				gui.addColor( points.material, 'color' ).onChange( render );
				gui.open();
//animate3
				function animate() {
					requestAnimationFrame(animate);
					renderer.render(scene, camera);
					controls.update();
					points.geometry.rotateZ(0.005);
				}
				animate();
				
				render();
			});
			window.addEventListener( 'resize', onWindowResize );
		}

        // 定义了一个窗口变化时的响应函数onWindowResize
        // 当窗口大小改变时,调用onWindowResize来响应这些变化
		function onWindowResize() {
			camera.aspect = window.innerWidth / window.innerHeight;//更新相机的aspect比例为当前窗口宽高比
			camera.updateProjectionMatrix();//更新相机的projection矩阵,以应用新的aspect比例

			renderer.setSize( window.innerWidth, window.innerHeight );//设置渲染器的大小为当前窗口的宽高

			render();//重新渲染场景

		}
// render
			function render() {
				requestAnimationFrame(render);
				renderer.render(scene, camera);
			}
			render();
	</script>

<canvas data-engine="three.js r157" width="998" height="0.1" style="display: block; width: 998px; height: 1px; touch-action: none;"></canvas>
		<div class="lil-gui allow-touch-styles root autoPlace">
			<div class="title" role="button" aria-expanded="true" tabindex="0">Controls</div>
				<div class="children">
					<div class="controller number hasSlider">
							<div class="controller color"><div class="name" id="lil-gui-name-2">color1</div>
							<div class="widget"><div class="display" style="background-color: rgb(129, 24, 24);">
								<input type="color1" tabindex="-1" aria-labelledby="lil-gui-name-2">
							</div>
						    <input type="text" spellcheck="false" aria-labelledby="lil-gui-name-2">
					</div>
				</div>
			</div>
		</div>		
</body>
</html>
```

---

# 许秩群

```HTML

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>3D点云可视化</title>
    <style>
        body {
            /* 去除默认边距 */
            margin: 0;
            margin: 0;
            /* 将背景颜色改为黑色 */
            background-color: #000;
            /* 修改文字颜色为白色 */
            color: #fff;
            /* 字体设置为等宽字 */
            font-family: Monospace;
            /* 字体大小设置为13像素 */
            font-size: 13px;
            /* 行高设置为24像素 */
            line-height: 24px;
            /* 禁用触屏设备的溢出滚动效果 */
            overscroll-behavior: none;
        }
    </style>
</head>

<body>
    <!--  
这是HTML中一个按钮的代码,包含了点击按钮时调用JavaScript函数的逻辑:

<button>定义了一个按钮元素
onclick="loadSelectedPointCloud(lookDirection1)" 设置了点击按钮的响应事件
loadSelectedPointCloud() 是自定义的一个JavaScript函数
lookDirection1 是传递给这个函数的一个参数
所以完整的逻辑是:

当点击这个按钮时,会调用loadSelectedPointCloud()这个函数,并传入lookDirection1这个参数。

这可以实现点击按钮时,加载特定的点云数据,并通过传入参数控制视角
    -->
    <button onclick="loadSelectedPointCloud(lookDirection1)">Load Point Cloud 1</button>
    <button onclick="loadSelectedPointCloud(lookDirection2)">Load Point Cloud 2</button>
    <button onclick="loadSelectedPointCloud(lookDirection3)">Load Point Cloud 3</button>
<!-- <div>定义一个块级容器 
<label>定义一个标签,for属性与下面的input id对应
"点云一颜色:" 显示文字说明颜色选择器的用途
<input type="color">定义了一个颜色输入框
id="colorPicker0" 给了该输入框一个id,与label的for对应
value设定了默认颜色值#ff0000,也就是红色
-->
    <div>
        <label for="colorPicker">点云一颜色：</label>
        <input type="color" id="colorPicker0" value="#ff0000">
        <label for="colorPicker">点云二颜色：</label>
        <input type="color" id="colorPicker1" value="#ff0000">
        <label for="colorPicker">点云三颜色：</label>
        <input type="color" id="colorPicker2" value="#ff0000">
    </div>

<!-- 
实现了一个滑块和按钮的界面:

<label>标签显示了"点大小:"的文字说明
<input type="range"> 定义了一个范围滑块输入框,用于选择点大小
min/max 设置了值的范围
step 设置了每次改变的增量
value 设置了默认值
<button>定义了一个按钮,id为"toggleRotation"

所以该界面包含:
一个滑块输入框,用于选择点大小参数
一个按钮,点击时可以在自动旋转和停止旋转之间切换

在JavaScript代码中可以:
获取滑块的值,调整点大小
给按钮添加点击事件,在旋转和停止之间切换状态
 -->
    <div>
        <label for="sizeSlider">点大小：</label>
        <input type="range" id="sizeSlider" min="0.001" max="0.1" step="0.00001" value="0.001">
        <button id="toggleRotation">停止自动旋转</button>
    </div>

    <script src="js/three.min.js"></script>
    <script src="js/OrbitControls.js"></script>
    <script src="js/PCDLoader.js"></script>
    <script>
        var scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000); // 设置场景背景颜色为黑色
        var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.z = 5;

        var renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        var controls = new THREE.OrbitControls(camera, renderer.domElement);
        // 设置相机初始位置
        camera.position.set(0, 2, 10);

        var shadowCamera1 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100);
        shadowCamera1.position.set(0, 0, 0);
        var shadowHelper1 = new THREE.CameraHelper(shadowCamera1);
        scene.add(shadowHelper1);
        //shadowCamera.lookAt(0, 0, 0);


        // 添加可视化的阴影摄像机

        var lookDirection1 = new THREE.Vector3(3, -1, 0);
        var lookDirection2 = new THREE.Vector3(-3, -1, 0);
        var lookDirection3 = new THREE.Vector3(0, 0, 0);

        // 自动旋转场景
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1;

        // 获取按钮元素
        const toggleRotationButton = document.getElementById('toggleRotation');

        // 更新按钮文本和自动旋转状态
        function updateRotationState() {
            if (controls.autoRotate) {
                toggleRotationButton.textContent = '停止自动旋转';
            } else {
                toggleRotationButton.textContent = '开始自动旋转';
            }
        }


        // 为按钮添加点击事件处理程序
        toggleRotationButton.addEventListener('click', function () {
            controls.autoRotate = !controls.autoRotate;
            updateRotationState();
        });



        // 用于存储点云对象和大小的控制
        var pointCloudObjects = [];
        var sizeSlider = document.getElementById("sizeSlider");

        //用于清除点云数据的
        var pointCloudclear = [];

        //输入pcd文件的路径、初始颜色、初始大小和初始位置
        function loadPointCloud(pcdFileName, initialColor, initialSize, position, uniqueId) {
            var loader = new THREE.PCDLoader();
            loader.load(pcdFileName, function (pointCloud) {
                // 获取点云的几何体
                var geometry = pointCloud.geometry;

                // 创建一个新的点云材质，设置颜色和大小
                var material = new THREE.PointsMaterial({ size: initialSize, color: new THREE.Color(initialColor), vertexColors: false });

                // 创建点云对象
                var pointCloudObject = new THREE.Points(geometry, material);

                // 启用阴影投射
                pointCloudObject.castShadow = true;
                pointCloudObject.receiveShadow = true;

                var scale;
                // 设置缩放因子
                if (pcdFileName != 'images/bun1.pcd') {
                    scale = 0.035; // 调整缩放因子根据需要
                    pointCloudObject.rotation.set(Math.PI / 2, Math.PI, 0);
                    geometry.scale(scale, scale, scale);

                    // 设置点云对象的位置
                    if(uniqueId == 2) pointCloudObject.position.set(position.x, position.y-1, position.z-6);
                    else pointCloudObject.position.set(position.x, position.y, position.z);
                }
                else {
                    scale = 0.5
                    pointCloudObject.rotation.set(0, Math.PI, Math.PI);
                    geometry.scale(scale, scale, scale);


                    // 设置点云对象的位置
                    pointCloudObject.position.set(position.x+1.5, position.y, position.z);
                }

                // 添加点云到场景
                scene.add(pointCloudObject);

                // 存储点云对象
                pointCloudObjects.push(pointCloudObject);
                // 存储点云对象到 pointCloudclear[uniqueId]
                pointCloudclear[uniqueId] = pointCloudObject;
            });
        }

        // 添加大小滑块事件监听器
        sizeSlider.addEventListener('input', function () {
            var newSize = parseFloat(sizeSlider.value);
            pointCloudObjects.forEach(function (pointCloudObject) {
                pointCloudObject.material.size = newSize;
            });
        });
        // 添加颜色控制
        function getColorPickerForIndex(i) {
            var colorPicker = document.getElementById('colorPicker' + i);
            colorPicker.addEventListener('input', function () {
                var color = new THREE.Color(colorPicker.value);
                pointCloudclear[i].material.color = color;
            });
        }

        getColorPickerForIndex(0);
        getColorPickerForIndex(1);
        getColorPickerForIndex(2);

        function getRandomColor() {
            // 生成随机的RGB颜色
            var r = Math.floor(Math.random() * 256);
            var g = Math.floor(Math.random() * 256);
            var b = Math.floor(Math.random() * 256);

            // 将RGB值转换为CSS颜色字符串
            var color = `rgb(${r},${g},${b})`;

            return color;
        }

        function loadSelectedPointCloud(position) {

            var uniqueId;
            if (position === lookDirection1) {
                uniqueId = 0;
            } else if (position === lookDirection2) {
                uniqueId = 1;
            } else if (position === lookDirection3) {
                uniqueId = 2;
            } else {
                uniqueId = -1; // 可以处理其他位置值
            }

            scene.remove(pointCloudclear[uniqueId]); // 从场景中移除指定的点云对象

            var fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.pcd';

            fileInput.addEventListener('change', function (event) {
                var selectedFile = event.target.files[0];

                if (selectedFile) {
                    var size = 0.001; // 指定大小
                    var reader = new FileReader();
                    reader.readAsDataURL(selectedFile);

                    reader.onload = function () {
                        var data = reader.result;

                        // 调用加载点云的函数，使用用户选择的文件名和其他参数
                        loadPointCloud(data, getRandomColor(), size, position, uniqueId);
                    };
                } else {
                    alert("Please select a point cloud file.");
                }
            });

            fileInput.click(); // 模拟点击文件选择按钮
        }

        var size = 0.001; // 指定大小
        //加载第一个点云
        loadPointCloud('images/ism_train_wolf.pcd', getRandomColor(), size, lookDirection1, 0)
        //加载第二个点云
        loadPointCloud('images/ism_train_cat.pcd', getRandomColor(), size, lookDirection2, 1)
        //加载第三个点云
        loadPointCloud('images/bun1.pcd', getRandomColor(), size, lookDirection3, 2)


        // 重新加载第一个点云
        loadSelectedPointCloud(lookDirection1);

        // 重新加载第二个点云
        loadSelectedPointCloud(lookDirection2);

        // 重新加载第三个点云
        loadSelectedPointCloud(lookDirection3);
        // 可以继续加载更多点云，调用 loadPointCloud 函数即可


        // 渲染场景
        function animate() {
            requestAnimationFrame(animate);

            // 更新主相机控件，以触发自动旋转
            controls.update();

            // 渲染场景
            renderer.render(scene, camera);

        }

        animate();

    </script>
</body>

</html>
```

---

# 王圳洋

```html

<!DOCTYPE html>
<html lang="en">
<head>
  <title>three.js webgl - PCD</title>
  <style>
    /* 先将原生的文件输入框隐藏。 */
    #file-input {
      display: none;
    }

    /* 设置绝对定位,将自定义按钮固定在页面右上角 */
    .button-container {
      position: absolute;
      top: 25px;
      right: 25px;
    }
    /* 定义了按钮的样式 */
    .custom-button {
      background-color: #63c966;
      color: white;
      border: none;//没有边框
      padding: 10px 20px;//添加内边距
      text-align: center;//居中文本
      text-decoration: none;//没有下划线
      display: inline-block;//设置为行内块元素
      font-size: 16px;//字体大小
      cursor: pointer;//鼠标手势
      border-radius: 4px;//圆角边框
    }

    .custom-button:hover {
      background-color: #428a46;
    }
    #bottom-text {
      position: fixed;
      bottom: 0;
      width: 100%;
      background-color: transparent;
      padding: 10px;
      text-align: center;
      justify-content: center; /* 水平居中对齐 */
      align-items: center; /* 垂直居中对齐 */
      padding-left: 20px; /* 添加左侧内边距 */
      padding-right: 20px; /* 添加右侧内边距 */
      padding-bottom: 20px; /* 添加下侧内边距 */
      font-size: 16px;
      color: white;
    }
  </style>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
<!-- 
这两行代码导入了网页需要使用的 favicon 图标和 CSS 样式文件:

第一行导入 favicon 图标:
rel="icon" 定义这是一个 favicon 图标
href 指定图标的位置,这里使用的是 data URI 来将一个空的 base64 编码直接嵌入页面里,以隐藏默认的 favicon
这样可以去掉页面默认的 favicon。

第二行导入自定义 CSS 样式表:
rel="stylesheet" 定义这是一个样式表文件
type="text/css" 指定它是CSS样式表
href="css/main.css" 指定样式表的位置在 css/main.css 文件中
浏览器会自动请求和加载这两个资源文件,并应用到页面上。
所以这两行代码的作用就是导入了自定义的图标和样式,覆盖了浏览器的默认外观。

是建立自定义页面视觉效果的重要一步。后续可以继续通过 CSS 和 JavaScript 来丰富页面效果。 
-->
  <link rel="icon" href="data:image/x-icon;base64,">
  <link type="text/css" rel="stylesheet" href="css/main.css">
  
</head>
<body>
  <div class="button-container">
    <input type="file" id="file-input" accept=".pcd" multiple>
    <button class="custom-button" onclick="openFileDialog()">选择PCD文件</button>
  </div>
  <div id="bottom-text">
    这个pcd模型加载器展示了所加载的点云文件的总数(Foldercount), 以及每个点云文件的名字(...pcd), 缩放比例(Scaling)和点的数量(Pointcount), <br>
    并实现了三个坐标轴方向的平移(PositionXYZ), 点的尺寸(Pointsize), 颜色(Pointcolor)的交互, 以及点云模型的显示和隐藏(show/off), <br>
    希望能为使用者带来好的体验
  </div>

  <script type="importmap">
    {
      "imports": {
        "three": "./js/three.module.js"
      }
    }
  </script>

  <script type="module">

    import * as THREE from 'three';
    import { OrbitControls } from './js/OrbitControls.js';
    import { PCDLoader } from './js/PCDLoader.js';
    import { GUI } from './js/lil-gui.module.min.js'

    let camera, addcamera, scene, renderer;
    let cameraHelper;
    let controls, loader, gui;
    let folderCount = 0;
    let folderCountControl;
    let visible;

    init();
    render();

    function init() {

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 2);
        scene.add(camera);

        addcamera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10000);
        addcamera.position.set(0, 0, 1);
        addcamera.lookAt(new THREE.Vector3(0, 0, 0)); // 设置辅助相机的目标点为点云的中心点
        cameraHelper = new THREE.CameraHelper(addcamera);
        scene.add(cameraHelper);

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000);
        document.body.appendChild(renderer.domElement);

        controls = new OrbitControls(camera, renderer.domElement);
        controls.autoRotate = true;
        controls.autoRotateSpeed = 2;
        controls.minPolarAngle = 0;
        controls.maxPolarAngle = Math.PI / 2;

        loader = new PCDLoader();
        gui = new GUI();
        gui.open();
        folderCountControl = gui.add({ folderCount: 0 }, 'folderCount').name('Foldercount');  //folderCount的属性，并将其初始值设置为0。然后，使用gui.add方法将该属性添加到GUI中

        gui.domElement.style.top = '80px'; // 设置距离顶部的像素数
        gui.domElement.style.right = '25px'; // 设置距离左侧的像素数

        window.addEventListener('resize', onWindowResize);

    }

    function openFileDialog() {
        var fileInput = document.getElementById('file-input');
        fileInput.multiple = true; // 添加此行以支持选择多个文件
        fileInput.click();
    }

    // 导出 openFileDialog() 为全局变量，只有导出来，我才能将函数与button绑定
    window.openFileDialog = openFileDialog;

/*
    function loadPCDFile(file) {
    var reader = new FileReader();
    
    reader.onload = function(event) {
        var url = event.target.result;
        console.log(url);

        loader.load(url, function (points) {
            points.geometry.center();
            points.geometry.rotateX(Math.PI);
            points.name = file.name;
            // 生成随机颜色
            var colors = new THREE.Color(0xFFFFFF*Math.random());
            // 点渲染模式
            const material = new THREE.PointsMaterial({color: colors , size: 0.0045});  // size是点对象像素尺寸
            // console.log(colors);
            points.material = material;
            scene.add(points);
        });
    };

        reader.readAsDataURL(file);
    }
*/

    function loadPCDFile(file) {
        console.log(file);
        var url = URL.createObjectURL(file);
        console.log(url);

        loader.load(url, function (points) {
            var pcdWrapper = new THREE.Object3D(); // 创建一个包装对象
            points.geometry.center();
            points.geometry.rotateX(Math.PI);
            points.name = file.name;

            // 生成随机颜色
            // var colors = new THREE.Color(0xFFFFFF*Math.random());
            // console.log(colors);

            // 点渲染模式
            // const material = new THREE.PointsMaterial({color: colors , size: 0.0045});  // size是点对象像素尺寸
            // points.material = material;

            var box = new THREE.Box3().setFromObject(points); // 获取模型的边界框
            var center = new THREE.Vector3();
            box.getCenter(center); // 计算中心点
            var Psize = new THREE.Vector3();
            box.getSize(Psize);

            // 统计点云模型的点数
            var pointCount = points.geometry.attributes.position.count;

            pcdWrapper.add(points); // 将点云添加到包装对象中
            var maxlength = Math.max(Psize.x, Psize.y, Psize.z);
            var scale = 1/maxlength;

            
            // 将整个点云模型减去中心点的坐标
            pcdWrapper.position.sub(center);
            pcdWrapper.scale.set(scale, scale, scale);
            console.log(pcdWrapper.position);
            scene.add(pcdWrapper);

            var filefolder = gui.addFolder(points.name);
            filefolder.open(); // 打开一级菜单

            filefolder.add({ scale: scale.toFixed(4) }, 'scale').name('Scaling').listen();
            filefolder.add({ pointCount: pointCount }, 'pointCount').name('Pointcount').listen();// 目的是创建一个属性名为 'pointCount'，值为 pointCount 的对象。然后，通过将这个对象作为第一个参数传递给 add 方法
            filefolder.add(pcdWrapper.position, 'x', -1.5, 1.5).name('PositionX');
            filefolder.add(pcdWrapper.position, 'y', -1.5, 1.5).name('PositionY');
            filefolder.add(pcdWrapper.position, 'z', -1.5, 1.5).name('PositionZ');

            filefolder.addColor( points.material, 'color' ).name('Pointcolor').onChange( renderer.render(scene, camera) );
            filefolder.add(points.material, 'size', 0.001, 0.01).name('Pointsize').onChange(renderer.render(scene, camera));
            visible = {enable: true};

            filefolder.add(visible, 'enable').name('show/off').onChange(function(value) {pcdWrapper.visible = value;  renderer.render(scene, camera);});
            folderCount++; // 增加每次读取文件夹时文件的数量
            folderCountControl.setValue(folderCount);

        }); 
    }



    function handleFiles(files) {
        for (var i = 0; i < files.length; i++) {
            console.log(files[i].name); // 在控制台打印文件名
            loadPCDFile(files[i]);
            // 在这里进行对文件的操作，比如上传等等
        }
    }

    document.getElementById('file-input').addEventListener('change', function (event) {
        handleFiles(event.target.files);  // 这段代码将监听file-input元素的change事件，并在文件选择发生变化时调用handleFiles函数来处理所选文件。
    });


    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function render() {
        controls.update();
        cameraHelper.update();
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

  </script>
</body>
</html>
```

---

# 杨镇宇

```html

<!DOCTYPE html>
<html>
    <head>
        <title>my lab1</title>
        <meta charset="utf-8">
        <style>
            body {margin:0;}
            canvas {width:100%;height: 100%;}
        </style>
    </head>
    <body>

        <script type ="importmap">
            {
                
                "imports" : {
					"three" : "./js/three.js-master/build/three.module.js",
					"three/addons/" : "./js/three.js-master/examples/jsm/"
				}
            }
        </script>
        <script type="module">
            import * as THREE from 'three';
            import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
            import {PCDLoader} from 'three/addons/loaders/PCDLoader.js';
            import {GUI} from 'three/addons/libs/lil-gui.module.min.js';
            var scene = new THREE.Scene();
            var camera = new THREE.PerspectiveCamera(45,window.innerWidth / window.innerHeight,1,2500);
            var renderer = new THREE.WebGLRenderer({antialias:true});
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth,window.innerHeight);
            document.body.appendChild(renderer.domElement);
             camera.position.set(800,0,0);
             scene.add(camera);

             const controls = new OrbitControls( camera,renderer.domElement);
             //controls.addEventListener('change',render);//场景改变触发渲染
             controls.minDistance = 0;
             controls.maxDistance = 2500;

             var camera1=new THREE.PerspectiveCamera(45,1,0.1,500);
             camera1.position.set(500,0,0);
             scene.add(camera1);

            const loader1 = new PCDLoader();
            loader1.load('./images/wolf.pcd',function(points)
            {
                points.geometry.center();
                points.geometry.rotateX(570);
                points.material.color=new THREE.Color(0xdca520);
                points.name="wolf.pcd";
                scene.add(points);
                camera1.lookAt(points.position);
                const helper1=new THREE.CameraHelper(camera1);
                scene.add(helper1);            
                const gui = new GUI();  //UI，交互控制界面
                gui.add( points.material, 'size',0.01,10 ).name('点大小');
                gui.addColor( points.material,'color').name('点颜色');
                gui.open();
                function animate(){
                requestAnimationFrame(animate);
                renderer.render(scene,camera);

            }
            animate();
            //render()
            });


            var camera2=new THREE.PerspectiveCamera(45,1,0.1,500);
             scene.add(camera2);

            const loader2 = new PCDLoader();
            loader2.load('./images/horse.pcd',function(points)
            {
                points.geometry.center();
                points.geometry.rotateX(570);
                points.position.z+=200;
                points.position.x-=150;
                points.name="horse.pcd";
                scene.add(points);       
                points.material.color=new THREE.Color(0xab1029);    
                const isRotation={bool:false} ;
                const gui = new GUI();  //UI，交互控制界面
                gui.domElement.style.position='absolute';
                gui.domElement.style.top='0';
                gui.domElement.style.left='0';
                gui.add( points.material, 'size',0.01,10 ).name('点大小');
                gui.addColor( points.material,'color').name('点颜色');
                gui.add(isRotation,'bool').name('旋转');
                gui.open();
                function animate(){
                requestAnimationFrame(animate);
                renderer.render(scene,camera);
                if(isRotation.bool)
                points.geometry.rotateY(-0.01);
            }
            animate();
            //render();
            });
            window.addEventListener('resize',onWindowResize);
            //窗口大小改变时重新渲染
            function onWindowResize() {
                camera.aspect=window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth,window.innerHeight);
                renderer.render( scene, camera );
            }


            function render() {

            renderer.render( scene, camera );

            }
            
        </script>
    </body>
</html>
```

---

# 黄一诺

```html

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PLY Point Cloud</title>
</head>
<style>
    body{
        /* body元素的外边距设置为0。外边距是元素与其周围元素之间的空间 */
        margin: 0;
        /* body元素的内边距设置为0。内边距是元素内容与元素边界之间的空间 */
        padding: 0;
        /* 隐藏body元素的溢出内容。如果页面的内容超出body元素的框，将被隐藏而不显示滚动条。 */
        overflow: hidden;
        /* 将body元素中的文本内容水平居中对齐。 */
        text-align: center;
        /* 指定flex项目在交叉轴上的对齐方式。然而，body是一个块级元素，通常不使用align-items。可能是一个错误或多余的属性，除非上下文中有其他相关的CSS规则 */
        align-items: center;
    }
    /* #webgl：这是一个 CSS 选择器，表示选择具有 id 为 "webgl" 的 HTML 元素。在HTML中，一个元素的 id 属性是唯一的，因此使用 # 符号后跟 id 的值，可以选择特定的元素 */
    #webgl{
        /* 将选中的 #webgl 元素的宽度设置为父容器的100%。这意味着该元素将占据其父容器的整个宽度，从而填充可用空间。 */
        width: 100%;
    }
    /* 创建一个相对定位的元素，具有一些内外边距，圆角边框，粗体文本，颜色设置以及一个带有阴影效果的外观。它的样式使得这个元素在页面上相对窄，且具有一些视觉上的装饰效果。 */
    #contain{
        /* 将元素的定位方式设置为相对定位。这意味着元素将相对于其正常位置进行偏移，但不会脱离文档流 */
        position: relative;
        /* 设置元素的内边距。在这里，上下边距为5像素，左右边距为0像素。 */
        padding: 5px 0px;
        /* 设置元素的底部外边距为20像素。这将在元素的下方留出一些空间 */
        margin-bottom: 20px;
        /* 将元素的宽度设置为其包含块宽度的20%。这使得元素相对于其包含块相对较窄。 */
        width: 20%;
        /* 相对于包含块，将元素的左边缘向右偏移40%。这样可以在水平方向上调整元素的位置。 */
        left: 40%;
        /* 将文本的字重设置为粗体 */
        font-weight: bold;
        /* 设置元素的边框半径为5像素，使其拥有圆角 */
        border-radius: 5px;
        /* 设置文本颜色为RGB值 (50, 0, 106)。这是一种深紫色。 */
        color: rgb(50, 0, 106);
        /* 为元素添加一个阴影效果。这个阴影是一个10像素偏移，没有水平或垂直的偏移，模糊半径为10像素，颜色为半透明的黑色。*/
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
    }
    /* 鼠标hover在infocontain上显示具体内容 */
    #infocontain{
        position: absolute;
        top: 20px;
        left: 50px;
        width: 100px;
        height: 30px;
        /* 设置元素的边框半径为5像素，使其拥有圆角 */
        border-radius: 5px;
        /* 设置元素的背景颜色为RGB值 (44, 1, 76)。这是一种深紫色。 */
        background-color: rgb(44, 1, 76);
        color: white;
        /* 文本的字体大小为15像素 */
        font-size: 15px;
        /* 文本水平居中对齐 */
        text-align: center;
        /* 元素的行高为0像素。这可能是为了确保文本垂直居中，因为高度只有30像素，而行高为0，意味着文本将垂直居中在这个相对较小的容器内 */
        line-height: 0px;
    }
    /* 使用了伪类 :hover，它表示鼠标悬停在 #infocontain 元素上时应用的样式。*/
    /* #infocontain:hover：这表示当鼠标悬停在 #infocontain 元素上时应用的样式 */
    /* #useinfo：这是一个子选择器，表示选择 #infocontain 元素下的具有 id 为 "useinfo" 的子元素。 */
    #infocontain:hover #useinfo{
        /* 将 #useinfo 元素的显示属性设置为块级元素。这样，当鼠标悬停在 #infocontain 元素上时，#useinfo 元素将变为可见。 */
        display: block;
        /* 为悬停效果添加了一个动画，持续时间为0.5秒。这个 all 值表示所有 CSS 属性都将受到动画的影响。这可能是为了使显示或隐藏的过渡看起来更平滑 */
        animation: 0.5s all;
    }
    /* 为 #useinfo 元素创建一个相对定位、半透明、带有圆角、居中显示的弹出框。在默认状态下，它是不可见的，但在鼠标悬停在 #infocontain 元素上时，通过设置 display: block;
     以及添加了一个悬停效果的动画，它将变得可见 */
    #useinfo{
        position: relative;
        display: none;
        width: 200px;
        background-color: rgba(14, 0, 19, 0.8);
        top: 200%;
        border-radius: 10px;
        left: 80px;
        /* 通过 transform 属性，将元素向左和向上移动，使其相对于其自身的中心点居中。这是通过使用百分比单位相对于元素的宽度和高度。 */
        transform: translate(-50%,-50%);
        text-align: left;
        z-index: 1;
        line-height: 18px;
        padding: 20px;
    }
</style>
<body>
    <h2>Point Cloud Display</h2>
    <div id="contain">
        <!-- 段落元素，显示文本 "总三维点数量:"，后面跟着一个用于显示信息的 <span> 元素，该 <span> 元素具有 class 为 "infos"。 -->
        <p>总三维点数量:<span class="infos"></span></p>
        <p>在正负6范围内的点数为:<span class="infos"></span></p>
    </div>
    <!-- 这是一个具有 id 为 "infocontain" 的 <div> 元素，用于包装关于使用说明的内容。 -->
    <div id="infocontain">
        <p>使用说明</p>
        <!-- 具有 id 为 "useinfo" 的 <div> 元素，包含更详细的使用说明内容。 -->
        <div id="useinfo">
            <!-- 这些都只是显示一个文本说明 -->
        <p>1. 鼠标左键拖动旋转</p>
        <p>2. 鼠标滚轮缩放</p>
        <p>3. 鼠标右键拖动平移</p>
        <p>4. 点击右上角按钮可以显示光源方向，网格，坐标轴</p>
        <p>5. 点击右上角按钮可以控制点的大小，旋转速度，相机位置</p>
        </div>
    </div>
    <div id="webgl" style="position: absolute;"></div>
</body>
<script src="./js/three.js"></script>
<script src="./js/OrbitControls.js"></script>
<script src="./js/PLYLoader.js"></script>
<script src="./js/dat.gui.min.js"></script>
<script>
     const scene = new THREE.Scene();
    //  创建点云材质的,设置了点云的颜色和大小
    const pointmaterial = new THREE.PointsMaterial({
        color: 0x00fff0,
        size: 0.03
    });
    // 控制器的状态或参数。看起来像是用于控制某个三维场景或对象的一些属性
    controler = {
            z: 3.14,
            isRotate: true,
            size: 0.05,
            speed:1,
            showLight:true,
            showGrid:true,//显示网格
            showAxis:true,//显示坐标轴
        };
    
    // 添加坐标轴
    var axesHelper = new THREE.AxisHelper(7);
    // 添加平行光
    var light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(10, 10, 10);
    scene.add(light);
    // 显示光源
    var helper = new THREE.DirectionalLightHelper(light, 5);
    //显示网格，xyz平面
    var gridHelper = new THREE.GridHelper(10, 10);

    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 18);
    camera.lookAt(0, 0, 0);

    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x000000);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.antialias = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('webgl').appendChild(renderer.domElement);

    var loader = new THREE.PLYLoader();
    // 加载Ply文件
    loader.load('./images/p.ply', function (geometry) {
        // load ply时把点云的信息储存到geometry中了
        var pointCount = geometry.attributes.position.count;
        console.log('点云中的三维点数量：' + pointCount);
        // 定义范围，例如一个立方体范围
        var range = new THREE.Box3(
        new THREE.Vector3(-6, -6, -6), // 最小坐标
        new THREE.Vector3(6, 6, 6)    // 最大坐标
        );

        // 初始化计数器
        var pointsInRange = 0;

        // 遍历点云中的每个点
        for (var i = 0; i < geometry.attributes.position.count; i++) {
        var pointPosition = new THREE.Vector3().fromBufferAttribute(geometry.attributes.position, i);

        // 检查点是否在范围内
        if (range.containsPoint(pointPosition)) {
            pointsInRange++;
        }
        }
        console.log('在指定范围内的点的数量：' + pointsInRange);
        document.getElementsByClassName('infos')[0].innerHTML = pointCount;
        document.getElementsByClassName('infos')[1].innerHTML = pointsInRange; 

        //var colors = geometry.attributes.color.array;
        var pointmaterial = new THREE.PointsMaterial({ 
            size: 0.03, 
            vertexColors: THREE.VertexColors 
        });

        // 创建点云对象
        var pointCloud = new THREE.Points(geometry, pointmaterial);
        // pointCloud.geometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));

        // 添加点云到场景
        scene.add(pointCloud);

        var gui = new dat.GUI();
        gui.add(controler, 'z', -Math.PI,2* Math.PI).name('camera-Z');
        gui.add(controler, 'isRotate').name('是否旋转');
        gui.add(controler, 'size',0.01, 0.1).name('点的大小').onChange(function(value){
            pointCloud.material.size = value;
        });
        gui.add(controler, 'speed', 0, 2).name('旋转速度').onChange(function(value){
            controler.speed = value;
        });
        gui.add(controler, 'showLight').name('显示光源方向');
        gui.add(controler, 'showGrid').name('显示网格');
        gui.add(controler, 'showAxis').name('显示坐标轴');
        function virsualize(){
            if(controler.showLight){
                scene.add(helper);
            }else{
                scene.remove(helper);
            }
            if(controler.showGrid){
                scene.add(gridHelper);
            }else{
                scene.remove(gridHelper);
            }
            if(controler.showAxis){
                scene.add(axesHelper);
            }else{
                scene.remove(axesHelper);
            }
        }
        function rotate(){
            if(controler.isRotate){
                pointCloud.rotation.y += 0.01*controler.speed;
            }
        }

        // 设置相机位置
        // 设置交互性以允许旋转相机    

        var controls = new THREE.OrbitControls(camera, renderer.domElement);
        // 渲染场景
        var animate = function () {
            requestAnimationFrame(animate);
            camera.rotation.z = controler.z;
            rotate();
            virsualize();
            renderer.render(scene, camera);
        };

        animate();
    });
    
</script>
</html>

```

