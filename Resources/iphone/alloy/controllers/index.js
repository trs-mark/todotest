function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function init() {
        setAddTaskButton();
        $.index.open();
        getToDo();
        getDone();
    }
    function setAddTaskButton() {
        var btnAddTask = Titanium.UI.createButton({
            title: "Add Task"
        });
        $.win1.setRightNavButton(btnAddTask);
    }
    function getToDo() {
        tasksCollection = Alloy.Collections.instance("tasks");
        var sql = "SELECT * FROM " + table + " WHERE status=0";
        tasksCollection.fetch({
            query: sql
        });
        var tasksArr = [];
        for (var i = 0; tasksCollection.length > i; i++) {
            var task = tasksCollection.at(i);
            var id = task.get("id");
            var title = task.get("title");
            task.get("status");
            var row = Titanium.UI.createTableViewRow({
                title: title,
                c_id: id,
                hasChild: true
            });
            row.addEventListener("click", todoRowFunction);
            tasksArr.push(row);
        }
        $.tblToDo.setData(tasksArr);
    }
    function getDone() {
        tasksCollection = Alloy.Collections.instance("tasks");
        var sql = "SELECT * FROM " + table + " WHERE status=1";
        tasksCollection.fetch({
            query: sql
        });
        var tasksArr = [];
        for (var i = 0; tasksCollection.length > i; i++) {
            var task = tasksCollection.at(i);
            task.get("id");
            var title = task.get("title");
            var status = task.get("status");
            var row = Titanium.UI.createTableViewRow({
                title: title,
                status: status,
                hasCheck: true
            });
            row.addEventListener("click", doneRowFunction);
            tasksArr.push(row);
        }
        $.tblDone.setData(tasksArr);
    }
    function todoRowFunction(row_evt) {
        var dialog = Titanium.UI.createAlertDialog({
            title: row_evt.source.title,
            message: "What do you want to do?",
            style: Ti.UI.iPhone.AlertDialogStyle.PLAIN_TEXT_INPUT,
            buttonNames: [ "Mark as Done", "Cancel" ],
            cancel: 1
        });
        dialog.addEventListener("click", function(dialog_evt) {
            if (0 === dialog_evt.index) {
                setItemAsDone(row_evt.source.c_id);
                getToDo();
                getDone();
            }
        });
        dialog.show();
        return false;
    }
    function doneRowFunction(row_evt) {
        var dialog = Titanium.UI.createAlertDialog({
            title: row_evt.source.title,
            message: "What do you want to do?",
            buttonNames: [ "Delete", "Cancel" ],
            cancel: 1
        });
        dialog.addEventListener("click", function(dialog_evt) {
            if (0 === dialog_evt.index) {
                removeItem(row_evt.source.c_id);
                getDone();
            }
        });
        dialog.show();
        return false;
    }
    function setItemAsDone(id) {
        tasksCollection = Alloy.Collections.instance("tasks");
        var sql = "SELECT * FROM " + table + " WHERE id=" + id;
        tasksCollection.fetch({
            query: sql
        });
        if (tasksCollection.length > 0) {
            var model = tasksCollection.at(0);
            model.set({
                status: 1
            }).save();
        }
        return false;
    }
    function removeItem(id) {
        tasksCollection = Alloy.Collections.instance("tasks");
        var sql = "SELECT * FROM " + table + " WHERE id=" + id;
        tasksCollection.fetch({
            query: sql
        });
        if (tasksCollection.length > 0) {
            var model = tasksCollection.at(0);
            model.destroy();
        }
        return false;
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    var __alloyId0 = [];
    $.__views.win1 = Ti.UI.createWindow({
        backgroundColor: "#fff",
        id: "win1",
        title: "To Do"
    });
    $.__views.tblToDo = Ti.UI.createTableView({
        id: "tblToDo"
    });
    $.__views.win1.add($.__views.tblToDo);
    $.__views.__alloyId1 = Ti.UI.createTab({
        window: $.__views.win1,
        title: "To Do",
        icon: "KS_nav_ui.png",
        id: "__alloyId1"
    });
    __alloyId0.push($.__views.__alloyId1);
    $.__views.win2 = Ti.UI.createWindow({
        backgroundColor: "#fff",
        id: "win2",
        title: "Done"
    });
    $.__views.tblDone = Ti.UI.createTableView({
        id: "tblDone"
    });
    $.__views.win2.add($.__views.tblDone);
    $.__views.__alloyId2 = Ti.UI.createTab({
        window: $.__views.win2,
        title: "Done",
        icon: "KS_nav_views.png",
        id: "__alloyId2"
    });
    __alloyId0.push($.__views.__alloyId2);
    $.__views.index = Ti.UI.createTabGroup({
        tabs: __alloyId0,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var tasksCollection = Alloy.createCollection("tasks");
    var table = tasksCollection.config.adapter.collection_name;
    init();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;