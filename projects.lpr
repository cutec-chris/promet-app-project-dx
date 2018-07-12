library projects;
  uses js, web, classes, Avamm, webrouter, AvammForms, dhtmlx_base,
    dhtmlx_form,SysUtils, Types;

type

  { TProjectForm }

  TProjectForm = class(TAvammForm)
  private
    FGanttWindow : TJSWindow;
    function GanttWindowLoaded(Event: TEventListenerEvent): boolean;
    function GanttWindowLoadend(aEvent: TJSLoadEvent): boolean;
  protected
    Tasks : TJSArray;
    procedure DoLoadData; override;
    procedure ToolbarButtonClick(id : string);
    procedure ShowGantt;
  public
    procedure DoCreate;
    procedure DoOpen;
  end;

resourcestring
  strProject             = 'Projekte';
  strGantt               = 'Gantt';

var
  Project : TAvammListForm = nil;
Procedure ShowProject(URl : String; aRoute : TRoute; Params: TStrings);
var
  aForm: TAvammForm;
begin
  aForm := TProjectForm.Create(fmInlineWindow,'projects',Params.Values['Id']);
end;
Procedure ShowProjectList(URl : String; aRoute : TRoute; Params: TStrings);
var
  aParent: TJSHTMLElement;
begin
  if Project = nil then
    begin
      aParent := TJSHTMLElement(GetAvammContainer());
      Project := TAvammListForm.Create(aParent,'projects');
      with Project do
        begin
          Grid.setHeader('Name,Nummer,Status,Kategorie');
          Grid.setColumnIds('NAME,ID,STATUS,CATEGORY');
          Grid.attachHeader('#text_filter,#text_filter,#select_filter,#text_filter');
          Grid.setInitWidths('*,100,150,100,200');
          Grid.init();
        end;
    end;
  Project.Show;
end;

{ TProjectForm }

function TProjectForm.GanttWindowLoaded(Event: TEventListenerEvent): boolean;
var
  aDiv: TJSHTMLElement;
  aObj, aLink: TJSObject;
  aDate: TDateTime;
  aDep: TJSArray;
  i, a: Integer;
  newWindow: TJSWindow;
begin
  writeln('loaded called ...');
  newWindow := FGanttWindow;
  aDiv := TJSHTMLElement(FGanttWindow.document.createElement('div'));
  FGanttWindow.document.body.appendChild(aDiv);
  aDiv.style.setProperty('height','100%');
  aDiv.style.setProperty('width','100%');
  asm //gantt config
    //newWindow.Form = aForm;
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
    newWindow.window.gantt.config.drag_progress = false;
    //newWindow.window.gantt.config.date_scale = "Week #%W";
    //newWindow.window.gantt.config.scale_unit= "week";
    newWindow.window.gantt.config.date_scale = "%d";
    newWindow.window.gantt.config.scale_unit= "day";
    newWindow.window.gantt.config.step = 1;
    newWindow.window.gantt.config.fit_tasks = true;
    newWindow.window.gantt.config.subscales = [
      {unit:"week", step:1, date:"KW %W" },
   		  {unit:"month", step:1, date:"%M" }
  		  //{unit:"year", step:1, date:"%Y" }
  	  ];
    newWindow.window.gantt.config.work_time = true;
    newWindow.window.gantt.config.correct_work_time = true;
    newWindow.window.gantt.config.columns = [
      { name: "text", label: "Aufgabe", tree: true, width: 300 },
      { name: "start_date", label: "Start", align: "center" },
      { name:"duration", label: "Dauer",align: "center", width:70 },
      { name: "add", label: "", width: 44 }
      ];
    newWindow.window.gantt.config.scale_height = 3*28;

    newWindow.window.gantt.config.task_height = 16;
	  newWindow.window.gantt.config.row_height = 20;

    newWindow.window.gantt.config.xml_date="%Y-%m-%d %H:%i";
    newWindow.window.gantt.init(aDiv,new Date().addDays(-5),new Date().addDays(90));
  end;

  for i := 0 to Tasks.length do
    begin
      aObj := TJSObject.new;
      with TJSObject(Tasks[i]) do
        begin
          if (Properties['ACTIVE'] <> 0) then
            begin
              aObj.Properties['id'] := Properties['sql_id'];
              aObj.Properties['text'] := Properties['SUMMARY'];
              if Assigned(Properties['STARTDATE']) then
                begin
                  aDate := StrToDateTime(string(Properties['STARTDATE']));
                  aObj.Properties['start_date'] := FormatDateTime('YYYY-MM-dd',aDate);
                end
              else
                begin
                  aObj.Properties['start_date'] := FormatDateTime('YYYY-MM-dd',Now());
                end;
              if (Integer(Properties['plantime'])>0) then
                aObj.Properties['duration'] := Integer(Properties['plantime']) * 8;
              if (Assigned(Properties['parent']) and (Properties['parent']<>'0')) then
                aObj.Properties['parent'] := Integer(Properties['parent']);
              asm
                newWindow.window.gantt.addTask(aObj);
              end;
            end;
        end;
    end;
  for i := 0 to Tasks.length do
    begin
      aObj := TJSObject.new;
      aLink := TJSObject.new;
      with TJSObject(Tasks[i]) do
        begin
          if (Properties['ACTIVE'] <> 0) then
            begin
              aObj.Properties['id'] := Properties['sql_id'];
              aObj.Properties['text'] := Properties['SUMMARY'];
              if Assigned(Properties['STARTDATE']) then
                begin
                  aDate := StrToDateTime(string(Properties['STARTDATE']));
                  aObj.Properties['start_date'] := FormatDateTime('YYYY-MM-dd',aDate);
                end
              else
                begin
                  aObj.Properties['start_date'] := FormatDateTime('YYYY-MM-dd',Now());
                end;
              if (Integer(Properties['plantime'])>0) then
                aObj.Properties['duration'] := Integer(Properties['plantime']) * 8;
              if (Assigned(Properties['parent']) and (Properties['parent']<>'0')) then
                aObj.Properties['parent'] := Integer(Properties['parent']);
              asm
                newWindow.window.gantt.addTask(aObj);
              end;
              if Assigned(Properties['DEPENDENCIES']) then
                begin
                  aDep := TJSArray(TJSObject(Properties['DEPENDENCIES']).Properties['Data']);
                  for a := 0 to aDep.Length-1 do
                    begin
                      aLink.Properties['id'] :=TJSObject(aDep[a]).Properties['sql_id'];
                      aLink.Properties['source'] := TJSObject(aDep[a]).Properties['ref_id_id'];
                      aLink.Properties['target'] := Properties['sql_id'];
                      asm
                        aLink.type = newWindow.window.gantt.config.links.finish_to_start;
                        newWindow.window.gantt.addLink(aLink);
                      end;
                    end;
                end;
            end;
        end;
    end;
end;

function TProjectForm.GanttWindowLoadend(aEvent: TJSLoadEvent): boolean;
begin
  GanttWindowLoaded(TEventListenerEvent(null));
end;

procedure TProjectForm.DoLoadData;
begin
  inherited DoLoadData;
  DoCreate;
  DoOpen;
end;

procedure TProjectForm.ToolbarButtonClick(id: string);
begin
  if id='gantt' then
    begin
      ShowGantt;
    end;
end;

procedure TProjectForm.ShowGantt;
var
  newPath: String;
  pathArray: TStringDynArray;
  i: Integer;

begin
  FGanttWindow := window.open('','_blank');
  if Assigned(FGanttWindow) then //no rights to open an new window (possibly were running from file:// so we use an dhtmlx window)
    begin
      pathArray := TJSString(window.location.pathname).split( '/' );
      for i := 0 to length(pathArray)-1 do
        begin
          newPath := newPath + '/';
          newPath := newPath + pathArray[i];
        end;
      FGanttWindow.location.href:=window.location.protocol + '//' + window.location.host + newPath+'projects/gantt.html';
      asm
        this.FGanttWindow.onload=this.GanttWindowLoaded;
      end;
      FGanttWindow.onloadend:=@GanttWindowLoadend;
    end;
end;

procedure TProjectForm.DoCreate;
begin
  Toolbar.addButton('gantt',3,strGantt,'fa fa-bar-chart fa-rotate-90');
  Toolbar.attachEvent('onClick', @ToolbarButtonClick);
end;

procedure TProjectForm.DoOpen;
begin
  if Data.Properties['TASKS'] is TJSObject then
    Tasks := TJSArray(TJSObject(Data.Properties['TASKS']).Properties['Data'])
  else
    Tasks := TJSArray(Data.Properties['TASKS']);

end;

initialization
  if getRight('Projects')>0 then
    RegisterSidebarRoute(strProject,'projects',@ShowProjectList);
  Router.RegisterRoute('/projects/by-id/:Id/',@ShowProject);
end.

