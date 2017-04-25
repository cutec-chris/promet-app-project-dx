var siTimes,tbToolbar,gTimes,dsTimes;
dhtmlxEvent(window,"load",function(){
  console.log("Loading Projects Page...");
  sbMain.addItem({id: 'siProject', text: 'Projekte', icon: 'fa fa-refresh'});
  siProject = window.parent.sbMain.cells('siProject');
  tbToolbar = siTimes.attachToolbar({
    parent:"pToolbar",
      items:[
         {id: "new", type: "button", text: "Neu", img: "fa fa-plus-circle"}
        ,{id: "sep1", type: "separator" }
        ,{id: "sep1", type: "separator" }
        ,{id: "refresh", type: "button", text: "Aktualisieren", img: "fa fa-refresh"}
      ],
    iconset: "awesome"
  });
  tbToolbar.attachEvent("onClick", function(id) {
    if (id=='new') {
    } else if (id=='refresh') {
    }
  });
});
