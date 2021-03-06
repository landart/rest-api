var customer = {
  firstName: 'Foo First Name',
  lastName: 'Foo Last Name',
  address: 'Foo Address',
  email: 'foo@email.com'
};

var accessToken = 'fooToken123';
var accessTokenString = 'Token token="{0}"';

$(document).ready(function () {
  
  // Fill textareas on initialization
  $('#create-payload').val(JSON.stringify(customer, undefined, 2));
  $('#update-payload').val(JSON.stringify(customer, undefined, 2));
  $('#access-token').val(accessToken);

  // get a collection
  $('#get-list a').click(function (ev) {
    ev.preventDefault();
    
    var $placeholder = $('#get-list .response-placeholder');
    
    $('#get-list .hidden').removeClass('hidden');

    $.get('customers')
      .success(function (data, status, response) {
        $placeholder.html('<strong>{0} {1}</strong><br>{2}'.format(
          response.status, 
          response.statusText, 
          JSON.stringify(data, undefined, 2)
        ));
      });

    ev.preventDefault();
  });

  // get a customer
  $('#get a').click(function (ev) {
    ev.preventDefault();
    
    var id = parseInt($('#get-customer-id').val()) || 0;
    var $placeholder = $('#get .response-placeholder');
    
    $('#get .hidden').removeClass('hidden');

    $.get('customers/' + id)
      .success(function (data, status, response) {
        $placeholder.html('<strong>{0} {1}</strong><br>{2}'.format(
          response.status, 
          response.statusText, 
          JSON.stringify(data, undefined, 2)
        ));
      })
      .error(function (error) {
        $placeholder.html('<strong>{0} {1}</strong>'.format(error.status, error.statusText)); 
      });
  });

  // create a customer
  $('#create a').click(function (ev) {
    ev.preventDefault();
    
    var $placeholder = $('#create .response-placeholder');
    var data = {};
    
    try{
      data = JSON.parse($('#create-payload').val());
    }
    catch(e){
      alert('Incorrect JSON format!');
      return;
    }
    
    $('#create .hidden').removeClass('hidden');
      
    $.ajax({
      url: 'customers',
      type: 'post',
      data: data,
      headers: {
          Authentication: accessTokenString.format($('#access-token').val())
      },
      dataType: 'json',
      success: function (data, status, response) {
        $placeholder.html('<strong>{0} {1}</strong><br>{2}'.format(
          response.status, 
          response.statusText, 
          JSON.stringify(data, undefined, 2)
        ));
      },
      error: function (error) {
        $placeholder.html('<strong>{0} {1}</strong>'.format(error.status, error.statusText)); 
      }
    });
    
  });

  // update a customer
  $('#update a').click(function (ev) {
    ev.preventDefault();
    
    var id = parseInt($('#update-customer-id').val()) || 0;
    var $placeholder = $('#update .response-placeholder');    
    var data = {};
    
    try{
      data = JSON.parse($('#update-payload').val());
    }
    catch(e){
      alert('Incorrect JSON format!');
      return;
    }
    
    $('#update .hidden').removeClass('hidden');

    $.ajax({
      url: 'customers/' + id,
      data: data,
      type: 'PUT',
      headers: {
          Authentication: accessTokenString.format($('#access-token').val())
      },
      dataType: "json",
      success: function (data, status, response) {
        $placeholder.html('<strong>{0} {1}</strong><br>{2}'.format(
          response.status, 
          response.statusText, 
          JSON.stringify(data, undefined, 2)
        ));
      },
      error: function (error) {
        $placeholder.html('<strong>{0} {1}</strong>'.format(error.status, error.statusText)); 
      }
    });
  });

  // delete a customer
  $('#delete a').click(function (ev) {
    ev.preventDefault();
    
    var id = parseInt($('#delete-customer-id').val()) || 0;
    var $placeholder = $('#delete .response-placeholder');
    
    $('#delete .hidden').removeClass('hidden');

    $.ajax({
      url: 'customers/' + id,
      type: 'DELETE',
      headers: {
          Authentication: accessTokenString.format($('#access-token').val())
      },
      success: function (data, status, response) {
        $placeholder.html('<strong>{0} {1}</strong>'.format(response.status, response.statusText));
      },
      error: function (error) {
        $placeholder.html('<strong>{0} {1}</strong>'.format(error.status, error.statusText)); 
      }
    });
  });
  
  // search customers
  $('#search a').click(function (ev) {
    ev.preventDefault();
    
    var $placeholder = $('#search .response-placeholder');
    var data = {};
    
    $('#search .hidden').removeClass('hidden');
    
    if ($('#search-id').val()) data.customerId = $('#search-id').val();
    if ($('#search-lastname').val()) data.lastName = $('#search-lastname').val();
    if ($('#search-email').val()) data.email = $('#search-email').val();
    
    console.log(data);

    $.get('customers/search', data)
      .success(function (data, status, response) {
        $placeholder.html('<strong>{0} {1}</strong><br>{2}'.format(
          response.status, 
          response.statusText, 
          JSON.stringify(data, undefined, 2)
        ));
      });

    ev.preventDefault();
  });

});

/**
 * Extend basic String class to add some extra functionality
 */
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}