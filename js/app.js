(function (window,Vue) {
	   const todos = JSON.parse(window.localStorage.getItem('todos')) || []
 	Vue.directive("focus",{
            inserted(element){
				// 操作dom聚焦
				element.focus()
			}
		})
		// 钩子函数   钩子一般声明周期钩子  满足一定体检就会调用 事件在这特点函数
		// inserted  插入时候，都能接收el节点，可以操作父元素只调用一次，以后不在调了
		// update  指令的所作母版发生改变时，发生update 和componentUpdated  update修改之前
		// componentUpdated  修改之后的dom
		// bind  拿不到该指令的父元素 ，一上来调用一次可以做一些初始化
		// upbind  当指令卸载的时候，才调用
	const app = new Vue({
		el: "#todoapp",
		data: {
			todos,  //任务列表  	// 
			inputText: "",//用来绑定获取数据添加文本框数据
			currentEdit: null, //用来判断任务项是否获取editing样式
			filterTodos: [],  
			backTitle: "",//编辑之前的任务项
			hash:''
		},
	
		methods: {
			// 添in加任务
			addTodo(e) {
				const { inputText, todos } = this
				// 判断非空校验
				if (inputText.trim().length === 0) {
					return
				}
				const lastItem = todos[todos.length - 1]
				const id = lastItem ? lastItem.id + 1 : 1
				// 添加数组中
				todos.push({
					id,
					title: inputText,
					done: false
				})
				// 清空文本框
				this.inputText = ""
			},
			removeTode(item) {
				// findIndex  会遍历数组，对数组的每一项调用你传递的回调函数
				// 返回索引遍历结果找不到返回-1
			  const index=this.todos.findIndex(function(t){
                   return  t.id ===item.id
				})
			
			},
			// 获取编辑样式
			getEditing(item) {
				// 将currentEdit  编织为
				this.currentEdit = item
				// 用以取消编辑时候，任务项的title会原始状态
				this.backTitle = item.title
			},
			// 会出或者失去焦点保存编辑
			savaEdit(item, index) {
				if (item.title.trim().length === 0) {
					this.todos.splice(index, 1)
				} else {
					this.currentEdit = null
				}

			},
			//   esc取消编辑
			cancelEdit() {

				this.currentEdit.title = this.backTitle
				// 取消编辑去除编辑样式
				this.currentEdit = null
			},
			crearAllDone() {
				console.log(123)
				const todos = this.todos
				for (let i = 0; i < todos.length; i++) {
					if (todos[i].done === true) {
						todos.splice(i, 1)
						i--
					}
				}
			}
		},
		computed: {
			getRamaing() {
				return this.todos.filter(item => !item.done).length
			},
			toggleAllStat: {
				get: function () {
					const toggleAll = this.todos.every(function (item) {
						return item.done 
					})
					return toggleAll
				},
				set: function (val) {
					this.todos.forEach(function (item) {
						item.done = val
					})
				}
			}
		},
		watch: {
			todos: {
				handler: function(){
					window.localStorage.setItem('todos',JSON.stringify(this.todos))
					// window.localStorage.removeItem
					window.onhashchange()
				},
				deep:true
			}
		},
		directives:{
			"todos-focus": {
				update(el,binding){
                   if(binding.value === true){
					   el.focus()
				   }
				}
			}
		}
	})
	window.app = app
	window.onhashchange = function () {
		const {hash} = window.location
		app.hash = hash	
		switch(hash){
			case "":
			  app.filterTodos = app.todos
			  break
			case "#/":
			  app.filterTodos = app.todos
			  break
			case "#/active":
			  app.filterTodos = app.todos.filter(function(item){
				  return  item.done === false
			  })
			  break
		    case "#/completed": 
			  app.filterTodos = app.todos.filter(function(item){
				  return  item.done  === true
			  })
			  break
			//   default:
			//      app.hash = "#/"
			//      app.app.filterTodos = app.todos
            //      break
		}
	}
	window.onhashchange()
	
	})(window,Vue);
