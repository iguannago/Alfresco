(function(){var d=YAHOO.util.Dom,G=YAHOO.util.Event,v=YAHOO.util.Element;var x=Alfresco.util.encodeHTML;Alfresco.TopicReplies=function(I){this.name="Alfresco.TopicReplies";this.id=I;this.widgets={};this.editData={formDiv:null,viewDiv:null};Alfresco.util.ComponentManager.register(this);Alfresco.util.YUILoaderHelper.require(["dom","event","element"],this.onComponentsLoaded,this);YAHOO.Bubbling.on("addReplyToPost",this.onAddReplyToPost,this);YAHOO.Bubbling.on("topicDataChanged",this.onTopicDataChanged,this);return this};Alfresco.TopicReplies.prototype={options:{siteId:"",containerId:"discussions",topicRef:"",topicId:"",topicTitle:""},editData:null,repliesData:null,widgets:null,setOptions:function s(I){this.options=YAHOO.lang.merge(this.options,I);return this},setMessages:function f(I){Alfresco.util.addMessages(I,this.name);return this},onComponentsLoaded:function u(){G.onContentReady(this.id,this.onReady,this,true)},onReady:function C(){var J=this;var L=function K(P,O){var N=YAHOO.Bubbling.getOwnerByTagName(O[1].anchor,"div");if(N!==null){var R="";R=N.className;if(typeof J[R]=="function"){var S="";S=N.id;var Q="";Q=S.substring((J.id+"-"+R+"-").length);Q=J.toNodeRef(Q);J[R].call(J,Q);O[1].stop=true}}return true};YAHOO.Bubbling.addDefaultAction("reply-action-link",L);var I=function M(P,O){var N=YAHOO.Bubbling.getOwnerByTagName(O[1].anchor,"a");if(N!==null){var R="";R=N.className;if(typeof J[R]=="function"){var S="";S=N.id;var Q="";Q=S.substring((J.id+"-"+R+"-").length);Q=J.toNodeRef(Q);J[R].call(J,Q);O[1].stop=true}}return true};YAHOO.Bubbling.addDefaultAction("showHideChildren",I);Alfresco.util.rollover.registerHandlerFunctions(this.id,this.onReplyElementMouseEntered,this.onReplyElementMouseExited,this)},onAddReplyToPost:function D(J,I){var K=I[1];if(K&&(K.postRef!==null)){this.onAddReply(K.postRef)}},onTopicDataChanged:function B(J,I){var L=this.options.topicRef;var K=I[1];if(K&&(K.topicRef!==null)&&(K.topicId!==null)&&(K.topicTitle!==null)){this.options.topicRef=K.topicRef;this.options.topicId=K.topicId;this.options.topicTitle=K.topicTitle;if(this.repliesData===null||(L!=this.repliesData.topicRef)){this._loadRepliesData()}}},_loadRepliesData:function q(){var J=function K(L){var M=L.json.items;this.repliesData=M;this.renderUI()};var I=YAHOO.lang.substitute(Alfresco.constants.URL_SERVICECONTEXT+"components/forum/post/site/{site}/{container}/{topicId}/replies?levels={levels}",{site:this.options.siteId,container:this.options.containerId,topicId:this.options.topicId,levels:999});Alfresco.util.Ajax.request({url:I,successCallback:{fn:J,scope:this},failureMessage:this._msg("message.loadreplies.failure")})},toNodeRef:function(I){return I.replace(/_/,"://").replace(/_/,"/")},toSafeRef:function(I){return I.replace(":/","").replace("/","_").replace("/","_")},renderUI:function z(){var L=d.get(this.id+"-replies-root");L.innerHTML="";var J=new v(L);var K=document.createElement("div");K.setAttribute("id","reply-add-form-"+this.toSafeRef(this.options.topicRef));J.appendChild(K);for(var I=0;I<this.repliesData.length;I++){this.renderReply(L,this.repliesData[I],false)}Alfresco.util.rollover.registerListenersByClassName(this.id,"reply","div");d.removeClass(L,"hidden")},renderReply:function H(I,M,L){var P=document.createElement("div");var J=this.toSafeRef(M.nodeRef);var N="";N+='<div class="reply" id="reply-'+J+'">';N+="</div>";N+='<div id="reply-edit-form-'+J+'" class="hidden"></div>';N+='<div id="reply-add-form-'+J+'" class="indented hidden"></div>';N+='<div class="indented" id="replies-of-'+J+'"></div>';P.innerHTML=N;I.appendChild(P);var Q=d.get("reply-"+J);this.renderReplyView(Q,M);if(M.children!==undefined){var K=d.get("replies-of-"+J);for(var O=0;O<M.children.length;O++){this.renderReply(K,M.children[O],false)}}if(L){Alfresco.util.Anim.pulse(Q);this._scrollToElement(Q)}},renderReplyView:function p(L,K){var I=this.toSafeRef(K.nodeRef);var J="";J+='<div class="nodeEdit">';if(K.permissions.reply){J+='<div class="onAddReply" id="'+this.id+"-onAddReply-"+I+'">';J+='<a href="#" class="reply-action-link">'+this._msg("action.reply")+"</a>";J+="</div>"}if(K.permissions.edit){J+='<div class="onEditReply" id="'+this.id+"-onEditReply-"+I+'">';J+='<a href="#" class="reply-action-link">'+this._msg("action.edit")+"</a>";J+="</div>"}J+="</div>";J+='<div class="authorPicture">'+Alfresco.util.people.generateUserAvatarImg(K.author)+"</div>";J+='<div class="nodeContent">';J+='<div class="userLink">'+Alfresco.util.people.generateUserLink(K.author)+" "+this._msg("post.said")+": ";if(K.isUpdated){J+='<span class="theme-color-2 nodeStatus">('+this._msg("post.updated")+")</span>"}J+="</div>";J+='<div class="content yuieditor">'+K.content+"</div>";J+="</div>";J+='<div class="nodeFooter">';J+='<span class="nodeAttrLabel replyTo">'+this._msg("replies")+": </span>";J+='<span class="nodeAttrValue">('+(K.children!==undefined?K.children.length:0)+") </span>";if(K.replyCount>0){J+='<span class="nodeAttrValue">';J+='<a href="#" class="showHideChildren" id="'+this.id+"-showHideChildren-"+I+'">'+this._msg("replies.hide")+"</a>";J+="</span>"}J+='<span class="separator">&nbsp;</span>';J+='<span class="nodeAttrLabel">'+this._msg("post.postedOn")+": </span>";J+='<span class="nodeAttrValue">'+Alfresco.util.formatDate(K.createdOn)+"</span>";J+="</div>";L.innerHTML=J},rerenderReplyUI:function b(K,J){var I=d.get("reply-"+this.toSafeRef(K));var L=this.findReplyDataObject(K);this.renderReplyView(I,L);if(J){Alfresco.util.Anim.pulse(I)}},onAddReply:function e(I){this._loadEditForm(I,false)},onEditReply:function n(I){this._loadEditForm(I,true)},showHideChildren:function A(J){var I=d.get("replies-of-"+this.toSafeRef(J));if(d.hasClass(I,"hidden")){this._showChildren(J)}else{this._hideChildren(J)}},_loadEditForm:function w(I,J){var K=this.id+this.toSafeRef(I)+(J?"-edit":"-add");Alfresco.util.Ajax.request({url:Alfresco.constants.URL_SERVICECONTEXT+"modules/discussions/replies/reply-form",dataObj:{htmlid:K},successCallback:{fn:this._onEditFormLoaded,scope:this,obj:{isEdit:J,nodeRef:I,formId:K}},failureMessage:this._msg("message.loadeditform.failure")})},_onEditFormLoaded:function F(L,N){this._hideOpenForms();var I=this.toSafeRef(N.nodeRef);var J=null;if(N.isEdit){J=d.get("reply-edit-form-"+I)}else{J=d.get("reply-add-form-"+I)}J.innerHTML=L.serverResponse.responseText;var O=this.findReplyDataObject(N.nodeRef);var K="";var S="";var Q="";var M="";var P=null;if(N.isEdit){P=d.get("reply-"+I);K=YAHOO.lang.substitute(Alfresco.constants.PROXY_URI+"api/forum/post/node/{nodeRef}",{nodeRef:N.nodeRef.replace(":/","")});S=this._msg("form.updateTitle");M=this._msg("action.update");Q=O.content}else{K=YAHOO.lang.substitute(Alfresco.constants.PROXY_URI+"api/forum/post/node/{nodeRef}/replies",{nodeRef:N.nodeRef.replace(":/","")});if(O!==null){S=this._msg("form.replyToTitle",Alfresco.util.people.generateUserLink(O.author))}else{S=this._msg("form.replyTitle")}M=this._msg("action.create")}var R=N.formId;d.get(R+"-form-title").innerHTML=S;d.get(R+"-form").setAttribute("action",K);d.get(R+"-site").setAttribute("value",this.options.siteId);d.get(R+"-container").setAttribute("value",this.options.containerId);d.get(R+"-submit").setAttribute("value",M);d.get(R+"-content").value=Q;this.editData={nodeRef:N.nodeRef,isEdit:N.isEdit,formId:R,viewDiv:P,formDiv:J};this._registerEditForm(N.nodeRef,R,N.isEdit)},_registerEditForm:function y(J,M,K){this.widgets.okButton=new YAHOO.widget.Button(M+"-submit",{type:"submit"});this.widgets.cancelButton=new YAHOO.widget.Button(M+"-cancel",{type:"button"});this.widgets.cancelButton.subscribe("click",this.onFormCancelButtonClick,this,true);this.widgets.editor=new Alfresco.util.RichEditor(Alfresco.constants.HTML_EDITOR,M+"-content",this.options.editorConfig);this.widgets.editor.addPageUnloadBehaviour(this._msg("message.unsavedChanges.reply"));this.widgets.editor.render();var I=(Alfresco.constants.HTML_EDITOR==="YAHOO.widget.SimpleEditor")?"editorKeyUp":"onKeyUp";this.widgets.editor.subscribe(I,function(N){if(this.widgets.editor.getContent().length<20||this.widgets.okButton.get("disabled")){this.widgets.editor.save();this.widgets.form.updateSubmitElements()}},this,true);this.widgets.form=new Alfresco.forms.Form(M+"-form");var L=this.widgets.form;L.setShowSubmitStateDynamically(true,false);L.addValidation(M+"-content",Alfresco.forms.validation.mandatory,null);L.setSubmitElements(this.widgets.okButton);if(K){L.setAjaxSubmitMethod(Alfresco.util.Ajax.PUT)}L.setAJAXSubmit(true,{successMessage:this._msg("message.savereply.success"),successCallback:{fn:this.onFormSubmitSuccess,scope:this,obj:{nodeRef:J,isEdit:K}},failureMessage:this._msg("message.savereply.failure"),failureCallback:{fn:this.onFormSubmitFailure,scope:this}});L.setSubmitAsJSON(true);L.doBeforeFormSubmit={fn:function(N,O){this.widgets.okButton.set("disabled",true);this.widgets.cancelButton.set("disabled",true);this.widgets.editor.save();this.widgets.feedbackMessage=Alfresco.util.PopupManager.displayMessage({text:Alfresco.util.message(this._msg("message.submitting")),spanClass:"wait",displayTime:0})},scope:this};L.init();this._showForm();this._scrollToElement(this.editData.formDiv)},onFormSubmitSuccess:function t(J,L){this.widgets.feedbackMessage.destroy();var K,I;if(L.isEdit){K=this.findReplyDataObject(L.nodeRef);YAHOO.lang.augmentObject(K,J.json.item,true);this.rerenderReplyUI(K.nodeRef,true)}else{if(this.options.topicRef==L.nodeRef){this.repliesData.push(J.json.item);I=d.get(this.id+"-replies-root");this.renderReply(I,J.json.item,true)}else{K=this.findReplyDataObject(L.nodeRef);if(K.children===undefined){K.children=[]}K.children.push(J.json.item);I=d.get("replies-of-"+this.toSafeRef(L.nodeRef));this.renderReply(I,J.json.item,true);this.rerenderReplyUI(L.nodeRef,false)}Alfresco.util.rollover.registerListenersByClassName(this.id,"reply","div")}this._hideOpenForms()},onFormSubmitFailure:function h(I,J){this.widgets.okButton.set("disabled",false);this.widgets.cancelButton.set("disabled",false);this.widgets.feedbackMessage.destroy()},onFormCancelButtonClick:function g(J,I){this._hideOpenForms()},findReplyDataObject:function c(I){return this._findReplyDataObjectImpl(this.repliesData,I)},_findReplyDataObjectImpl:function i(K,L){for(var J=0;J<K.length;J++){if(K[J].nodeRef==L){return K[J]}else{if(K[J].children!==undefined){var I=this._findReplyDataObjectImpl(K[J].children,L);if(I!==null){return I}}}}return null},_showChildren:function o(K){var J=d.get("replies-of-"+this.toSafeRef(K));d.removeClass(J,"hidden");var I=d.get(this.id+"-showHideChildren-"+this.toSafeRef(K));if(I!==null){I.innerHTML=this._msg("replies.hide")}},_hideChildren:function r(K){var J=d.get("replies-of-"+this.toSafeRef(K));d.addClass(J,"hidden");var I=d.get(this.id+"-showHideChildren-"+this.toSafeRef(K));I.innerHTML=this._msg("replies.show")},_hideOpenForms:function l(){if(this.editData.formDiv!==null){d.addClass(this.editData.formDiv,"hidden");this.editData.formDiv.innerHTML="";this.editData.formDiv=null}if(this.editData.viewDiv!==null){d.removeClass(this.editData.viewDiv,"hidden");this.editData.viewDiv=null}},_showForm:function E(){if(this.editData.viewDiv!==null){d.addClass(this.editData.viewDiv,"hidden")}d.removeClass(this.editData.formDiv,"hidden")},_scrollToElement:function k(I){var J=d.getY(I);if(YAHOO.env.ua.ie>0){J=J-(document.body.clientHeight/3)}else{J=J-(window.innerHeight/3)}window.scrollTo(0,J)},onReplyElementMouseEntered:function a(J,I){var L=I[1].target.id.substring(("reply-").length);L=this.toNodeRef(L);var M=this.findReplyDataObject(L),K=M.permissions;if(!(K.edit||K.reply||K["delete"])){return}d.addClass(I[1].target,"over")},onReplyElementMouseExited:function m(J,I){d.removeClass(I[1].target,"over")},_msg:function j(I){return Alfresco.util.message.call(this,I,"Alfresco.TopicReplies",Array.prototype.slice.call(arguments).slice(1))}}})();