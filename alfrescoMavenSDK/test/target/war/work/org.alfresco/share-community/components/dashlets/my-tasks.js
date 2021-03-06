/**
 * Copyright (C) 2005-2010 Alfresco Software Limited.
 *
 * This file is part of Alfresco
 *
 * Alfresco is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Alfresco is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Dashboard MyTasks component.
 *
 * @namespace Alfresco.dashlet
 * @class Alfresco.dashlet.MyTasks
 */
(function()
{
   /**
    * YUI Library aliases
    */
   var Dom = YAHOO.util.Dom,
      Event = YAHOO.util.Event,
      Selector = YAHOO.util.Selector;

   /**
    * Alfresco Slingshot aliases
    */
   var $html = Alfresco.util.encodeHTML,
      $siteURL = Alfresco.util.siteURL;
   /**
    * Preferences
    */
   var PREFERENCES_TASKS_DASHLET_FILTER = "org.alfresco.share.tasks.dashlet.filter";

   /**
    * Dashboard MyTasks constructor.
    *
    * @param {String} htmlId The HTML id of the parent element
    * @return {Alfresco.dashlet.MyTasks} The new component instance
    * @constructor
    */
   Alfresco.dashlet.MyTasks = function MyTasks_constructor(htmlId)
   {
      Alfresco.dashlet.MyTasks.superclass.constructor.call(this, "Alfresco.dashlet.MyTasks", htmlId, ["button", "container", "datasource", "datatable", "paginator", "history", "animation"]);

      // Services
      this.services.preferences = new Alfresco.service.Preferences();

      return this;
   };

   /**
    * Extend from Alfresco.component.Base
    */
   YAHOO.extend(Alfresco.dashlet.MyTasks, Alfresco.component.Base);

   /**
    * Augment prototype with Common Workflow actions to reuse createFilterURLParameters
    */
   YAHOO.lang.augmentProto(Alfresco.dashlet.MyTasks, Alfresco.action.WorkflowActions);

   /**
    * Augment prototype with main class implementation, ensuring overwrite is enabled
    */
   YAHOO.lang.augmentObject(Alfresco.dashlet.MyTasks.prototype,
   {
      /**
       * Object container for initialization options
       *
       * @property options
       * @type object
       */
      options:
      {
         /**
          * Task types not to display
          *
          * @property hiddenTaskTypes
          * @type object
          * @default []
          */
         hiddenTaskTypes: [],

         /**
          * Maximum number of tasks to display in the dashlet.
          *
          * @property maxItems
          * @type int
          * @default 50
          */
         maxItems: 50,

         /**
          * Filter look-up: type to display value and query value
          *
          * @property filters
          * @type Object
          */
         filters: {}
      },

      /**
       * Fired by YUI when parent element is available for scripting
       * @method onReady
       */
      onReady: function MyTasks_onReady()
      {
         // Create filter menu
         this.widgets.filterMenuButton = Alfresco.util.createYUIButton(this, "filters", this.onFilterSelected,
         {
            type: "menu",
            menu: "filters-menu",
            lazyloadmenu: false
         });

         // Load preferences (after which the appropriate tasks will be displayed)
         this.services.preferences.request(PREFERENCES_TASKS_DASHLET_FILTER,
         {
            successCallback:
            {
               fn: this.onPreferencesLoaded,
               scope: this
            }
         });
      },
      
      /**
       * Process response from preference query
       *
       * @method onPreferencesLoaded
       * @param p_response {object} Response from "api/people/{userId}/preferences" query
       */
      onPreferencesLoaded: function MyTasks_onPreferencesLoaded(p_response)
      {
         // Select the preferred filter in the ui
         var filter = Alfresco.util.findValueByDotNotation(p_response.json, PREFERENCES_TASKS_DASHLET_FILTER, "allTasks");
         filter = this.options.filters.hasOwnProperty(filter) ? filter : "allTasks";
         this.widgets.filterMenuButton.set("label", this.msg("filter." + filter));
         this.widgets.filterMenuButton.value = filter;

         // Display the toolbar now that we have selected the filter
         Dom.removeClass(Selector.query(".toolbar div", this.id, true), "hidden");

         // Prepare webscript url to task instances
         var webscript = YAHOO.lang.substitute("api/task-instances?authority={authority}&properties={properties}&exclude={exclude}",
         {
            authority: encodeURIComponent(Alfresco.constants.USERNAME),
            properties: ["bpm_priority", "bpm_status", "bpm_dueDate", "bpm_description"].join(","),
            exclude: this.options.hiddenTaskTypes.join(",")
         });

         /**
          * Create datatable with a simple pagination that only displays number of results.
          * The pagination is handled in the "base" data source url and can't be changed in the dashlet
          */
         this.widgets.alfrescoDataTable = new Alfresco.util.DataTable(
         {
            dataSource:
            {
               url: Alfresco.constants.PROXY_URI + webscript,
               initialParameters: this.substituteParameters(this.options.filters[filter]) || ""
            },
            dataTable:
            {
               container: this.id + "-tasks",
               columnDefinitions:
               [
                  { key: "isPooled", sortable: false, formatter: this.bind(this.renderCellIcons), width: 24 },
                  { key: "title", sortable: false, formatter: this.bind(this.renderCellTaskInfo) },
                  { key: "name", sortable: false, formatter: this.bind(this.renderCellActions), width: 45 }
               ],
               config:
               {
                  MSG_EMPTY: this.msg("message.noTasks")
               }
            },
            paginator:
            {
               history: false,
               hide: false,
               config:
               {
                  containers: [this.id + "-paginator"],
                  template: this.msg("pagination.template"),
                  pageReportTemplate: this.msg("pagination.template.page-report"),
                  rowsPerPage: this.options.maxItems
               }               
            }
         });

         // Override DataTable function to set custom empty message
         var me = this,
            dataTable = this.widgets.alfrescoDataTable.getDataTable(),
            original_doBeforeLoadData = dataTable.doBeforeLoadData;

         dataTable.doBeforeLoadData = function MyTasks_doBeforeLoadData(sRequest, oResponse, oPayload)
         {
            // Hide the paginator if there are fewer rows than would cause pagination
            Dom.setStyle(this.configs.paginator.getContainerNodes(), "visibility", (oResponse.results.length == 0) ? "hidden" : "visible");

            if (oResponse.results.length === 0)
            {
               oResponse.results.unshift(
               {
                  isInfo: true,
                  title: me.msg("empty.title"),
                  description: me.msg("empty.description")
               });
            }

            return original_doBeforeLoadData.apply(this, arguments);
         };
      },

      /**
       * Reloads the list with the new filter and updates the filter menu button's label
       *
       * @param p_sType {string} The event
       * @param p_aArgs {array} Event arguments
       */
      onFilterSelected: function MyTasks_onFilterSelected(p_sType, p_aArgs)
      {
         var menuItem = p_aArgs[1];
         
         if (menuItem)
         {
            this.widgets.filterMenuButton.set("label", menuItem.cfg.getProperty("text"));
            this.widgets.filterMenuButton.value = menuItem.value;
            
            var parameters = this.substituteParameters(this.options.filters[menuItem.value], {});
            this.widgets.alfrescoDataTable.loadDataTable(parameters);

            // Save preferences
            this.services.preferences.set(PREFERENCES_TASKS_DASHLET_FILTER, menuItem.value);
         }
      },

      /**
       * Priority & pooled icons custom datacell formatter
       */
      renderCellIcons: function MyTasks_onReady_renderCellIcons(elCell, oRecord, oColumn, oData)
      {
         var data = oRecord.getData(),
            desc = "";

         if (data.isInfo)
         {
            oColumn.width = 52;
            Dom.setStyle(elCell, "width", oColumn.width + "px");
            Dom.setStyle(elCell.parentNode, "width", oColumn.width + "px");

            desc = '<img src="' + Alfresco.constants.URL_RESCONTEXT + 'components/images/help-task-bw-32.png" />';
         }
         else
         {
            var priority = data.properties["bpm_priority"],
               priorityMap = { "1": "high", "2": "medium", "3": "low" },
               priorityKey = priorityMap[priority + ""],
               pooledTask = data.isPooled;

            desc = '<img src="' + Alfresco.constants.URL_RESCONTEXT + 'components/images/priority-' + priorityKey + '-16.png" title="' + this.msg("label.priority", this.msg("priority." + priorityKey)) + '"/>';
            if (pooledTask)
            {
               desc += '<br/><img src="' + Alfresco.constants.URL_RESCONTEXT + 'components/images/pooled-task-16.png" title="' + this.msg("label.pooledTask") + '"/>';
            }
         }

         elCell.innerHTML = desc;
      },

      /**
       * Task info custom datacell formatter
       */
      renderCellTaskInfo: function MyTasks_onReady_renderCellTaskInfo(elCell, oRecord, oColumn, oData)
      {
         var data = oRecord.getData(),
            desc = "";

         if (data.isInfo)
         {
            desc += '<div class="empty"><h3>' + data.title + '</h3>';
            desc += '<span>' + data.description + '</span></div>';
         }
         else
         {
            var taskId = data.id,
               message = data.properties["bpm_description"],
               dueDateStr = data.properties["bpm_dueDate"],
               dueDate = dueDateStr ? Alfresco.util.fromISO8601(dueDateStr) : null,
               today = new Date(),
               type = data.title,
               status = data.properties["bpm_status"],
               assignee = data.owner;

            // if message is the same as the task type show the <no message> label
            if (message == type)
            {
               message = this.msg("workflow.no_message");
            }

         var messageDesc = '<h3><a href="' + $siteURL('task-edit?taskId=' + taskId + '&referrer=tasks') + '" class="theme-color-1" title="' + this.msg("title.editTask") + '">' + $html(message) + '</a></h3>',
               dateDesc = dueDate ? '<h4><span class="' + (today > dueDate ? "task-delayed" : "") + '" title="' + 
                          this.msg("title.dueOn", Alfresco.util.formatDate(dueDate, "longDate")) + '">' + Alfresco.util.formatDate(dueDate, "longDate") + '</span></h4>' : "",
               statusDesc = '<div title="' + this.msg("title.taskSummary", type, status) + '">' + this.msg("label.taskSummary", type, status) + '</div>',
               unassignedDesc = '';

            if (!assignee || !assignee.userName)
            {
               unassignedDesc = '<span class="theme-bg-color-5 theme-color-5 unassigned-task">' + this.msg("label.unassignedTask") + '</span>';
            }
            desc = messageDesc + dateDesc + statusDesc + unassignedDesc;
         }
         
         elCell.innerHTML = desc;
      },

      /**
       * Actions custom datacell formatter
       */
      renderCellActions:function MyTasks_onReady_renderCellActions(elCell, oRecord, oColumn, oData)
      {
         var data = oRecord.getData(),
            desc = "";

         if (data.isInfo)
         {
            oColumn.width = 0;
            Dom.setStyle(elCell, "width", oColumn.width + "px");
            Dom.setStyle(elCell.parentNode, "width", oColumn.width + "px");
         }
         else
         {
            if (data.isEditable)
            {
               desc += '<a href="' + $siteURL('task-edit?taskId=' + data.id + '&referrer=tasks') + '" class="edit-task" title="' + this.msg("title.editTask") + '">&nbsp;</a>';
            }
            desc += '<a href="' + $siteURL('task-details?taskId=' + data.id + '&referrer=tasks') + '" class="view-task" title="' + this.msg("title.viewTask") + '">&nbsp;</a>';
         }

         elCell.innerHTML = desc;
      }

   });
})();
