(function(){var x=YAHOO.util.Dom,w=YAHOO.util.Event,r=YAHOO.util.Selector,k=YAHOO.Bubbling;var t=Alfresco.util.encodeHTML,f=Alfresco.util.activateLinks,s=Alfresco.util.combinePaths,i=Alfresco.util.userProfileLink;Alfresco.component.DataGrid=function(O){Alfresco.component.DataGrid.superclass.constructor.call(this,"Alfresco.component.DataGrid",O,["button","container","datasource","datatable","paginator","animation","history"]);this.datalistMeta={};this.datalistColumns={};this.dataRequestFields=[];this.dataResponseFields=[];this.currentPage=1;this.totalRecords=0;this.showingMoreActions=false;this.currentFilter={filterId:"all",filterData:""};this.selectedItems={};this.afterDataGridUpdate=[];k.on("activeDataListChanged",this.onActiveDataListChanged,this);k.on("changeFilter",this.onChangeFilter,this);k.on("filterChanged",this.onFilterChanged,this);k.on("dataListDetailsUpdated",this.onDataListDetailsUpdated,this);k.on("dataItemCreated",this.onDataItemCreated,this);k.on("dataItemUpdated",this.onDataItemUpdated,this);k.on("dataItemsDeleted",this.onDataItemsDeleted,this);k.on("dataItemsDuplicated",this.onDataGridRefresh,this);this.deferredListPopulation=new Alfresco.util.Deferred(["onReady","onActiveDataListChanged"],{fn:this.populateDataGrid,scope:this});return this};YAHOO.extend(Alfresco.component.DataGrid,Alfresco.component.Base);YAHOO.lang.augmentProto(Alfresco.component.DataGrid,Alfresco.service.DataListActions);YAHOO.lang.augmentObject(Alfresco.component.DataGrid.prototype,{options:{siteId:"",containerId:"dataLists",usePagination:false,initialPage:1,pageSize:50,initialFilter:{},actionsPopupTimeout:500,loadingMessageDelay:1000,splitActionsAt:3},currentPage:null,totalRecords:null,currentFilter:null,selectedItems:null,currentActionsMenu:null,showingMoreActions:null,deferredActionsMenu:null,afterDataGridUpdate:null,datalistMeta:null,datalistColumns:null,dataRequestFields:null,dataResponseFields:null,fnRenderCellSelected:function u(){var O=this;return function P(R,Q,S,T){x.setStyle(R,"width",S.width+"px");x.setStyle(R.parentNode,"width",S.width+"px");R.innerHTML='<input id="checkbox-'+Q.getId()+'" type="checkbox" name="fileChecked" value="'+T+'"'+(O.selectedItems[T]?' checked="checked">':">")}},fnRenderCellActions:function K(){var P=this;return function O(R,Q,S,T){x.setStyle(R,"width",S.width+"px");x.setStyle(R.parentNode,"width",S.width+"px");R.innerHTML='<div id="'+P.id+"-actions-"+Q.getId()+'" class="hidden"></div>'}},getCellFormatter:function j(){var P=this;return function O(W,Y,U,Q){var T="";if(!Y){Y=this.getRecord(W)}if(!U){U=this.getColumn(W.parentNode.cellIndex)}if(Y&&U){if(!Q){Q=Y.getData("itemData")[U.field]}if(Q){var V=P.datalistColumns[U.key];if(V){Q=YAHOO.lang.isArray(Q)?Q:[Q];for(var S=0,X=Q.length,R;S<X;S++){R=Q[S];switch(V.dataType.toLowerCase()){case"cm:person":T+='<span class="person">'+i(R.metadata,R.displayValue)+"</span>";break;case"datetime":T+=Alfresco.util.formatDate(Alfresco.util.fromISO8601(R.value),P.msg("date-format.default"));break;case"date":T+=Alfresco.util.formatDate(Alfresco.util.fromISO8601(R.value),P.msg("date-format.defaultDateOnly"));break;case"text":T+=f(t(R.displayValue));break;default:if(V.type=="association"){T+='<a href="'+Alfresco.util.siteURL((R.metadata=="container"?"folder":"document")+"-details?nodeRef="+R.value)+'">';T+='<img src="'+Alfresco.constants.URL_RESCONTEXT+"components/images/filetypes/"+Alfresco.util.getFileIcon(R.displayValue,(R.metadata=="container"?"cm:folder":null),16)+'" width="16" alt="'+t(R.displayValue)+'" title="'+t(R.displayValue)+'" />';T+=" "+t(R.displayValue)+"</a>"}else{T+=f(t(R.displayValue))}break}if(S<X-1){T+="<br />"}}}}}W.innerHTML=T}},getSortFunction:function E(){return function O(R,P,W,V){var U=R.getData().itemData[V],T=P.getData().itemData[V];if(YAHOO.lang.isArray(U)){U=U[0]}if(YAHOO.lang.isArray(T)){T=T[0]}if(!YAHOO.lang.isValue(U)){return(!YAHOO.lang.isValue(T))?0:1}else{if(!YAHOO.lang.isValue(T)){return -1}}var S=U.value,Q=T.value;if(S.indexOf&&S.indexOf("workspace://SpacesStore")==0){S=U.displayValue;Q=T.displayValue}return YAHOO.util.Sort.compare(S,Q,W)}},onReady:function b(){var R=this;this.widgets.itemSelect=Alfresco.util.createYUIButton(this,"itemSelect-button",this.onItemSelect,{type:"menu",menu:"itemSelect-menu",disabled:true});var P=function Q(V,U){var T=k.getOwnerByTagName(U[1].anchor,"div");if(T!==null){if(typeof R[T.className]=="function"){U[1].stop=true;var W=R.widgets.dataTable.getRecord(U[1].target.offsetParent).getData();R[T.className].call(R,W,T)}}return true};k.addDefaultAction("action-link",P);k.addDefaultAction("show-more",P);var S=function O(V,U){var T=U[1].anchor;if(T!==null){var W=T.rel,X,Y={};if(W&&W!==""){U[1].stop=true;X=W.split("|");Y={filterOwner:window.unescape(X[0]||""),filterId:window.unescape(X[1]||""),filterData:window.unescape(X[2]||""),filterDisplay:window.unescape(X[3]||"")};Alfresco.logger.debug("DL_fnChangeFilterHandler","changeFilter =>",Y);k.fire("changeFilter",Y)}}return true};k.addDefaultAction("filter-change",S);this.modules.actions=new Alfresco.module.DataListActions();this.modules.dataGrid=this;x.removeClass(this.id+"-selectListMessage","hidden");this.deferredListPopulation.fulfil("onReady");x.setStyle(this.id+"-body","visibility","visible")},onHistoryManagerReady:function h(){Alfresco.logger.debug("DataGrid_onHistoryManagerReady","changeFilter =>",this.options.initialFilter);k.fire("changeFilter",YAHOO.lang.merge({datagridFirstTimeNav:true},this.options.initialFilter))},_onDataListFailure:function a(Q,P){Alfresco.util.PopupManager.displayPrompt({title:P.title,text:P.text,modal:true,buttons:[{text:this.msg("button.ok"),handler:function O(){this.destroy()},isDefault:true}]})},renderDataListMeta:function m(){if(!YAHOO.lang.isObject(this.datalistMeta)){return}Alfresco.util.populateHTML([this.id+"-title",t(this.datalistMeta.title)],[this.id+"-description",f(t(this.datalistMeta.description,true))])},populateDataGrid:function L(){if(!YAHOO.lang.isObject(this.datalistMeta)){return}this.renderDataListMeta();Alfresco.util.Ajax.jsonGet({url:s(Alfresco.constants.URL_SERVICECONTEXT,"components/data-lists/config/columns?itemType="+encodeURIComponent(this.datalistMeta.itemType)),successCallback:{fn:this.onDatalistColumns,scope:this},failureCallback:{fn:this._onDataListFailure,obj:{title:this.msg("message.error.columns.title"),text:this.msg("message.error.columns.description")},scope:this}})},onDatalistColumns:function C(O){this.datalistColumns=O.json.columns;this._setupHistoryManagers();this._setupDataSource();this._setupDataTable();x.addClass(this.id+"-selectListMessage","hidden");this.widgets.itemSelect.set("disabled",false);YAHOO.util.History.onReady(this.onHistoryManagerReady,this,true)},_setupHistoryManagers:function l(){var R=YAHOO.util.History.getBookmarkedState("filter");R=R===null?"all":(YAHOO.env.ua.gecko>0)?R:window.escape(R);try{while(R!=(R=decodeURIComponent(R))){}}catch(W){}var P=function X(Z){var aa=Z.split("|"),ab={filterId:window.unescape(aa[0]||""),filterData:window.unescape(aa[1]||"")};ab.filterOwner=Alfresco.util.FilterManager.getOwner(ab.filterId);return ab};this.options.initialFilter=P(R);YAHOO.util.History.register("filter",R,function O(Z){Alfresco.logger.debug("HistoryManager: filter changed:"+Z);if(YAHOO.env.ua.gecko>0){Z=window.unescape(Z);Alfresco.logger.debug("HistoryManager: filter (after Firefox fix):"+Z)}this._updateDataGrid.call(this,{filter:P(Z)})},null,this);var V=this;var Q=function Y(aa,Z){Z.widgets.paginator.setState(aa);YAHOO.util.History.navigate("page",String(aa.page))};if(this.options.usePagination){var U=YAHOO.util.History.getBookmarkedState("page")||"1";while(U!=(U=decodeURIComponent(U))){}this.currentPage=parseInt(U||this.options.initialPage,10);YAHOO.util.History.register("page",U,function S(Z){Alfresco.logger.debug("HistoryManager: page changed:"+Z);V.widgets.paginator.setPage(parseInt(Z,10))},null,this);this.widgets.paginator=new YAHOO.widget.Paginator({containers:[this.id+"-paginator",this.id+"-paginatorBottom"],rowsPerPage:this.options.pageSize,initialPage:this.currentPage,template:this.msg("pagination.template"),pageReportTemplate:this.msg("pagination.template.page-report"),previousPageLinkLabel:this.msg("pagination.previousPageLinkLabel"),nextPageLinkLabel:this.msg("pagination.nextPageLinkLabel")});this.widgets.paginator.subscribe("changeRequest",Q,this);x.setStyle(this.id+"-datagridBarBottom","display","block")}try{YAHOO.util.History.initialize("yui-history-field","yui-history-iframe")}catch(T){Alfresco.logger.error(this.name+": Couldn't initialize HistoryManager.",T);this.onHistoryManagerReady()}},_setupDataSource:function z(){var U=new Alfresco.util.NodeRef(this.datalistMeta.nodeRef);for(var R=0,T=this.datalistColumns.length;R<T;R++){var S=this.datalistColumns[R],Q=S.name.replace(":","_"),P=(S.type=="property"?"prop":"assoc")+"_"+Q;this.dataRequestFields.push(Q);this.dataResponseFields.push(P);this.datalistColumns[P]=S}this.widgets.dataSource=new YAHOO.util.DataSource(Alfresco.constants.PROXY_URI+"slingshot/datalists/data/node/"+U.uri,{connMethodPost:true,responseType:YAHOO.util.DataSource.TYPE_JSON,responseSchema:{resultsList:"items",metaFields:{paginationRecordOffset:"startIndex",totalRecords:"totalRecords"}}});this.widgets.dataSource.connMgr.setDefaultPostHeader(Alfresco.util.Ajax.JSON);this.widgets.dataSource.doBeforeCallback=function O(X,V,Y){var W=V.metadata.parent.permissions;if(W&&W.userAccess){k.fire("userAccess",{userAccess:W.userAccess})}return Y}},_setupDataTable:function A(Q){var S=[{key:"nodeRef",label:"",sortable:false,formatter:this.fnRenderCellSelected(),width:16}];var P;for(var R=0,W=this.datalistColumns.length;R<W;R++){P=this.datalistColumns[R];S.push({key:this.dataResponseFields[R],label:P.label,sortable:true,sortOptions:{field:P.formsName,sortFunction:this.getSortFunction()},formatter:this.getCellFormatter(P.dataType)})}S.push({key:"actions",label:this.msg("label.column.actions"),sortable:false,formatter:this.fnRenderCellActions(),width:80});var V=this;this.widgets.dataTable=new YAHOO.widget.DataTable(this.id+"-grid",S,this.widgets.dataSource,{renderLoopSize:this.options.usePagination?16:32,initialLoad:false,dynamicData:false,MSG_EMPTY:this.msg("message.empty"),MSG_ERROR:this.msg("message.error"),paginator:this.widgets.paginator});this.widgets.dataTable.handleDataReturnPayload=function O(Y,X,Z){V.totalRecords=X.meta.totalRecords;X.meta.pagination={rowsPerPage:V.options.pageSize,recordOffset:(V.currentPage-1)*V.options.pageSize};return X.meta};this.widgets.dataTable.doBeforeLoadData=function U(Y,Z,ab){if(Z.error){try{var X=YAHOO.lang.JSON.parse(Z.responseText);V.widgets.dataTable.set("MSG_ERROR",X.message)}catch(aa){V._setDefaultDataTableErrors(V.widgets.dataTable)}}if(Z.results.length===0){this.fireEvent("renderEvent",{type:"renderEvent"})}return true};this.widgets.dataTable.doBeforeSortColumn=function T(Y,X){return true};this.widgets.dataTable.subscribe("checkboxClickEvent",function(X){var Y=X.target.value;this.selectedItems[Y]=X.target.checked;k.fire("selectedItemsChanged")},this,true);this.widgets.dataTable.subscribe("renderEvent",function(){Alfresco.logger.debug("DataTable renderEvent");if(YAHOO.env.ua.ie<7){var X=this.widgets.dataTable.getTableEl().parentNode;X.className=X.className}for(var Z=0,Y=this.afterDataGridUpdate.length;Z<Y;Z++){this.afterDataGridUpdate[Z].call(this)}this.afterDataGridUpdate=[]},this,true);this.widgets.dataTable.subscribe("rowMouseoverEvent",this.onEventHighlightRow,this,true);this.widgets.dataTable.subscribe("rowMouseoutEvent",this.onEventUnhighlightRow,this,true)},onItemSelect:function e(S,R,Q){var O=R[0],P=R[1];this.selectItems(Alfresco.util.findEventClass(P));w.preventDefault(O)},onEventHighlightRow:function d(ag){var P=x.get(this.id+"-actions-"+ag.target.id);if(P&&P.firstChild===null){this.widgets.dataTable.onEventHighlightRow.call(this.widgets.dataTable,ag);var Q=this.widgets.dataTable.getRecord(ag.target.id),ah=x.get(this.id+"-actionSet").cloneNode(true);ah.innerHTML=YAHOO.lang.substitute(window.unescape(ah.innerHTML),this.getActionUrls(Q));ah.id=P.id+"_a";x.addClass(ah,"simple");var ai=Q.getData("permissions").userAccess,V=Q.getData("actionLabels")||{};ai["filter-"+this.currentFilter.filterId]=true;var W=YAHOO.util.Selector.query("div",ah),Z,aa,ae,O,T,ac,X,ab,af;for(ac=0,X=W.length;ac<X;ac++){Z=W[ac];aa=Z.firstChild;ae=aa.firstChild;if(ae&&V[Z.className]){ae.innerHTML=t(V[Z.className])}if(aa.rel!==""){O=aa.rel.split(",");for(ab=0,af=O.length;ab<af;ab++){T=O[ab];if((T.charAt(0)=="~")?!!ai[T.substring(1)]:!ai[T]){ah.removeChild(Z);break}}}}var U=this.options.splitActionsAt;W=YAHOO.util.Selector.query("div",ah);if(W.length>U){var R=x.get(this.id+"-moreActions").cloneNode(true);var ad=YAHOO.util.Selector.query("div",R);x.insertBefore(ad[0],W[U]);x.insertBefore(ad[1],W[U]);var S,Y=W.slice(U);for(S in Y){if(Y.hasOwnProperty(S)){ad[1].appendChild(Y[S])}}}P.appendChild(ah)}if(this.showingMoreActions){this.deferredActionsMenu=P}else{if(!x.hasClass(document.body,"masked")){this.currentActionsMenu=P;x.removeClass(P,"hidden");this.deferredActionsMenu=null}}},onEventUnhighlightRow:function g(P){this.widgets.dataTable.onEventUnhighlightRow.call(this.widgets.dataTable,P);var O=x.get(this.id+"-actions-"+(P.target.id));if(!this.showingMoreActions||x.hasClass(document.body,"masked")){x.addClass(O,"hidden");this.deferredActionsMenu=null}},getActionUrls:function I(P){var O=YAHOO.lang.isFunction(P.getData)?P.getData():P,Q=O.nodeRef;return({editMetadataUrl:"edit-dataitem?nodeRef="+Q})},getSelectedItems:function H(){var P=[],S=this.widgets.dataTable.getRecordSet(),U=this.widgets.paginator.getPageRecords(),Q=U[0],T=U[1],O;for(var R=Q;R<=T;R++){O=S.getRecord(R);if(this.selectedItems[O.getData("nodeRef")]){P.push(O.getData())}}return P},selectItems:function G(W){var U=this.widgets.dataTable.getRecordSet(),P=r.query('input[type="checkbox"]',this.widgets.dataTable.getTbodyEl()),O=this.widgets.paginator.getPageRecords(),T=O[0],S=P.length,R,Q,V;switch(W){case"selectAll":V=function(X,Y){return true};break;case"selectNone":V=function(X,Y){return false};break;case"selectInvert":V=function(X,Y){return !Y};break;default:V=function(X,Y){return Y}}for(Q=0;Q<S;Q++){R=U.getRecord(Q+T);this.selectedItems[R.getData("nodeRef")]=P[Q].checked=V(R.getData("type"),P[Q].checked)}k.fire("selectedItemsChanged")},onActionEdit:function p(S){var R=this;var Q=function O(W,X){Alfresco.util.populateHTML([X.id+"-dialogTitle",this.msg("label.edit-row.title")])};var U=YAHOO.lang.substitute(Alfresco.constants.URL_SERVICECONTEXT+"components/form?itemKind={itemKind}&itemId={itemId}&mode={mode}&submitType={submitType}&showCancelButton=true",{itemKind:"node",itemId:S.nodeRef,mode:"edit",submitType:"json"});var T=new Alfresco.module.SimpleDialog(this.id+"-editDetails");T.setOptions({width:"34em",templateUrl:U,actionUrl:null,destroyOnHide:true,doBeforeDialogShow:{fn:Q,scope:this},onSuccess:{fn:function V(W){Alfresco.util.Ajax.jsonPost({url:Alfresco.constants.PROXY_URI+"slingshot/datalists/item/node/"+new Alfresco.util.NodeRef(S.nodeRef).uri,dataObj:this._buildDataGridParams(),successCallback:{fn:function X(Z){k.fire("dataItemUpdated",{item:Z.json.item});Alfresco.util.PopupManager.displayMessage({text:this.msg("message.details.success")})},scope:this},failureCallback:{fn:function Y(Z){Alfresco.util.PopupManager.displayMessage({text:this.msg("message.details.failure")})},scope:this}})},scope:this},onFailure:{fn:function P(W){Alfresco.util.PopupManager.displayMessage({text:this.msg("message.details.failure")})},scope:this}}).show()},onActiveDataListChanged:function M(P,O){var Q=O[1];if((Q!==null)&&(Q.dataList!==null)){this.datalistMeta=Q.dataList;if(!this.deferredListPopulation.fulfil("onActiveDataListChanged")){this.populateDataGrid()}}},onDataListDetailsUpdated:function o(P,O){var Q=O[1];if((Q!==null)&&(Q.dataList!==null)){this.dataListMeta=Q.dataList;this.renderDataListMeta()}},onDataGridRefresh:function v(P,O){this._updateDataGrid.call(this)},onChangeFilter:function B(R,Q){var U=Q[1];if((U!==null)&&(U.filterId!==null)){var T=Alfresco.util.cleanBubblingObject(U),S=YAHOO.lang.substitute("{filterId}|{filterData}",T,function(W,X,V){return typeof X=="undefined"?"":window.escape(X)}),P=S.split("|");if(P[1].length===0){S=P[0]}Alfresco.logger.debug("DataGrid_onChangeFilter: ",T);var O={filter:S};if(U.datagridFirstTimeNav){this._updateDataGrid.call(this,{filter:T,page:this.currentPage})}else{if(this.options.usePagination){this.currentPage=1;O.page="1"}Alfresco.logger.debug("DataGrid_onChangeFilter: objNav = ",O);YAHOO.util.History.multiNavigate(O)}}},onFilterChanged:function n(P,O){var Q=O[1];if((Q!==null)&&(Q.filterId!==null)){Q.filterOwner=Q.filterOwner||Alfresco.util.FilterManager.getOwner(Q.filterId);this.currentFilter=Alfresco.util.cleanBubblingObject(Q);Alfresco.logger.debug("DL_onFilterChanged: ",this.currentFilter)}},onDataItemCreated:function D(Q,O){var S=O[1];if(S&&(S.nodeRef!==null)){var R=new Alfresco.util.NodeRef(S.nodeRef);Alfresco.util.Ajax.jsonPost({url:Alfresco.constants.PROXY_URI+"slingshot/datalists/item/node/"+R.uri,dataObj:this._buildDataGridParams(),successCallback:{fn:function P(V){var W=V.json.item;var U=function X(){var Z=this._findRecordByParameter(W.nodeRef,"nodeRef");if(Z!==null){var Y=this.widgets.dataTable.getTrEl(Z);Alfresco.util.Anim.pulse(Y)}};this.afterDataGridUpdate.push(U);this.widgets.dataTable.addRow(W)},scope:this},failureCallback:{fn:function T(U){Alfresco.util.PopupManager.displayMessage({text:this.msg("message.create.refresh.failure")})},scope:this}})}},onDataItemUpdated:function c(P,O){var S=O[1];if(S&&(S.item!==null)){var R=this._findRecordByParameter(S.item.nodeRef,"nodeRef");if(R!==null){this.widgets.dataTable.updateRow(R,S.item);var Q=this.widgets.dataTable.getTrEl(R);Alfresco.util.Anim.pulse(Q)}}},onDataItemsDeleted:function N(Q,O){var U=O[1];if(U&&(U.items!==null)){var T,S,V=function(X){return function W(){this.widgets.dataTable.deleteRow(X)}};for(var P=0,R=U.items.length;P<R;P++){T=this._findRecordByParameter(U.items[P].nodeRef,"nodeRef");if(T!==null){S=this.widgets.dataTable.getTrEl(T);Alfresco.util.Anim.fadeOut(S,{callback:V(T),scope:this})}}}},_setDefaultDataTableErrors:function y(O){var P=Alfresco.util.message;O.set("MSG_EMPTY",P("message.empty","Alfresco.component.DataGrid"));O.set("MSG_ERROR",P("message.error","Alfresco.component.DataGrid"))},_updateDataGrid:function F(aa){aa=aa||{};Alfresco.logger.debug("DataGrid__updateDataGrid: ",aa.filter);var ac=YAHOO.lang.merge({},aa.filter!==undefined?aa.filter:this.currentFilter),V=null,R=null,X=this,Q={filter:ac};var S=function Z(){Alfresco.logger.debug("DataGrid__uDG_fnShowLoadingMessage: slow data webscript detected.");if(R){V=Alfresco.util.PopupManager.displayMessage({displayTime:0,text:'<span class="wait">'+t(this.msg("message.loading"))+"</span>",noEscape:true});if(YAHOO.env.ua.ie>0){this.loadingMessageShowing=true}else{V.showEvent.subscribe(function(){this.loadingMessageShowing=true},this,true)}}};this._setDefaultDataTableErrors(this.widgets.dataTable);this.showingMoreActions=false;this.loadingMessageShowing=false;R=YAHOO.lang.later(this.options.loadingMessageDelay,this,S);var ab=function U(){if(R){R.cancel();R=null}if(V){if(this.loadingMessageShowing){V.destroy();V=null}else{YAHOO.lang.later(100,X,ab)}}};var T=function W(ae,af,ah){ab();var ad=function ag(){k.fire("selectedFilesChanged")};this.afterDataGridUpdate.push(ad);Alfresco.logger.debug("currentFilter was:",this.currentFilter,"now:",ac);this.currentFilter=ac;this.currentPage=aa.page||1;k.fire("filterChanged",ac);this.widgets.dataTable.onDataReturnInitializeTable.call(this.widgets.dataTable,ae,af,ah)};var O=function P(ae,af){ab();this.afterDataGridUpdate=[];if(af.status==401){window.location.reload(true)}else{try{var ad=YAHOO.lang.JSON.parse(af.responseText);this.widgets.dataTable.set("MSG_ERROR",ad.message);this.widgets.dataTable.showTableMessage(ad.message,YAHOO.widget.DataTable.CLASS_ERROR);if(af.status==404){k.fire("deactivateAllControls")}}catch(ag){this._setDefaultDataTableErrors(this.widgets.dataTable)}}};var Y=this._buildDataGridParams(Q);Alfresco.logger.debug("DataSource requestParams: ",Y);this.widgets.dataSource.sendRequest(YAHOO.lang.JSON.stringify(Y),{success:T,failure:O,scope:this})},_buildDataGridParams:function q(P){var O={fields:this.dataRequestFields};if(P&&P.filter){O.filter={filterId:P.filter.filterId,filterData:P.filter.filterData}}return O},_findRecordByParameter:function J(S,R){var Q=this.widgets.dataTable.getRecordSet();for(var P=0,O=Q.getLength();P<O;P++){if(Q.getRecord(P).getData(R)==S){return Q.getRecord(P)}}return null}},true)})();