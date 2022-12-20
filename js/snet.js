let session = new Session();
session_id = session.getSession();

if (session_id !== "") {
  async function populateUserData() {
    let user = new User();
    user = await user.get(session_id);
    document.querySelector("#username").innerText = user["username"];
    document.querySelector("#email").innerText = user["email"];

    document.querySelector("#korisnicko_ime").value = user["username"];
    document.querySelector("#edit_email").value = user["email"];
  }
  populateUserData();
} else {
  window.location.href = "index.html";
}
//logout
document.querySelector("#logout").addEventListener("click", (e) => {
  e.preventDefault();
  session.destroySession();
  window.location.href = "index.html";
});
//hamburger
document.querySelector(".hamburger").addEventListener("click", () => {
  let x = document.querySelector(".inner-container.left-side");
  if (x.style.display === "flex") {
    x.style.display = "none";
  } else {
    x.style.display = "flex";
  }
});
//close customize
document.querySelector("#editAccount").addEventListener("click", () => {
  document.querySelector(".custom-modal").style.display = "block";
});
//modal close
document.querySelector("#closeModal").addEventListener("click", () => {
  document.querySelector(".custom-modal").style.display = "none";
});

//customize profile
document.querySelector("#editForm").addEventListener("submit", (e) => {
  e.preventDefault();

  let user = new User();
  user.username = document.querySelector("#korisnicko_ime").value;
  user.email = document.querySelector("#edit_email").value;
  user.edit();
});
//delete profile
document.querySelector("#deleteProfile").addEventListener("click", (e) => {
  e.preventDefault();

  let text = "Do you really want to delete this profile?";
  if (confirm(text) === true) {
    let user = new User();
    user.delete();
  }
});
//logo reload
document.querySelector(".top-logo").addEventListener("click", () => {
  location.reload();
});
//create post
document.querySelector("#postForm").addEventListener("submit", (e) => {
  e.preventDefault();

  async function createPost() {
    let content = document.querySelector("#postContent").value;
    document.querySelector("#postContent").value = "";
    let post = new Post();
    post.post_content = content;
    post = await post.create();

    let current_user = new User();
    current_user = await current_user.get(session_id);

    let html = document.querySelector("#allPostsWrapper").innerHTML;

    let delete_post_html = "";
    //comment
    if (session_id == post.user_id || session_id == 1) {
      delete_post_html = `<button class="remove-btn" onClick="removeMyPost(this)">Delete</button>`;
    }

    document.querySelector("#allPostsWrapper").innerHTML =
      `<div class="single-post" data-post_id="${post.id}">
                    <p><b>Author:</b> ${current_user.username}</p>
                    <div class="post-content">${post.content}</div>  

                    <div class="post-actions">
                      
                      <div class="btns">
                        <button onClick="likePost(this)" class="likePostJS like-btn"><span>${post.likes}</span> Likes </button>
                        <button class="comment-btn" onClick="commentPost(this)">Comments</buttons>
                        ${delete_post_html}
                      </div>
                    </div>
                    <div class="post-comments">
                    <form>
                      <input placeholder="Type a comment..." type="text">
                      <button c onClick="commentPostSubmit(event)">Comment</button>
                    </form>
                  </div>                                            
                  </div>
                 
                  ` + html;
  }
  createPost();
});
async function getAllPosts() {
  let all_posts = new Post();
  all_posts = await all_posts.getAllPosts();

  all_posts.forEach((post) => {
    async function getPostUser() {
      let user = new User();
      user = await user.get(post.user_id);

      let comments = new Comment();
      comments = await comments.get(post.id);

      let comments_html = "";
      let deleteComment = "";
      //comment delete
      if (comments.length > 0) {
        comments.forEach((comment) => {
          if (
            session_id == comment.user_id ||
            session_id == post.user_id ||
            session_id == 60
          ) {
            deleteComment = `<button class="remove-btn" onclick="removeMyComment(this)">Remove</button> `;
          }
          comments_html += `<div class="single-comment" data-post_id="${
            comment.id
          }"><p class="comment-author">${
            comment.username + " commented :"
          } ${deleteComment}</p>${comment.content}
          </div>`;
        });
      }

      let html = document.querySelector("#allPostsWrapper").innerHTML;

      let delete_post_html = "";
      //post html
      if (session_id == post.user_id || session_id == 1) {
        delete_post_html = `<button class="remove-btn" onclick="removeMyPost(this)">Remove</button> `;
      }
      document.querySelector("#allPostsWrapper").innerHTML =
        `<div class="single-post" data-post_id="${post.id}">
    
    <div class="post-content">${post.content}</div>  

    <div class="post-actions">
    <p><b>Author:</b> ${user.username}</p>
      <div class="btns">
        <button onClick="likePost(this)" class="likePostJS like-btn"><span>${post.likes}</span> Likes </button>
        <button class="comment-btn" onClick="commentPost(this)">Comments</buttons>
        ${delete_post_html}
      </div>
    </div>
    <div class="post-comments">
    <form>
      <input placeholder="Type a comment..." type="text">
      <button  onClick="commentPostSubmit(event)">Comment</button>
    </form>
    ${comments_html}
    </div>
  </div>                                            
  </div>
 
  ` + html;
    }
    getPostUser();
  });
}
getAllPosts();
const commentPostSubmit = (e) => {
  e.preventDefault();

  let btn = e.target;
  btn.setAttribute("disabled", "true");

  let main_post_el = btn.closest(".single-post");
  let post_id = main_post_el.getAttribute("data-post_id");

  let comment_value = main_post_el.querySelector("input").value;

  let deleteComment = "";
  deleteComment = `<button class="remove-btn" onclick="removeMyComment(this)">Remove</button> `;
  main_post_el.querySelector("input").value = "";

  main_post_el.querySelector(
    ".post-comments"
  ).innerHTML += `<div class="single-comment"><p class="comment-author">${" You:"} ${deleteComment}</p>${comment_value}</div> `;

  let comment = new Comment();
  comment.content = comment_value;
  comment.user_id = session_id;
  comment.post_id = post_id;
  comment.create();
};
//remove post function
const removeMyPost = (btn) => {
  let post_id = btn.closest(".single-post").getAttribute("data-post_id");
  btn.closest(".single-post").remove();
  let post = new Post();
  post.delete(post_id);
};

//like function
const likePost = (btn) => {
  let main_post_el = btn.closest(".single-post");
  let post_id = btn.closest(".single-post").getAttribute("data-post_id");
  let number_of_likes = parseInt(btn.querySelector("span").innerText);

  btn.querySelector("span").innerText = number_of_likes + 1;
  btn.setAttribute("disabled", "true");
  let post = new Post();
  post.like(post_id, number_of_likes + 1);
};
//Comment function
const commentPost = (btn) => {
  let main_post_el = btn.closest(".single-post");
  let post_id = main_post_el.getAttribute("data-post_id");

  if (main_post_el.querySelector(".post-comments").style.display == "block") {
    main_post_el.querySelector(".post-comments").style.display = "";
  } else main_post_el.querySelector(".post-comments").style.display = "block";
};
//remove comment
const removeMyComment = (btn) => {
  let post_id = btn.closest(".single-comment").getAttribute("data-post_id");
  btn.closest(".single-comment").remove();
  let comment = new Comment();
  comment.delete(post_id);
};
