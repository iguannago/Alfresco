(function(){var e=YAHOO.util.Dom,d=YAHOO.util.Event;var a=Alfresco.util.encodeHTML;Alfresco.WikiCreateForm=function(h){Alfresco.WikiCreateForm.superclass.constructor.call(this,"Alfresco.WikiCreateForm",h,["button","container","connection","editor"]);return this};YAHOO.extend(Alfresco.WikiCreateForm,Alfresco.component.Base,{options:{siteId:"",locale:""},_showUnloadDialog:true,onReady:function f(){this.tagLibrary=new Alfresco.module.TagLibrary(this.id);this.tagLibrary.setOptions({siteId:this.options.siteId});this.widgets.editor=Alfresco.util.createImageEditor(this.id+"-content",{height:300,width:600,inline_styles:false,convert_fonts_to_spans:false,theme:"advanced",plugins:"table,visualchars,emotions,advhr,print,directionality,fullscreen,insertdatetime",theme_advanced_buttons1:"bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,formatselect,fontselect,fontsizeselect,forecolor",theme_advanced_buttons2:"bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,alfresco-imagelibrary,alfresco-linklibrary,image,cleanup,help,code,removeformat,|,insertdate,inserttime",theme_advanced_buttons3:"tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,advhr,|,print,|,ltr,rtl,|,fullscreen",theme_advanced_toolbar_location:"top",theme_advanced_toolbar_align:"left",theme_advanced_statusbar_location:"bottom",theme_advanced_path:false,theme_advanced_resizing:true,siteId:this.options.siteId,language:this.options.locale});var l=this;var i=function(){return l._showUnloadDialog};this.widgets.editor.addPageUnloadBehaviour(this.msg("message.unsavedChanges.wiki"),i);this.widgets.editor.render();this.widgets.saveButton=new YAHOO.widget.Button(this.id+"-save-button",{type:"submit"});Alfresco.util.createYUIButton(this,"cancel-button",null,{type:"link"});this.widgets.validateOnZero=0;var h=(Alfresco.constants.HTML_EDITOR==="YAHOO.widget.SimpleEditor")?"editorKeyUp":"onKeyUp";this.widgets.editor.subscribe(h,function(m){this.widgets.validateOnZero++;YAHOO.lang.later(1000,this,this.validateAfterEditorChange)},this,true);this.widgets.form=new Alfresco.forms.Form(this.id+"-form");var j=this.widgets.form;j.addValidation(this.id+"-title",Alfresco.forms.validation.mandatory,null,"blur");j.addValidation(this.id+"-title",Alfresco.forms.validation.nodeName,null,"keyup");j.addValidation(this.id+"-title",Alfresco.forms.validation.length,{max:256,crop:true},"keyup");j.addValidation(this.id+"-content",Alfresco.forms.validation.mandatory,null);j.setShowSubmitStateDynamically(true);j.setSubmitElements(this.widgets.saveButton);j.setAJAXSubmit(true,{successCallback:{fn:this.onPageCreated,scope:this},failureCallback:{fn:this.onPageCreateFailed,scope:this}});j.setSubmitAsJSON(true);j.setAjaxSubmitMethod(Alfresco.util.Ajax.PUT);j.doBeforeFormSubmit={fn:function k(n,o){this.widgets.saveButton.set("disabled",true);this.widgets.editor.save();this.tagLibrary.updateForm(this.id+"-form","tags");var m=e.get(this.id+"-tag-input-field");if(m){m.disabled=true}var p=e.get(this.id+"-title").value;p=p.replace(/\s+/g,"_");n.action=Alfresco.constants.PROXY_URI+"slingshot/wiki/page/"+this.options.siteId+"/"+encodeURIComponent(p);this.widgets.savingMessage=Alfresco.util.PopupManager.displayMessage({displayTime:0,text:'<span class="wait">'+a(this.msg("message.saving"))+"</span>",noEscape:true})},scope:this};this.tagLibrary.initialize(j);j.init();e.get(this.id+"-title").focus()},validateAfterEditorChange:function g(){this.widgets.validateOnZero--;if(this.widgets.validateOnZero==0){var h=e.get(this.id+"-content").value.length;this.widgets.editor.save();var i=e.get(this.id+"-content").value.length;if((h==0&&i!=0)||(h>0&&i==0)){this.widgets.form.updateSubmitElements()}}},onPageCreated:function c(j){var h="Main_Page";var i=YAHOO.lang.JSON.parse(j.serverResponse.responseText);if(i){h=i.name}this._showUnloadDialog=false;window.location=Alfresco.constants.URL_PAGECONTEXT+"site/"+this.options.siteId+"/wiki-page?title="+encodeURIComponent(h)},onPageCreateFailed:function b(k){if(this.widgets.savingMessage){this.widgets.savingMessage.destroy();this.widgets.savingMessage=null}var j=k.config.dataObj.pageTitle;var i=this;if(k.serverResponse.status===409){Alfresco.util.PopupManager.displayPrompt({title:this.msg("message.failure.title"),text:this.msg("message.failure.duplicate",j),buttons:[{text:this.msg("button.ok"),handler:function(){this.destroy();e.get(i.id+"-title").focus()},isDefault:true}]})}else{if(k.serverResponse.status==401){Alfresco.util.PopupManager.displayPrompt({title:this.msg("message.sessionTimeout.title"),text:this.msg("message.sessionTimeout.text")})}else{Alfresco.util.PopupManager.displayPrompt({title:this.msg("message.failure"),text:k.json.message})}}var h=e.get(this.id+"-tag-input-field");if(h){h.disabled=false}}})})();