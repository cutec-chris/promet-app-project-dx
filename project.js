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
        var aDiv = document.createElement('div');
        aForm.Parent.appendChild(aDiv);
        aForm.Tabs.tabs("plan").attachObject(aDiv);
        aDiv.style.height = '100%';
        aDiv.style.width = '100%';
        aForm.OnDataUpdated = function(bForm) {
          gantt.config.xml_date="%Y-%m-%d %H:%i";
          gantt.init(aDiv);
          for (var i = 0; i < bForm.Data.TASKS.length; i++) {
            var aObj = {};
            if (bForm.Data.TASKS[i].Fields.active != 0) {
              aObj.id = bForm.Data.TASKS[i].Fields.sql_id;
              aObj.text = bForm.Data.TASKS[i].Fields.summary;
              if (bForm.Data.TASKS[i].Fields.startdate) {
                var aDate = new Date(bForm.Data.TASKS[i].Fields.startdate);
                aObj.start_date = formatDate(aDate,"YYYY-MM-dd");
              } else {
                var aDate = new Date();
                aObj.start_date = formatDate(aDate,"YYYY-MM-dd");
              }
              if (bForm.Data.TASKS[i].Fields.plantime>0)
                aObj.duration = bForm.Data.TASKS[i].Fields.plantime * 8;
              if ((bForm.Data.TASKS[i].Fields.parent)&&(bForm.Data.TASKS[i].Fields.parent!="0"))
                aObj.parent = parseInt(bForm.Data.TASKS[i].Fields.parent);
              gantt.addTask(aObj);
            }
          }
          //gantt.parse(tasks);
        }
      }});
  }
});
