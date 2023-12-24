# 图形学第三次实验

2022090902007 | 李艳超

## 实现功能

满足PPT上的实验要求：

•下载并配置相关平台

​	•https://github.com/twpride/three.cad

​	•https://github.com/TheGerd1/WebCAD 

​	•https://github.com/xibyte/jsketcher 

​	•Web-cad.org

•修改相关界面，实现自己的CAD服务

•选择一个零件进行设计（尽量涉及多个工具）

•详细了解每个设计功能

•保存相应的数据并提供信息展示

## 个人想法

由于参考了几位同学的代码后发现流程甚是清晰，整体颇为简单，并未真正上代码量，所以直接修代码了，没有进行长期的准备和学习，下面简单梳理：、

首先HTML文档主要是为了调用其他库文件，定义图标、颜色、画布等后就是调库，具体来说重要的有下面几个

```html
    <!-- 指向一个Web应用清单文件，通常包含关于Web应用（如名称、图标等）的信息。 -->
    <link rel="manifest" href="js/manifest.json" />
    <!-- 链接到一个外部CSS文件，用于样式化页面。 -->
    <link rel="stylesheet" href="css/app.css">

	<!-- 包含此网页所需的脚本和功能。 -->
    <script src="js/app.bundle.js"></script>
    <script src="js/scene.bundle.js"></script>
    <script src="js/gunzip.min.js"></script>
```

接下来是重头戏app.bundle.js文件的修改：

汉化很散，需要检查多个显示代码以筛选，重复性工作，没有意义

重头戏是CAD零件，在网页自己画一个CAD零件后保存为json格式，转换为gz格式满足内在需求后即可匹配

-----

个人来看本次实验主要是修改和适配https://github.com/twpride/three.cad到本地，即js文件的适配，而难点在于汉化界面和零件获取两部分

### 汉化界面：

该部分主要在于浏览和分析app.bundle.js文件，一方面是文件代码量颇大，另一方面是需要辨别具体添加的汉语位置，没有什么技术含量，就是繁琐

### 零件获取

首先是怎么画一个零件，CAD真的很头痛，这部分绊住了时间，尝试找同学的外援和网上下载，但两者都不行，同学的零件没有自己画而是直接拿的原来的耳机支架，网上下载的很多格式比如STL、js等并不好转为json格式，最后还是硬着头皮仿制了一个简单的零件；

json->gz文件格式的转换也需要注意，网上方式参差不齐，这里是用python专门来转，感谢GPT4，直接跑通了

## 文件说明

上传的文件即是整个工作区，LiYanchao_Exp3和js/app.bundle.js即是最终修改后的代码，[myExample.json.gz](https://github.com/LiZaiyuan0619/Exps-of-CV/blob/main/Exp3/myExample.json.gz)即是零件

