setTimeout(function () {
    const accordion = document.querySelector("[data-content-type='accordion']");

    if (accordion) {
        const detailsElements = accordion.querySelectorAll("li details");

        // Open the first details block after a 2-second delay
        if (detailsElements.length > 0) {
            detailsElements[0].setAttribute("open", "");
        }

        // Function to update aria-expanded based on the open attribute of the details element
        function updateAriaExpanded() {
            detailsElements.forEach((details) => {
                const summary = details.querySelector("summary");

                if (summary) {
                    // Set aria-expanded based on whether the details element is open or not
                    summary.setAttribute("aria-expanded", details.hasAttribute("open") ? "true" : "false");
                }
            });
        }

        // Initial check to update aria-expanded on page load
        updateAriaExpanded();

        // Listen for the toggle event, which fires when the details element opens/closes
        detailsElements.forEach((details) => {
            details.addEventListener("click", function () {
                // Close all other details elements
                detailsElements.forEach((otherDetails) => {
                    if (otherDetails !== details) {
                        otherDetails.removeAttribute("open");
                    }
                });

                // Update aria-expanded for the clicked details block
                updateAriaExpanded();
            });
        });

        // Listen for the toggle event, which fires when the details element opens/closes
        detailsElements.forEach((details) => {
            details.addEventListener("toggle", updateAriaExpanded);
        });
    }
}, 2000);  // 2-second delay before opening the first details element
