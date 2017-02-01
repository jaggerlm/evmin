MM.Command.Edit = Object.create(MM.Command, {
	label: {value: "Edit item"},
	keys: {value: [
		{keyCode: 32},
		{keyCode: 113}
	]}
});
MM.Command.Edit.execute = function() {
	MM.App.current.startEditing();
	MM.App.editing = true;
}

MM.Command.Finish = Object.create(MM.Command, {
	keys: {value: [{keyCode: 13, altKey:false, ctrlKey:false, shiftKey:false}]},
	editMode: {value: true}
});
MM.Command.Finish.execute = function() {
	MM.App.editing = false;
	var text = MM.App.current.stopEditing();
	if (text) {
		var action = new MM.Action.SetText(MM.App.current, text);
	} else {
		var action = new MM.Action.RemoveItem(MM.App.current);
	}
	MM.App.action(action);
}

MM.Command.Newline = Object.create(MM.Command, {
	label: {value: "Line break"},
	keys: {value: [
		{keyCode: 13, shiftKey:true},
		{keyCode: 13, ctrlKey:true}
	]},
	editMode: {value: true}
});
MM.Command.Newline.execute = function() {
	var range = getSelection().getRangeAt(0);
	var br = document.createElement("br");
	range.insertNode(br);
	range.setStartAfter(br);
}

MM.Command.Cancel = Object.create(MM.Command, {
	editMode: {value: true},
	keys: {value: [{keyCode: 27}]}
});
MM.Command.Cancel.execute = function() {
	MM.App.editing = false;
	MM.App.current.stopEditing();
	var oldText = MM.App.current.getText();
	if (!oldText) { /* newly added node */
		var action = new MM.Action.RemoveItem(MM.App.current);
		MM.App.action(action);
	}
}

MM.Command.Bold = Object.create(MM.Command, {
	editMode: {value: true},
	label: {value: "Bold"},
	keys: {value: [{charCode: "b".charCodeAt(0), ctrlKey:true}]}
});
MM.Command.Bold.execute = function() {
	document.execCommand("bold", null, null);
}

MM.Command.Underline = Object.create(MM.Command, {
	editMode: {value: true},
	label: {value: "Underline"},
	keys: {value: [{charCode: "u".charCodeAt(0), ctrlKey:true}]}
});
MM.Command.Underline.execute = function() {
	document.execCommand("underline", null, null);
}

MM.Command.Italic = Object.create(MM.Command, {
	editMode: {value: true},
	label: {value: "Italic"},
	keys: {value: [{charCode: "i".charCodeAt(0), ctrlKey:true}]}
});
MM.Command.Italic.execute = function() {
	document.execCommand("italic", null, null);
}

MM.Command.Strikethrough = Object.create(MM.Command, {
	editMode: {value: true},
	label: {value: "Strike-through"},
	keys: {value: [{charCode: "s".charCodeAt(0), ctrlKey:true}]}
});
MM.Command.Strikethrough.execute = function() {
	document.execCommand("strikeThrough", null, null);
}

MM.Command.Value = Object.create(MM.Command, {
	label: {value: "Set value"},
	keys: {value: [{charCode: "v".charCodeAt(0), ctrlKey:false}]}
});
MM.Command.Value.execute = function() {
	var item = MM.App.current;
	var oldValue = item.getValue();
	var newValue = prompt("Set item value", oldValue);
	if (newValue == null) { return; }

	if (!newValue.length) { newValue = null; }

	var numValue = parseFloat(newValue);
	var action = new MM.Action.SetValue(item, isNaN(numValue) ? newValue : numValue);
	MM.App.action(action);
}

MM.Command.Yes = Object.create(MM.Command, {
	label: {value: "Yes"},
	keys: {value: [{charCode: "y".charCodeAt(0), ctrlKey:false}]}
});
MM.Command.Yes.execute = function() {
	var item = MM.App.current;
	var status = (item.getStatus() == "yes" ? null : "yes");
	var action = new MM.Action.SetStatus(item, status);
	MM.App.action(action);
}

MM.Command.No = Object.create(MM.Command, {
	label: {value: "No"},
	keys: {value: [{charCode: "n".charCodeAt(0), ctrlKey:false}]}
});
MM.Command.No.execute = function() {
	var item = MM.App.current;
	var status = (item.getStatus() == "no" ? null : "no");
	var action = new MM.Action.SetStatus(item, status);
	MM.App.action(action);
}

MM.Command.Maybe = Object.create(MM.Command, {
	label: {value: "Maybe"},
	keys: {value: [{charCode: "m".charCodeAt(0), ctrlKey:false}]}
});
MM.Command.Maybe.execute = function() {
	var item = MM.App.current;
	var status = (item.getStatus() == "maybe" ? null : "maybe");
	var action = new MM.Action.SetStatus(item, status);
	MM.App.action(action);
}
