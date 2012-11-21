Tiny
====

javascript template engine
 一个简单前端模版引擎 Jot.Tiny
 一个基于smarty 模板的语法
  作者：蜗眼 <iceet@uoeye.com>
 
 模版例子：
 渲染数据：{title:'asfd',data:[{link:'//www.baidu.com',clink:1,name:'title'}]}
 模版结构：
 <dl>
	 <dt>｛/$title/｝</dt>
	 {/foreach $data as $item/}
		<dd>
		{/if $item.link/}
			{/plugin baidu $item.c|2|3/}
		{/elseif $item.clink == 2 /}
		{//if/}
		</dd>
	 {//foreach/}
 </dl>
 支持语法:
	
	//注意 对原生语法的支持
	1、foreach 语法  foreach $data as $item || foreach ($data as $item)
	2、if-else 语法  if $data == 2 || if ($data == 2) || elseif $data == 1 || else || /if 
	3、plugin 语法 plugin baidu $dasdf:12 | $data|baidu:23,$asdf,1 注意这里的管道（‘|’）语法 将前面的输出应用到后面的插件的输入 分好后面是传入参数
	4、赋值语法，定义变量 {/var $baidu = $asdf /}  || {/assign $baidu=eeeee/} ||  {/$baidu=233/}
	
	5、函数定义function 和插件类似，只是作用域在该模版下。
	{/function name=menu level=0/}
	  <ul class="level{/$level/}">
	  {/foreach $data as $entry/}
		{/if is_array($entry)/}
		  <li>{/$entry.key/}</li>
		  {/call name=menu data=$entry level=$level+1/}
		{/else/}
		  <li>{/$entry/}</li>
		{//if/}
	  {//foreach/}
	  </ul>
	{//function/}
	
	6、函数调用call 调用通过function关键字定义的函数 level 表示调用层级,这种可以解决那个循环嵌套问题
	{/call name=menu data=$menu level=$level+1/}
	
	//预定义常量
	1、$$index 在foreach语法中可以访问当前循环的索引下标,调用方法有$index,$index[1]//在多重循环里面调用
	2、$$item  在foreach语法中访问当前项 $$item[1] //在多重循环中有用
	3、$$arguments 访问传入参数arguments对象，在做插件的时候有用 只一个数组	
