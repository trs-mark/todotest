//stuff written in comments are your clues so pay attention
var tasksCollection = Alloy.createCollection('tasks');
var table = tasksCollection.config.adapter.collection_name;

function init(){
	setAddTaskButton();
	$.index.open();
	
	//1. put code here to show the "to do" list
	getDone();
}

function setAddTaskButton(){
	var btnAddTask = Titanium.UI.createButton({
		title: 'Add Task',
		top : 10,
		width : 10,
	});
button.addEventListener('btnAddTask',fucntion(e));
	{
		Titanium.API.info("added");
	}
	//2. add an event listener for the btnAddTask button for the add task function
	$.win1.setLeftNavButton(btnAddTask);
	
	//3. assign btnAddTask as the right nav button of win1 window
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
				//4. add code here to save the task
				getToDo();
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
		//5. add an event listener for the row for the click event
		
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
			//6. something is missing here, what is it?
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
		//7. add something here so that the left button is "Mark as done" and the right button is "Cancel"
		cancel: 1
	});
	dialog.addEventListener('click',function(dialog_evt){
		if(dialog_evt.index === 0){
			setItemAsDone(row_evt.source.c_id);
			//8. add a function call here to refresh the "to do" table list
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
			//9. add a function call here to refresh the done table list
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
		//10. declare a variable named "model" here from the first item of the tasksCollection
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
