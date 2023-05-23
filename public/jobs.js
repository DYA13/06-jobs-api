//This section of code calls a function, buildJobsTable. 
//This function does the complicated task of populating the jobs table. 
//This function is async because it will eventually await a fetch call to retrieve the list of jobs.
//In this code, there is a GET request for all of the jobs entries. 
//If no entries are returned, the function just returns 0.
// If entries are returned, they must be added to the table in the following columns: company, position, status, edit button, delete button. 
//The rows of the table are accumulated in a loop, with the first row being the table header row. 
//The tricky part is the buttons. We need to identify whether a button represents an add or delete. This is done with the editButton and deleteButton classes.
// We also have to record which jobs entry corresponds to which button. This is done with the dataset.id attribute, which is set in the HTML using dataset-id.
// Then the HTML for each row is created and turned into a DOM entry. 
//The table is updated with the rows using a replaceChildren() call.

async function buildJobsTable(jobsTable, jobsTableHeader, token, message) {
    try {
      const response = await fetch("/api/v1/jobs", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      var children = [jobsTableHeader];
      if (response.status === 200) {
        if (data.count === 0) {
          jobsTable.replaceChildren(...children); // clear this for safety
          return 0;
        } else {
          for (let i = 0; i < data.jobs.length; i++) {
            let editButton = `<td><button type="button" class="editButton" data-id=${data.jobs[i]._id}>edit</button></td>`;
            let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.jobs[i]._id}>delete</button></td>`;
            let rowHTML = `<td>${data.jobs[i].company}</td><td>${data.jobs[i].position}</td><td>${data.jobs[i].status}</td>${editButton}${deleteButton}`;
            let rowEntry = document.createElement("tr");
            rowEntry.innerHTML = rowHTML;
            children.push(rowEntry);
          }
          jobsTable.replaceChildren(...children);
        }
        return data.count;
      } else {
        message.textContent = data.msg;
        return 0;
      }
    } catch (err) {
      message.textContent = "A communication error occurred.";
      return 0;
    }
  }


document.addEventListener("DOMContentLoaded", () => {
    const logoff = document.getElementById("logoff");
    const message = document.getElementById("message");
    const logonRegister = document.getElementById("logon-register");
    const logon = document.getElementById("logon");
    const register = document.getElementById("register");
    const logonDiv = document.getElementById("logon-div");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const logonButton = document.getElementById("logon-button");
    const logonCancel = document.getElementById("logon-cancel");
    const registerDiv = document.getElementById("register-div");
    const name = document.getElementById("name");
    const email1 = document.getElementById("email1");
    const password1 = document.getElementById("password1");
    const password2 = document.getElementById("password2");
    const registerButton = document.getElementById("register-button");
    const registerCancel = document.getElementById("register-cancel");
    const jobs = document.getElementById("jobs");
    const jobsTable = document.getElementById("jobs-table");
    const jobsTableHeader = document.getElementById("jobs-table-header");
    const addJob = document.getElementById("add-job");
    const editJob = document.getElementById("edit-job");
    const company = document.getElementById("company");
    const position = document.getElementById("position");
    const status = document.getElementById("status");
    const addingJob = document.getElementById("adding-job");
    const jobsMessage = document.getElementById("jobs-message");
    const editCancel = document.getElementById("edit-cancel");
    const deleteButtons = document.querySelectorAll(".deleteButton");

    //The home page will show a logon button and a register button if the user is not logged in. 
    //If the user is logged in, the logoff button is shown, as well as a table of jobs entries, if the user has any. 
    //Because the home page must be brought up at various points in the application, you create an event listener for it, and trigger its display by dispatching an event.
    // This is the next section of code to be added, after the line that says section 2:
    // section 2 
    let showing = logonRegister;
  let token = null;
  document.addEventListener("startDisplay", async () => {
    showing = logonRegister;
    token = localStorage.getItem("token");
    if (token) {
      //if the user is logged in
      logoff.style.display = "block";
      const count = await buildJobsTable(
        jobsTable,
        jobsTableHeader,
        token,
        message
      );
      if (count > 0) {
        jobsMessage.textContent = "";
        jobsTable.style.display = "block";
      } else {
        jobsMessage.textContent = "There are no jobs to display for this user.";
        jobsTable.style.display = "none";
      }
      jobs.style.display = "block";
      showing = jobs;
    } else {
      logonRegister.style.display = "block";
    }
  });

  var thisEvent = new Event("startDisplay");
  document.dispatchEvent(thisEvent);
  var suspendInput = false;
  //In the code above, several operational variables (token, showing, thisEvent, and suspendInput) are created. 
  //The token is retrieved from local storage. Local storage persists even if the page is refreshed. 
  //If the token is not present in local storage, that means the user is not logged in, so the logon/register div is shown. 
  //Otherwise the logoff button and the jobs div are shown. 
  //The jobs div contains the table for jobs entries, and this is shown only if the user has jobs entries. 
  //The showing variable keeps track of which div is being shown. The thisEvent variable is used to create an event, which, when dispatched, triggers the home page display.
  // Div are shown and hidden by setting the style.display for the div to “block” or “none”.

 // section 3
//   The flow of the application is controlled by button clicks, so you need an event listener to catch those. 
//   The first button click to handle is the logon. 
//   The callback for the click event listener is async, because there are awaits for fetch calls in the body of that function.
// First, if an async operation is in progress, you do not want to handle button clicks, because that could disrupt the flow of the application. The suspendInput variable is set to true if an asynchronous operation is in progress, and false once that operation completes. If suspendIInput is true, the button click is ignored. Second, the message variable stores the DOM entry of a paragraph that displays messages to the user. The message has to be cleared when a subsequent button click occurs. The code that follows handles clicks for the logoff, logon, register, logonCancel, registerCancel, logonButton, and registerButton. Let’s discuss each in turn.
// The logoff button clears the token and removes it from local storage, so the user is no longer logged on. The contents of the jobs table are also cleared, so that the next user can’t access them. Note that even if the jobs table is hidden, a user could see its contents using browser development tools. The table is cleared by making the header row as the only child of the table. Then an event is dispatched to cause the home screen to display, and a message (you are logged off) is shown.
// The logon button causes the logonDiv to be shown. The home screen is hidden by setting the style.display of showing to “none”. Similarly the register button causes the registerDiv to be shown. THe logonCancel and registerCancel buttons just trigger the display of the home page.
// The logonButton button causes user input (email and password) to be collected. Then (!!!) a jobs API is called, using fetch. This is done inside of a try/catch block, in case of error conditions. If a successful (status 200) response is recieved, the body of the response contains the JWT token, so this is stored in local storage and the home page display is triggered. Otherwise the body of the response contains a message, which is displayed in the message paragraph. Note that the URL for the API call is a relative URL, /api/v1/login . This means that the web address to be called is the same one as for the index.html page.
// The registerButton button works similarly, except that the user is registered, instead of logging in an existing user.
// At this point, after the code above has been added and saved, go to the localhost:3000 page and refresh it. You will find that several functions now work, including register, logon, and logoff. Try them out. Of course, there is nothing to handle the CRUD operations: creating, reading, updating, or deleting jobs entries.


  document.addEventListener("click", async (e) => {
    if (suspendInput) {
      return; // we don't want to act on buttons while doing async operations
    }
    if (e.target.nodeName === "BUTTON") {
      message.textContent = "";
    }
    if (e.target === logoff) {
      localStorage.removeItem("token");
      token = null;
      showing.style.display = "none";
      logonRegister.style.display = "block";
      showing = logonRegister;
      jobsTable.replaceChildren(jobsTableHeader); // don't want other users to see
      message.textContent = "You are logged off.";
    } else if (e.target === logon) {
      showing.style.display = "none";
      logonDiv.style.display = "block";
      showing = logonDiv;
    } else if (e.target === register) {
      showing.style.display = "none";
      registerDiv.style.display = "block";
      showing = registerDiv;
    } else if (e.target === logonCancel || e.target == registerCancel) {
      showing.style.display = "none";
      logonRegister.style.display = "block";
      showing = logonRegister;
      email.value = "";
      password.value = "";
      name.value = "";
      email1.value = "";
      password1.value = "";
      password2.value = "";
    } else if (e.target === logonButton) {
      suspendInput = true;
      try {
        const response = await fetch("/api/v1/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.value,
            password: password.value,
          }),
        });
        const data = await response.json();
        if (response.status === 200) {
          message.textContent = `Logon successful.  Welcome ${data.user.name}`;
          token = data.token;
          localStorage.setItem("token", token);
          showing.style.display = "none";
          thisEvent = new Event("startDisplay");
          email.value = "";
          password.value = "";
          document.dispatchEvent(thisEvent);
        } else {
          message.textContent = data.msg;
        }
      } catch (err) {
        message.textContent = "A communications error occurred.";
      }
      suspendInput = false;
    } else if (e.target === registerButton) {
      if (password1.value != password2.value) {
        message.textContent = "The passwords entered do not match.";
      } else {
        suspendInput = true;
        try {
          const response = await fetch("/api/v1/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: name.value,
              email: email1.value,
              password: password1.value,
            }),
          });
          const data = await response.json();
          if (response.status === 201) {
            message.textContent = `Registration successful.  Welcome ${data.user.name}`;
            token = data.token;
            localStorage.setItem("token", token);
            showing.style.display = "none";
            thisEvent = new Event("startDisplay");
            document.dispatchEvent(thisEvent);
            name.value = "";
            email1.value = "";
            password1.value = "";
            password2.value = "";
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {
          message.textContent = "A communications error occurred.";
        }
        suspendInput = false;
      }
    }
     // section 4
    //  The addJob button causes the editJob div to be shown in place of the home page. 
    //This div is used both for add and for edit. 
    //You need to keep track of whether an add or edit is being done. 
    //This is done with the editJob.dataset.id value. 
    //The dataset attribute of a DOM entry may be used to store arbitrary values. 
    //If editJob.dataset.id is not set, then this is an add.
    // If it is set, it holds the value of the entry being edited. 
    //You will see how that value is set for an edit further on in the lesson. 
    //If the addingJob pushbutton is clicked, an add or an update is attempted. 
    //If this is successful, a messsage is displayed to the user and the display of the home page is triggered. 
    //If the add or update operation fails, a message, taken from the body of the response, is showed to the user. 
    //The add operation corresponds to a fetch call with POST as the method. 
    //The update operation corresponds to a fetch with a PATCH method. Note that, unlike the logon and register, these operations use and require the Authorization header, which has the bearer token. 
    //If that is not present, the operation fails with a 401 not authorized result code.
    //  Once you have added this code, try out the application again. You are now able to add entries, but you can’t actually see them. Next you add the code to populate the table of jobs entries.
     
     
    else if (e.target === addJob) {
        showing.style.display = "none";
        editJob.style.display = "block";
        showing = editJob;
        delete editJob.dataset.id;
        company.value = "";
        position.value = "";
        status.value = "pending";
        addingJob.textContent = "add";
      } else if (e.target === editCancel) {
        showing.style.display = "none";
        company.value = "";
        position.value = "";
        status.value = "pending";
        thisEvent = new Event("startDisplay");
        document.dispatchEvent(thisEvent);
      } else if (e.target === addingJob) {
  
        if (!editJob.dataset.id) {
          // this is an attempted add
          suspendInput = true;
          try {
            const response = await fetch("/api/v1/jobs", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                company: company.value,
                position: position.value,
                status: status.value,
              }),
            });
            const data = await response.json();
            if (response.status === 201) {
              //successful create
              message.textContent = "The job entry was created.";
              showing.style.display = "none";
              thisEvent = new Event("startDisplay");
              document.dispatchEvent(thisEvent);
              company.value = "";
              position.value = "";
              status.value = "pending";
            } else {
              // failure
              message.textContent = data.msg;
            }
          } catch (err) {
            message.textContent = "A communication error occurred.";
          }
          suspendInput = false;
        } else {
          // this is an update
          suspendInput = true;
          try {
            const jobID = editJob.dataset.id;
            const response = await fetch(`/api/v1/jobs/${jobID}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                company: company.value,
                position: position.value,
                status: status.value,
              }),
            });
            const data = await response.json();
            if (response.status === 200) {
              message.textContent = "The entry was updated.";
              showing.style.display = "none";
              company.value = "";
              position.value = "";
              status.value = "pending";
              thisEvent = new Event("startDisplay");
              document.dispatchEvent(thisEvent);
            } else {
              message.textContent = data.msg;
            }
          } catch (err) {
  
            message.textContent = "A communication error occurred.";
          }
        }
        suspendInput = false;
      } 
      // section 5
      //Edit job

      else if (e.target.classList.contains("editButton")) {
        editJob.dataset.id = e.target.dataset.id;
        suspendInput = true;
        try {
          const response = await fetch(`/api/v1/jobs/${e.target.dataset.id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (response.status === 200) {
            company.value = data.job.company;
            position.value = data.job.position;
            status.value = data.job.status;
            showing.style.display = "none";
            showing = editJob;
            showing.style.display = "block";
            addingJob.textContent = "update";
            message.textContent = "";
          } else {
            // might happen if the list has been updated since last display
            message.textContent = "The jobs entry was not found";
            thisEvent = new Event("startDisplay");
            document.dispatchEvent(thisEvent);
          }
        } catch (err) {
          message.textContent = "A communications error has occurred.";
        }
        suspendInput = false;
      }

//Section 6
// delete job
// How do you know it is a delete? In the buildJobsTable function, each of the delete buttons is given a class of deleteButton. You check for that class in the e.target.
// How do you know which entry to delete? The id of the entry is stored in the data-id of the button, as done in the buildJobsTable function.
// How do you do the delete? You need a call to fetch with a method of DELETE giving the URL of that entry. Be sure you include the authorization header. Also, remember that fetch is asynchronous, and should be called in a try/catch block.
// What do you do if the delete succeeds? First, you put a message in the text content of the message paragraph. Second, you redraw the table showing the updated list of entries. You can redraw the table by dispatching an event to startDisplay. You’ll see other places in the code where this is done?
// What do you do if the delete fails? Put a message indicating the failure in the message paragraph.
// Anything else? You don’t want to take input while these asynchronous operations are in progress, so you set the suspendInput flag before you start them, and clear it afterwards.

else if (e.target.classList.contains('deleteButton')) {
    editJob.dataset.id = e.target.dataset.id;
    suspendInput = true;
    try {
      const response = await fetch(`/api/v1/jobs/${e.target.dataset.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.status === 200) {
        message.textContent = 'This job entry has been successfully deleted';
        thisEvent = new Event('startDisplay');
        document.dispatchEvent(thisEvent);
      } else {
        // might happen if the list has been updated since last display
        message.textContent = 'The jobs entry was not found';
        thisEvent = new Event('startDisplay');
        document.dispatchEvent(thisEvent);
      }
    } catch (err) {
      message.textContent = 'A delete fail has occurred.';
    }
    suspendInput = false;
  }
});
});