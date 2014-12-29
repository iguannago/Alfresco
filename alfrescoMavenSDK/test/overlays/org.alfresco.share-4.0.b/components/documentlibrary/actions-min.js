(function(){var w=Alfresco.util.encodeHTML,q=Alfresco.util.combinePaths,B=Alfresco.util.siteURL,F=Alfresco.util.isValueSet;Alfresco.doclib.Actions={};Alfresco.doclib.Actions.prototype={actionsView:null,onRegisterAction:function H(K,J){var L=J[1];if(L&&F(L.actionName)&&F(L.fn)){this.registerAction(L.actionName,L.fn)}else{Alfresco.logger.error("DL_onRegisterAction: Custom action registion invalid: "+L)}},registerAction:function n(J,K){if(F(J)&&F(K)){this.constructor.prototype[J]=K;return true}return false},renderAction:function f(K,N){var J=Alfresco.constants.URL_RESCONTEXT+"components/documentlibrary/actions/",O='style="background-image:url('+J+'{icon}-16.png)" ',M={link:'<div class="{id}"><a title="{label}" class="simple-link" href="{href}" '+O+"{target}><span>{label}</span></a></div>",pagelink:'<div class="{id}"><a title="{label}" class="simple-link" href="{pageUrl}" '+O+"><span>{label}</span></a></div>",javascript:'<div class="{id}" title="{jsfunction}"><a title="{label}" class="action-link" href="#"'+O+"><span>{label}</span></a></div>"};N.actionParams[K.id]=K.params;var L={id:K.id,icon:K.icon,label:Alfresco.util.substituteDotNotation(this.msg(K.label),N)};if(K.type==="link"){if(K.params.href){L.href=Alfresco.util.substituteDotNotation(K.params.href,N);L.target=K.params.target?'target="'+K.params.target+'"':""}else{Alfresco.logger.warn("Action configuration error: Missing 'href' parameter for actionId: ",K.id)}}else{if(K.type==="pagelink"){if(K.params.page){L.pageUrl=B(Alfresco.util.substituteDotNotation(K.params.page,N))}else{Alfresco.logger.warn("Action configuration error: Missing 'page' parameter for actionId: ",K.id)}}else{if(K.type==="javascript"){if(K.params["function"]){L.jsfunction=K.params["function"]}else{Alfresco.logger.warn("Action configuration error: Missing 'function' parameter for actionId: ",K.id)}}}}return YAHOO.lang.substitute(M[K.type],L)},getActionUrls:function E(N,K){var L=N.jsNode,R=L.isLink?L.linkedNode.nodeRef:L.nodeRef,P=R.toString(),J=R.uri,M=L.contentURL,S=N.workingCopy||{},O=YAHOO.lang.isString(K)?{site:K}:null,Q=Alfresco.util.bind(function(T){return Alfresco.util.siteURL(T,O)},this);return({downloadUrl:q(Alfresco.constants.PROXY_URI,M)+"?a=true",viewUrl:q(Alfresco.constants.PROXY_URI,M)+'" target="_blank',documentDetailsUrl:Q("document-details?nodeRef="+P),folderDetailsUrl:Q("folder-details?nodeRef="+P),editMetadataUrl:Q("edit-metadata?nodeRef="+P),inlineEditUrl:Q("inline-edit?nodeRef="+P),managePermissionsUrl:Q("manage-permissions?nodeRef="+P),manageTranslationsUrl:Q("manage-translations?nodeRef="+P),workingCopyUrl:Q("document-details?nodeRef="+(S.workingCopyNodeRef||P)),workingCopySourceUrl:Q("document-details?nodeRef="+(S.sourceNodeRef||P)),viewGoogleDocUrl:S.googleDocUrl+'" target="_blank',explorerViewUrl:q(this.options.repositoryUrl,"/n/showSpaceDetails/",J)+'" target="_blank',sourceRepositoryUrl:this.viewInSourceRepositoryURL(N)+'" target="_blank'})},getAction:function e(K,J,O){var Q=J.getAttribute("class"),N=Alfresco.util.findInArray(K.actions,Q,"id")||{};if(O===false){return N}else{N=Alfresco.util.deepCopy(N);var P=N.params||{};for(var L in P){P[L]=YAHOO.lang.substitute(P[L],K,function M(S,T,R){return Alfresco.util.findValueByDotNotation(K,S)})}return N}},getParentNodeRef:function G(K){var N=null;if(YAHOO.lang.isArray(K)){try{N=this.doclistMetadata.parent.nodeRef}catch(O){N=null}if(N===null){for(var M=1,L=K.length,J=true;M<L&&J;M++){J=(K[M].parent.nodeRef==K[M-1].parent.nodeRef)}N=J?K[0].parent.nodeRef:this.doclistMetadata.container}}else{N=K.parent.nodeRef}return N},onActionDetails:function d(M){var S=this,O=M.nodeRef,L=M.jsNode;var Q=function J(U,V){var T='<span class="light">'+w(M.displayName)+"</span>";Alfresco.util.populateHTML([V.id+"-dialogTitle",S.msg("edit-details.title",T)]);this.widgets.editMetadata=Alfresco.util.createYUIButton(V,"editMetadata",null,{type:"link",label:S.msg("edit-details.label.edit-metadata"),href:B("edit-metadata?nodeRef="+O)})};var K=YAHOO.lang.substitute(Alfresco.constants.URL_SERVICECONTEXT+"components/form?itemKind={itemKind}&itemId={itemId}&destination={destination}&mode={mode}&submitType={submitType}&formId={formId}&showCancelButton=true",{itemKind:"node",itemId:O,mode:"edit",submitType:"json",formId:"doclib-simple-metadata"});var R=new Alfresco.module.SimpleDialog(this.id+"-editDetails-"+Alfresco.util.generateDomId());R.setOptions({width:"40em",templateUrl:K,actionUrl:null,destroyOnHide:true,doBeforeDialogShow:{fn:Q,scope:this},onSuccess:{fn:function N(U){Alfresco.util.Ajax.request({url:q(Alfresco.constants.URL_SERVICECONTEXT,"components/documentlibrary/data/node/",L.nodeRef.uri)+"?view="+this.actionsView,successCallback:{fn:function V(X){var W=X.json.item;W.jsNode=new Alfresco.util.Node(X.json.item.node);YAHOO.Bubbling.fire(W.node.isContainer?"folderRenamed":"fileRenamed",{file:W});YAHOO.Bubbling.fire("tagRefresh");Alfresco.util.PopupManager.displayMessage({text:this.msg("message.details.success")})},scope:this},failureCallback:{fn:function T(W){Alfresco.util.PopupManager.displayMessage({text:this.msg("message.details.failure")})},scope:this}})},scope:this},onFailure:{fn:function P(T){Alfresco.util.PopupManager.displayMessage({text:this.msg("message.details.failure")})},scope:this}}).show()},onActionLocate:function s(J){var L=J.jsNode,M=J.location.path,K=L.isLink?L.linkedNode.properties.name:J.displayName;if(Alfresco.util.isValueSet(this.options.siteId)&&J.location.site.name!==this.options.siteId){window.location=B("documentlibrary?file="+encodeURIComponent(K)+"&path="+encodeURIComponent(M),{site:J.location.site.name})}else{this.options.highlightFile=K;YAHOO.Bubbling.fire("changeFilter",{filterId:"path",filterData:M})}},onActionDelete:function D(K){var N=this,M=K.jsNode;Alfresco.util.PopupManager.displayPrompt({title:this.msg("actions."+(M.isContainer?"folder":"document")+".delete"),text:this.msg("message.confirm.delete",K.displayName),buttons:[{text:this.msg("button.delete"),handler:function L(){this.destroy();N._onActionDeleteConfirm.call(N,K)}},{text:this.msg("button.cancel"),handler:function J(){this.destroy()},isDefault:true}]})},_onActionDeleteConfirm:function h(K){var N=K.jsNode,O=K.location.path,P=K.location.file,L=q(O,P),J=K.displayName,M=N.nodeRef;this.modules.actions.genericAction({success:{activity:{siteId:this.options.siteId,activityType:"file-deleted",page:"documentlibrary",activityData:{fileName:P,path:O,nodeRef:M.toString()}},event:{name:N.isContainer?"folderDeleted":"fileDeleted",obj:{path:L}},message:this.msg("message.delete.success",J)},failure:{message:this.msg("message.delete.failure",J)},webscript:{method:Alfresco.util.Ajax.DELETE,name:"file/node/{nodeRef}",params:{nodeRef:M.uri}}})},onActionEditOffline:function b(J){Alfresco.logger.error("onActionEditOffline","Abstract implementation not overridden")},onlineEditMimetypes:{"application/vnd.ms-excel":"Excel.Sheet","application/vnd.ms-powerpoint":"PowerPoint.Slide","application/msword":"Word.Document","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":"Excel.Sheet","application/vnd.openxmlformats-officedocument.presentationml.presentation":"PowerPoint.Slide","application/vnd.openxmlformats-officedocument.wordprocessingml.document":"Word.Document"},onActionEditOnline:function k(J){if(this._launchOnlineEditor(J)){YAHOO.Bubbling.fire("metadataRefresh")}},_launchOnlineEditor:function I(N){var S="SharePoint.OpenDocuments",K=N.jsNode,O=N.location,V=K.mimetype,L=null,M=null,J={xls:"application/vnd.ms-excel",ppt:"application/vnd.ms-powerpoint",doc:"application/msword",xlsx:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",pptx:"application/vnd.openxmlformats-officedocument.presentationml.presentation",docx:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"};if(this.onlineEditMimetypes.hasOwnProperty(V)){L=this.onlineEditMimetypes[V]}else{var R=Alfresco.util.getFileExtension(N.location.file);if(R!==null){R=R.toLowerCase();if(J.hasOwnProperty(R)){V=J[R];if(this.onlineEditMimetypes.hasOwnProperty(V)){L=this.onlineEditMimetypes[V]}}}}if(L!==null){if(!Alfresco.util.isValueSet(N.onlineEditUrl)){var Q=this.doclistMetadata.custom.vtiServer.host+":"+this.doclistMetadata.custom.vtiServer.port+"/"+q("alfresco",O.site.name,O.container.name,O.path,O.file);if(!(/^(http|https):\/\//).test(Q)){Q=window.location.protocol+"//"+Q}N.onlineEditUrl=Q}try{M=new ActiveXObject(S+".3");return M.EditDocument3(window,N.onlineEditUrl,true,L)}catch(P){try{M=new ActiveXObject(S+".2");return M.EditDocument2(window,N.onlineEditUrl,L)}catch(U){try{M=new ActiveXObject(S+".1");return M.EditDocument(N.onlineEditUrl,L)}catch(T){}}}}return window.open(N.onlineEditUrl,"_blank")},onActionCheckoutToGoogleDocs:function C(J){Alfresco.logger.error("onActionCheckoutToGoogleDocs","Abstract implementation not overridden")},onActionCheckinFromGoogleDocs:function z(J){Alfresco.logger.error("onActionCheckinFromGoogleDocs","Abstract implementation not overridden")},onActionSimpleRepoAction:function m(L,J){var N=this.getAction(L,J).params,K=L.displayName;var M={success:{event:{name:"metadataRefresh",obj:L}},failure:{message:this.msg(N.failureMessage,K)},webscript:{method:Alfresco.util.Ajax.POST,stem:Alfresco.constants.PROXY_URI+"api/",name:"actionQueue"},config:{requestContentType:Alfresco.util.Ajax.JSON,dataObj:{actionedUponNode:L.nodeRef,actionDefinitionName:N.action}}};if(YAHOO.lang.isFunction(this[N.success])){M.success.callback={fn:this[N.success],obj:L,scope:this}}if(N.successMessage){M.success.message=this.msg(N.successMessage,K)}if(YAHOO.lang.isFunction(this[N.failure])){M.failure.callback={fn:this[N.failure],obj:L,scope:this}}if(N.failureMessage){M.failure.message=this.msg(N.failureMessage,K)}this.modules.actions.genericAction(M)},onActionFormDialog:function i(L,J){var N=this.getAction(L,J),P=N.params,M={title:this.msg(N.label)},K=L.displayName;delete P["function"];var O=P.success;delete P.success;M.success={fn:function(Q,R){if(YAHOO.lang.isFunction(this[O])){this[O].call(this,Q,R)}YAHOO.Bubbling.fire("metadataRefresh",R)},obj:L,scope:this};if(P.successMessage){M.successMessage=this.msg(P.successMessage,K);delete P.successMessage}if(YAHOO.lang.isFunction(this[P.failure])){M.failure={fn:this[P.failure],obj:L,scope:this};delete P.failure}if(P.failureMessage){M.failureMessage=this.msg(P.failureMessage,K);delete P.failureMessage}M.properties=P;Alfresco.util.PopupManager.displayForm(M)},onActionUploadNewVersion:function y(L){var Q=L.jsNode,K=L.displayName,N=Q.nodeRef,J=L.version;if(!this.fileUpload){this.fileUpload=Alfresco.getFileUploadInstance()}var P=this.msg("label.filter-description",K),M="*";if(K&&new RegExp(/[^\.]+\.[^\.]+/).exec(K)){M="*"+K.substring(K.lastIndexOf("."))}if(L.workingCopy&&L.workingCopy.workingCopyVersion){J=L.workingCopy.workingCopyVersion}var O={updateNodeRef:N.toString(),updateFilename:K,updateVersion:J,overwrite:true,filter:[{description:P,extensions:M}],mode:this.fileUpload.MODE_SINGLE_UPDATE,onFileUploadComplete:{fn:this.onNewVersionUploadComplete,scope:this}};if(Alfresco.util.isValueSet(this.options.siteId)){O.siteId=this.options.siteId;O.containerId=this.options.containerId}this.fileUpload.show(O)},_uploadComplete:function A(J,N){var O=J.successful.length,K,M;if(O>0){if(O<(this.options.groupActivitiesAt||5)){for(var L=0;L<O;L++){M=J.successful[L];K={fileName:M.fileName,nodeRef:M.nodeRef};this.modules.actions.postActivity(this.options.siteId,"file-"+N,"document-details",K)}}else{K={fileCount:O,path:this.currentPath,parentNodeRef:this.doclistMetadata.parent.nodeRef};this.modules.actions.postActivity(this.options.siteId,"files-"+N,"documentlibrary",K)}}},onFileUploadComplete:function u(J){this._uploadComplete(J,"added")},onNewVersionUploadComplete:function a(J){this._uploadComplete(J,"updated")},onActionCancelEditing:function v(K){var J=K.displayName;this.modules.actions.genericAction({success:{event:{name:"metadataRefresh"},message:this.msg("message.edit-cancel.success",J)},failure:{message:this.msg("message.edit-cancel.failure",J)},webscript:{method:Alfresco.util.Ajax.POST,name:"cancel-checkout/node/{nodeRef}",params:{nodeRef:K.jsNode.nodeRef.uri}}})},onActionCopyTo:function p(J){this._copyMoveTo("copy",J)},onActionMoveTo:function t(J){this._copyMoveTo("move",J)},_copyMoveTo:function l(L,K){if(!L in {copy:true,move:true}){throw new Error("'"+L+"' is not a valid Copy/Move to mode.")}if(!this.modules.copyMoveTo){this.modules.copyMoveTo=new Alfresco.module.DoclibCopyMoveTo(this.id+"-copyMoveTo")}var J=[Alfresco.module.DoclibGlobalFolder.VIEW_MODE_SITE];if(this.options.repositoryBrowsing===true){J.push(Alfresco.module.DoclibGlobalFolder.VIEW_MODE_REPOSITORY,Alfresco.module.DoclibGlobalFolder.VIEW_MODE_USERHOME)}this.modules.copyMoveTo.setOptions({allowedViewModes:J,mode:L,siteId:this.options.siteId,containerId:this.options.containerId,path:this.currentPath,files:K,rootNode:this.options.rootNode,parentId:this.getParentNodeRef(K)}).showDialog()},onActionAssignWorkflow:function r(K){var O="",J=this.getParentNodeRef(K);if(YAHOO.lang.isArray(K)){for(var M=0,L=K.length;M<L;M++){O+=(M===0?"":",")+K[M].nodeRef}}else{O=K.nodeRef}var N={selectedItems:O};if(J){N.destination=J}Alfresco.util.navigateTo(B("start-workflow"),"POST",N)},onActionManagePermissions:function o(J){if(!this.modules.permissions){this.modules.permissions=new Alfresco.module.DoclibPermissions(this.id+"-permissions")}this.modules.permissions.setOptions({siteId:this.options.siteId,containerId:this.options.containerId,path:this.currentPath,files:J}).showDialog()},onActionManageAspects:function j(J){if(!this.modules.aspects){this.modules.aspects=new Alfresco.module.DoclibAspects(this.id+"-aspects")}this.modules.aspects.setOptions({file:J}).show()},onActionChangeType:function g(N){var J=N.jsNode,O=J.type,Q=N.displayName,K=Alfresco.constants.PROXY_URI+q("slingshot/doclib/type/node",J.nodeRef.uri);var R=function M(T){T.addValidation(this.id+"-changeType-type",function S(Z,V,Y,X,U,W){return Z.options[Z.selectedIndex].value!=="-"},null,"change");T.setShowSubmitStateDynamically(true,false)};this.modules.changeType=new Alfresco.module.SimpleDialog(this.id+"-changeType").setOptions({width:"30em",templateUrl:Alfresco.constants.URL_SERVICECONTEXT+"modules/documentlibrary/change-type?currentType="+encodeURIComponent(O),actionUrl:K,doSetupFormsValidation:{fn:R,scope:this},firstFocus:this.id+"-changeType-type",onSuccess:{fn:function P(S){YAHOO.Bubbling.fire("metadataRefresh",{highlightFile:Q});Alfresco.util.PopupManager.displayMessage({text:this.msg("message.change-type.success",Q)})},scope:this},onFailure:{fn:function L(S){Alfresco.util.PopupManager.displayMessage({text:this.msg("message.change-type.failure",Q)})},scope:this}});this.modules.changeType.show()},viewInSourceRepositoryURL:function x(L){var M=L.node,K=L.location.repositoryId,J=this.options.replicationUrlMapping,N;if(!K||!J||!J[K]){return"#"}N=this.getActionUrls(L)[M.isContainer?"folderDetailsUrl":"documentDetailsUrl"];N=N.substring(Alfresco.constants.URL_CONTEXT.length);return q(J[K],"/",N)},onActionPublish:function c(J){Alfresco.module.getSocialPublishingInstance().show({nodeRef:J.nodeRef,filename:J.fileName})}}})();