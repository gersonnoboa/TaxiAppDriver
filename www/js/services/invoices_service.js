/**
 * Created by Victor on 22/11/2016.
 */

'use strict';

var app = angular.module('taksi_driver');

app.service('InvoicesService', function () {
  var invoicesList = [
    {title: "Invoice for September 2016", date: "2016-10-01", id: 1},
    {title: "Invoice for October 2016", date: "2016-11-01", id: 2},
    {title: "Invoice for November 2016", date: "2016-12-01", id: 3}
  ];
  this.getInvoices = function () {
    return invoicesList;
  };

  this.getInvoice = function (id) {
    for (var i in invoicesList) {
      if (invoicesList[i].id == id) {
        return invoicesList[i];
      }
    }
  };
});
