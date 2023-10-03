const userSelect = document.getElementById("userSelect");
const loadPosts = document.getElementById("loadPosts");
const containertweetUsers = document.getElementById("containertweetUsers");
const modelPost = document.getElementById("modelPost");

let selectedUserId = null;

const fillUserSelect = () => {
  fetch("https://jsonplaceholder.typicode.com/users")
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al cargar la lista de usuarios');
      }
      return response.json();
    })
    .then(usersData => {
      usersData.forEach(user => {
        const option = document.createElement("option");
        option.value = user.id;
        option.textContent = user.name;
        userSelect.appendChild(option);
      });

      userSelect.addEventListener("change", () => {
        selectedUserId = userSelect.value;
      });
    })
    .catch(error => {
      console.error("Error al cargar la lista de usuarios: ", error);
    });
};


const fetchAndShowComments = (postId, container) => {
  fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error al cargar los comentarios para el post ${postId}`);
      }
      return response.json();
    })
    .then(comments => {
      const commentsContainer = document.createElement("div");
      commentsContainer.classList.add("comments-container");
      comments.forEach(comment => {
        const commentDiv = document.createElement("div");
        commentDiv.classList.add("comment");
        const emailDiv = document.createElement("div");
        emailDiv.classList.add("email");
        emailDiv.textContent = `${comment.email}`;
        const bodyDiv = document.createElement("div");
        bodyDiv.classList.add("body");
        bodyDiv.textContent = comment.body;
        commentDiv.appendChild(emailDiv);
        commentDiv.appendChild(bodyDiv);
        commentsContainer.appendChild(commentDiv);
      });
      container.appendChild(commentsContainer);
    })
    .catch(error => {
      console.error(`Error al cargar los comentarios para el post ${postId}:`, error);
    });
};


const fetchAndShowUserPosts = () => {
  if (selectedUserId === null) {
    alert("Seleccione un usuario primero.");
    return;
  }

  fetch(`https://jsonplaceholder.typicode.com/users/${selectedUserId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al cargar los datos del usuario');
      }
      return response.json();
    })
    .then(userData => {
      fetch(`https://jsonplaceholder.typicode.com/users/${selectedUserId}/posts`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al cargar las publicaciones');
          }
          return response.json();
        })
        .then(userPosts => {
          containertweetUsers.innerHTML = "";

          userPosts.forEach(post => {
            const newPost = modelPost.cloneNode(true);
            newPost.style.display = "block";
            newPost.querySelector(".fw-bold").textContent = userData.name;
            newPost.querySelector(".fw-normal.text-white-50").textContent = userData.email;
            newPost.querySelector(".post-body p:nth-child(1)").textContent = post.title;
            newPost.querySelector(".post-body p:nth-child(2)").textContent = post.body;
            newPost.querySelector(".badge.text-white-50.mb-0.ms-2.opacity-75 small").textContent = "1";
            newPost.querySelector(".badge.text-white-50.mb-0.mx-2.opacity-75 small").textContent = "1";
            newPost.querySelector(".badge.text-white-50.mb-0.mx-0.opacity-75 small").textContent = "7";
            newPost.querySelector(".badge.text-white-50.mb-0.opacity-75 small").textContent = "1.794";

            const commentsContainer = document.createElement("div");
            commentsContainer.classList.add("comments-container");

            commentsContainer.setAttribute("data-post-id", post.id);

            newPost.appendChild(commentsContainer);

            containertweetUsers.appendChild(newPost);

            fetchAndShowComments(post.id, commentsContainer);
          });
        })
        .catch(error => {
          console.error("Error al cargar las publicaciones: ", error);
        });
    })
    .catch(error => {
      console.error("Error al cargar los datos del usuario: ", error);
    });
};



loadPosts.addEventListener("click", () => {
  fetchAndShowUserPosts();
});

fillUserSelect();
