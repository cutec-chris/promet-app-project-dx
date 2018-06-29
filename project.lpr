library project;
  uses js, web, classes, Avamm, webrouter, AvammForms, dhtmlx_base,
    dhtmlx_form,SysUtils, Types;

type

  TProjectForm = class(TAvammForm)
  end;

resourcestring
  strProject             = 'Projekte';

var
  Project : TAvammListForm = nil;
Procedure ShowProject(URl : String; aRoute : TRoute; Params: TStrings);
var
  aForm: TAvammForm;
begin
  aForm := TProjectForm.Create(fmInlineWindow,'Project',Params.Values['Id']);
end;
Procedure ShowProjectList(URl : String; aRoute : TRoute; Params: TStrings);
var
  aParent: TJSHTMLElement;
begin
  if Project = nil then
    begin
      aParent := TJSHTMLElement(GetAvammContainer());
      Project := TAvammListForm.Create(aParent,'Project');
      with Project do
        begin
          Grid.setHeader('Name,Nummer,Status,Kategorie',',',TJSArray._of([]));
          Grid.setColumnIds('NAME,ID,STATUS,CATEGORY');
          Grid.attachHeader('#text_filter,#text_filter,#select_filter,#text_filter');
          Grid.setInitWidths('*,100,150,100,200');
          Grid.init();
        end;
    end;
  Project.Show;
end;

initialization
  if getRight('Project')>0 then
    RegisterSidebarRoute(strProject,'Project',@ShowProjectList);
  Router.RegisterRoute('/Project/by-id/:Id/',@ShowProject);
end.

