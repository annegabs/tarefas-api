import knex from "../config/knex";

const requestHandler = (request, reply) => {
  return (
    knex
      .from("users")
      // .where({ deleted: false })
      .select("oid", "username", "email", "done")
      .then(results => reply.response(results))
      .catch(err => console.log(err))
  );
};

const users = [
  {
    method: "GET",
    path: "/users",
    handler: (request, reply) => {
      return requestHandler(request, reply);
    }
  },
  {
    method: "GET",
    path: "/users/",
    handler: (request, reply) => {
      return requestHandler(request, reply);
    }
  },
  {
    method: "POST",
    path: "/users",
    handler: (request, reply) => {
      try {
        let { username, email } = JSON.parse(request.payload);
        if (username === undefined) {
          username = "";
          return reply.response({ error: "undefined title" }).code(400);
        }
        if (email === undefined) {
          email = "";
        }
        const user = {
          username: username,
          email: email,
          deleted: false,
          done: false
        };
        return knex
          .into("users")
          .insert(user)
          .returning("oid")
          .then(result => {
            user.oid = result[0];
            return reply.response({ status: "inserted", data: user }).code(201);
          })
          .catch(err => {
            return reply.response(err).code(400);
          });
      } catch (err) {
        return reply
          .response({ error: "undefined user in json object" })
          .code(400);
      }
    }
  },
  {
    method: "PUT",
    path: "/users/{user_id}",
    handler: (request, reply) => {
      try {
        const { username, email } = JSON.parse(request.payload);
        const id = request.params.user_id;
        let user = {};
        if (username != undefined) {
          user.username = username;
        }
        if (email != undefined) {
          user.email = email;
        }
        return knex("users")
          .where("oid", id)
          .update(user)
          .then(result =>
            knex("users")
              .where("oid", id)
              .select("oid", "username", "email", "deleted", "done")
              .then(result =>
                reply.response({ status: "updated", data: result[0] }).code(200)
              )
          )
          .catch(err => reply.response(err).code(401));
      } catch (err) {
        return reply.response(err).code(401);
      }
    }
  },
  {
    method: "PUT",
    path: "/users/{user_id}/done",
    handler: (request, reply) => {
      try {
        const id = request.params.user_id;
        let user = { done: true };
        return knex("users")
          .where("oid", id)
          .update(user)
          .then(result =>
            knex("users")
              .where("oid", id)
              .select("oid", "username", "email", "deleted", "done")
              .then(result =>
                reply.response({ status: "done", data: result[0] }).code(200)
              )
          )
          .catch(err => reply.response(err).code(401));
      } catch (err) {
        return reply.response(err).code(401);
      }
    }
  },
  {
    method: "PUT",
    path: "/users/{user_id}/undone",
    handler: (request, reply) => {
      try {
        const id = request.params.user_id;
        let user = { done: false };
        return knex("users")
          .where("oid", id)
          .update(user)
          .then(result =>
            knex("users")
              .where("oid", id)
              .select("oid", "username", "email", "deleted", "done")
              .then(result =>
                reply.response({ status: "undone", data: result[0] }).code(200)
              )
          )
          .catch(err => reply.response(err).code(401));
      } catch (err) {
        return reply.response(err).code(401);
      }
    }
  },
  {
    method: "DELETE",
    path: "/users/{user_id}",
    handler: (request, reply) => {
      const id = request.params.user_id;
      return knex("users")
        .where("oid", id)
        .update({ deleted: true })
        .then(result => {
          console.log(result);
          if (result === 0) {
            return reply
              .response({
                status: "not deleted",
                message: "user not found!"
              })
              .code(409);
          } else {
            return knex("users")
              .where("oid", id)
              .select("oid", "username", "email", "deleted", "done")
              .then(result =>
                reply.response({ status: "deleted", data: result[0] }).code(200)
              );
          }
        })
        .catch(err => reply.response(err).code(401));
    }
  }
];

export default users;