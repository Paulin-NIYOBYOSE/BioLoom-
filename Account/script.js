

// Function to fetch data from the backend and populate the table
function fetchData() {
    $('#dataTable').show();
    $('#form').show();

    $.ajax({
        url: 'backend.php',
        method: 'GET',
        data: { page: currentPage, limit: recordsPerPage },
        success: function (response) {
            $('#dataTable tbody').html(response.data);
            createPagination(response.totalRecords);
        }
    });
}

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

// Edit data using JQUERY
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
                    <input type='text' name='edit-name' id='edit-name' value='${response.name}' />
                    <input type='email' name='edit-email' id='edit-email' value='${response.email}'/>
                    <button type='submit' id="submitBtn">Save</button>
               `);

            updateForm.attr('id', 'edit-form');

            $(".divform").append(updateForm)

            // Submit form data using JQUERY
            $('#edit-form').on("submit", function (e) {
                e.preventDefault();
                var id = $('#edit-id').val();
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

// Show table and hide other elements on button clicks
$("#drug, #record").click(function (event) {
    event.preventDefault();

    $("#table").show();
    $(".card").hide();
    $("#record").css({
        backgroundColor: " #eaacf2"
    })
    $("#home").css({
        backgroundColor: "#fef7ff"
    })
});

//myajax 

$(document).ready(function () {
    $("#addForm").submit(function (event) {
        event.preventDefault(); // Prevent default form submission

        // Collect form data
        var formData = new FormData(this);
        formData.append('action', 'add');

        // Send form data using AJAX
        $.ajax({
            url: "actions.php",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                alert(response); // Display response from server
            },
            error: function (xhr, status, error) {
                alert("Error: " + xhr.status + " " + xhr.statusText); // Display error message
            }
        });
    });

    $("#deleteBtn").click(function (event) {
        event.preventDefault(); // Prevent default button behavior

        // Collect IDs of selected checkboxes
        var selectedIds = [];
        $("#drugsTable input[type=checkbox]:checked").each(function () {
            selectedIds.push($(this).val());
        });

        // Send selected IDs to backend for deletion
        $.ajax({
            url: "actions.php",
            type: "POST",
            data: { action: "delete_multiple", ids: JSON.stringify(selectedIds) },
            success: function (response) {
                alert(response); // Display response from server
                // Refresh table after deletion
                loadDrugs();
            }
        });
    });

    function loadDrugs(searchQuery = '') {
        $.ajax({
            url: "get_drugs.php",
            type: "GET",
            data: { search: encodeURIComponent(searchQuery) },
            success: function (response) {
                var drugsTable = $("#drugsTable");
                drugsTable.empty(); // Clear existing table content
                var drugs = JSON.parse(response);

                // Add table headers
                var headerRow = $("<tr>").html(`
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Select to delete</th>`);
                drugsTable.append(headerRow);

                // Filter drugs based on search query
                drugs = drugs.filter(function (drug) {
                    return drug.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        drug.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        drug.price.toString().includes(searchQuery) ||
                        drug.stock.toString().includes(searchQuery);
                });

                // Add table rows for each filtered drug
                drugs.forEach(function (drug) {
                    var row = $("<tr>").html(`
                            <td>${drug.name}</td>
                            <td>${drug.description}</td>
                            <td>${drug.price}</td>
                            <td>${drug.stock}</td>
                            <td><input type="checkbox" value="${drug.id}"></td>`);
                    drugsTable.append(row);
                });
            }
        });
    }

});
