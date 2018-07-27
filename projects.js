rtl.module("projects",["System","JS","Web","Classes","Avamm","webrouter","AvammForms","dhtmlx_base","SysUtils","Types"],function () {
  "use strict";
  var $mod = this;
  rtl.createClass($mod,"TProjectForm",pas.AvammForms.TAvammForm,function () {
    this.$init = function () {
      pas.AvammForms.TAvammForm.$init.call(this);
      this.FGanttWindow = null;
      this.Tasks = null;
    };
    this.$final = function () {
      this.FGanttWindow = undefined;
      this.Tasks = undefined;
      pas.AvammForms.TAvammForm.$final.call(this);
    };
    this.GanttWindowLoaded = function (Event) {
      var Result = false;
      var aDiv = null;
      var aObj = null;
      var aLink = null;
      var aDate = 0.0;
      var aDep = null;
      var i = 0;
      var a = 0;
      var newWindow = null;
      pas.System.Writeln("loaded called ...");
      newWindow = this.FGanttWindow;
      aDiv = this.FGanttWindow.document.createElement("div");
      this.FGanttWindow.document.body.appendChild(aDiv);
      aDiv.style.setProperty("height","100%");
      aDiv.style.setProperty("width","100%");
      //gantt config
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
      for (var $l1 = 0, $end2 = this.Tasks.length; $l1 <= $end2; $l1++) {
        i = $l1;
        aObj = new Object();
        var $with3 = rtl.getObject(this.Tasks[i]);
        if ($with3["ACTIVE"] != 0) {
          aObj["id"] = $with3["sql_id"];
          aObj["text"] = $with3["SUMMARY"];
          if (pas.System.Assigned($with3["STARTDATE"])) {
            aDate = pas.SysUtils.StrToDateTime("" + $with3["STARTDATE"]);
            aObj["start_date"] = pas.SysUtils.FormatDateTime("YYYY-MM-dd",aDate);
          } else {
            aObj["start_date"] = pas.SysUtils.FormatDateTime("YYYY-MM-dd",pas.SysUtils.Now());
          };
          if (Math.floor($with3["plantime"]) > 0) aObj["duration"] = Math.floor($with3["plantime"]) * 8;
          if (pas.System.Assigned($with3["parent"]) && ($with3["parent"] != "0")) aObj["parent"] = Math.floor($with3["parent"]);
          newWindow.window.gantt.addTask(aObj);
        };
      };
      for (var $l4 = 0, $end5 = this.Tasks.length; $l4 <= $end5; $l4++) {
        i = $l4;
        aObj = new Object();
        aLink = new Object();
        var $with6 = rtl.getObject(this.Tasks[i]);
        if ($with6["ACTIVE"] != 0) {
          aObj["id"] = $with6["sql_id"];
          aObj["text"] = $with6["SUMMARY"];
          if (pas.System.Assigned($with6["STARTDATE"])) {
            aDate = pas.SysUtils.StrToDateTime("" + $with6["STARTDATE"]);
            aObj["start_date"] = pas.SysUtils.FormatDateTime("YYYY-MM-dd",aDate);
          } else {
            aObj["start_date"] = pas.SysUtils.FormatDateTime("YYYY-MM-dd",pas.SysUtils.Now());
          };
          if (Math.floor($with6["plantime"]) > 0) aObj["duration"] = Math.floor($with6["plantime"]) * 8;
          if (pas.System.Assigned($with6["parent"]) && ($with6["parent"] != "0")) aObj["parent"] = Math.floor($with6["parent"]);
          newWindow.window.gantt.addTask(aObj);
          if (pas.System.Assigned($with6["DEPENDENCIES"])) {
            aDep = rtl.getObject(rtl.getObject($with6["DEPENDENCIES"])["Data"]);
            for (var $l7 = 0, $end8 = aDep.length - 1; $l7 <= $end8; $l7++) {
              a = $l7;
              aLink["id"] = rtl.getObject(aDep[a])["sql_id"];
              aLink["source"] = rtl.getObject(aDep[a])["ref_id_id"];
              aLink["target"] = $with6["sql_id"];
              aLink.type = newWindow.window.gantt.config.links.finish_to_start;
              newWindow.window.gantt.addLink(aLink);
            };
          };
        };
      };
      return Result;
    };
    this.GanttWindowLoadend = function (aEvent) {
      var Result = false;
      this.GanttWindowLoaded(rtl.getObject(null));
      return Result;
    };
    this.DoLoadData = function () {
      pas.AvammForms.TAvammForm.DoLoadData.call(this);
      this.DoCreate();
      this.DoOpen();
    };
    this.ToolbarButtonClick = function (id) {
      if (id === "gantt") {
        this.ShowGantt();
      };
    };
    this.ShowGantt = function () {
      var newPath = "";
      var pathArray = [];
      var i = 0;
      this.FGanttWindow = window.open("","_blank");
      if (this.FGanttWindow != null) {
        pathArray = window.location.pathname.split("\/");
        for (var $l1 = 0, $end2 = rtl.length(pathArray) - 1; $l1 <= $end2; $l1++) {
          i = $l1;
          newPath = newPath + "\/";
          newPath = newPath + pathArray[i];
        };
        this.FGanttWindow.location.href = (((window.location.protocol + "\/\/") + window.location.host) + newPath) + "projects\/gantt.html";
        this.FGanttWindow.onload=this.GanttWindowLoaded;
        this.FGanttWindow.onloadend = rtl.createCallback(this,"GanttWindowLoadend");
      };
    };
    this.DoCreate = function () {
      this.Toolbar.addButton("gantt",3,rtl.getResStr(pas.projects,"strGantt"),"fa fa-bar-chart fa-rotate-90");
      this.Toolbar.attachEvent("onClick",rtl.createCallback(this,"ToolbarButtonClick"));
    };
    this.DoOpen = function () {
      if (rtl.isExt(this.FData["TASKS"],Object,1)) {
        this.Tasks = rtl.getObject(rtl.getObject(this.FData["TASKS"])["Data"])}
       else this.Tasks = rtl.getObject(this.FData["TASKS"]);
    };
  });
  this.Project = null;
  this.ShowProject = function (URl, aRoute, Params) {
    var aForm = null;
    aForm = $mod.TProjectForm.$create("Create$1",[pas.AvammForms.TAvammFormMode.fmInlineWindow,"projects",Params.GetValue("Id"),""]);
  };
  this.ShowProjectList = function (URl, aRoute, Params) {
    var aParent = null;
    if ($mod.Project === null) {
      aParent = rtl.getObject(pas.Avamm.GetAvammContainer());
      $mod.Project = pas.AvammForms.TAvammListForm.$create("Create$2",[aParent,"projects","1C"]);
      var $with1 = $mod.Project;
      $with1.Grid.setHeader("Name,Nummer,Status,Kategorie");
      $with1.Grid.setColumnIds("NAME,ID,STATUS,CATEGORY");
      $with1.SetFilterHeader("#text_filter,#text_filter,#select_filter,#text_filter");
      $with1.Grid.setInitWidthsP("60,10,10,20");
      $with1.Grid.init();
    };
    $mod.Project.Show();
  };
  $mod.$resourcestrings = {strProject: {org: "Projekte"}, strGantt: {org: "Gantt"}};
  $mod.$init = function () {
    if (pas.Avamm.getRight("Projects") > 0) pas.Avamm.RegisterSidebarRoute(rtl.getResStr(pas.projects,"strProject"),"projects",$mod.ShowProjectList,"fa-briefcase");
    pas.webrouter.Router().RegisterRoute("\/projects\/by-id\/:Id\/",$mod.ShowProject,false);
  };
});
//# sourceMappingURL=projects.js.map
