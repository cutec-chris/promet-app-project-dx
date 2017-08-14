var Projects;
dhtmlxEvent(window,"load",function(){
  Projects = newPrometList('projects','Projekte');
  Projects.Grid.setHeader(["Nummer","Name","Status","Kategorie"]);
  Projects.Grid.setColumnIds('ID,NAME,STATUS,CATEGORY')
  Projects.Grid.setColTypes("txt,txt,txt,txt");
  Projects.Grid.attachHeader("#text_filter,#text_filter,#select_filter,");
  Projects.Grid.init();
});
