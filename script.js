/* script.js */

// Wait for the DOM to load before running scripts
document.addEventListener("DOMContentLoaded", function () {
  // Select all internal anchor links (links starting with '#')
  const links = document.querySelectorAll('a[href^="#"]');
  
  // Add click event listener to each link for smooth scrolling
  links.forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault(); // Prevent the default jump behavior
      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        // Smoothly scroll to the target element
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });
});
