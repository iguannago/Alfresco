(function(){var e=YAHOO.util.Dom,b=YAHOO.util.Event;Alfresco.dashlet.RssFeed=function a(f){Alfresco.dashlet.RssFeed.superclass.constructor.call(this,"Alfresco.dashlet.RssFeed",f);this.configDialog=null;return this};YAHOO.extend(Alfresco.dashlet.RssFeed,Alfresco.component.Base,{options:{componentId:"",feedURL:"",limit:"all"},onReady:function d(){var f=e.get(this.id+"-configFeed-link");if(f){b.addListener(f,"click",this.onConfigFeedClick,this,true)}},onConfigFeedClick:function c(i){b.stopEvent(i);var g=Alfresco.constants.URL_SERVICECONTEXT+"modules/feed/config/"+encodeURIComponent(this.options.componentId);if(!this.configDialog){this.configDialog=new Alfresco.module.SimpleDialog(this.id+"-configDialog").setOptions({width:"50em",templateUrl:Alfresco.constants.URL_SERVICECONTEXT+"modules/feed/config",onSuccess:{fn:function h(j){var k=j.json;this.options.feedURL=(k&&k.feedURL)?k.feedURL:this.options.feedURL;this.options.limit=k.limit;e.get(this.id+"-title").innerHTML=k?k.title:"";e.get(this.id+"-scrollableList").innerHTML=(k&&k.content!=="")?k.content:("<h3>"+this.msg("label.noItems")+"</h3>")},scope:this},doSetupFormsValidation:{fn:function f(p){p.addValidation(this.configDialog.id+"-url",Alfresco.forms.validation.mandatory,null,"keyup");p.addValidation(this.configDialog.id+"-url",Alfresco.forms.validation.url,null,"keyup");p.setShowSubmitStateDynamically(true,false);e.get(this.configDialog.id+"-url").value=this.options.feedURL;var k=e.get(this.configDialog.id+"-limit"),m=k.options,o,n,l;for(n=0,l=m.length;n<l;n++){o=m[n];if(o.value===this.options.limit){o.selected=true;break}}},scope:this}})}this.configDialog.setOptions({actionUrl:g}).show()}})})();