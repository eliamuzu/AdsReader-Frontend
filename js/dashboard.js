// Delete code below to disable Firebase authentication and user data fetching

// import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
// import {getAuth,onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
// import {getFirestore, getDoc, doc} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";


// const firebaseConfig = {
//   apiKey: "AIzaSyDyiajp4XCJ47Qnn2nEIs2me0n_yXjY-7w",
//   authDomain: "signup-page-52cd3.firebaseapp.com",
//   projectId: "signup-page-52cd3",
//   storageBucket: "signup-page-52cd3.firebasestorage.app",
//   messagingSenderId: "1004059042004",
//   appId: "1:1004059042004:web:3a0b38ce3d69bccb781b41"
// };



// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// const auth = getAuth();
// const db = getFirestore();

// onAuthStateChanged(auth, (user) => {
//     const loggedInUserId = localStorage.getItem('loggedInUserId');
//     if (loggedInUserId) {
//         const docRef = doc(db, "Users", loggedInUserId);
//         getDoc(docRef)
//             .then((docSnap) => {
//                 if (docSnap.exists()) {
//                     const userData = docSnap.data();
//                     document.getElementById('loggedUserFullname').innerText = userData.fullname;
//                     document.getElementById('loggedUserEmail').innerText = userData.email;
//                 } else {
//                     console.log("No document found matching id");
//                 }
//             })
//             .catch((error) => {
//                 console.log("Error getting document", error);
//             });
//     }
//     else{
//         console.log('No UserId in localStorage, signing out');
//         signOut(auth).then(() => {
//             console.log('User signed out');
//         }).catch((error) => {
//             console.log('Error signing out', error);
//         });
//     }
// });
// // Handle logout
// const logoutButton = document.getElementById('logout');
// if (logoutButton) {
//     console.log('Attaching logout handler');
//     logoutButton.addEventListener('click', (e) => {
//         console.log('Logout clicked, signing out...');
//         localStorage.removeItem('loggedInUserId');
//         signOut(auth).then(() => {
//             console.log('User signed out successfully');
//             window.location.href = 'index.html';
//         }).catch((error) => {
//             console.error('Error signing out:', error);
//         });
//     });
// } else {
//     console.error('Logout button not found!');
// }

const datepicker = document.querySelector('.datepicker');
const rangeInput = datepicker.querySelector('input');
const calendarContainer = datepicker.querySelector('.calendar');
const leftCalendar = datepicker.querySelector('.left-side');
const rightCalendar = datepicker.querySelector('.right-side');
const prevButtons = datepicker.querySelectorAll('.prev');
const nextButtons = datepicker.querySelectorAll('.next');
const selectionEl = datepicker.querySelector('.selection');
const applyButton = datepicker.querySelector('.apply-btn');
const cancelButton = datepicker.querySelector('.cancel-btn');

let startDate = null;
let endDate = null;
let tempStartDate = null;
let tempEndDate = null;

let leftDate = new Date();
let rightDate = new Date();
rightDate.setMonth(rightDate.getMonth() + 1);

calendarContainer.hidden = true;

//format date as YYYY-MM-DD
const formatDate = (date ) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};


const createDateEl = (date, isDisabled, isToday) => {
    const span = document.createElement('span');
    span.textContent = date.getDate();
    span.classList.toggle('disabled', isDisabled);
    if(!isDisabled) {
        span.classList.toggle('today', isToday);
        span.setAttribute('data-date', formatDate(date));
    }
    span.addEventListener('click', handleDateClick);

    return span;
};
const displayselection = () => {
    if (startDate && endDate) {

        selectionEl.textContent = `Selected: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
    } else {
        selectionEl.textContent = 'No date selected';
    }
};

const clearHighlights = () => {
    const dateElements = datepicker.querySelectorAll('span[data-date]');
    for (const dateEl of dateElements) {
        dateEl.classList.remove('in-range', 'range-start', 'range-end');
    }
};

const applyHighlight = () => {
    // Clear all highlights first
    const dateElements = datepicker.querySelectorAll('span[data-date]');
    for (const dateEl of dateElements) {
        dateEl.classList.remove('in-range', 'range-start', 'range-end');
    }

    if (!startDate) return;

    // Add start date highlight
    const startStr = formatDate(startDate);
    const startEl = datepicker.querySelector(`span[data-date="${startStr}"]`);
    if (startEl) {
        startEl.classList.add('range-start');
    }

    // Add end date highlight and in-between range
    if (endDate) {
        const endStr = formatDate(endDate);
        const endEl = datepicker.querySelector(`span[data-date="${endStr}"]`);
        if (endEl) {
            endEl.classList.add('range-end');
        }

        // Highlight dates in between
        dateElements.forEach(dateEl => {
            const date = new Date(dateEl.dataset.date);
            if (date > startDate && date < endDate) {
                dateEl.classList.add('in-range');
            }
        });
    }

    // Update the input display
    const formatForDisplay = (date) => {
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    };
    
    if (endDate) {
        rangeInput.value = `${formatForDisplay(startDate)} - ${formatForDisplay(endDate)}`;
    } else {
        rangeInput.value = formatForDisplay(startDate);
    }
};

const handleDateClick = (e) => {
    const dateEl = e.target;
    if (!dateEl.dataset.date || dateEl.classList.contains('disabled')) return;
    
    const selectedDate = new Date(dateEl.dataset.date);
    
    // Start new selection if we already have a complete range
    // or if this is the first selection
    if (!startDate || (startDate && endDate)) {
        startDate = selectedDate;
        endDate = null;
    } 
    // If selecting a date before start date, make it the new start
    else if (selectedDate < startDate) {
        startDate = selectedDate;
    }
    // If selecting a date after start date, set it as end date
    else if (selectedDate > startDate) {
        endDate = selectedDate;
    }
    // If selecting the same date, toggle it off
    else if (selectedDate.getTime() === startDate.getTime()) {
        startDate = null;
        endDate = null;
    }
    
    applyHighlight();
};

const renderCalendar = (calendar, year, month) => {
    const label = calendar.querySelector('.label');
    label.textContent = new Date(year, month).toLocaleDateString( 
        navigator.language || 'en-US', { 
            month: 'long', year: 'numeric' 
        }
    );
    const dateContainer = calendar.querySelector('.dates');
    dateContainer.innerHTML = '';

    const startDate = new Date(year, month, 1);
    startDate.setDate(startDate.getDate() - startDate.getDay());

//
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 42); // 6 weeks

    const fragment = document.createDocumentFragment();
    while(startDate < endDate) {
        const isDisabled = startDate.getMonth() !== month;
        const today = new Date();
        const isToday = formatDate(startDate) === formatDate(today);
        const dateEl = createDateEl(new Date(startDate), isDisabled, isToday);
        fragment.appendChild(dateEl);
        startDate.setDate(startDate.getDate() + 1);
    }

    dateContainer.appendChild(fragment);
};

const updateCalendars = () => {
    renderCalendar(leftCalendar, leftDate.getFullYear(), leftDate.getMonth());
    renderCalendar(rightCalendar, rightDate.getFullYear(), rightDate.getMonth());
}


// Show datepicker and store temporary dates
rangeInput.addEventListener('focus', () => {
    calendarContainer.hidden = false;
    // Store current selection as temporary
    tempStartDate = startDate;
    tempEndDate = endDate;
});

// Handle cancel button
cancelButton.addEventListener('click', () => {
    // Clear selection
    startDate = null;
    endDate = null;
    // Clear the input and selection display
    rangeInput.value = '';
    selectionEl.textContent = 'No date selected';
    applyHighlight();
});

// Handle apply button
applyButton.addEventListener('click', () => {
    // Current selection becomes permanent
    tempStartDate = startDate;
    tempEndDate = endDate;
    // Calendar stays visible for further selections
});

// Hide on outside click
document.addEventListener('click', (event) => {
    if (!datepicker.contains(event.target)) {
        // Restore previous selection on outside click
        startDate = tempStartDate;
        endDate = tempEndDate;
        applyHighlight();
        calendarContainer.hidden = true;
    }
});

//prev buttons
prevButtons.forEach(button => {
    button.addEventListener('click', () => {


        leftDate.setMonth(leftDate.getMonth() - 1);
        rightDate.setMonth(rightDate.getMonth() - 1);
        updateCalendars();
    });
}); 

//next buttons
nextButtons.forEach(button => {
    button.addEventListener('click', () => {
        leftDate.setMonth(leftDate.getMonth() + 1);
        rightDate.setMonth(rightDate.getMonth() + 1);
        updateCalendars();
    });
});

//initialize calendars
updateCalendars();

// Highlight active sidebar link based on current page and keep links mutually exclusive
(() => {
    try {
        const sidebarLinks = document.querySelectorAll('.sidebar-links li a');
        if (!sidebarLinks || sidebarLinks.length === 0) return;

        // current filename (last segment) e.g. 'home.html' or '' -> use 'index.html'
        const currentFile = (window.location.pathname.split('/').pop() || 'index.html');

        sidebarLinks.forEach(link => {
            const href = link.getAttribute('href') || '';
            const linkFile = href.split('/').pop();

            if (linkFile === currentFile) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }

            // ensure only one link is active on click (visual feedback before navigation)
            link.addEventListener('click', (e) => {
                sidebarLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    } catch (err) {
        // fail silently in case elements are missing on some pages
        console.warn('Sidebar active link script error:', err);
    }
})();