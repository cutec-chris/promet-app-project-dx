function RefreshProjects() {
  siProject.progressOn();
  try {
    console.log("Refresh Times");
    dsProjects.FillGrid(gProjects,'');
  } finally {
    siProject.progressOff();
  }
}
var siProject,tbToolbar,gProjects,dsProjects;
dhtmlxEvent(window,"load",function(){
  console.log("Loading Projects Page...");
  sbMain.addItem({id: 'siProject', text: 'Projekte', icon: 'fa fa-refresh'});
  siProject = window.parent.sbMain.cells('siProject');
  tbToolbar = siProject.attachToolbar({
    parent:"pToolbar",
      items:[
        {id: "refresh", type: "button", text: "Aktualisieren", img: "fa fa-refresh"}
      ],
    iconset: "awesome"
  });
  tbToolbar.attachEvent("onClick", function(id) {
    if (id=='new') {
    } else if (id=='refresh') {
      RefreshProjects();
    }
  });
  gProjects = siProject.attachGrid({parent:"pTimes"});
  gProjects.setImagePath("codebase/imgs/");
  gProjects.setSizes();
  gProjects.setHeader(["Nummer","Name","Status","Kategorie"]);
  gProjects.setColumnIds('ID,NAME,STATUS,CATEGORY')
  gProjects.setColTypes("txt,txt,txt,txt");
  gProjects.attachHeader("#text_filter,#text_filter,#select_filter,");
  //gProjects.filterByAll=function(){
  //};
  gProjects.attachEvent("onFilterStart", function(indexes,values){
    console.log("onFilterStart event fired");
    return false;
  });
  gProjects.init();
  dsProjects = newPrometDataStore('projects');
  dsProjects.DataProcessor.init(gProjects);
});
