Alfresco.WebPreview.prototype.Plugins.StrobeMediaPlayback=function(b,a){this.wp=b;this.attributes=YAHOO.lang.merge(Alfresco.util.deepCopy(this.attributes),a);this.swfDiv=null;return this};Alfresco.WebPreview.prototype.Plugins.StrobeMediaPlayback.prototype={attributes:{src:null,poster:null,posterFileSuffix:null,scaleMode:"letterbox",loop:"false",autoPlay:"false",playButtonOverlay:"true",controlBarMode:"docked",controlBarAutoHide:"true",controlBarAutoHideTimeout:"3",bufferingOverlay:"true",muted:"false",volume:"1",audioPan:"0"},report:function StrobeMediaPlayback_report(){if(!Alfresco.util.hasRequiredFlashPlayer(10,0,0)){return this.wp.msg("label.noFlash")}},display:function StrobeMediaPlayback_display(){var a=this.resolveUrls();var b="StrobeMediaPlayback_"+this.wp.id;var c=new YAHOO.deconcept.SWFObject(Alfresco.constants.URL_CONTEXT+"components/preview/StrobeMediaPlayback.swf",b,"100%","100%","9.0.45");c.addVariable("src",a.src);if(a.poster){c.addVariable("poster",a.poster)}c.addVariable("loop",this.attributes.loop);c.addVariable("autoPlay",this.attributes.autoPlay);c.addVariable("playButtonOverlay",this.attributes.playButtonOverlay);c.addVariable("controlBarAutoHide",this.attributes.controlBarAutoHide);c.addVariable("scaleMode",this.attributes.scaleMode);c.addVariable("controlBarMode",this.attributes.controlBarMode);c.addVariable("controlBarAutoHideTimeout",this.attributes.controlBarAutoHideTimeout);c.addVariable("bufferingOverlay",this.attributes.bufferingOverlay);c.addVariable("muted",this.attributes.muted);c.addVariable("volume",this.attributes.volume);c.addVariable("audioPan",this.attributes.audioPan);c.addParam("allowScriptAccess","sameDomain");c.addParam("allowFullScreen","true");c.addParam("wmode","transparent");c.write(this.wp.getPreviewerElement().id)},resolveUrls:function StrobeMediaPlayback_resolveUrls(){var a={src:this.attributes.src?this.wp.getThumbnailUrl(this.attributes.src):this.wp.getContentUrl()};if(this.attributes.poster&&this.attributes.poster.length>0&&this.attributes.posterFileSuffix){a.poster=this.wp.getThumbnailUrl(this.attributes.poster,this.attributes.posterFileSuffix)}return a}};