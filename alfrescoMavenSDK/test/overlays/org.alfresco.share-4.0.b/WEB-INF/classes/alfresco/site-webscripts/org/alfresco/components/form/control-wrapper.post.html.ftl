<#import "form.lib.ftl" as formLib />
<div id="${args.htmlid}-control-wrapper" class="form-container inlineable">
   <#if field??>
      <@formLib.renderField field=field />
   <#else>
      ${msg("error.configuration")}
   </#if>
</div>