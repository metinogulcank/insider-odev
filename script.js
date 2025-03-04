var defaultStudentData = [
    { name: "Ahmet", class: "10-A" },
    { name: "Ayşe", class: "9-B" },
    { name: "Mehmet", class: "11-C" }
  ];
  
  var studentData = JSON.parse(localStorage.getItem("studentData")) || defaultStudentData;
  
  function updateLocalStorage() {
    localStorage.setItem("studentData", JSON.stringify(studentData));
  }
  
  function renderTable() {
    var tbody = $("#studentTable tbody");
    tbody.empty();
    $.each(studentData, function(index, student) {
      var row = $("<tr></tr>").data("index", index);
      row.append($("<td></td>").text(student.name));
      row.append($("<td></td>").text(student.class));
  
      var deleteButton = $("<button>Sil</button>").click(function(e) {
        e.stopPropagation();
        studentData.splice(index, 1);
        updateLocalStorage();
        renderTable();
      });
      row.append($("<td></td>").append(deleteButton));
  
      row.click(function() {
        $(this).toggleClass("selected");
      });
  
      tbody.append(row);
    });
  }
  
  $(document).ready(function() {
    renderTable();
  
    $("#studentForm").submit(function(e) {
      e.preventDefault();
      var name = $("#nameInput").val();
      var studentClass = $("#classInput").val();
      if (name && studentClass) {
        studentData.push({ name: name, class: studentClass });
        updateLocalStorage();
        renderTable();
        $(this)[0].reset();
      }
    });
  });
  