

function open_Menu(overlay) {
    document.getElementById("mySidebar").style.width = "25%";
    document.getElementById("mySidebar").style.display = "block";
    document.getElementById("openNav").style.display = 'none';
    document.getElementById(overlay).classList.add("overlayactive");

  }
  function close_Menu(overlay) {
    document.getElementById("main").style.marginLeft = "0%";
    document.getElementById("mySidebar").style.display = "none";
    document.getElementById("openNav").style.display = "inline-block";
    document.getElementById(overlay).classList.remove("overlayactive");

  }
  function open_Profile() {
    document.getElementById("profileSidebar").style.width = "25%";
    document.getElementById("profileSidebar").style.display = "block";
    document.getElementById("openNav").style.display = 'none';
    document.getElementById("overlay").classList.add("overlayactive");


  }
  function close_Profile() {
    document.getElementById("main").style.marginLeft = "0%";
    document.getElementById("profileSidebar").style.display = "none";
    document.getElementById("openNav").style.display = "inline-block";
    document.getElementById("overlay").classList.remove("overlayactive");

  }

  

  document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("noteModal");
    const openBtn = document.getElementById("openFormButton");
    const closeBtn = document.querySelector(".close-btn");

    // Open modal
    openBtn.addEventListener("click", function () {
        modal.style.display = "block";
    });

    // Close modal when clicking on 'X'
    closeBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Close modal when clicking outside the modal content
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Handle form submission
    document.getElementById("noteForm").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent page refresh
        modal.style.display = "none"; // Hide modal after submission
    });
});


 