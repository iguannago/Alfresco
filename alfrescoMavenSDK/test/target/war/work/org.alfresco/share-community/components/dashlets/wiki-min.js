(function(){var e=YAHOO.util.Dom,a=YAHOO.util.Event;Alfresco.dashlet.WikiDashlet=function d(f){Alfresco.dashlet.WikiDashlet.superclass.constructor.call(this,"Alfresco.dashlet.WikiDashlet",f);this.parser=new Alfresco.WikiParser();return this};YAHOO.extend(Alfresco.dashlet.WikiDashlet,Alfresco.component.Base,{options:{guid:"",siteId:"",pages:[]},parser:null,configDialog:null,onReady:function c(){a.addListener(this.id+"-wiki-link","click",this.onConfigFeedClick,this,true);this.parser.URL=Alfresco.util.uriTemplate("sitepage",{site:this.options.siteId,pageid:"wiki-page?title="});var f=e.get(this.id+"-scrollableList");f.innerHTML=this.parser.parse(f.innerHTML,this.options.pages)},onConfigFeedClick:function b(h){a.stopEvent(h);var g=Alfresco.constants.URL_SERVICECONTEXT+"modules/wiki/config/"+encodeURIComponent(this.options.guid);if(!this.configDialog){this.configDialog=new Alfresco.module.SimpleDialog(this.id+"-configDialog").setOptions({width:"50em",templateUrl:Alfresco.constants.URL_SERVICECONTEXT+"modules/wiki/config/"+this.options.siteId,onSuccess:{fn:function f(j){var i=YAHOO.lang.JSON.parse(j.serverResponse.responseText);if(i){e.get(this.id+"-scrollableList").innerHTML=this.parser.parse(i.content,this.options.pages);e.get(this.id+"-title").innerHTML=Alfresco.util.message("label.header-prefix",this.name)+(i.title!==""?' - <a href="wiki-page?title='+encodeURIComponent(j.config.dataObj.wikipage)+'">'+i.title+"</a>":"")}},scope:this}})}this.configDialog.setOptions({actionUrl:g}).show()}})})();