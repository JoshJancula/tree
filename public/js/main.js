 // onload 
 //==============================================

 window.onload = function() {
     $('#generateNumbers').hide();
     $('#updateName').hide();
     // get the data
     getData();
 }


 // initializations
 //==============================================

 //initialize input modal
 $('#inputModal').modal({
     ready: function(modal, trigger) {
         // gets the post that this belongs to 
         modal.find('#postTo').text(trigger.data('id'));
         $('#generateNumbers').hide();
         $('#updateName').hide();
     }
 });

 //initialize number modal
 $('#numberModal').modal({
     ready: function(modal, trigger) {
         // gets the post that this belongs to 
         modal.find('#deleteThis').text(trigger.data('id'));
     }
 });

 // Functions
 //==============================================

 // gets all data for the tree
 function getData() {
     $.get("/api/people", function(data) {
         data.forEach(function(result) {
             let numbers = result.LuckyNumbers;
             // for each name...
             let div = $("<div class='name red-text'>").append(
                 "____<a class='modal-trigger' data-target='inputModal' data-id='" + result.id + "'>" + result.name + "</a><br>" +
                 "<a class='range modal-trigger' data-target='inputModal data-id='" + result.id + " '><span style='color: red;'>|____</span>Numbers Ranging From: " + result.low + " To: " + result.high + "</a>"
             ); // get numbers and make these...
             numbers.forEach(function(result) {
                 console.log('id for numberModal: ' + result.id)
                 let div2 = $('<div class="lucky">').append(
                     "|____<a class='modal-trigger' data-target='numberModal' data-id='" + result.id + "'>" + result.value + "</a>"
                 ) // append those to div
                 div.append(div2);
             }); // append to mainContent
             $('#mainContent').append(div);
         });
     });
 }

 // generates the number and posts 
 function postNumber(numbersRequest, id, low, high) {
     // make however many in the range
     for (let i = 0; i < numbersRequest; i++) {
         // make a random number
         let number = Math.floor(Math.random() * high) + low
         // data to create number entry
         let data = {
             value: number,
             PersonId: id
         } // post the new number
         $.post('/api/numbers', data, function() {
             // say it was a success
             console.log('we created a new number');
         });
     }
     // empty input
     $('#numberInput').val('');
     // empty out mainContent
     $('#mainContent').empty();
     // run getData
     getData()
 }





 // Click handlers
 //==============================================

 // when you click to update name
 $(document).on('click', '#updateName', function() {
     // hide this
     $('#generateNumbers').hide();
     // show this
     $('#updateName').show();
 });


 // when you click to generate numbers
 $(document).on('click', '#generateNumbers', function() {
     // show this
     $('#generateNumbers').show();
     // hide this
     $('#updateName').hide();
 });


 // when you click to delete a number
 $(document).on('click', '#deleteNumber', function() {
     // grab id to delete
     let id = $('#deleteThis').text();
     $.ajax({ // go delete it
         method: "DELETE",
         url: "/api/numbers/" + id
     }).done(function(data) { // tell me its gone
         console.log("delete was successfull");
         // empty out mainContent
         $('#mainContent').empty();
         // run getData
         getData()
     });
 });


 // when you click to submit a new name for an entry
 $(document).on('click', '#submitNewName', function() {
     // grab id to update
     let id = $('#postTo').text();
     // change name to ...
     let name = $('#nameChange').val().trim();
     let sLength = $('#nameChange').val().length;
     // data to be passed
     let input = {
         name: name
     } // make sure they input something
     if (!name) {
         alert('Please input something to update the name to');
         return;
     }
     // name length must be less than 15 characters
     if (sLength > 15 || sLength < 3) {
         alert("We're sorry but entry names must be at least 3 characters long and can be no longer than 15 characters")
     } // check to make sure its only letters
     let reg = /^[a-zA-Z]+$/;
     if (reg.test(name) == false) {
         alert('please only use letters for the entry names');
         return;
     }
     // run PUT route
     $.ajax({
         method: "PUT",
         url: "/api/people/" + id,
         data: input
     }).done(function(data) {
         // close the modal
         $('#inputModal').modal('close');
         // empty out mainContent
         $('#mainContent').empty();
         // run getData
         getData()
     })

 });



 // when you click to delete all the numbers 
 $(document).on('click', '#deleteAllNumbers', function() {
     // get parent of numbers to delete
     let id = $('#postTo').text();
     // get the numbers
     $.get("/api/people/" + id, function(data) {
         let numbers = data.LuckyNumbers;
         // for each number run the delete route 
         numbers.forEach(function(result) {
             let id = result.id;
             $.ajax({ // go delete it
                 method: "DELETE",
                 url: "/api/numbers/" + id
             }).done(function() { // tell me its gone
                 console.log("delete was successfull");
             });
         });
     }).done(function() {
         // close modal
         $('#inputModal').modal('close');
         // empty out mainContent
         $('#mainContent').empty();
         // run getData
         getData()
     });
 });


 // when you click to delete an entry and its numbers
 $(document).on('click', '#deleteThisEntry', function() {
     // grab id to delete
     let id = $('#postTo').text();
     $.ajax({ // go delete it
         method: "DELETE",
         url: "/api/people/" + id
     }).done(function() { // tell me its gone
         console.log("deleted entry successfully");
         // close modal
         $('#inputModal').modal('close');
         // empty out mainContent
         $('#mainContent').empty();
         // run getData
         getData()
     });
 });


 // click handler for new person
 $(document).on('click', '#submitPerson', function() {
     console.log('clicked on submitPerson');
     // get person name
     let name = $('#personName').val().trim();
     let sLength = $('#personName').val().length;
     let low = $('#low').val().trim();
     let high = $('#high').val().trim();

     // to be passed to database...
     let data = {
         name: name,
         low: low,
         high: high
     }
     let reg = /^[a-zA-Z]+$/;
     let reg2 = /^\d+$/;
     // make sure everything is there
     if (!high || !low || !name) {
         alert('please complete the form');
         return;
     } // test to make sure its only letters being input
     if (reg.test(name) == false) {
         alert('Please only use letters in the entry names');
         return;
     } // test to make sure only numbers for ranges

     if (reg2.test(low) == false) {
         alert("Please only input them digits!");
         return;
     }
     if (reg2.test(high) == false) {
         alert("Please only input them digits!");
         return;
     } // low cannot be greater than higher
     if (low >= high) {
         alert('You cannot have the high number lower than the low number, what were you thinking?');
         return;
     }
     // check to make sure its atleast 3 char long and no more than 15
     if (sLength > 15 || sLength < 3) {
         alert("We're sorry but entry names must be at least 3 characters long and can be no longer than 15")
     } // check to make sure it's only text
     // run post 
     $.post("/api/people", data, function() {
         // log success
         console.log("successfully created new person");
         // empty fields
         $("#personName").val("");
         $('#low').val('');
         $('#high').val('')
         // empty out mainContent
         $('#mainContent').empty();
         // run getData
         getData()
     });


 });


 // click handler for new random number
 $(document).on('click', '#submitNumber', function() {
     // grab id
     let id = $('#postTo').text();
     // check people for numbers 
     $.get("api/people/" + id, function(data) {
         // get total numbers for that person
         let numbers = data.LuckyNumbers;
         // get the range values
         let low = data.low;
         let high = data.high;
         // get total number of numbers they wanna make
         let numbersRequest = $('#numberInput').val();
         // test to make sure its only a number
         let reg = /^\d+$/;
         if (reg.test(numbersRequest) == false) {
             alert("please don't hack at the values bro, not cool!");
             return;
         }
         // if there are numbers already existing
         if (numbers.length != 0) {
             let total = (numbers.length + parseInt(numbersRequest));
             // you cannot have more than 15 numbers
             if (total > 15) {
                 alert('you cannot have more than 15 lucky numbers');
                 return;
             }
             // cannot be less than 0
             if (numbersRequest < 1) {
                 alert('you cannot enter less than 1');
                 return;
             }
             else { // if not ...
                 // call post number function
                 postNumber(numbersRequest, id, low, high);
             }
         }
         else {// run post
             postNumber(numbersRequest, id, low, high);
         }
     });
     // close modal
     $('#inputModal').modal('close');
 });
 