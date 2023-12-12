# Summary

## Huang

### html

head部分就是导入各种文件，设置网页标题和、编码方式和狂高部分

style部分还是定义一堆CSS样式规则，定义网页中特定元素的布局和外观

​	body部分定义整个文档主体部分内容

​	ID为loading元素

​	class为fileupload的元素

​	鼠标悬停在class为fileupload的元素上时

script部分单独导入了额外的代码主体部分内容，留给js部分分析

body部分刚开始定义带有 `id="loading"` 的 `<div>` 元素，显示的文本为“正在加载……”

这个元素将以绝对定位的方式出现在页面上，覆盖整个视图区域，背景为半透明黑色，并且文本居中显示。这通常用于显示加载指示器，表明页面或某部分内容正在加载中。

**`<input type="file" id="fileInput" style="display: none;" />`**:

- 这是一个文件上传输入框，用于选择文件。它有 `type="file"` 属性，使用户可以选择文件上传。
- `id="fileInput"` 使这个元素可以通过JavaScript或CSS进行特定的操作或样式应用。
- `style="display: none;"` 这个样式使得文件输入框在页面上不可见。这通常用于自定义文件上传按钮的外观，而隐藏默认的HTML文件上传控件。

**`<div class="fileupload" onclick="uploadFiles()">`**

- 这是一个带有 `class="fileupload"` 的 `<div>` 元素，显示的文本为“上传PCD文件”。
- 根据您之前的CSS样式，这个元素将以绝对定位的方式出现在页面上，具有特定的大小、样式和交互效果（例如，鼠标悬停时的颜色变化）。
- `onclick="uploadFiles()"` 表示当用户点击这个元素时，将执行 `uploadFiles()` 这个JavaScript函数。这个函数可能用于触发文件上传的动作，比如打开隐藏的文件输入框让用户选择文件。

### js

刚开始就是初始化：创建场景  相机  点云容器  控制器  渲染器  场景颜色  浏览器视图大小  视图范围（这里是定义了五个视图：分别展示原始点云  最小分割  异常值过滤  关键点提取  体素网格

开始正文部分：初始化  渲染  配参  重新加载  取PCL.PointCloud数据到THREE.BufferGeometry  加载点云场景  初始GUI加载  各个GUI  各个函数  文件上传  多个文件处理

init函数设置渲染器大小，添加渲染器，初始化五个场景、相机和控制器

渲染分为两种：render函数对五个长江启用裁剪视口，然后递归；animate函数递归调用自身然后render就行

配参部分设置了PCD加载器和各种点云类型，并且设置了各种初始化处理参数

重新加载部分先PCL初始化，使用高效浏览器计算文件，显示加载，获取点云文件转换为ArrayBuffer再转换为点云数据，接下来就是对点云进行不同的点云处理，最后隐藏加载提示

取PCL.PointCloud数据到THREE.BufferGeometry：读取PCL（Point Cloud Library）中的点云数据，并将其转换为Three.js库中的 `THREE.BufferGeometry` 对象。这样的转换使得点云数据可以在WebGL环境中被渲染。具体来说步骤如下：提取点数据，获取输俩个、位置、颜色信息，如果需要显示颜色信息就遍历点云中的每个点提取位置（x, y, z）和颜色（r, g, b），并将它们添加到 `position` 和 `color` 数组中，如果 `needColor` 为假，则只提取位置信息，接下来创建**`THREE.BufferGeometry`**和配合显示颜色的包含位置数据的属性

加载点云场景：根据当前的视图序号选择处理当前的点云，移除上次的点云并分别加载这次点云

初始GUI加载：原始GUI就是原始点云的GUI设置，这里是配合重新加载函数使用的

接下来是其他的各种GUI：具体来说添加相应项后分别使用相应的处理函数和加载场景函数

各个函数：这里是搭配上面的各种GUI函数一起使用的，其实还是相应的函数

文件上传：监听文件上传一旦处理多文件、创建文件对象和重新加载

各个函数的最后就是加载各种GUI、重新加载和渲染

## YangS

head部分还是设置网页标题、标签等样式，设置源文件等内容

接下来首先是body部分：

刚开始是设置各种导入库文件，设置变量、点云加载，设置窗口大小，处理参数，然后是主要的三个函数初始化、主函数、动画

初始化创建渲染器、每个窗口设置相机、场景、控制器和帧率检测器

主函数之前需要先定义几个函数：提取关键点、体素网格过滤、点云融合、临近点，这部分放到后面分析

主函数则是注解加载点云，转为PCL处理格式，然后就是调用上面的几个函数显示各个视窗的处理点云

动画函数循环遍历几个窗口，渲染，更新，递归调用自身

这里的渲染函数主要多了一个更新视窗尺寸，设置各个视窗的位置大小背景以匹配

“提取关键点、体素网格过滤、点云融合、临近点”这几个函数其实还是那几个步骤，不过这里是把GUI和初始设置塞到一块了

## YangC

head部分定义网页标题、编码方式、视窗宽高

body部分：初始定义相关变量，循环设置三个场景、相机，一个渲染器，三个材质、辅助相机和视锥体辅助器、网格坐标轴，然后是主函数

主函数部分初始化PCL库，获取PCD文件并转型，分别对这三个点云处理（涉及到三个不同函数，后面介绍），动画函数结束

滤波、关键点、最小切割三个处理函数：还是老样子的主要是那几个函数，多的是相机和场景等设置

接下来是设置更新窗口大小，设置三个GUI，分别设置三个GUI的具体内容

设置窗口大小的尺寸

渲染函数就是循环裁剪+渲染

## Bian

和YangC差不多的思路，比较明显的不同是设置了三个分贝的显示函数和主函数，GUI很少

## Wang

加载多个点云然后分别处理，很是周到，但不感兴趣，觉得就以Huang+YangS来做就行，时间紧迫不分析了