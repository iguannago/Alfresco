(function(){var b=YAHOO.Bubbling;Alfresco.service.DataListActions={};Alfresco.service.DataListActions.prototype={onActionDelete:function c(g){var i=this,d=YAHOO.lang.isArray(g)?g:[g];var f=function j(k){var n=[];for(var l=0,m=k.length;l<m;l++){n.push(k[l].nodeRef)}this.modules.actions.genericAction({success:{event:{name:"dataItemsDeleted",obj:{items:k}},message:this.msg("message.delete.success",k.length)},failure:{message:this.msg("message.delete.failure")},webscript:{method:Alfresco.util.Ajax.DELETE,name:"items"},config:{requestContentType:Alfresco.util.Ajax.JSON,dataObj:{nodeRefs:n}}})};Alfresco.util.PopupManager.displayPrompt({title:this.msg("message.confirm.delete.title",d.length),text:this.msg("message.confirm.delete.description",d.length),buttons:[{text:this.msg("button.delete"),handler:function h(){this.destroy();f.call(i,d)}},{text:this.msg("button.cancel"),handler:function e(){this.destroy()},isDefault:true}]})},onActionDuplicate:function a(h){var j=this,e=YAHOO.lang.isArray(h)?h:[h],d=new Alfresco.util.NodeRef(this.modules.dataGrid.datalistMeta.nodeRef),k=[];for(var f=0,g=e.length;f<g;f++){k.push(e[f].nodeRef)}this.modules.actions.genericAction({success:{event:{name:"dataItemsDuplicated",obj:{items:e}},message:this.msg("message.duplicate.success",e.length)},failure:{message:this.msg("message.duplicate.failure")},webscript:{method:Alfresco.util.Ajax.POST,name:"duplicate/node/"+d.uri},config:{requestContentType:Alfresco.util.Ajax.JSON,dataObj:{nodeRefs:k}}})}}})();(function(){var j=YAHOO.util.Dom,a=YAHOO.util.Selector,d=YAHOO.util.KeyListener;Alfresco.module.SimpleDialog=function(o,p){p=YAHOO.lang.isArray(p)?p:[];this.isFormOwner=false;if(o!=="null"){this.formsServiceDeferred=new Alfresco.util.Deferred(["onTemplateLoaded","onBeforeFormRuntimeInit"],{fn:this._showDialog,scope:this});YAHOO.Bubbling.on("beforeFormRuntimeInit",this.onBeforeFormRuntimeInit,this)}return Alfresco.module.SimpleDialog.superclass.constructor.call(this,"Alfresco.module.SimpleDialog",o,["button","container","connection","json","selector"].concat(p))};YAHOO.extend(Alfresco.module.SimpleDialog,Alfresco.component.Base,{dialog:null,form:null,isFormOwner:null,options:{templateUrl:null,actionUrl:null,firstFocus:null,onSuccess:{fn:null,obj:null,scope:window},onSuccessMessage:"",onFailure:{fn:null,obj:null,scope:window},onFailureMessage:"",doBeforeDialogShow:{fn:null,obj:null,scope:null},doSetupFormsValidation:{fn:null,obj:null,scope:null},doBeforeFormSubmit:{fn:null,obj:null,scope:window},doBeforeAjaxRequest:{fn:null,obj:null,scope:window},width:"30em",clearForm:false,destroyOnHide:false},show:function b(){if(this.dialog){this._showDialog()}else{var o={htmlid:this.id};if(this.options.templateRequestParams){o=YAHOO.lang.merge(this.options.templateRequestParams,o)}Alfresco.util.Ajax.request({url:this.options.templateUrl,dataObj:o,successCallback:{fn:this.onTemplateLoaded,scope:this},failureMessage:"Could not load dialog template from '"+this.options.templateUrl+"'.",scope:this,execScripts:true})}return this},_showDialog:function e(){var o=j.get(this.id+"-form");j.addClass(o,"bd");var x=this.options.doSetupFormsValidation;if(typeof x.fn=="function"){x.fn.call(x.scope||this,this.form,x.obj)}var q=this.options.doBeforeFormSubmit;if(typeof q.fn=="function"){this.form.doBeforeFormSubmit=q}else{this.form.doBeforeFormSubmit={fn:function p(){this.widgets.okButton.set("disabled",true);this.widgets.cancelButton.set("disabled",true)},scope:this}}var s=this.options.doBeforeAjaxRequest;if(typeof s.fn=="function"){this.form.doBeforeAjaxRequest=s}if(this.options.actionUrl!==null){o.attributes.action.nodeValue=this.options.actionUrl}if(this.options.clearForm){var u=a.query("input",o),v;u=u.concat(a.query("textarea",o));for(var t=0,r=u.length;t<r;t++){v=u[t];if(v.getAttribute("type")!="radio"&&v.getAttribute("type")!="checkbox"&&v.getAttribute("type")!="hidden"){v.value=""}}}var w=this.options.doBeforeDialogShow;if(w&&typeof w.fn=="function"){w.fn.call(w.scope||this,this.form,this,w.obj)}if(this.isFormOwner){this.widgets.okButton.set("disabled",false);this.widgets.cancelButton.set("disabled",false)}this.form.updateSubmitElements();this.dialog.show();Alfresco.util.caretFix(o);this.form.applyTabFix();this.widgets.escapeListener=new d(document,{keys:d.KEY.ESCAPE},{fn:function(z,y){this.hide()},scope:this,correctScope:true});this.widgets.escapeListener.enable();if(this.options.firstFocus!==null){j.get(this.options.firstFocus).focus()}},hide:function k(){if(this.dialog){this.dialog.hide()}},_hideDialog:function g(){this.dialog.hideEvent.unsubscribe(this.onHideEvent,null,this);if(this.widgets.escapeListener){this.widgets.escapeListener.disable()}var o=j.get(this.id+"-form");Alfresco.util.undoCaretFix(o);if(this.options.destroyOnHide){YAHOO.Bubbling.fire("formContainerDestroyed");YAHOO.Bubbling.unsubscribe("beforeFormRuntimeInit",this.onBeforeFormRuntimeInit);this.dialog.destroy();delete this.dialog;delete this.widgets;if(this.isFormOwner){delete this.form}}},onHideEvent:function n(p,o){YAHOO.lang.later(0,this,this._hideDialog)},onTemplateLoaded:function f(o){var q=document.createElement("div");q.innerHTML=o.serverResponse.responseText;var p=j.getFirstChild(q);while(p&&p.tagName.toLowerCase()!="div"){p=j.getNextSibling(p)}this.dialog=Alfresco.util.createYUIPanel(p,{width:this.options.width});this.dialog.hideEvent.subscribe(this.onHideEvent,null,this);if(j.get(this.id+"-form-submit")){this.isFormOwner=false;this.formsServiceDeferred.fulfil("onTemplateLoaded")}else{this.widgets.okButton=Alfresco.util.createYUIButton(this,"ok",null,{type:"submit"});this.widgets.cancelButton=Alfresco.util.createYUIButton(this,"cancel",this.onCancel);this.isFormOwner=true;this.form=new Alfresco.forms.Form(this.id+"-form");this.form.setSubmitElements(this.widgets.okButton);this.form.setAJAXSubmit(true,{successCallback:{fn:this.onSuccess,scope:this},failureCallback:{fn:this.onFailure,scope:this}});this.form.setSubmitAsJSON(true);this.form.setShowSubmitStateDynamically(true,false);this.form.init();this._showDialog()}},onBeforeFormRuntimeInit:function c(p,o){var q=o[1].component,r=o[1].runtime;this.widgets.okButton=q.buttons.submit;this.widgets.okButton.set("label",this.msg("button.save"));this.widgets.cancelButton=q.buttons.cancel;this.widgets.cancelButton.set("onclick",{fn:this.onCancel,scope:this});this.form=r;this.form.setAJAXSubmit(true,{successCallback:{fn:this.onSuccess,scope:this},failureCallback:{fn:this.onFailure,scope:this}});this.formsServiceDeferred.fulfil("onBeforeFormRuntimeInit")},onCancel:function h(o,p){this.hide()},onSuccess:function i(o){this.hide();if(!o){if(this.options.onFailure&&typeof this.options.onFailure.fn=="function"){this.options.onFailure.fn.call(this.options.onFailure.scope,null,this.options.onFailure.obj)}else{Alfresco.util.PopupManager.displayMessage({text:this.options.failureMessage||"Operation failed."})}}else{if(this.options.onSuccess&&typeof this.options.onSuccess.fn=="function"){this.options.onSuccess.fn.call(this.options.onSuccess.scope,o,this.options.onSuccess.obj)}else{Alfresco.util.PopupManager.displayMessage({text:this.options.successMessage||"Operation succeeded."})}}},onFailure:function m(o){if(this.isFormOwner){this.widgets.okButton.set("disabled",false);this.widgets.cancelButton.set("disabled",false)}this.form.updateSubmitElements();if(typeof this.options.onFailure.fn=="function"){this.options.onFailure.fn.call(this.options.onFailure.scope,o,this.options.onFailure.obj)}else{if(o.json&&o.json.message&&o.json.status.name){Alfresco.util.PopupManager.displayPrompt({title:o.json.status.name,text:o.json.message})}else{Alfresco.util.PopupManager.displayPrompt({title:this.msg("message.failure"),text:o.serverResponse})}}}});var l=new Alfresco.module.SimpleDialog("null")})();