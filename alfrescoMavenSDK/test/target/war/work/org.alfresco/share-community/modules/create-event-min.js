Alfresco.module.event=Alfresco.module.event||{};Alfresco.module.event.validation=Alfresco.module.event.validation||{};(function(){var g=YAHOO.util.Dom,m=YAHOO.util.Event;var e="dddd, d mmmm yyyy",k="yyyy/mm/dd";Alfresco.module.AddEvent=function(p){this.name="Alfresco.module.AddEvent";this.id=p;this.panel=null;Alfresco.util.YUILoaderHelper.require(["button","calendar","container","connection"],this.onComponentsLoaded,this);return this};Alfresco.module.AddEvent.prototype={panel:null,options:{siteId:"",eventURI:null,mode:"add",displayDate:null},setOptions:function l(p){this.options=YAHOO.lang.merge(this.options,p);return this},onComponentsLoaded:function n(){if(this.id===null){return}},show:function a(){var p={htmlid:this.id,site:this.options.siteId};if(this.options.eventURI){p.uri=this.options.eventURI}Alfresco.util.Ajax.request({url:Alfresco.constants.URL_SERVICECONTEXT+"components/calendar/add-event",dataObj:p,successCallback:{fn:this.templateLoaded,scope:this},execScripts:true,failureMessage:"Could not load add event form"})},templateLoaded:function f(t){var C=document.createElement("div");C.innerHTML=t.serverResponse.responseText;var u=g.getFirstChild(C);this.panel=Alfresco.util.createYUIPanel(u);g.get(this.id+"-title-div").innerHTML=Alfresco.util.message("title."+this.options.mode+"Event",this.name);var F=g.get(this.id+"-allday");if(F){m.addListener(F,"click",this.onAllDaySelect,F,this)}var z=new Alfresco.forms.Form(this.id+"-addEvent-form");z.addValidation(this.id+"-title",Alfresco.forms.validation.mandatory,null,"keyup");z.addValidation(this.id+"-tags",Alfresco.module.event.validation.tags,null,"keyup");var x=["td","fd",this.id+"-start",this.id+"-end"],v,E;for(v=0,E=x.length;v<E;v++){z.addValidation(x[v],this._onDateValidation,{obj:this},"blur")}z.addValidation("td",this._onDateValidation,{obj:this},"focus");z.addValidation("fd",this._onDateValidation,{obj:this},"focus");z.addValidation(this.id+"-start",this._onDateValidation,{obj:this},"blur");z.addValidation(this.id+"-end",this._onDateValidation,{obj:this},"blur");this.okButton=Alfresco.util.createYUIButton(this,"ok-button",null,{type:"submit"});z.setShowSubmitStateDynamically(true);z.setSubmitElements(this.okButton);if(!this.options.eventURI){z.setAJAXSubmit(true,{successCallback:{fn:this.onCreateEventSuccess,scope:this}});var B=this.options.displayDate||new Date();var s=Alfresco.util.formatDate(B,e);g.get("fd").value=s;g.get("td").value=s;s=Alfresco.util.formatDate(B,k);g.get(this.id+"-from").value=s;g.get(this.id+"-to").value=s}else{var p=g.get(this.id+"-addEvent-form");p.attributes.action.nodeValue=Alfresco.constants.PROXY_URI+this.options.eventURI;z.setAjaxSubmitMethod(Alfresco.util.Ajax.PUT);z.setAJAXSubmit(true,{successCallback:{fn:this.onEventUpdated,scope:this}});var q=g.get(this.id+"-start"),y=g.get(this.id+"-end");if(q.value==="00:00"&&(q.value===y.value)){F.setAttribute("checked","checked");this._displayTimeFields(false)}}z.setSubmitAsJSON(true);z.doBeforeFormSubmit={fn:function(G,H){this.okButton.set("disabled",true)},scope:this};z.applyTabFix();z.init();var r=Alfresco.util.createYUIButton(this,"cancel-button",this.onCancelButtonClick);var w=new YAHOO.widget.Button({type:"push",id:"calendarpicker",container:this.id+"-startdate"});w.on("click",this.onDateSelectButton,this);var D=new YAHOO.widget.Button({type:"push",id:"calendarendpicker",container:this.id+"-enddate"});D.on("click",this.onDateSelectButton,this);this.panel.show();Alfresco.util.caretFix(this.id+"-addEvent-form");var A=new YAHOO.util.KeyListener(document,{keys:YAHOO.util.KeyListener.KEY.ESCAPE},{fn:function(H,G){this.onCancelButtonClick()},scope:this,correctScope:true});A.enable();g.get(this.id+"-title").focus()},_onDateValidation:function j(x,w,q,s,v){var r=Alfresco.util.formatDate(g.get("fd").value,k);var t=new Date(r+" "+g.get(w.obj.id+"-start").value);var y=Alfresco.util.formatDate(g.get("td").value,k);var u=new Date(y+" "+g.get(w.obj.id+"-end").value);var p=YAHOO.widget.DateMath.after(u,t);if(Alfresco.logger.isDebugEnabled()){Alfresco.logger.debug("Current start date: "+r+" "+g.get(w.obj.id+"-start").value);Alfresco.logger.debug("Current end date: "+y+" "+g.get(w.obj.id+"-end").value);Alfresco.logger.debug("End date is after start date: "+p)}if(!p&&!v){s.addError(s.getFieldLabel(x.id)+" cannot be before the start date.",x)}return p},onAllDaySelect:function o(r,p){var q=!(p.checked);this._displayTimeFields(q)},_displayTimeFields:function h(s){var q=[this.id+"-starttime",this.id+"-endtime"];var r;for(var p=0;p<q.length;p++){r=g.get(q[p]);if(r){r.style.display=(s?"inline":"none")}}},onEventUpdated:function c(p){this.panel.destroy();YAHOO.Bubbling.fire("eventUpdated")},onDateSelectButton:function i(s){var q=new YAHOO.widget.Overlay("calendarmenu");q.setBody("&#32;");q.body.id="calendarcontainer";var r=this.get("container");q.render(r);q.align();var p=new YAHOO.widget.Calendar("buttoncalendar",q.body.id,{close:true,navigator:true});Alfresco.util.calI18nParams(p);p.render();p.changePageEvent.subscribe(function(){window.setTimeout(function(){q.show()},0)});p.selectEvent.subscribe(function(A,z){var w;if(z){var C,t;if(r.indexOf("enddate")>-1){C="td";t=me.id+"-to"}else{C="fd";t=me.id+"-from"}w=z[0][0];var y=new Date(w[0],(w[1]-1),w[2]);var v=g.get(C);v.value=Alfresco.util.formatDate(y,e);v.focus();var u=g.get(t);u.value=Alfresco.util.formatDate(y,k);if(C=="fd"){var x=new Date(Alfresco.util.formatDate(g.get("td").value,k));if(YAHOO.widget.DateMath.before(x,y)){var B=g.get("td");B.value=Alfresco.util.formatDate(y,e)}}}q.hide()},me)},onCancelButtonClick:function b(q,p){this.panel.destroy()},onCreateEventSuccess:function d(q){this.panel.destroy();var p=YAHOO.lang.JSON.parse(q.serverResponse.responseText);if(p.event){YAHOO.Bubbling.fire("eventSaved",{name:p.event.name,from:p.event.from,start:p.event.start,end:p.event.end,uri:p.event.uri,tags:p.event.tags});YAHOO.Bubbling.fire("tagRefresh")}}}})();Alfresco.module.event.validation.tags=function mandatory(e,b,d,c,a){if(!b){b={}}b.pattern=/([\"\*\\\>\<\?\/\:\|]+)|([\.]?[\.]+$)/;b.match=false;return Alfresco.forms.validation.regexMatch(e,b,d,c,a)};new Alfresco.module.AddEvent(null);