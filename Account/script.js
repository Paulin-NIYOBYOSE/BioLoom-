$(document).ready(function () {

    // Function to fetch data from the backend and populate the table
    function fetchData() {
        $('#dataTable').show();
        $('#form').show();

        $.ajax({
            url: 'backend.php',
            method: 'GET',
            success: function (response) {
                $('#dataTable tbody').html(response);
            }
        });
    }

    // Initial data load
    fetchData();

    // Submit form data using JQUERY
    $('#form').on("submit", function (e) {
        e.preventDefault();
        var name = $('#name').val();
        var email = $('#email').val();
        $.ajax({
            url: 'backend.php',
            method: 'POST',
            data: { name: name, email: email },
            success: function (response) {
                $('#form')[0].reset();
                fetchData(); // Reload data after successful submission
            }
        });
    });

    // Delete data using JQUERY
    $(document).on('click', '.deleteBtn', function () {
        var id = $(this).data('id');
        $.ajax({
            url: 'backend.php',
            method: 'POST',
            data: { id: id, action: 'delete' },
            success: function (response) {
                fetchData(); // Reload data after successful deletion
            }
        });
    });


    $(document).on('click', '.editBtn', function () {
        var id = $(this).data('id');
        var updateForm = $('<form></form>');

        $('#form').hide();

        $.ajax({
            url: 'backend.php',
            method: 'GET',
            data: { id, action: "select-single" },
            success: function (response) {
                $('#dataTable').hide();

                updateForm.html(`
                    <input type='hidden' name='id' id='edit-id' value='${response.id}' />
                    <input type='username' name='edit-name' id='edit-name' value='${response.name}' />
                    <input type='email' name='edit-email' id='edit-email' value='${response.email}'/>
                    <button type='submit' id="submitBtn">Save</button>
               `);

                updateForm.attr('id', 'edit-form');

                $(".divform").append(updateForm)

                // Submit form data using JQUERY
                $('#edit-form').on("submit", function (e) {
                    e.preventDefault();
                    var id =  $('#edit-id').val();
                    var name = $('#edit-name').val();
                    var email = $('#edit-email').val();
                    $.ajax({
                        url: 'backend.php',
                        method: 'POST',
                        data: { id, name: name, email: email, action: "update" },
                        success: function (response) {
                            $('#edit-form').remove();
                            fetchData(); // Reload data after successful submission
                        }
                    });
                });

               
            }
        });


    });


});
$(document).ready(function(){
    $("#drug").click(function(){
        $("#table").show();
        $(".card").hide();
        $("#record").css({ 
            backgroundColor: " #eaacf2"
        })
        $("#home").css({
            backgroundColor: "#fef7ff"
        })
    });
    $("#record").click(function(){
        $("#table").show();
        $(".card").hide();
        $("#record").css({ 
            backgroundColor: " #eaacf2"
        })
        $("#home").css({
            backgroundColor: "#fef7ff"
        })
    });
});
