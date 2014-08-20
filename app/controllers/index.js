var tasksCollection = Alloy.createCollection('tasks');
var table = tasksCollection.config.adapter.collection_name;

function init(){
	setAddTaskButton();
	$.index.open();
	getToDo();
	getDone();
}

function setAddTaskButton(){
	var btnAddTask = Titanium.UI.createButton({
		title: 'Add Task'
	});
	btnAddTask.addEventListener('click',addTask);
	$.win1.rightNavButton = btnAddTask;
}

function addTask(){
	var dialog = Ti.UI.createAlertDialog({
		title		: 'Type your task here.',
		style		: Ti.UI.iPhone.AlertDialogStyle.PLAIN_TEXT_INPUT,
		buttonNames	: ['Ok', 'Cancel'],
		cancel		: 1
	});
	dialog.addEventListener('click', function(dialog_evt) {
		if(dialog_evt.index === 0){
			if(dialog_evt.text.trim().length > 0){
				saveTask(dialog_evt.text.trim());
				getToDo();
				//Titanium.UI.createAlertDialog({title:'Task added',message:'Task added successfully'}).show();
			}else{
				Titanium.UI.createAlertDialog({title:'Task not added',message:'Task cannot be empty.'}).show();
			}
		}
	});
	dialog.show();
}

function saveTask(task){
	tasksCollection = Alloy.Collections.instance('tasks');
	tasksCollection.fetch();
	
	var taskModel = Alloy.createModel('tasks',{
		'title'		: task,
		'status'	: 0
	});
	
	tasksCollection.add(taskModel);
	taskModel.save();
}

function getToDo(){
	tasksCollection = Alloy.Collections.instance('tasks');
	
	var sql = 'SELECT * FROM '+table+ ' WHERE status=0';
	tasksCollection.fetch({ query: sql});
	
	var tasksArr = [];
	for(var i=0; i<tasksCollection.length; i++){
		
		var task = tasksCollection.at(i);
		
		var id = task.get('id');
		var title = task.get('title');
		var status = task.get('status');
		
		var row = Titanium.UI.createTableViewRow({
			'title'		: title,
			'c_id'		: id,
			'hasChild'	: true
		});
		row.addEventListener('click',todoRowFunction);
		
		tasksArr.push(row);
	}
	
	$.tblToDo.setData(tasksArr);
}

function getDone(){
	tasksCollection = Alloy.Collections.instance('tasks');
	
	var sql = 'SELECT * FROM '+table+ ' WHERE status=1';
	tasksCollection.fetch({ query: sql});
	
	var tasksArr = [];
	for(var i=0; i<tasksCollection.length; i++){
		
		var task = tasksCollection.at(i);
		
		var id = task.get('id');
		var title = task.get('title');
		var status = task.get('status');
		
		var row = Titanium.UI.createTableViewRow({
			'title'		: title,
			'c_id'		: id,
			'hasCheck'	: true
		});
		row.addEventListener('click',doneRowFunction);
		
		tasksArr.push(row);
	}
	
	$.tblDone.setData(tasksArr);
}

function todoRowFunction(row_evt){
	var dialog = Titanium.UI.createAlertDialog({
		title: row_evt.source.title,
		message: 'What do you want to do?',
		buttonNames: ['Mark As Done','Cancel'],
		cancel: 1
	});
	dialog.addEventListener('click',function(dialog_evt){
		if(dialog_evt.index === 0){
			setItemAsDone(row_evt.source.c_id);
			getToDo();
			getDone();
		}
	});
	dialog.show();
	
	return false;
}

function doneRowFunction(row_evt){
	var dialog = Titanium.UI.createAlertDialog({
		title: row_evt.source.title,
		message: 'What do you want to do?',
		buttonNames: ['Delete','Cancel'],
		cancel: 1
	});
	dialog.addEventListener('click',function(dialog_evt){
		if(dialog_evt.index === 0){
			removeItem(row_evt.source.c_id);
			getDone();
		}
	});
	dialog.show();
	
	return false;
}

function setItemAsDone(id){
	tasksCollection = Alloy.Collections.instance('tasks');
	
	var sql = 'SELECT * FROM '+table+ ' WHERE id='+id;
	tasksCollection.fetch({ query: sql});
	
	if(tasksCollection.length>0){
		var model = tasksCollection.at(0);
		model.set({
			'status': 1
		}).save();
	}
	
	return false;
}

function removeItem(id){
	tasksCollection = Alloy.Collections.instance('tasks');
	
	var sql = 'SELECT * FROM '+table+ ' WHERE id='+id;
	tasksCollection.fetch({ query: sql});
	
	if(tasksCollection.length>0){
		var model = tasksCollection.at(0);
		model.destroy();
	}
	
	return false;
}

init();
