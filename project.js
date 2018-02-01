var Projects;
window.addEventListener('AfterLogin',function(){
  Projects = newPrometList('projects','Projekte');
  Projects.Grid.setHeader(["Name","Nummer","Status","Kategorie"]);
  Projects.Grid.setColumnIds('NAME,ID,STATUS,CATEGORY')
  Projects.Grid.setColTypes("ro,ro,ro,ro");
  Projects.Grid.attachHeader("#text_filter,#text_filter,#select_filter,#text_filter");
  Projects.Grid.setInitWidths('*,100,150,100,200');
  Projects.Grid.init();
  Projects.OnCreateForm = function(aForm) {
    aForm.Toolbar.addButton('gantt', 3, 'Gantt', 'fa fa-bar-chart fa-rotate-90');
    aForm.Toolbar.attachEvent("onClick", function(id) {
      if (id=='gantt') {
        var newWindow=window.open('','_blank');
        if (newWindow!=null) { //no rights to open an new window (possibly were running from file:// so we use an dhtmlx window)
          parent.RegisterWindow(newWindow);
          var newPath = '';
          var pathArray = window.location.pathname.split( '/' );
          for (i = 0; i < pathArray.length-1; i++) {
            newPath += "/";
            newPath += pathArray[i];
          }
          newWindow.location.href=window.location.protocol + "//" + window.location.host + newPath+'project/gantt.html';
          newWindow.onload = function () {
            newWindow.Form = aForm;
            var aDiv = newWindow.document.createElement('div');
            newWindow.document.body.appendChild(aDiv);
            aDiv.style.height = '100%';
            aDiv.style.width = '100%';

            newWindow.window.gantt.templates.scale_cell_class = function(date){
                if(date.getDay()==0||date.getDay()==6){
                    return "weekend";
                }
            };
            newWindow.window.gantt.templates.task_cell_class = function(item,date){
                if(date.getDay()==0||date.getDay()==6){
                    return "weekend" ;
                }
            };
            newWindow.window.gantt.config.date_scale = "Week #%W";
            newWindow.window.gantt.config.scale_unit= "week";
            newWindow.window.gantt.config.subscales = [
            		{unit:"month", step:1, date:"%M" },
            		{unit:"year", step:1, date:"%Y" }
            	];

            newWindow.window.gantt.config.scale_height = 3*28;

            newWindow.window.gantt.config.task_height = 16;
          	newWindow.window.gantt.config.row_height = 20;

            newWindow.window.gantt.init(aDiv/*,new Date(),new Date().addDays(30)*/);

            for (var i = 0; i < aForm.Data.TASKS.length; i++) {
              var aObj = {};
              if (aForm.Data.TASKS[i].Fields.active != 0) {
                aObj.id = aForm.Data.TASKS[i].Fields.sql_id;
                aObj.text = aForm.Data.TASKS[i].Fields.summary;
                if (aForm.Data.TASKS[i].Fields.startdate) {
                  var aDate = new Date(aForm.Data.TASKS[i].Fields.startdate);
                  aObj.start_date = formatDate(aDate,"YYYY-MM-dd");
                } else {
                  var aDate = new Date();
                  aObj.start_date = formatDate(aDate,"YYYY-MM-dd");
                }
                if (aForm.Data.TASKS[i].Fields.plantime>0)
                  aObj.duration = aForm.Data.TASKS[i].Fields.plantime * 8;
                if ((aForm.Data.TASKS[i].Fields.parent)&&(aForm.Data.TASKS[i].Fields.parent!="0"))
                  aObj.parent = parseInt(aForm.Data.TASKS[i].Fields.parent);
                newWindow.window.gantt.addTask(aObj);
              }
            }
            for (var i = 0; i < aForm.Data.TASKS.length; i++) {
              var aObj = {};
              var aLink = {};
              if (aForm.Data.TASKS[i].Fields.active != 0) {
                aObj.id = aForm.Data.TASKS[i].Fields.sql_id;
                aObj.text = aForm.Data.TASKS[i].Fields.summary;
                if (aForm.Data.TASKS[i].Fields.startdate) {
                  var aDate = new Date(aForm.Data.TASKS[i].Fields.startdate);
                  aObj.start_date = formatDate(aDate,"YYYY-MM-dd");
                } else {
                  var aDate = new Date();
                  aObj.start_date = formatDate(aDate,"YYYY-MM-dd");
                }
                if (aForm.Data.TASKS[i].Fields.plantime>0)
                  aObj.duration = aForm.Data.TASKS[i].Fields.plantime * 8;
                if ((aForm.Data.TASKS[i].Fields.parent)&&(aForm.Data.TASKS[i].Fields.parent!="0"))
                  aObj.parent = parseInt(aForm.Data.TASKS[i].Fields.parent);
                newWindow.window.gantt.addTask(aObj);
                if (aForm.Data.TASKS[i].DEPENDENCIES) {
                  for (var a = 0; a < aForm.Data.TASKS[i].DEPENDENCIES.length; a++) {
                    aLink.id = aForm.Data.TASKS[i].DEPENDENCIES[a].Fields.sql_id;
                    aLink.source = aForm.Data.TASKS[i].DEPENDENCIES[a].Fields.ref_id_id;
                    aLink.target = aForm.Data.TASKS[i].Fields.sql_id;
                    aLink.type = newWindow.window.gantt.config.links.finish_to_start;
                    newWindow.window.gantt.addLink(aLink);
                  }
                }
              }
            }
          }
        }
      }});
  }
});
window.addEventListener('AfterLogout',function(){
  Projects.Grid.destructor();
  Projects.Page.remove();
  delete Projects;
  Projects = {};
  Projects = null;
});
