(function(){var e=YAHOO.util.Dom,b=YAHOO.util.Event;Alfresco.DocumentMetadata=function d(f){Alfresco.DocumentMetadata.superclass.constructor.call(this,"Alfresco.DocumentMetadata",f);return this};YAHOO.extend(Alfresco.DocumentMetadata,Alfresco.component.Base,{options:{nodeRef:null,site:null,formId:null},onReady:function c(){Alfresco.util.Ajax.request({url:Alfresco.constants.URL_SERVICECONTEXT+"components/form",dataObj:{htmlid:this.id+"-formContainer",itemKind:"node",itemId:this.options.nodeRef,formId:this.options.formId,mode:"view"},successCallback:{fn:this.onFormLoaded,scope:this},failureMessage:this.msg("message.failure"),scope:this,execScripts:true})},onFormLoaded:function a(f){var g=e.get(this.id+"-formContainer");g.innerHTML=f.serverResponse.responseText}})})();