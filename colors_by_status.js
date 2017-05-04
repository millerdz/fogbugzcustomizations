name:          Change status colors on list page
description:   Changes colors of statuses on list page
author:        Derrick Miller
version:       1.0.0.0

js:

$(function(){
  // code based off template from http://help.fogcreek.com/11580/case-page-customization-template
  var isOcelot = function() {
    console.log("isOcelot");
     try {
         return (typeof fb.config != 'undefined');
     }
     catch(err) {
         return false;
     }
  };
  // if this isn't Ocelot, and we're not on the oldbugz case page, don't run
  if (!isOcelot() && !$('#bugviewContainer').length) {
    return;
  }
  // this needs to be idempotent. in ocelot, we don't know on a full page
  // load if it was run on the /nav/end event so we run it again after subscribing
  var runThisWhenCasePageModeChanges = function(fIsOcelot) {
    var colors = {"Not Started": "darkgray", "On Target": "green", "At Risk": "yellow", "Due/Overdue": "red", "Resolved (Completed)": "blue", "Closed (Completed)": "blue"};
  
  
    // the bug JS object is goBug in the old UI and fb.cases.current.bug in Ocelot
    var bug;
    // tags differ in the two UIs: bug.tags in Ocelot and goBug.ListTagsAsArray() in the old UI
    var rgTags;
    // when using url parameters to populate case form fields on page-load, Ocelot and the
    // old UI differ in one or more. In this instance, the tag list is "tags" in Ocelot
    // and "sTags" in the old UI
    if (fIsOcelot && typeof fb.cases.current.sAction == 'undefined') {
        // list page.
        var statuses =  $(".grid-column-contents.grid-column-Status");
        statuses.each(function( index ) {
            var status_text = statuses[index].innerText;
            if(status_text in colors){
                console.log("Applying color " + colors[status_text] + "status '" + status_text + "'");
                statuses[index].style.background = colors[status_text];
                if(colors[status_text] == "blue"){
                    statuses[index].style.color = "silver";
                }
            }
        });
    }
  };
  
  // ------ set up to call your code when the case view changes -------------------
  
  // Customizations are run only on full page-load. In ocelot, this only
  // happens when you go direclty to a URL or when you refresh the whole page.
  // Therefore, we just want to subscribe to the navigation event that fires whenever
  // the view is changed, as well as subscribe to any other events we care about
  // and run our code one initial time.
  if (isOcelot()) {
    // /nav/end fires at the end of every single-page-app navigation, e.g. when
    // the list page is done displaying or when the case page is done changing from
    // view to edit mode. the event param contains some useful info e.g.
    // event.route is something like '/cases/234/case-title-here' and event.url
    // has the entire url of the page
    // on the case page, fb.cases.current.sAction is the mode of the page just like
    // in the old UI: view, edit, assign, resolve, close, reactivate, reopen,
    // open, email, reply, forward and new
    fb.pubsub.subscribe({
      '/nav/end': function(event) {
        runThisWhenCasePageModeChanges(true);
      }
    });
    // depending on timing, if you go directly to a case page, the pubsub might not
    // finish before /nav/end is called the first time, so run the function once
    // after a delay. remember your code should be idempotent
    setTimeout(function() { runThisWhenCasePageModeChanges(isOcelot()) }, 100);
  }
});


css:

/ * your css here */

