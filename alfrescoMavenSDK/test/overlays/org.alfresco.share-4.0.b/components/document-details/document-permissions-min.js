(function(){Alfresco.DocumentPermissions=function(c){Alfresco.DocumentPermissions.superclass.constructor.call(this,"Alfresco.DocumentPermissions",c);YAHOO.Bubbling.on("filesPermissionsUpdated",this.doRefresh,this);return this};YAHOO.extend(Alfresco.DocumentPermissions,Alfresco.component.Base,{options:{nodeRef:null,siteId:"",displayName:null,roles:null},onManagePermissionsClick:function a(){if(!this.modules.permissions){this.modules.permissions=new Alfresco.module.DoclibPermissions(this.id+"-permissions")}this.modules.permissions.setOptions({siteId:this.options.siteId,files:{nodeRef:this.options.nodeRef,displayName:this.options.displayName,permissions:{roles:this.options.roles}}}).showDialog()},doRefresh:function b(){YAHOO.Bubbling.unsubscribe("filesPermissionsUpdated",this.doRefresh);this.refresh("components/document-details/document-permissions?nodeRef={nodeRef}"+(this.options.siteId?"&site={siteId}":""))}})})();