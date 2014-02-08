(function(){var D=YAHOO.util.Dom,B=YAHOO.util.Event,f=YAHOO.util.Element,u=YAHOO.util.KeyListener,c=YAHOO.util.DragDropMgr;Alfresco.util.DragAndDrop=function(N){this.config=N;if(N.shadow){this.shadow=N.shadow}else{this.shadow=document.createElement("li");D.setStyle(this.shadow,"display","none")}D.addClass(this.shadow,"dnd-shadow");this.targets={};this.draggables={};this.keyListeners={};var P,L,M,O,Q,K;for(P=0,L=(N.targets?N.targets.length:0);P<L;P++){if(YAHOO.lang.isString(N.targets[P].container)){N.targets[P].container=D.get(N.targets[P].container)}new YAHOO.util.DDTarget(N.targets[P].container,N.targets[P].group);N.targets[P]._index=P;this.targets[N.targets[P].container.getAttribute("id")]=N.targets[P]}for(P=0,L=(N.draggables?N.draggables.length:0);P<L;P++){if(YAHOO.lang.isString(N.draggables[P].container)){N.draggables[P].container=D.get(N.draggables[P].container)}K=N.draggables[P].container;Q=new f(K).getElementsByTagName("li");if(!K.getAttribute("id")){Alfresco.util.generateDomId(K)}if(N.draggables[P].cssClass){D.addClass(this.shadow,N.draggables[P].cssClass)}N.draggables[P]._index=P;this.draggables[K.getAttribute("id")]=N.draggables[P];for(M=0,O=Q.length;M<O;M++){this._createDraggable(Q[M],N.draggables[P].groups)}}return this};var b=Alfresco.util.DragAndDrop;YAHOO.lang.augmentObject(b,{GROUP_MOVE:"dnd-move",GROUP_DELETE:"dnd-delete"});YAHOO.lang.augmentObject(b,{ACTION_DELETE:"action-delete",ACTION_ENTER:"action-enter",ACTION_MOVED:"action-moved",ACTION_DUPLICATED:"action-duplicated"});Alfresco.util.DragAndDrop.prototype={keyListeners:null,currentEl:null,shadow:null,draggables:{},targets:{},onDraggableBlur:function t(L,M){if(this.currentEl){D.removeClass(this.currentEl,"dnd-focused")}D.removeClass(M.li,"dnd-focused");this.currentEl=null;var K=this.keyListeners[M.a.id];if(K!==undefined){K.disable()}},onDraggableFocus:function I(L,M){if(this.currentEl){D.removeClass(this.currentEl,"dnd-focused")}this.currentEl=M.li;D.addClass(this.currentEl,"dnd-focused");if(!M.a.id||M.a.id.length==0){Alfresco.util.generateDomId(M.a)}var K=this.keyListeners[M.a.id];if(K===undefined){K=new u(M.a,{keys:[u.KEY.UP,u.KEY.DOWN,u.KEY.LEFT,u.KEY.RIGHT,u.KEY.ESCAPE,u.KEY.DELETE,u.KEY.ENTER]},{fn:this.onKeyPressed,scope:this,correctScope:true});this.keyListeners[M.a.id]=K}K.enable()},onKeyPressed:function J(K,L){var W=this.currentEl,U=this.draggables[this.getContainer(W).getAttribute("id")],Q=this.isContainerVertical(this.getContainer(W)),X,T;if(L[1].keyCode===u.KEY.ESCAPE){this.focusDraggableAfterDomChange(W,false)}else{if(L[1].keyCode===u.KEY.ENTER&&this.invokeCallback(Alfresco.util.DragAndDrop.ACTION_ENTER,W)){var P=this.config.draggables;for(var S=0,V=(P?P.length:0);S<V;S++){T=P[S].container;if(T.id!=W.parentNode.id&&!P[S].protect&&!this.isTargetFull(T)){if(U.duplicatesOnEnterKey){var M=D.getChildrenBy(T,this.isRealDraggable);this.copyAndInsertDraggable(W,T,M.length>0?M[0]:null)}else{if(U.movesOnEnterKey){T.appendChild(W);this.focusDraggableAfterDomChange(W,true);this.invokeCallback(Alfresco.util.DragAndDrop.ACTION_MOVED,W)}}return}}Alfresco.util.PopupManager.displayMessage({text:Alfresco.util.message("message.dnd.allColumnsAreFull",this.name)})}else{if(L[1].keyCode===u.KEY.DELETE){if(this.isDraggableInGroup(W,b.GROUP_DELETE)){this.deleteDraggable(W)}}else{if(!this.isDraggableProtected(W)){var R=false;if((Q&&L[1].keyCode===u.KEY.UP)||(!Q&&L[1].keyCode===u.KEY.LEFT)){X=D.getPreviousSiblingBy(W,this.isRealDraggable);if(X){D.insertBefore(W,X);this.focusDraggableAfterDomChange(W,true);R=true}}else{if((Q&&L[1].keyCode===u.KEY.DOWN)||(!Q&&L[1].keyCode===u.KEY.RIGHT)){X=D.getNextSiblingBy(W,this.isRealDraggable);if(X){D.insertAfter(W,X);this.focusDraggableAfterDomChange(W,true);R=true}}else{var O=this.getTargetIndex(W);if((Q&&L[1].keyCode===u.KEY.LEFT)||(!Q&&L[1].keyCode===u.KEY.UP)){O--}else{if((Q&&L[1].keyCode===u.KEY.RIGHT)||(!Q&&L[1].keyCode===u.KEY.DOWN)){O++}else{O=-1}}T=this.getTargetByIndex(O);if(T&&!this.isTargetFull(T)&&!this.isDraggableProtected(T)){var N=this._getDraggableIndex(W);X=this._getDraggable(T,N);if(X){D.insertBefore(W,X)}else{T.appendChild(W)}this.focusDraggableAfterDomChange(W,true);R=true}}}if(R){this.invokeCallback(Alfresco.util.DragAndDrop.ACTION_MOVED,W)}}}}}},_createDraggable:function H(R,L){var N=new Alfresco.util.DraggableProxy(R,this.shadow,this);for(var M=0,O=L?L.length:0;M<O;M++){N.addToGroup(L[M])}D.addClass(R,"dnd-draggable");var K=new f(R).getElementsByTagName("a"),P;for(var M=0,O=K.length;M<O;M++){P=K[M];var Q=new f(P);Q.addListener("focus",this.onDraggableFocus,{li:R,a:P},this);Q.addListener("blur",this.onDraggableBlur,{li:R,a:P},this);if(M==0){var S=new f(R);S.addListener("click",function(V,T){var U=this.getVisibleAnchors(T);if(U.length>0){U[0].focus()}},R,this)}}},copyAndInsertDraggable:function r(M,L,N){var K=this.draggables[L.getAttribute("id")],O=document.createElement("li");Alfresco.util.generateDomId(O);if(K.cssClass){D.addClass(O,K.cssClass)}O.innerHTML=M.innerHTML+"";this._createDraggable(O,K?K.groups:[]);D.setStyle(O,"visibility","");D.setStyle(O,"display","");if(N){L.insertBefore(O,N)}else{L.appendChild(O)}this.focusDraggableAfterDomChange(O,true);this.invokeCallback(Alfresco.util.DragAndDrop.ACTION_DUPLICATED,M)},focusDraggableAfterDomChange:function g(L,M){var N=M,K=L;YAHOO.lang.later(50,this,function(){var O=this.getVisibleAnchors(K);if(O.length>0){if(N){O[0].focus()}else{O[0].blur()}}})},deleteDraggable:function n(K){if(this.invokeCallback(Alfresco.util.DragAndDrop.ACTION_DELETE,K)){K.parentNode.removeChild(K)}else{this.focusDraggableAfterDomChange(K,true)}D.setStyle(this.shadow,"display","none")},invokeCallback:function(L,Q){var N=Q.parentNode,K=N.getAttribute("id"),P=this.config.draggables||[],S=true;for(var M=0,O=P.length;M<O;M++){if(K==P[M].container.getAttribute("id")){var R=P[M].callback||{};if(YAHOO.lang.isFunction(R.fn)){var T=R.fn.call(R.scope,L,Q,P[M].container);if(YAHOO.lang.isBoolean(T)&&!T){S=false}}}}return S},getVisibleAnchors:function(K){var P=new f(K).getElementsByTagName("a"),O=[];for(var L,N=0,M=P.length;N<M;N++){if(Alfresco.util.isVisible(P[N])){O.push(P[N])}}return O},_getDraggable:function G(L,K){var M=this.draggables[L.getAttribute("id")].cssClass;return D.getElementsByClassName(M,"li",L)[K]},_getDraggableIndex:function i(K){var M=K.parentNode,N=this.draggables[M.getAttribute("id")].cssClass;var O=D.getElementsByClassName(N,"li",M);for(var L=0;L<O.length;L++){if(O[L]===K){return L}}return -1},getDraggableColumnIndex:function F(L){var K=this.draggables[this.getContainer(L).getAttribute("id")];return(K&&K._index)?K._index:-1},getTargetIndex:function j(L){var K=this.targets[this.getContainer(L).getAttribute("id")];return(K&&YAHOO.lang.isNumber(K._index))?K._index:null},getTargetByIndex:function x(K){for(var L in this.targets){if(this.targets[L]._index==K){return this.targets[L].container}}return null},getContainer:function m(K){if(K.nodeName.toLowerCase()=="li"){return K.parentNode}return K},isTargetFull:function y(L){var K=this.targets[L.getAttribute("id")].maximum;if(K){return D.getChildrenBy(L,this.isRealDraggable).length>=K}else{return false}},isContainerVertical:function v(L){var K=this.draggables[L.getAttribute("id")].vertical;return YAHOO.lang.isBoolean(K)?K:true},isDraggableProtected:function o(K){var L=this.draggables[this.getContainer(K).getAttribute("id")];return(L&&L.protect==true)},isRealDraggable:function A(K){return K.nodeName.toLowerCase()=="li"&&!D.hasClass(K,"dnd-shadow")},isOfTagType:function E(M,N){var O=YAHOO.lang.isArray(N)?N:[N];for(var L=0,K=O.length;L<K;L++){if(M.nodeName.toLowerCase()==O[L].toLowerCase()){return true}}return false},isTargetInGroup:function h(K,L){K=this.getContainer(K);return this.targets[K.getAttribute("id")].group==L},isDraggableInGroup:function q(K,L){K=this.getContainer(K);return Alfresco.util.arrayContains(this.draggables[K.getAttribute("id")].groups,L)}};Alfresco.util.DraggableProxy=function(K,N,M){Alfresco.util.DraggableProxy.superclass.constructor.call(this,K);var L=this.getDragEl();D.setStyle(L,"opacity",0.67);this.goingUp=false;this.goingLeft=false;this.lastY=0;this.lastX=0;this.srcShadow=N;this.droppedOnEl=null;this.originalScrollPosition=null;this.isOver=false;this.dndComponent=M};YAHOO.extend(Alfresco.util.DraggableProxy,YAHOO.util.DDProxy,{startDrag:function k(L,O){this.originalScrollPosition=Alfresco.util.getScrollPosition();this.droppedOnEl=null;if(this.dndComponent.currentEl){this.dndComponent.currentEl.blur();this.dndComponent.currentEl=null}var K=this.getDragEl(),M=this.getEl(),N=this.dndComponent.draggables[this.dndComponent.getContainer(M).getAttribute("id")].cssClass;K.innerHTML=M.innerHTML;if(N){D.addClass(K,N)}D.addClass(K,"dnd-focused");D.addClass(K,"dnd-dragged");D.setStyle(K,"border-style","");D.setStyle(K,"border-width","");D.setStyle(K,"border-color","");if(!this.dndComponent.isDraggableProtected(M)){D.setStyle(M,"visibility","hidden")}this._resetSrcShadow()},_resetSrcShadow:function z(){var M=this.getEl();var O=M.parentNode;if(this.dndComponent.isDraggableProtected(M)){D.setStyle(this.srcShadow,"display","none")}var K,N;if(YAHOO.env.ua.ie){K=M.offsetHeight;N=M.offsetWidth}else{K=D.getStyle(M,"height");N=D.getStyle(M,"width")}var L=this.dndComponent.isContainerVertical(this.dndComponent.getContainer(M));if(L&&K){D.setStyle(this.srcShadow,"height",K);D.setStyle(this.srcShadow,"width","1px")}if(!L&&N){D.setStyle(this.srcShadow,"height","1px");D.setStyle(this.srcShadow,"width",N)}O.insertBefore(this.srcShadow,M)},endDrag:function a(N,O){var K=this.getEl();var L=this.getDragEl();if(this.droppedOnEl&&this.dndComponent.isTargetInGroup(this.droppedOnEl,b.GROUP_DELETE)){if(!this.dndComponent.isDraggableProtected(K)){this.dndComponent.deleteDraggable(K)}var M=this.droppedOnEl;if(this.dndComponent.isOfTagType(M,"li")){M=M.parentNode}D.removeClass(M,"deleteDrag");return}D.setStyle(L,"visibility","hidden");this.insertSrcEl(K);D.setStyle(this.srcShadow,"display","none")},insertSrcEl:function s(L){var K=this.srcShadow.parentNode;if(this.dndComponent.isDraggableProtected(L)){if(!this.dndComponent.isDraggableProtected(this.srcShadow)){this.dndComponent.copyAndInsertDraggable(L,K,this.srcShadow)}}else{K.insertBefore(L,this.srcShadow);this.dndComponent.focusDraggableAfterDomChange(L,true);this.dndComponent.invokeCallback(Alfresco.util.DragAndDrop.ACTION_MOVED,L)}D.setStyle(L,"visibility","");D.setStyle(L,"display","")},onDragDrop:function e(L,P){var K=D.get(P);this.droppedOnEl=K;if(D.hasClass(K,"target")){D.removeClass(K,"target")}if(!this.dndComponent.isTargetInGroup(K,b.GROUP_MOVE)){return}if(c.interactionInfo.drop.length===1){var O=c.interactionInfo.point;var N=YAHOO.util.Region.getRegion(this.getEl());if(!N.intersect(O)){K=D.get(P);if(!this.dndComponent.isTargetFull(K)&&YAHOO.util.Dom.getStyle(this.srcShadow,"display")=="none"){K.appendChild(this.srcShadow);var M=c.getDDById(P);M.isEmpty=false}}}},_changeCursor:function C(L){var M=this.getDragEl();var K=new f(M,{});var N=K.getElementsByTagName("div")[0];Alfresco.util.Cursor.setCursorState(N,L)},onDragOut:function d(L,M){this.isOver=false;this.droppedOnEl=null;var K=D.get(M);if(this.dndComponent.isOfTagType(K,["ul","ol"])){this._resetSrcShadow();this._changeCursor(Alfresco.util.Cursor.DRAG);if(this.dndComponent.isTargetInGroup(K,b.GROUP_DELETE)){D.removeClass(K,"deleteDrag")}}if(this.dndComponent.isOfTagType(K,"li")){}else{this._changeCursor(Alfresco.util.Cursor.DRAG);D.removeClass(K,"target")}},onDrag:function w(L){var M=B.getPageY(L);if(M<this.lastY){this.goingUp=true}else{if(M>this.lastY){this.goingUp=false}}this.lastY=M;var K=B.getPageX(L);if(K<this.lastX){this.goingLeft=true}else{if(K>this.lastX){this.goingLeft=false}}this.lastX=K},onDragOver:function l(P,R){this.isOver=true;var M=D.get(R),L=this.getEl();if(this.dndComponent.isOfTagType(M,"li")){if(!this.dndComponent.isTargetFull(this.dndComponent.getContainer(M))||this.dndComponent.getContainer(L)==this.dndComponent.getContainer(M)){if(!this.dndComponent.isDraggableProtected(M)){if(!this.dndComponent.isDraggableProtected(L)){D.setStyle(L,"display","none")}if(D.getStyle(this.srcShadow,"display")=="none"){D.setStyle(this.srcShadow,"display","")}if(this.dndComponent.isRealDraggable(M)){var K=this.dndComponent.isContainerVertical(this.dndComponent.getContainer(M));if((K&&this.goingUp)||(!K&&this.goingLeft)){M.parentNode.insertBefore(this.srcShadow,M)}else{M.parentNode.insertBefore(this.srcShadow,M.nextSibling)}}}}}else{if(this.dndComponent.isOfTagType(M,["ul","ol"])){var Q=this.dndComponent.isTargetFull(M),O=this.dndComponent.isDraggableProtected(M),N=this.dndComponent.isDraggableProtected(L);if((!N&&O)||(!O&&(!Q||this.dndComponent.getContainer(L)==this.dndComponent.getContainer(M)))){this._changeCursor(Alfresco.util.Cursor.DROP_VALID);D.addClass(M,"target");if(this.dndComponent.isTargetInGroup(M,b.GROUP_DELETE)){D.addClass(M,"deleteDrag")}}else{if(!O&&Q){this._changeCursor(Alfresco.util.Cursor.DROP_INVALID)}else{}}}else{this._changeCursor(Alfresco.util.Cursor.DROP_VALID);D.addClass(M,"target")}}},onInvalidDrop:function p(){if(this.originalScrollPosition){window.scrollTo(this.originalScrollPosition[0],this.originalScrollPosition[1])}}})})();