// Fetch projects from the Express REST endpoint and render cards
const loadProjects = () => {
    $.get('/api/projects', (projects) => {
        addCards(projects);
    });
};

const clickMe = () => {
    M.toast({ html: "Thanks for visiting! Hope you like my work 😊", classes: "teal darken-2" });
};

const submitForm = () => {
    let formData = {};
    formData.first_name = $('#first_name').val();
    formData.last_name = $('#last_name').val();
    formData.password = $('#password').val();
    formData.note = $('#note').val();
    console.log("Form Data Submitted: ", formData);
    M.toast({ html: "Message sent! I'll get back to you soon.", classes: "teal darken-2" });
};

const addCards = (items) => {
    items.forEach(item => {
        let card = `
      <div class="col s12 m4">
        <div class="card hoverable">
          <div class="card-image">
            <img src="${item.image}" alt="${item.title}"/>
            <span class="card-title">${item.title}</span>
            <a class="btn-floating halfway-fab waves-effect waves-light teal darken-2">
              <i class="material-icons">open_in_new</i>
            </a>
          </div>
          <div class="card-content card-text">
            <p>${item.description}</p>
          </div>
          <div class="card-action">
            <a href="#" class="teal-text">${item.link}</a>
          </div>
        </div>
      </div>`;
        $('#project-cards').append(card);
    });
    // Re-initialise Materialize components
    M.AutoInit();
};

$(document).ready(() => {
    M.AutoInit();
    loadProjects();
});