use actix_web::dev::Server;
use actix_web::{web, App, HttpServer};
use sqlx::MySqlPool;
use std::net::TcpListener;

use crate::routes::{call_insert_one, call_select_many, call_select_one, health_check };
use crate::user::{GetUserRequest, UserService};

pub fn run(listener: TcpListener, 
  user_service: web::Data<UserService>,
  pool: web::Data<MySqlPool>) -> Result<Server, std::io::Error> {

  let user2 = UserService{};

  let server = HttpServer::new(move || {
    App::new()
      .route("/health_check", web::get().to(health_check))
      .route("/select/one", web::get().to(call_select_one))
      .route("/select/many", web::get().to(call_select_many))
      .route("/user", web::post().to(call_insert_one))
      .route("/v2/user", web::get().to(move |query: web::Query<GetUserRequest>| {
        user2.get_user(query)
      }))
      .app_data(pool.clone())
  })
  .listen(listener)?
  .run();

  Ok(server)
}
