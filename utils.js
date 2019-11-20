(function (){
	alert("测试");
}());
// 获得类型方法
function type(target){
	var template = {
		"[object Array]":"array",
		"[object Object]":"object",
		"[object Number]":"number-object",
		"[object Boolean]":"boolean-object",
		"[object String]":"string-object"
	}
	if (target === null){
		return "null";
	}else if (typeof(target)=="object"){
		// 包装类
		var str = Object.prototype.toString.call(target);
		return template[str];
	}else {
		// 数组，对象，函数
		return typeof(target);
	}
}

// 数组去重方法
Array.prototype.unique = function(){
	var temp = {},
		arr = [],
		len = this.length;
	for(var i=0;i<len;i++){
		if (!temp[this[i]]){ // 如果没有出现过，就为undefined，而if(undefined)为false，所以这里弄成if(!undefinded)
			temp[this[i]] = "abc"; // 可以随意赋值，只要占了空间就好
			arr.push(this[i]);
		}
	}
	return arr;
}

// 获得指定兄弟结点方法（考虑到兼容问题）
/*
	@parm: e 为指定的元素，n为第几个兄弟元素，+代表后面的兄弟元素，-代表前面的兄弟元素
	@return: 返回获得的兄弟元素
*/
function retSibling(e, n) {
	while(e && n){ // 当e为null或者n为0的时候退出循环
		if (n>0){
			if (e.nextElementSibling){
				e = e.nextElementSibling;
			}else {
				// 兼容ie
				for (e = e.nextSibling; e && e.nodeType != 1 ; e = e.nextSibling );	
			}
			n--;
		}else {
			if (e.previousElementSibling){
				e = e.previousElementSibling;
			}else {
				// 兼容ie
				for (e = e.previousSibling; e && e.nodeType != 1 ; e = e.previousSibling );				
			}
			n++;
		}
	}
	return e;
}


// 获取指定元素的第n层父亲结点
/*
	@parm: e为指定的元素, n 为第n层父亲元素
	@return: 返回第n层父亲元素
*/
function retParent(e, n){
	while (e && n){
		e = e.parentElement;
		n--;
	}
	return e;
}


// 获取指定元素的子元素
Element.prototype.mychildren = function(){
	var child = this.childNodes;
	var len = child.length;
	var arr = [];
	for (var i=0;i<len;i++){
		if(child[i].nodeType == 1){
			arr.push(child[i]);
		}
	}
	return arr;
}

// 判断是否还有子元素
Element.prototype.haschildren = function(){
	var child = this.childNodes;
	var len = child.length;
	var arr = [];
	for (var i=0;i<len;i++){
		if(child[i].nodeType == 1){
			return true;
		}
	}
	return false;
}

// 封装类似insertBefore方法insertAfter：将指定元素插入到参照对象的后面
/*
	@parm: targetNode: 要插入的元素
			afterNode: 插入对象（参照物）
*/
Element.prototype.insertAfter = function (targetNode, afterNode){
	var beforeNode;
	if (afterNode.nextElementSibling){
		beforeNode = afterNode.nextElementSibling;
		if (beforeNode != null){
			this.insertBefore(targetNode, beforeNode);
		}else {
			this.appendChild(targetNode);
		}
	}else {
		// 兼容ie
		for (beforeNode = afterNode.nextSibling; beforeNode.nodeType != 1 ; beforeNode = beforeNode.nextSibling ){
			if (beforeNode==null){
				this.appendChild(targetNode);
				return;
			}
		}
		this.insertBefore(targetNode, beforeNode);	
	}
}

/*
	获取滚动条的位置
*/
function getSrollOffSet(){
	if (window.pageXOffset){
		return {
			x : window.pageXOffset,
			y : window.pageYOffset
		}
	}else {
		return {
			// 兼容ie8（包括ie8）以下的浏览器
			x : document.body.scrollLeft + document.documentElement.scrollLeft,
			y : document.body.scrollTop + document.documentElement.scrollTop
		}
	}
}

/*
	获得此刻窗口的大小
*/
function getViewPortOffset(){
	if (window.innerWidth){
		return {
			w : window.innerWidth,
			h : window.innerHeight
		}
	}else {
		// 兼容ie8（包括ie8）以上版本
		if (document.compatMode){
			// 怪异模式
			return {
				w : document.body.clientWidth,
				h : document.body.clientHeight
			}
		}else {
			// 标准模式
			return {
				w : document.documentElement.clientWidth,
				h : document.documentElement.clientHeight
			}
		}
	}
}

// 获取样式
/*
	@parm: elem：要获取样式的对象
		prop： 要获取的样式(要求字符串类型)
*/
function getStyle(elem, prop){
	if (window.getComputedStyle){
		return window.getComputedStyle(elem,null)[prop];
	}else {
		return elem.currentStyle[prop];
	}
}

// 事件绑定函数
/*
	@parm: elem: 要绑定事件的元素
		   type: 绑定的事件类型
		   handle: 绑定的事件处理函数
*/
function addEvent(elem, type, handle){
	if (elem.addEventListener){
		elem.addEventListener(type, handle, false);
	}else if (elem.attachEvent){
		// ie 浏览器
		elem.attachEvent('on' + type, function(){
			handle.call(elem);
		})
	}else {
		// 兼容性最好的方法
		elem['on' + type] = handle;
	}
}

// 事件绑定取消函数
/*
	@parm: elem:  要取消绑定的元素
			type: 取消绑定的事件类型
			handle: 取消绑定的处理函数(必须与绑定的函数相同)
*/
function removeEvent(elem, type, handle){
	if (elem.removeEventListener){
		elem.removeEventListener(type,handle,false);
	}else if (elem.detachEvent){
		// ie 浏览器
		elem.detachEvent('on'+type, function(){
			handle.call(elem);
		})
	}else {
		elem['on' + type] = null;
	}
}



// 取消冒泡
/*
	@parm: event 事件对象
*/
function stopBubble(event){
	if (event.stopPropagation){
		// w3school 推荐的方法,ie8包括ie8不兼容
		event.stopPropagation();
	}else {
		// ie独有的方法（存在争议）
		event.cancelBubble = true;
	}
}


//	取消元素的默认事件（取消默认事件的方法很多，这里只封装两种）
/*
	@parm: event 事件对象
*/
function cancelHandler(event){
	if (event.preventDefault){
		// w3 推荐，ie8包括ie8不兼容
		event.preventDefault();
	}else {
		// 兼容IE
		event.returnValue = false;
	}
}

// 获得事件源对象
/*
	这里推荐编写以下代码
	xx.onclick = function(e){
		var event = e || window.event; // 后者兼容ie
		var target = event.target || event.srcElement; //前者只有火狐有，后者只有ie有，两者谷歌都有
		......

	}
*/

// 元素拖拽功能(要求元素的left，top属性要生效，才可用)
/*
	@parm: elem:  要设置拖拽功能的元素
*/
function drag(elem){
	var disX,
		disY;
	addEvent(elem, "mousedown", function(e){
		var event = e || window.event;
		/*if(isNaN(parseInt(getStyle(elem,'left')))||isNaN(parseInt(getStyle(elem,'top')))){
			// 如果这个left，top属性生效，则不需要这个if语句，并且这个if语句只是为了不报错。
			// 如果left，top属性生效，则元素无法移动
			disX = event.clientX;
			disY = event.clientY;
		}else{*/
			disX = event.clientX - parseInt(getStyle(elem,'left'));
			disY = event.clientY - parseInt(getStyle(elem,'top'));			
		//}
		addEvent(document,'mousemove',mouseMove);
		addEvent(document,"mouseup",mouseUp);
		stopBubble(event); // 取消冒泡
		cancelHandler(event); // 取消元素默认事件
	});
	function mouseMove(e){
		// 拖拽功能
		var event = e || window.event;
		elem.style.left = event.clientX - disX + "px";
		elem.style.top = event.clientY - disY + "px";
	}
	function mouseUp(e){
		var event = e || window.event;
		removeEvent(document,"mousemove",mouseMove);
		removeEvent(document,"mouseup",mouseUp);	
	}
}


//	异步处理函数
/*
	@parm: url： 要引入的js代码
		   callback: 要执行的方法（传入的是方法的字符串，如 "test()"）
*/

function loadScript(url,callback){
	var script = document.createElement('script');
	script.type = "text/javascript";
	
	if (script.readyState){
		script.onreadyStataechange = function(){
			// IE
			if (script,readyState == "complete" || script.readyState == "load"){
				eval(callback);
			}
		}
	}else {
		script.onload = function(){
			eval(callback);
		}
	}
	script.url = url;
	document.head.appendChild(script);
}
