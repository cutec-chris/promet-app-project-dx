var Projects;
dhtmlxEvent(window,"load",function(){
  Projects = newPrometList('projects','Projekte');
  Projects.Grid.setHeader(["Name","Nummer","Status","Kategorie"]);
  Projects.Grid.setColumnIds('NAME,ID,STATUS,CATEGORY')
  Projects.Grid.setColTypes("txt,txt,txt,txt");
  Projects.Grid.attachHeader("#text_filter,#text_filter,#select_filter,");
  Meetings.Grid.setInitWidths('*,70,150,*');
  Projects.Grid.init();
});
