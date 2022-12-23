class Post {
  post_id = "";
  post_content = "";
  user_id = "";
  likes = "";
  server_url = "https://62f2988118493ca21f3701b4.mockapi.io";

  async create() {
    let session = new Session();
    session_id = session.getSession();

    let data = {
      user_id: session_id,
      content: this.post_content,
      likes: 0,
    };
    data = JSON.stringify(data);

    let response = await fetch(this.server_url + "/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });
    data = await response.json();

    return data;
  }
  async getAllPosts() {
    let response = await fetch(this.server_url + "/posts");
    let data = await response.json();
    return data;
  }

  like(post_id, likes) {
    let data = {
      likes: likes,
    };
    data = JSON.stringify(data);

    fetch(this.server_url + "/posts/" + post_id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {});
  }

  delete(post_id) {
    fetch(this.server_url + "/posts/" + post_id, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {});
  }
}
