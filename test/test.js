$(document).ready(function () {
    const tableBody = document.querySelector("tbody")
    const searchInput = document.getElementById("searchInput");
    const paginationDiv = document.getElementById("pagination");
    let currentPage = 1;
    const rowsPerPage = 5;


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
            success: function (response) {
                var drugsTable = $("tbody");
                drugsTable.empty(); // Clear existing table content

                var drugs = JSON.parse(response); // Parse response as JSON

                // Filter drugs based on search query
                drugs = drugs.filter(function (drug) {
                    return drug.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        drug.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        drug.price.toString().includes(searchQuery) ||
                        drug.stock.toString().includes(searchQuery);
                });

                // Add table headers
                var headerRow = $("<tr>").html(`
                    <th>Name</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Select to delete</th>`);
                drugsTable.append(headerRow);

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
    function loadDrugs(searchQuery = '') {
        $.ajax({
            url: "get_drugs.php",
            type: "GET",
            data: { search: encodeURIComponent(searchQuery) },
            success: function (response) {
                var drugsTable = $("tbody");
                drugsTable.empty(); // Clear existing table content
                let drugs;
                // Filter drugs based on search query
                drugs = response.filter(function (drug) {
                    return drug.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        drug.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        drug.price.toString().includes(searchQuery) ||
                        drug.stock.toString().includes(searchQuery);
                });
                drugsTable.append(headerRow);
                // Add table rows for each filtered drug
                drugs.forEach(function (drug) {
                    var row = $("<tr>").html(`
                      
                        <td>${drug.name}</td>
                        <td>${drug.description}</td>
                        <td>${drug.price}</td>
                        <td>${drug.stock}</td>
                          <td><input type="checkbox" value="${drug.id}"></td>
                       `);
                    drugsTable.append(row);
                });
            }
        });
    }

    $.ajax({
        url: "get_drugs.php",
        type: "GET",
        success: (data) => {
            renderer(data)
            const totalPages = Math.ceil(data.length / rowsPerPage)
            displayPagination(totalPages)
        }
    });

    function renderer(data) {
        if (data.length) {
            var drugsTable = $("tbody");
            drugsTable.empty();

            const startIndex = (currentPage - 1) * rowsPerPage;
            const endIndex = startIndex + rowsPerPage;
            const paginatedData = data.slice(startIndex, endIndex);

            paginatedData.forEach(function (drug) {
                var row = $("<tr>").html(`
              
                <td>${drug.name}</td>
                <td>${drug.description}</td>
                <td>${drug.price}</td>
                <td>${drug.stock}</td>
                <td><input type="checkbox" value="${drug.id}"></td>
               `);
                drugsTable.append(row);
            });

        } else {
            tableBody.innerHTML = "No data";
        }
    }


    function displayPagination(totalPages) {
        $.ajax({
            url: "get_drugs.php",
            type: "GET",
            success: (tableData) => {
                paginationDiv.innerHTML = "";

                for (let i = 1; i <= totalPages; i++) {
                    const btn = document.createElement("button");
                    btn.innerText = i;
                    btn.classList.add("pagination-btn");
                    if (i === currentPage) {
                        btn.classList.add("active");
                    }
                    btn.addEventListener("click", function () {
                        currentPage = i;
                        renderer(tableData);
                        displayPagination(totalPages);
                    });
                    paginationDiv.appendChild(btn);
                }
            }
        })
    }


    searchInput.addEventListener("keyup", () => {
        searchTable();
    })


    function searchTable() {
        $.ajax({
            url: "get_drugs.php",
            type: "GET",
            success: (tableData) => {
                const searchText = searchInput.value.toLowerCase();
                const filteredData = tableData.filter((item) => {
                    return (
                        item.name.toLowerCase().includes(searchText) ||
                        item.description.toLowerCase().includes(searchText)
                    );
                });
                renderer(filteredData);
                const totalPages = Math.ceil(filteredData.length / rowsPerPage);
                displayPagination(totalPages);
            }
        })
    }

});
