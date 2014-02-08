(function(){var j=YAHOO.util.Dom,n=YAHOO.util.Event,c=YAHOO.util.Element;var h=Alfresco.util.encodeHTML;Alfresco.CreateTopic=function(p){this.name="Alfresco.CreateTopic";this.id=p;this.widgets={};this.modules={};Alfresco.util.ComponentManager.register(this);Alfresco.util.YUILoaderHelper.require(["datasource","json","connection","event","button","menu","editor"],this.onComponentsLoaded,this);return this};Alfresco.CreateTopic.prototype={options:{siteId:"",containerId:"discussions",editMode:false,topicId:""},widgets:null,modules:null,discussionsTopicData:null,setOptions:function o(p){this.options=YAHOO.lang.merge(this.options,p);return this},setMessages:function l(p){Alfresco.util.addMessages(p,this.name);return this},onComponentsLoaded:function g(){YAHOO.util.Event.onContentReady(this.id,this.onReady,this,true)},onReady:function i(){if(this.options.editMode){this._loadDiscussionsTopicData()}else{this._initializeDiscussionsTopicForm()}},_loadDiscussionsTopicData:function k(){var r=this;var s=function p(t){var u=t.json.item;r.discussionsTopicData=u;r._initializeDiscussionsTopicForm()};var q=YAHOO.lang.substitute(Alfresco.constants.URL_SERVICECONTEXT+"components/forum/post/site/{site}/{container}/{topicId}",{site:this.options.siteId,container:this.options.containerId,topicId:this.options.topicId});Alfresco.util.Ajax.request({url:q,method:"GET",responseContentType:"application/json",successCallback:{fn:s,scope:this},failureMessage:this._msg("message.loadpostdata.failure")})},_initializeDiscussionsTopicForm:function m(){var r,p=true,s="",q="";if(this.options.editMode){r=YAHOO.lang.substitute(Alfresco.constants.PROXY_URI+"api/forum/post/site/{site}/{container}/{topicId}",{site:this.options.siteId,container:this.options.containerId,topicId:this.options.topicId})}else{r=YAHOO.lang.substitute(Alfresco.constants.PROXY_URI+"api/forum/site/{site}/{container}/posts",{site:this.options.siteId,container:this.options.containerId})}j.get(this.id+"-form").setAttribute("action",r);j.get(this.id+"-site").setAttribute("value",this.options.siteId);j.get(this.id+"-container").setAttribute("value",this.options.containerId);if(this.options.editMode){s=this.discussionsTopicData.title}j.get(this.id+"-title").setAttribute("value",s);if(this.options.editMode){q=this.discussionsTopicData.content}j.get(this.id+"-content").value=q;this._registerCreateTopicForm()},_registerCreateTopicForm:function e(){this.modules.tagLibrary=new Alfresco.module.TagLibrary(this.id);this.modules.tagLibrary.setOptions({siteId:this.options.siteId});if(this.options.editMode&&this.discussionsTopicData.tags.length>0){this.modules.tagLibrary.setTags(this.discussionsTopicData.tags)}this.widgets.okButton=new YAHOO.widget.Button(this.id+"-submit",{type:"submit"});this.widgets.cancelButton=new YAHOO.widget.Button(this.id+"-cancel");this.widgets.cancelButton.subscribe("click",this.onFormCancelButtonClick,this,true);this.widgets.editor=new Alfresco.util.RichEditor(Alfresco.constants.HTML_EDITOR,this.id+"-content",this.options.editorConfig);this.widgets.editor.addPageUnloadBehaviour(this._msg("message.unsavedChanges.discussion"));this.widgets.editor.render();var p=(Alfresco.constants.HTML_EDITOR==="YAHOO.widget.SimpleEditor")?"editorKeyUp":"onKeyUp";this.widgets.editor.subscribe(p,function(q){if(this.widgets.editor.getContent().length<20||this.widgets.okButton.get("disabled")){this.widgets.editor.save();this.widgets.topicForm.updateSubmitElements()}},this,true);this.widgets.topicForm=new Alfresco.forms.Form(this.id+"-form");this.widgets.topicForm.setShowSubmitStateDynamically(true,false);this.widgets.topicForm.addValidation(this.id+"-title",Alfresco.forms.validation.mandatory,null,"keyup");this.widgets.topicForm.addValidation(this.id+"-title",Alfresco.forms.validation.length,{max:256,crop:true},"keyup");this.widgets.topicForm.addValidation(this.id+"-content",Alfresco.forms.validation.mandatory,null);this.widgets.topicForm.setSubmitElements(this.widgets.okButton);this.widgets.topicForm.setAJAXSubmit(true,{successMessage:this._msg("message.savetopic.success"),successCallback:{fn:this.onFormSubmitSuccess,scope:this},failureMessage:this._msg("message.savetopic.failure"),failureCallback:{fn:this.onFormSubmitFailure,scope:this}});if(this.options.editMode){this.widgets.topicForm.setAjaxSubmitMethod(Alfresco.util.Ajax.PUT)}this.widgets.topicForm.setSubmitAsJSON(true);this.widgets.topicForm.doBeforeFormSubmit={fn:function(q,r){this.widgets.okButton.set("disabled",false);this.widgets.cancelButton.set("disabled",false);this.widgets.editor.save();this.modules.tagLibrary.updateForm(this.id+"-form","tags");this.widgets.feedbackMessage=Alfresco.util.PopupManager.displayMessage({text:Alfresco.util.message(this._msg("message.submitting")),spanClass:"wait",displayTime:0})},scope:this};this.modules.tagLibrary.initialize(this.widgets.topicForm);this.widgets.topicForm.init();j.removeClass(this.id+"-topic-create-div","hidden");j.get(this.id+"-title").focus()},onFormSubmitSuccess:function a(p,r){var q=Alfresco.util.discussions.getTopicViewPage(this.options.siteId,this.options.containerId,p.json.item.name);window.location=q},onFormSubmitFailure:function f(){this.widgets.okButton.set("disabled",false);this.widgets.cancelButton.set("disabled",false);this.widgets.feedbackMessage.destroy()},onFormCancelButtonClick:function b(q,p){history.go(-1)},_msg:function d(p){return Alfresco.util.message.call(this,p,"Alfresco.CreateTopic",Array.prototype.slice.call(arguments).slice(1))}}})();