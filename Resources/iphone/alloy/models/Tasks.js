var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

exports.definition = {
    config: {
        adapter: {
            type: "sql",
            collection_name: "tasks",
            db_file: "/todotest.sqlite",
            db_name: "todotest",
            idAttribute: "id",
            remoteBackup: false
        }
    }
};

model = Alloy.M("tasks", exports.definition, []);

collection = Alloy.C("tasks", exports.definition, model);

exports.Model = model;

exports.Collection = collection;