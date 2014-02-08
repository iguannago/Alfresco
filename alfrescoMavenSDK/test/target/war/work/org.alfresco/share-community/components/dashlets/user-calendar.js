/**
 * Copyright (C) 2005-2011 Alfresco Software Limited.
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
 * Dashboard UserCalendar component.
 *
 * @namespace Alfresco.dashlet
 * @class Alfresco.dashlet.UserCalendar
 */
(function()
{
   /**
    * YUI Library aliases
    */
   var Dom = YAHOO.util.Dom,
       Event = YAHOO.util.Event;

   /**
    * Alfresco Slingshot aliases
    */
   var $html = Alfresco.util.encodeHTML,
       dateFormat = Alfresco.thirdparty.dateFormat,
       longDateMsg = Alfresco.util.message("date-format.longDate");

   /**
    * Dashboard UserCalendar constructor.
    *
    * @param {String} htmlId The HTML id of the parent element
    * @return {Alfresco.dashlet.UserCalendar} The new component instance
    * @constructor
    */
   Alfresco.dashlet.UserCalendar = function UserCalendar_constructor(htmlId)
   {
      Alfresco.dashlet.UserCalendar.superclass.constructor.call(this, "Alfresco.dashlet.UserCalendar", htmlId, ["container", "datasource", "datatable"]);
      return this;
   };

   YAHOO.extend(Alfresco.dashlet.UserCalendar, Alfresco.component.Base,
   {
      events: null,
      
      /**
       * Object container for initialization options
       *
       * @property options
       * @type object
       */
      options:
      {
         /**
          * Result list size maximum
          *
          * @property listSize
          * @type integer
          * @default 100
          */
         listSize: 100
      },

      /**
       * Load the list of events to process
       * 
       * @method loadSites
       */
      loadEvents: function()
      {
         Alfresco.util.Ajax.request(
         {
            url: Alfresco.constants.PROXY_URI + "calendar/events/user?from=now&size=" + this.options.listSize,
            successCallback:
            {
               fn: this.onEventsLoaded,
               scope: this
            }
         });
      },

      /**
       * Events loaded handler
       *
       * @method onEventsLoaded
       * @param response {object} Response from events query
       */
      onEventsLoaded: function UserCalendar_onEventsLoaded(response)
      {
         this.events = response.json.events;
         
         var successHandler = function DT_success(sRequest, oResponse, oPayload)
         {
            oResponse.results = this.events;
            this.widgets.dataTable.onDataReturnInitializeTable.call(this.widgets.dataTable, sRequest, oResponse, oPayload);
         };
         
         this.widgets.dataSource.sendRequest(this.sites,
         {
            success: successHandler,
            scope: this
         });
      },

      /**
       * Fired by YUI when parent element is available for scripting
       * @method onReady
       */
      onReady: function UserCalendar_onReady()
      {
         // DataSource definition
         this.widgets.dataSource = new YAHOO.util.DataSource(this.events,
         {
            responseType: YAHOO.util.DataSource.TYPE_JSARRAY
         });
         
         // DataTable column defintions
         var columnDefinitions =
         [
            { key: "icon", label: "", sortable: false, formatter: this.bind(this.renderCellIcon), width: 32 },
            { key: "event", label: "", sortable: false, formatter: this.bind(this.renderCellEvent) }
         ];
         
         // DataTable definition
         this.widgets.dataTable = new YAHOO.widget.DataTable(this.id + "-events", columnDefinitions, this.widgets.dataSource,
         {
            MSG_EMPTY: this.msg("label.noEvents")
         });
         
         // Load user calendar events
         this.loadEvents();
      },

      /**
       * Icon custom datacell formatter
       */
      renderCellIcon: function UserCalendar_renderCellIcon(elCell, oRecord, oColumn, oData)
      {
         Dom.setStyle(elCell, "width", oColumn.width + "px");
         var desc = '<div class="icon"><img src="' + Alfresco.constants.URL_RESCONTEXT + '/components/calendar/images/calendar-16.png" alt="event"/></div>';
         elCell.innerHTML = desc;
      },

      /**
       * Event information custom datacell formatter
       */
      renderCellEvent: function UserCalendar_renderCellEvent(elCell, oRecord, oColumn, oData)
      {
         var startDate = oRecord.getData("when"),
             endDate = oRecord.getData("endDate");
         var startDateDate = Alfresco.thirdparty.fromISO8601(startDate),
             endDateDate = Alfresco.thirdparty.fromISO8601(endDate);
         
         var desc = '<div class="detail"><h4><a href="' + Alfresco.constants.URL_CONTEXT + oRecord.getData("url") + '" class="theme-color-1">' + $html(oRecord.getData("title")) + '</a></h4>';
         desc += '<div>';
         if (startDate != endDate && oRecord.getData("allday") != "true")
         {
            // simple multiday
            desc += dateFormat(startDateDate, longDateMsg) + ' ' + oRecord.getData("start") + ' - ' + dateFormat(endDateDate, longDateMsg) + ' ' + oRecord.getData("end");
         }
         else
         {
            desc += dateFormat(startDateDate, longDateMsg);
            if (oRecord.getData("allday") == "true")
            {
               if (startDate != endDate)
               {
                  // all day Multiday
                  desc += ' - ' + dateFormat(endDateDate, longDateMsg);
               }
               desc += ' ' + this.msg("label.allday");
            }
            else
            {
               // single day
               desc += dateFormat(startDateDate, longDateMsg);
               if (oRecord.getData("start") != oRecord.getData("end"))
               {
                  desc += ' - ' + oRecord.getData("end");
               }
            }
         }
         desc += '</div><div><a href="' + Alfresco.constants.URL_PAGECONTEXT + 'site/' + oRecord.getData("site") + '/dashboard" class="theme-link-1">' + $html(oRecord.getData("siteTitle")) + '</a></div></div>';
         
         elCell.innerHTML = desc;
      }
   });
})();