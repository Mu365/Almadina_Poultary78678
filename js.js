// Retrieve saved contacts from LocalStorage
let contactData = JSON.parse(localStorage.getItem('contactData')) || [];

// Handle form submission
document.getElementById("contact-form").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent form submission from refreshing the page

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const category = document.getElementById("category").value;
    const subcategory = category === "Shop Keepers Contacts" ? document.getElementById("subcategory").value : "None";

    // Save the contact
    saveContact(name, phone, category, subcategory);

    // Clear the form fields after submission
    document.getElementById("name").value = '';
    document.getElementById("phone").value = '';
    document.getElementById("category").value = 'Executive Contacts';
    document.getElementById("subcategory").disabled = true;
});

// Show subcategories only for Shop Keepers Contacts
document.getElementById("category").addEventListener("change", function () {
    const subcategoryElement = document.getElementById("subcategory");
    if (this.value === "Shop Keepers Contacts") {
        subcategoryElement.disabled = false;  // Enable subcategory select
    } else {
        subcategoryElement.disabled = true;   // Disable subcategory select for other categories
    }
});

// Function to save the contact to LocalStorage
function saveContact(name, phone, category, subcategory) {
    // Add the new contact to the array
    contactData.push({ name, phone, category, subcategory });
    
    // Save the updated contact list to LocalStorage
    localStorage.setItem('contactData', JSON.stringify(contactData));

    // Display an alert confirming the contact is saved
    alert(`Contact saved: ${name}, ${phone}, ${category}, ${subcategory}`);
}

// Function to view contacts by category or subcategory
function viewContacts(categoryOrSubcategory) {
    const contactList = document.getElementById("contact-list");
    contactList.innerHTML = "";  // Clear the list

    // Filter contacts by category or subcategory
    const list = contactData.filter(contact => contact.category === categoryOrSubcategory || contact.subcategory === categoryOrSubcategory);

    if (!list.length) {
        contactList.innerHTML = `No contacts found for ${categoryOrSubcategory}`;
        return;
    }

    // Display contacts in the list with edit and delete options
    list.forEach((contact, index) => {
        const contactItem = document.createElement("div");
        contactItem.textContent = `${contact.name} - ${contact.phone}`;
        
        // Edit button
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.onclick = () => editContact(index);
        contactItem.appendChild(editButton);

        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => deleteContact(index);
        contactItem.appendChild(deleteButton);

        contactList.appendChild(contactItem);
    });

    // Add a download button
    const downloadButton = document.createElement("button");
    downloadButton.textContent = "Download Contacts";
    downloadButton.onclick = () => downloadContacts(categoryOrSubcategory, list);
    contactList.appendChild(downloadButton);
}

// Function to edit a contact
function editContact(index) {
    const contact = contactData[index];
    document.getElementById("name").value = contact.name;
    document.getElementById("phone").value = contact.phone;
    document.getElementById("category").value = contact.category;

    if (contact.category === "Shop Keepers Contacts") {
        document.getElementById("subcategory").value = contact.subcategory;
        document.getElementById("subcategory").disabled = false;
    } else {
        document.getElementById("subcategory").disabled = true;
    }

    // Remove the contact from the list to allow updating
    contactData.splice(index, 1);
    localStorage.setItem('contactData', JSON.stringify(contactData));
}

// Function to delete a contact
function deleteContact(index) {
    contactData.splice(index, 1);
    localStorage.setItem('contactData', JSON.stringify(contactData));
    alert("Contact deleted.");
    viewContacts(document.getElementById("category").value); // Refresh the list
}

// Function to download contacts as a CSV
function downloadContacts(categoryOrSubcategory, list) {
    let csvContent = "data:text/csv;charset=utf-8,Name,Phone\n";
    list.forEach(contact => {
        csvContent += `${contact.name},${contact.phone}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${categoryOrSubcategory}-contacts.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);  // Clean up
}
